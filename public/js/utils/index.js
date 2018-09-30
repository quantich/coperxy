import fetch from 'isomorphic-fetch';
import capitalize from 'lodash/fp/capitalize';
import $ from 'jquery'; // eslint-disable-line
import { showMessengerError } from '../modules/messenger';

export const fixPageStyle = () => {
  $('body.form div:first').addClass('hiddenMenu');
  // Não mostra o scroll da div do nxj, todo sroll deve estar dentro desse Iframe
  $('#nxj_main_div').css({ overflow: 'hidden' });
};

/**
* Build url base
*/
const href = window.location.href.split('/');
export const baseURL = href.slice(0, href.length - 3).join('/');

const managerID = (() => {
  const name = 'managerId';
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(window.parent.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
})();

export const normalizeUrl = (url) => {
  if (/(.+\?.+=.+)/.test(url)) {
    return `${baseURL}/${url}&managerId=${managerID}`;
  }
  return `${baseURL}/${url}?managerId=${managerID}`;
};

/**
* HTTP Request utils
*/
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

function buildHeaders() {
  return { ...defaultHeaders };
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export function parseJSON(response) {
  if (response.status !== 204) {
    return response.json();
  }
  return {};
}

export function httpGet(url, query) {
  let queryString = '';
  if (query) {
    queryString = `?
      ${Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
    .replace(/%20/g, '+')}`;
  }
  return fetch(normalizeUrl(url + queryString), {
    credentials: 'include',
    headers: buildHeaders()
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function httpPut(url, data) {
  const body = JSON.stringify(data);

  return fetch(normalizeUrl(url), {
    credentials: 'include',
    method: 'put',
    headers: buildHeaders(),
    body
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function httpPost(url, data) {
  const body = JSON.stringify(data);

  return fetch(normalizeUrl(url), {
    credentials: 'include',
    method: 'post',
    headers: buildHeaders(),
    body
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function httpDelete(url) {
  return fetch(normalizeUrl(url), {
    credentials: 'include',
    method: 'delete',
    headers: buildHeaders()
  })
    .then(checkStatus)
    .then(parseJSON);
}

export function executeRequest(url, opts) {
  return fetch(normalizeUrl(url), opts)
    .then(checkStatus)
    .then(parseJSON);
}

/* Utils */

export function capitalizeString(value) {
  return value.split(' ').map(capitalize).join(' ');
}

export function bindAsyncActionCreator(actionCreator, dispatch) {
  return (...args) => {
    return dispatch(actionCreator(...args));
  };
}

export function parseErrorDispatchAndRethrow(dispatch) {
  const serverError = '500 - Erro Interno do Servidor';
  return (error) => {
    console.error(error); // eslint-disable-line no-console
    if (!error.response) {
      const msg = error.message || error;
      dispatch(showMessengerError(msg));
    } else {
      const { status, statusText } = error.response;
      const defaultMessage = `${serverError} - ${status} - ${statusText}`;
      error.response.json()
        .then((jsonerr) => {
          if (!jsonerr || !Object.keys(jsonerr)) {
            dispatch(showMessengerError(defaultMessage));
          } else if (jsonerr.message) {
            dispatch(showMessengerError(jsonerr.message));
          } else if (jsonerr.msg) {
            dispatch(showMessengerError(`${serverError} - ${jsonerr.msg}`));
          }
        }, () => {
          dispatch(showMessengerError(defaultMessage));
        });
    }
    throw error;
  };
}

export function compareCodigoProduct(a, b) {
  const firstProduct = `${a.niv}.${a.gru}.${a.sub}.${a.ite}`;
  const secondProduct = `${b.niv}.${b.gru}.${b.sub}.${b.ite}`;
  if (firstProduct < secondProduct) {
    return -1;
  }
  if (firstProduct > secondProduct) {
    return 1;
  }
  return 0;
}

export function parseCodigoMaquina(codMaquina) {
  if (codMaquina) {
    return `${codMaquina.gru}.${codMaquina.sub}.${codMaquina.num}`;
  }
  return 'Código inválido!';
}

export function parseCodigoProduto(codProduto) {
  if (codProduto) {
    return `${codProduto.niv}.${codProduto.gru}.${codProduto.sub}.${codProduto.ite}`;
  }
  return 'Código inválido!';
}

export function parseMachineDate(date) {
  return `${date.substring(8, 10)}/${date.substring(5, 7)}/${date.substring(0, 4)}`;
}
