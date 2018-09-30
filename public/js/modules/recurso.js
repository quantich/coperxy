import { httpGet } from '../utils';

export const LIST_FAMILIAS = 'recurso/LIST_FAMILIAS';
export const LIST_ORDENS = 'recurso/LIST_ORDENS';
export const LIST_OS = 'recurso/LIST_OS';
export const LIST_CALENDARIO = 'recurso/LIST_CALENDARIO';
export const LIST_FINAL_DATES = 'recurso/LIST_FINAL_DATES';
export const LIST_FAMILIAS_INFO = 'recurso/LIST_FAMILIAS_INFO';

export const initialState = {
  familias: [],
  ordens: [],
  os: null,
  calendario: null,
  finalDates: null,
  familiasInfo: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LIST_FAMILIAS:
      return { ...state, familias: action.data };
    case LIST_ORDENS:
      return { ...state, ordens: action.data };
    case LIST_OS:
      return { ...state, os: action.data };
    case LIST_CALENDARIO:
      return { ...state, calendario: action.data };
    case LIST_FINAL_DATES:
      return { ...state, finalDates: action.data };
    case LIST_FAMILIAS_INFO:
      return { ...state, familiasInfo: action.data };
    default:
      return state;
  }
}

export const listFamiliasInfo = () => {
  return (dispatch) => {
    return httpGet('cost/recursos/info')
      .then((data) => {
        dispatch({
          type: LIST_FAMILIAS_INFO,
          data
        });
      });
  };
};

export const listFamilias = () => {
  return (dispatch) => {
    return httpGet('cost/recursos/all')
      .then((data) => {
        dispatch({
          type: LIST_FAMILIAS,
          data
        });
      });
  };
};

export const listOrdens = () => {
  return (dispatch) => {
    return httpGet('cost/aplanejar/oplist')
      .then((data) => {
        dispatch({
          type: LIST_ORDENS,
          data
        });
      });
  };
};

export const listOs = () => {
  return (dispatch) => {
    return httpGet('cost/aplanejar/oslist')
      .then((data) => {
        dispatch({
          type: LIST_OS,
          data
        });
      });
  };
};

export const listCalendario = () => {
  return (dispatch) => {
    return httpGet('cost/disponibilidade/all')
      .then((data) => {
        dispatch({
          type: LIST_CALENDARIO,
          data
        });
      });
  };
};

export const listFinalDates = () => {
  return (dispatch) => {
    return httpGet('cost/disponibilidade/finaldate')
      .then((data) => {
        dispatch({
          type: LIST_FINAL_DATES,
          data
        });
      });
  };
};
