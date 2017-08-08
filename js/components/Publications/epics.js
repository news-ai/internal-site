
import * as api from 'actions/api';
import {normalize, schema} from 'normalizr';
import 'rxjs';
import {Observable} from 'rxjs';
import get from 'lodash/get';
import {publicationConstant} from './constants';

const publicationSchema = new schema.Entity('publications', {}, {idAttribute: 'id'});
const publicationListSchema = [publicationSchema];

export const fetchQueryPublication = (action$, {getState}) =>
  action$.ofType('FETCH_QUERY_PUBLICATIONS')
  .filter(({query}) => query.length > 0)
  .distinctUntilChanged()
  .debounceTime(750)
  .switchMap(({query}) => {
    return Observable.merge(
      Observable.of({type: publicationConstant.REQUEST_QUERY, query}),
      Observable.from(api.get(`/database-publications?q="${query}"`))
      .map(response => {
        const res = normalize(response.data, publicationListSchema);
        return ({
          type: publicationConstant.RECEIVE_QUERY,
          query,
          publications: res.entities.publications,
          ids: res.result,
        });
      })
    )
    .catch(err => Observable.of({type: publicationConstant.REQUEST_QUERY_FAIL, message: err, query}));
  })
  .takeUntil(action$.ofType(publicationConstant.REQUEST_ABORT));
