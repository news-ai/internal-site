import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {twitterProfileConstant} from './constants';
import has from 'lodash/has';

export const fetchTwitterProfile = (action$, {getState}) =>
  action$.ofType('FETCH_TWITTER_PROFILE')
  .filter(({email, useCache}) => useCache ? !has(getState(), `twitterProfileReducer['${email}']`) : true)
  .filter(({email}) => {
    const contact = getState().twitterProfileReducer[email];
    return contact ? !contact.isReceiving : true;
  })
  .switchMap(({email}) =>
    Observable.merge(
      Observable.of({type: twitterProfileConstant.REQUEST, email}),
      Observable.from(api.get(`/database-contacts/${email}/twitterprofile`))
      .map(response => ({email, type: twitterProfileConstant.RECEIVE, profile: response.data}))
      .catch(err => Observable.of({type: twitterProfileConstant.REQUEST_FAIL, message: err}))
      )
    )
  .takeUntil(action$.ofType('FETCH_TWITTER_PROFILE_ABORT'));
