
import {contactConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: []
};

function contactReducer(state = initialState, action) {
  if (window.isDev) Object.freeze(state);
  switch (action.type) {
    case contactConstant.REQUEST:
      return assignToEmpty(state, {
        isReceiving: true,
        [action.email]: state[action.email] ? assignToEmpty(state[action.email], {isReceiving: true}) : {isReceiving: true}
      });
    case contactConstant.RECEIVE:
      return assignToEmpty(state, {
        isReceiving: false,
        [action.email]: assignToEmpty(action.contact, {isReceiving: false}),
        received: [...state.received.filter(e => e !== action.email), action.email]
      });
    case contactConstant.REQUEST_ABORT:
      return assignToEmpty(state, {isReceiving: false});
    case contactConstant.REQUEST_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true
      });
    case contactConstant.REQUEST_MULTIPLE:
      return assignToEmpty(state, {
        isReceiving: true
      });
    case contactConstant.RECEIVE_MULTIPLE:
      return assignToEmpty(state, action.contacts, {
        received: [...state.received, ...action.ids.filter(id => !state[id])],
        isReceiving: false,
        didInvalidate: false
      });
    case contactConstant.REQUEST_MULTIPLE_ABORT:
      return assignToEmpty(state, {isReceiving: false});
    case contactConstant.REQUEST_MULTIPLE_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true
      });
    default:
      return state;
  }
}

export default contactReducer;
