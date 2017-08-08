
import 'rxjs';
import {Observable} from 'rxjs';

const baseSettings = {
  withCredentials: true,
  crossDomain: true,
  responseType: 'text'
  // async: true
};

export const get = endpoint => Observable.ajax(
  Object.assign({}, baseSettings, {
    url: `${window.TABULAE_API_BASE}${endpoint}`,
  }))
.map(response => response.json());

export const deleteRequest = endpoint => Observable.ajax(
  Object.assign({}, baseSettings, {
    url: `${window.TABULAE_API_BASE}${endpoint}`,
    method: 'DELETE'
  }));

export const post = (endpoint, body) => Observable.ajax(
  Object.assign({}, baseSettings, {
    url: `${window.TABULAE_API_BASE}${endpoint}`,
    method: 'POST',
    body: JSON.stringify(body)
  }));

export const postFile = (endpoint, file) => Observable.ajax(
  Object.assign({}, baseSettings, {
    url: `${window.TABULAE_API_BASE}${endpoint}`,
    method: 'POST',
    body: file
  }));

export const patch = (endpoint, body) => Observable.ajax(
  Object.assign({}, baseSettings, {
    url: `${window.TABULAE_API_BASE}${endpoint}`,
    method: 'PATCH',
    body: JSON.stringify(body),
    crossDomain: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }));
