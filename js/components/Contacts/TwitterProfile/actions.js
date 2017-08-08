import {twitterProfileConstant} from './constants';
import * as api from 'actions/api';

// export function fetchTwitterProfile(email) {
//   return (dispatch, getState) => {
//     const isReceiving = getState().twitterProfileReducer.isReceiving;
//     if (isReceiving) return;
//     dispatch({type: twitterProfileConstant.REQUEST, email});
//     return api.get(`/contacts/${email}/twitterprofile`)
//     .then(response => dispatch({email, type: twitterProfileConstant.RECEIVE, profile: response.data}))
//     .catch(err => dispatch({type: twitterProfileConstant.REQUEST_FAIL, message: err}));
//   };
// }
