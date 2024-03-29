import fetch from 'isomorphic-fetch';
import axios from 'axios';
import 'rxjs';


export function get(endpoint) {
  return axios(`${window.TABULAE_API_BASE}${endpoint}`, {
    withCredentials: true
  })
  .then(response => response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response));
}

export function deleteRequest(endpoint) {
  return fetch(`${window.TABULAE_API_BASE}${endpoint}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(response => response.status === 200 ? response.text() : Promise.reject(response))
    .then(text => JSON.parse(text));
}

export function post(endpoint, body) {
  return axios({
    method: 'post',
    url: `${window.TABULAE_API_BASE}${endpoint}`,
    withCredentials: true,
    data: JSON.stringify(body)
  })
  .then(response => response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response));
}

export function patch(endpoint, body) {
  return axios({
    method: 'patch',
    url: `${window.TABULAE_API_BASE}${endpoint}`,
    withCredentials: true,
    data: JSON.stringify(body)
  })
  .then(response => response.status === 200 ? Promise.resolve(response.data) : Promise.reject(response));
}

// export function post(endpoint, body) {
//   return fetch(`${window.TABULAE_API_BASE}${endpoint}`, {
//     method: 'POST',
//     credentials: 'include',
//     body: JSON.stringify(body)
//   })
//     .then(response => response.status === 200 ? response.text() : Promise.reject(response))
//     .then(text => JSON.parse(text));
// }

export function postFile(endpoint, file) {
  return fetch(`${window.TABULAE_API_BASE}${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    body: file
  })
    .then(response => response.status === 200 ? response.text() : Promise.reject(response.text()))
    .then(text => JSON.parse(text));
}

// export function patch(endpoint, body) {
//   return fetch(`${window.TABULAE_API_BASE}${endpoint}`, {
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     mode: 'cors',
//     method: 'PATCH',
//     credentials: 'include',
//     body: JSON.stringify(body)
//   })
//     .then(response => response.status === 200 ? response.text() : Promise.reject(response))
//     .then(text => JSON.parse(text));
// }

