const SHOW = 'messenger/SHOW';
const HIDE = 'messenger/HIDE';
const MESSAGE_HIDDEN = 'messenger/MESSAGE_HIDDEN';

const initialState = {
  text: '',
  type: '',
  status: 'hidden'
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SHOW:
      return {
        ...state,
        ...action.messenger,
        status: 'show'
      };

    case HIDE:
      return {
        ...state,
        ...action.messenger,
        status: 'hide'
      };

    case MESSAGE_HIDDEN:
      return {
        ...state,
        ...action.messenger,
        status: 'hidden'
      };

    default:
      return state;
  }
}

let hideTimeOut;
let hiddenTimeOut;
/*
 * action creators
 */
export function hideMessenger() {
  return (dispatch) => {
    dispatch({ type: HIDE });
    clearTimeout(hiddenTimeOut);
    clearTimeout(hideTimeOut);
    hiddenTimeOut = window.setTimeout(() => {
      dispatch({
        type: MESSAGE_HIDDEN
      });
    }, 500);
  };
}

export function hideTimeOutMessenger(messenger) {
  const timeoutTime = messenger.time || 3000;
  return (dispatch) => {
    if (messenger && messenger.status === 'show') {
      clearTimeout(hideTimeOut);
      hideTimeOut = window.setTimeout(() => {
        dispatch({
          type: HIDE
        });
      }, timeoutTime);
    }
  };
}

export function showMessenger(text, type) {
  return {
    type: SHOW,
    messenger: {
      text,
      type
    }
  };
}

export function showMessengerSuccess(text) {
  return {
    type: SHOW,
    messenger: {
      text,
      type: 'messenger--success',
      time: 3000
    }
  };
}

export function showMessengerError(text) {
  return {
    type: SHOW,
    messenger: {
      text,
      type: 'messenger--error',
      time: 5000
    }
  };
}
