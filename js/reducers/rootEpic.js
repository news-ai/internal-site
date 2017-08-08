import {combineEpics} from 'redux-observable';
// import {fetchPerson, setupThirdparty} from 'components/Login/epics';
import * as personEpics from 'components/Login/epics';
// import {fetchContactTweets} from 'components/Contacts/Tweets/epics';
import * as tweetEpics from 'components/Contacts/Tweets/epics';
// import {fetchContactHeadlines} from 'components/Headlines/epics';
import * as headlineEpics from 'components/Headlines/epics';
// import {fetchTwitterProfile} from 'components/Contacts/TwitterProfile/epics';
import * as twitterProfileEpics from 'components/Contacts/TwitterProfile/epics';
// import {fetchContactProfile, fetchContact, fetchPlaceholderContacts} from 'components/Contacts/epics';
import * as contactEpics from 'components/Contacts/epics';
import * as publicationEpics from 'components/Publications/epics';
import * as searchEpics from 'components/Search/epics';

const argumentObjects = [
  personEpics,
  tweetEpics,
  headlineEpics,
  twitterProfileEpics,
  contactEpics,
  publicationEpics,
  searchEpics
];

const flatten = args => Object.keys(args).map(key => args[key]);
const argArray = argumentObjects.reduce((acc, epic) => [...acc, ...flatten(epic)], []);

const rootEpic = combineEpics(...argArray);

export default rootEpic;
