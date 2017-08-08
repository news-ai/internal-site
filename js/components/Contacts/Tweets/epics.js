import {tweetConstant} from './constants';
import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {normalize, schema} from 'normalizr';
import get from 'lodash/get';
const tweetSchema = new schema.Entity('tweets', {}, {idAttribute: 'tweetid'});
const tweetListSchema = [tweetSchema];

const PAGE_LIMIT = 50;
export const fetchContactTweets = (action$, {getState}) =>
  action$.ofType('FETCH_CONTACT_TWEETS')
  .filter(({email}) => !get(getState(), `tweetReducer['${email}'].didInvalidate`))
  .filter(({email}) => get(getState(), `tweetReducer['${email}'].offset`) !== null)
  .filter(({email}) => {
    const contact = getState().tweetReducer[email];
    return contact ? !contact.isReceiving : true;
  })
  .switchMap(({email}) => {
    const OFFSET = get(getState(), `tweetReducer['${email}'].offset`, 0);
    return Observable.merge(
      Observable.of({type: tweetConstant.REQUEST_MULTIPLE, email}),
      Observable.fromPromise(api.get(`/database-contacts/${email}/tweets?limit=${PAGE_LIMIT}&offset=${OFFSET}`))
      .map(response => {
        const res = normalize(response.data, tweetListSchema);
        return ({
          type: tweetConstant.RECEIVE_MULTIPLE,
          email,
          tweets: res.entities.tweets,
          ids: res.result,
          offset: res.result.length < PAGE_LIMIT ? null : OFFSET + PAGE_LIMIT
        });
      })
      .catch(err => Observable.of({type: tweetConstant.REQUEST_MULTIPLE_FAIL, message: err, email}))
    );
  })
  .takeUntil(action$.ofType(tweetConstant.REQUEST_ABORT));
