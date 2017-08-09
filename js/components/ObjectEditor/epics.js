import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {schemaConstant} from './constants';

export const fetchContactSchema = (action$) =>
  action$.ofType('FETCH_CONTACT')
  .switchMap(() =>
    Observable.merge(
      Observable.of({type: schemaConstant.REQUEST, schemaType: 'contacts'}),
      Observable.fromPromise(api.get(`/database-schemas/_mappings`))
      .map(response => {
        const dbKey = Object.keys(response.data)[0];
        const mapping = response.data[dbKey].mappings;
        return ({type: schemaConstant.RECEIVE, mapping, schemaType: 'contacts'});
      })
      .catch(err => Observable.of({type: schemaConstant.REQUEST_FAIL, message: err}))
      )
    )
  .takeUntil(action$.ofType(schemaConstant.REQUEST_ABORT));
