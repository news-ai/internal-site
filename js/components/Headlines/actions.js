import * as api from 'actions/api';
import {normalize, Schema, arrayOf} from 'normalizr';

const headlineSchema = new Schema('headlines', {idAttribute: 'title'});

// export function fetchContactHeadlines(email) {
//   return dispatch => {
//     dispatch({type: 'CONTACT_HEADLINES_REQUEST', email});
//     return api.get(`${window.TABULAE_API_BASE}/database-contacts/${email}/headlines`)
//     .then(response => {
//       const res = normalize(response, {data: arrayOf(headlineSchema)});
//       return dispatch({type: 'CONTACT_HEADLINES_RECEIVE', ids: res.result.data, headlines: res.entities.headlines});
//     })
//     .catch(err => console.log(err));
//   };
// }
