import {loginConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false
};

function personReducer(state = initialState, action) {
  if (window.isDev) Object.freeze(state);
  switch (action.type) {
    case loginConstant.REQUEST:
      return assignToEmpty(state, {isReceiving: true});
    case loginConstant.RECEIVE:
      return assignToEmpty(state, {
        isReceiving: false,
        person: action.person
      });
    case loginConstant.REQUEST_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true
      });
    default:
      return state;
  }
}

export default personReducer;
