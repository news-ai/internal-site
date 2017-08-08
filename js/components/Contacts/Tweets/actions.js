import {tweetConstant} from './constants';
import * as api from 'actions/api';
import {normalize, schema} from 'normalizr';
const tweetSchema = new schema.Entity('tweets', {}, {idAttribute: 'tweetid'});
const tweetListSchema = [tweetSchema];

// export function fetchContactTweets(email) {
//   const PAGE_LIMIT = 50;
//   return (dispatch, getState) => {
//     const contactObj = getState().tweetReducer[email];
//     const OFFSET = contactObj ? contactObj.offset : 0;
//     const isReceiving = getState().tweetReducer.isReceiving;
//     if (OFFSET === null || isReceiving) return;
//     dispatch({type: tweetConstant.REQUEST_MULTIPLE, email});
//     return api.get(`/database-contacts/${email}/tweets?limit=${PAGE_LIMIT}&offset=${OFFSET}`)
//     .then(response => {
//       const res = normalize(response.data, tweetListSchema);

//       return dispatch({
//         type: tweetConstant.RECEIVE_MULTIPLE,
//         email,
//         tweets: res.entities.tweets,
//         ids: res.result,
//         offset: res.result.length < PAGE_LIMIT ? null : OFFSET + PAGE_LIMIT
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       dispatch({type: tweetConstant.REQUEST_MULTIPLE_FAIL});
//     });
//   };
// }
