import * as api from 'actions/api';
import {normalize, schema} from 'normalizr';
import 'rxjs';
import {Observable} from 'rxjs';
import get from 'lodash/get';
import {headlineConstant} from './constants';

const headlineSchema = new schema.Entity('headlines', {}, {idAttribute: 'url'});
const headlineListSchema = [headlineSchema];

const PAGE_LIMIT = 50;
export const fetchContactHeadlines = (action$, {getState}) =>
  action$.ofType('FETCH_CONTACT_HEADLINES')
  .filter(({email}) => !get(getState(), `headlineReducer['${email}'].didInvalidate`))
  .filter(({email}) => get(getState(), `headlineReducer['${email}'].offset`) !== null)
  .filter(({email}) => {
    const contact = getState().headlineReducer[email];
    return contact ? !contact.isReceiving : true;
  })
  .switchMap(({email}) => {
    const OFFSET = get(getState(), `headlineReducer['${email}'].offset`, 0);
    return Observable.merge(
      Observable.of({type: headlineConstant.REQUEST_MULTIPLE, email}),
      Observable.from(api.get(`/database-contacts/${email}/headlines?limit=${PAGE_LIMIT}&offset=${OFFSET}`))
      .map(response => {
        const res = normalize(response.data, headlineListSchema);
        return ({
          type: headlineConstant.RECEIVE_MULTIPLE,
          email,
          headlines: res.entities.headlines,
          ids: res.result,
          offset: res.result.length < PAGE_LIMIT ? null : OFFSET + PAGE_LIMIT
        });
      })
    )
    .catch(err => Observable.of({type: headlineConstant.REQUEST_MULTIPLE_FAIL, message: err, email}));
  })
  .takeUntil(action$.ofType(headlineConstant.REQUEST_ABORT));

