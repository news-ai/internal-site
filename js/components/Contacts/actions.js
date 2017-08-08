import * as api from 'actions/api';
import {normalize, schema} from 'normalizr';
import {contactConstant} from './constants';

const contactSchema = new schema.Entity('contacts', {}, {idAttribute: 'email'});

// export function fetchContact(email) {
//   return dispatch => {
//     dispatch({type: contactConstant.REQUEST, email});
//     return api.get(`/database-contacts/${email}`)
//     .then(response => dispatch({type: contactConstant.RECEIVE, email, contact: response.data}))
//     .catch(err => console.log(err));
//   };
// }
