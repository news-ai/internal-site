import * as api from 'actions/api';
import {
  loginConstant,
  SET_FIRST_TIME_USER,
  REMOVE_FIRST_TIME_USER
} from './constants';

import alertify from 'alertifyjs';
import 'node_modules/alertifyjs/build/css/alertify.min.css';
alertify.set('notifier', 'position', 'top-right');

function requestLogin() {
  return {
    type: loginConstant.REQUEST
  };
}

function receiveLogin(person) {
  return {
    type: loginConstant.RECEIVE,
    person
  };
}

function loginFail(message) {
  return {
    type: loginConstant.REQUEST_FAIL,
    message
  };
}

export function loginWithGoogle() {
  return dispatch => {
    const base = `${window.TABULAE_API_BASE}/auth/google?next=${window.location}`;
    dispatch({type: 'LOGIN WITH GOOGLE'});
    window.location.href = base;
  };
}

export function getEmailMaxAllowance() {
  return (dispatch, getState) => {
    if (getState().personReducer.allowance) return Promise.resolve(true);
    dispatch({type: 'REQUEST_EMAIL_MAX_ALLOWANCE'});
    return api.get(`/users/me/plan-details`)
    .then(response => dispatch({type: 'RECEIVE_EMAIL_MAX_ALLOWANCE', allowance: response.data.emailaccounts, ontrial: response.data.ontrial}))
    .catch(err => console.log(err));
  };
}

export function onLogin() {
  return dispatch => {
    const base = `${window.TABULAE_API_BASE}/auth?next=${window.location}`;
    dispatch({type: 'LOGIN'});
    window.location.href = base;
  };
}

export function register() {
  return dispatch => {
    const base = `${window.TABULAE_API_BASE}/auth/registration?next=${window.location}`;
    dispatch({type: 'REGISTER'});
    window.location.href = base;
  };
}

export function logout() {
  return dispatch => {
    const base = `${window.TABULAE_API_BASE}/auth/logout?next=${window.location}`;
    dispatch({type: 'LOGOUT'});
    window.location.href = base;
  };
}

// export function fetchPerson() {
//   return (dispatch, getState) => {
//     if (getState().personReducer.person) return;
//     dispatch(requestLogin());
//     return api.get('/users/me')
//     .then(response => dispatch(receiveLogin(response.data)))
//     .catch(message => {
//       if (window.isDev) console.log(message);
//     });
//   };
// }

export function fetchUser(userId) {
  return (dispatch, getState) => {
    if (getState().personReducer[userId]) return;
    dispatch({type: 'FETCH_USER', userId});
    return api.get(`/users/${userId}`)
    .then(response => dispatch({type: 'RECEIVE_USER', user: response.data}))
    .catch(message => {
      if (window.isDev) console.log(message);
    });
  };
}

export function removeExternalEmail(email) {
  return dispatch => {
    dispatch({type: 'START_REMOVE_EXTERNAL_EMAIL'});
    return api.post(`/users/me/remove-email`, {email})
    .then(response => dispatch(receiveLogin(response.data)))
    .catch(err => console.log(err));
  };
}

export function patchPerson(personBody) {
  return dispatch => {
    dispatch({type: 'PATCH_PERSON', personBody});
    return api.patch(`/users/me`, personBody)
    .then(response => dispatch(receiveLogin(response.data)))
    .catch(message => {
      if (window.isDev) console.log(message);
    });
  };
}
