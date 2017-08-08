
import {publicationConstant} from './constants';
import {assignToEmpty} from 'utils/assign';
import get from 'lodash/get';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: [],
  latestReceivedBatch: [],
  latestQuery: undefined
};

function publicationReducer(state = initialState, action) {
  if (process.env.NODE_ENV === 'development') Object.freeze(state);

  let obj;
  switch (action.type) {
    case publicationConstant.REQUEST_QUERY:
      return assignToEmpty(state, {
        isReceiving: true,
        latestQuery: action.query
      });
    case publicationConstant.RECEIVE_QUERY:
      return assignToEmpty(state, action.publications, {
        isReceiving: false,
        didInvalidate: false,
        latestReceivedBatch: [...action.ids],
        received: [...state.received, ...action.ids.filter(id => !state[id])]
      });
    case publicationConstant.REQUEST_QUERY_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true
      });
    case publicationConstant.REQUEST_QUERY_ABORT:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: false
      });
    default:
      return state;
  }
}

export default publicationReducer;
