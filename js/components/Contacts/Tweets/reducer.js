import {tweetConstant} from './constants';
import {assignToEmpty} from 'utils/assign';
import get from 'lodash/get';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: [],
};

function tweetReducer(state = initialState, action) {
  if (process.env.NODE_ENV === 'development') Object.freeze(state);

  let obj;
  switch (action.type) {
    case tweetConstant.REQUEST_MULTIPLE:
      obj = assignToEmpty(state, {
        [action.email]: state[action.email] ? assignToEmpty(state[action.email], {isReceiving: true}) : {isReceiving: true}
      });
      obj.isReceiving = true;
      return obj;
    case tweetConstant.RECEIVE_MULTIPLE:
      obj = assignToEmpty(state, action.tweets);
      const oldContact = state[action.email];
      obj[action.email] = assignToEmpty(state[action.email], {
        isReceiving: false,
        received: [
          ...get(oldContact, 'received', []),
          ...action.ids.filter(id => !oldContact[id])
        ],
        offset: action.offset
      });
      obj.isReceiving = false;
      obj.didInvalidate = false;
      return obj;
    case tweetConstant.REQUEST_MULTIPLE_FAIL:
      return assignToEmpty(state, {
        didInvalidate: true,
        isReceiving: false,
        [action.email]: assignToEmpty(state[action.email], {didInvalidate: true, isReceiving: false})
      });
    default:
      return state;
  }
}

export default tweetReducer;
