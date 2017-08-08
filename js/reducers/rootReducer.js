import {combineReducers} from 'redux';

import personReducer from 'components/Login/reducer';
import contactReducer from 'components/Contacts/reducer';
import tweetReducer from 'components/Contacts/Tweets/reducer';
import headlineReducer from 'components/Headlines/reducer';
import twitterProfileReducer from 'components/Contacts/TwitterProfile/reducer';
import publicationReducer from 'components/Publications/reducer';
import searchReducer from 'components/Search/reducer';

const rootReducer = combineReducers({
  personReducer,
  contactReducer,
  tweetReducer,
  twitterProfileReducer,
  headlineReducer,
  publicationReducer,
  searchReducer
});

export default rootReducer;
