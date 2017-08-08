import {twitterProfileConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: [],
};

function twitterProfileReducer(state = initialState, action) {
  if (process.env.NODE_ENV === 'development') Object.freeze(state);

  let obj;
  switch (action.type) {
    case twitterProfileConstant.REQUEST:
      return assignToEmpty(state, {
        isReceiving: true,
        [action.email]: state[action.email] ? assignToEmpty(state[action.email], {isReceiving: true}) : {isReceiving: true}
      });
    case twitterProfileConstant.RECEIVE:
      return assignToEmpty(state, {
        isReceiving: false,
        [action.email]: assignToEmpty(action.profile, {isReceiving: false}),
        received: [...state.received.filter(e => e !== action.email), action.email]
      });
    case twitterProfileConstant.REQUEST_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true
      });
    default:
      return state;
  }
}

export default twitterProfileReducer;
