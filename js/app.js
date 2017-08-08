/**
 *
 * app.js
 *
 * This is the entry file for the application, mostly just setup and boilerplate
 * code. Routes are configured at the end of this file!
 *
 */

// Load the ServiceWorker, the Cache polyfill, the manifest.json file and the .htaccess file
// import 'file-loader?name=[name].[ext]!../serviceworker.js';
// import 'file-loader?name=[name].[ext]!../manifest.json';
// import 'file-loader?name=[name].[ext]!../.htaccess';

// Check for ServiceWorker support before trying to install it
// if (!window.isDev) {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/serviceworker.js')
//     .then(
//       registration => console.log('ServiceWorker registration successful with scope: ', registration.scope),
//       err => console.log('ServiceWorker registration failed: ', err)
//     ).catch(err => {
//       // Registration failed
//       console.log(err);
//     });
//   } else {
//     // No ServiceWorker Support
//     console.log('service worker is not supported');
//   }
// }

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';

// Import the pages
import App from 'components/App';
import Contacts from 'components/Contacts/Contacts';
import Contact from 'components/Contacts/Contact';
import Home from 'components/Home/Home';
import SearchResults from 'components/Search/SearchResults';

import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Import the CSS file, which HtmlWebpackPlugin transfers to the build folder
import '../css/main.css';

const store = configureStore();

window.TABULAE_API_BASE = process.env.NODE_ENV === 'development' ? `https://dev-dot-newsai-1166.appspot.com/api` : `https://tabulae.newsai.org/api`;
// window.TABULAE_HOME = window.isDev ? `https://tabulae-dev.newsai.co` : `https://tabulae.newsai.co`;


// third-party services setups
// if (!window.isDev) Raven.config('https://c6c781f538ef4b6a952dc0ad3335cf61@sentry.io/100317').install();


// Make reducers hot reloadable, see http://stackoverflow.com/questions/34243684/make-redux-reducers-and-other-non-components-hot-loadable
if (module.hot) {
  module.hot.accept('./reducers/rootReducer', () => {
    const nextRootReducer = require('./reducers/rootReducer').default;
    const nextRootEpic = require('./reducers/rootEpic').default;
    store.replaceReducer(nextRootReducer);
    store.replaceEpic(nextRootEpic);
  });
}

const Base = () => (
  <MultiThemeProvider>
    <Provider store={store}>
      <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
        <Route path='/' name='Home' component={App}>
          <IndexRoute component={Home} />
          <Route path='contacts' name='Contacts'>
            <IndexRoute component={Contacts} />
            <Route path='contact' component={Contact} />
          </Route>
          <Route path='search' name='Search Results' component={SearchResults} />
        </Route>
      </Router>
    </Provider>
  </MultiThemeProvider>
  );

ReactDOM.render(
  <Base />,
  document.getElementById('app')
);
