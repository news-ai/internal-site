import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {contactConstant} from './constants';
import {normalize, schema} from 'normalizr';
import has from 'lodash/has';
const contactSchema = new schema.Entity('contacts', {}, {idAttribute: 'email'});
const contactListSchema = [contactSchema];

export const fetchPlaceholderContacts = (action$, {getState}) =>
  action$.ofType('FETCH_PLACEHOLDER_CONTACTS')
  .filter(_ => !getState().contactReducer.isReceiving)
  .switchMap(_ =>
    Observable.merge(
      Observable.of({type: contactConstant.REQUEST_MULTIPLE}),
      Observable.from(api.get(`/database-contacts`))
      .map(response => {
        const res = normalize(response.data, contactListSchema);
        return {type: contactConstant.RECEIVE_MULTIPLE, ids: res.result, contacts: res.entities.contacts};
      })
      .catch(err => Observable.of({type: contactConstant.REQUEST_MULTIPLE_FAIL, message: err}))
      ))
  .takeUntil(action$.ofType(contactConstant.REQUEST_MULTIPLE_ABORT));

export const fetchContactProfile = action$ =>
  action$.ofType('FETCH_CONTACT_PROFILE')
  .switchMap(({email}) =>
    Observable.merge(
      Observable.of({type: 'FETCH_CONTACT', email, useCache: true}),
      Observable.of({type: 'FETCH_CONTACT_TWEETS', email}),
      Observable.of({type: 'FETCH_CONTACT_HEADLINES', email}),
      Observable.of({type: 'FETCH_TWITTER_PROFILE', email, useCache: true})
      )
    )
  .takeUntil(action$.ofType('FETCH_CONTACT_PROFILE_ABORT'))
  .catch(err => Observable.of({type: 'FETCH_CONTACT_FAIL', message: err}));

export const fetchContact = (action$, {getState}) =>
  action$.ofType('FETCH_CONTACT')
  .filter(({email, useCache}) => useCache ? !has(getState(), `contactReducer['${email}']`) : true)
  .filter(({email}) => {
    const contact = getState().contactReducer[email];
    return contact ? !contact.isReceiving : true;
  })
  .switchMap(({email}) =>
    Observable.merge(
      Observable.of({type: contactConstant.REQUEST, email}),
      Observable.fromPromise(api.get(`/database-contacts/${email}`))
      .map(response => ({type: contactConstant.RECEIVE, email, contact: response.data}))
      .catch(err => Observable.of({type: contactConstant.REQUEST_FAIL, message: err, email}))
      )
    )
  .takeUntil(action$.ofType(contactConstant.REQUEST_ABORT));
