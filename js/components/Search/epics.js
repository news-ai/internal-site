
import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {searchConstant} from './constants';
import {contactConstant} from 'components/Contacts/constants';
import {normalize, schema} from 'normalizr';
import get from 'lodash/get';
import has from 'lodash/has';
const contactSchema = new schema.Entity('contacts', {}, {idAttribute: 'email'});
const contactListSchema = [contactSchema];

const PAGE_LIMIT = 50;
export const fetchSearch = (action$, {getState}) =>
  action$.ofType('FETCH_QUERY_SEARCH')
  .debounceTime(100)
  .filter(({query}) => {
    if (JSON.stringify(query) === JSON.stringify(getState().searchReducer.currentQuery)) return getState().searchReducer.offset !== null;
    return true;
  })
  .switchMap(({query}) => {
    // const formattedQuery = formatQuery(query);
    // console.log(formattedQuery);
    const OFFSET = JSON.stringify(query) === JSON.stringify(getState().searchReducer.currentQuery) ? getState().searchReducer.offset : 0;
    return Observable.merge(
      Observable.of({type: searchConstant.REQUEST, query}),
      Observable.from(api.post(`/database-contacts/search?limit=${PAGE_LIMIT}&offset=${OFFSET}`, {included: query}))
      .flatMap(response => {
        // console.log(response);
        const res = normalize(response.data === null ? [] : response.data, contactListSchema);
        return [
          {type: contactConstant.RECEIVE_MULTIPLE, ids: res.result, contacts: res.entities.contacts},
          {
            type: searchConstant.RECEIVE,
            query,
            ids: res.result,
            offset: res.result.length < PAGE_LIMIT ? null : OFFSET + PAGE_LIMIT,
            total: response.summary.total
          }
        ];
      })
    );
  })
  .takeUntil(action$.ofType(searchConstant.REQUEST_ABORT));
