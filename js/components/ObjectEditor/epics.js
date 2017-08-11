import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {schemaConstant} from './constants';

export const fetchSchema = (action$) =>
  action$.ofType('FETCH_SCHEMA')
  .switchMap(({schemaType}) => {
    switch (schemaType) {
      case 'contacts':
        return Observable.of({type: 'FETCH_CONTACT_SCHEMA'});
      default:
        return Observable.of({type: 'FETCH_CONTACT_SCHEMA'});
    }
  });

const convertSchema = mapping => Object
.entries(mapping)
.reduce((newMap, [key, val]) => {
  newMap[key] = val.properties ? convertSchema(val.properties) : val;
  return newMap;
}, {});

export const fetchContactSchema = (action$, {getState}) =>
  action$.ofType('FETCH_CONTACT_SCHEMA')
  .filter(_ => !getState().schemaReducer.contacts)
  .filter(_ => !getState().schemaReducer.isReceiving)
  .switchMap(() =>
    Observable.merge(
      Observable.of({type: schemaConstant.REQUEST, schemaType: 'contacts'}),
      Observable.fromPromise(api.get(`/database-contacts/_mapping`))
      .map(response => {
        const dbKey = Object.keys(response.data)[0];
        const schema = convertSchema(response.data[dbKey].mappings.contacts.properties.data.properties);
        return ({type: schemaConstant.RECEIVE, schema, schemaType: 'contacts'});
      })
      .catch(err => Observable.of({type: schemaConstant.REQUEST_FAIL, message: err}))
      )
    )
  .takeUntil(action$.ofType(schemaConstant.REQUEST_ABORT));
