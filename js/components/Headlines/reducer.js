import {headlineConstant} from './constants';
import {assignToEmpty} from 'utils/assign';
import get from 'lodash/get';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: [],
};

function headlineReducer(state = initialState, action) {
  if (process.env.NODE_ENV === 'development') Object.freeze(state);

  let obj;
  switch (action.type) {
    case headlineConstant.REQUEST_MULTIPLE:
      obj = assignToEmpty(state, {
        [action.email]: state[action.email] ? assignToEmpty(state[action.email], {isReceiving: true}) : {isReceiving: true}
      });
      obj.isReceiving = true;
      return obj;
    case headlineConstant.RECEIVE_MULTIPLE:
      obj = assignToEmpty(state, action.headlines);
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
    case headlineConstant.REQUEST_MULTIPLE_FAIL:
      return assignToEmpty(state, {
        didInvalidate: true,
        isReceiving: false,
        [action.email]: assignToEmpty(state[action.email], {didInvalidate: true, isReceiving: false})
      });
    default:
      return state;
  }
}

export default headlineReducer;
