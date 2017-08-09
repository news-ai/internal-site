import {schemaConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: []
};

function schemaReducer(state = initialState, action) {
  if (window.isDev) Object.freeze(state);
  switch (action.type) {
    case schemaConstant.REQUEST:
      return assignToEmpty(state, {
        isReceiving: true,
      });
    case schemaConstant.RECEIVE:
      return assignToEmpty(state, {
        isReceiving: false,
        [action.schemaType]: action.schema,
      });
    case schemaConstant.REQUEST_ABORT:
      return assignToEmpty(state, {isReceiving: false});
    case schemaConstant.REQUEST_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true
      });
    default:
      return state;
  }
}

export default schemaReducer;
