import {searchConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  mostRecentReceived: [],
  pastQueries: []
};

function searchReducer(state = initialState, action) {
  if (window.isDev) Object.freeze(state);
  switch (action.type) {
    case searchConstant.REQUEST:
      return assignToEmpty(state, {isReceiving: true});
    case searchConstant.RECEIVE:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: false,
        mostRecentReceived: JSON.stringify(action.query) !== JSON.stringify(state.currentQuery) ? action.ids : [...state.mostRecentReceived, ...action.ids],
        currentQuery: action.query,
        pastQueries: JSON.stringify(action.query) !== JSON.stringify(state.currentQuery) ? [...state.pastQueries, assignToEmpty(state.currentQuery)] : state.pastQueries,
        offset: action.offset,
        total: action.total
      });
    case searchConstant.REQUEST_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true,
      });
    case searchConstant.REQUEST_ABORT:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: false,
      });
    case 'SELECT_SEARCH_ITEMS':
    default:
      return state;
  }
}

export default searchReducer;
