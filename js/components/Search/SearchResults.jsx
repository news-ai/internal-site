import React, { Component } from 'react';
import {connect} from 'react-redux';
import withRouter from 'react-router/lib/withRouter';
import Link from 'react-router/lib/Link';
import queryString from 'query-string';
import Select from 'react-select';
import isEmpty from 'lodash/isEmpty';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import {searchConstant} from './constants';
import {blue500, grey400, grey700, grey800} from 'material-ui/styles/colors';
import ContactListItem from 'components/Contacts/ContactListItem';
import SearchPage from 'components/Search/SearchPage';
import Paper from 'material-ui/Paper';

const beatOptions = [
  {value: 'Arts and Entertainment'},
  {value: 'Beauty'},
  {value: 'Business and Finance'},
  {value: 'Crime and Justice'},
  {value: 'Education'},
  {value: 'Energy'},
  {value: 'Environment'},
  {value: 'Fashion'},
  {value: 'Food and Dining'},
  {value: 'Health'},
  {value: 'Media'},
  {value: 'Opinion and Editorial'},
  {value: 'Politics'},
  {value: 'Real Estate'},
  {value: 'Religion'},
  {value: 'Science'},
  {value: 'Sports'},
  {value: 'Technology'},
  {value: 'Transportation'},
  {value: 'Travel'},
  {value: 'Weather'},
  {value: 'World'},
];

const styles = {
  pagesContainer: {padding: '15px 10px', margin: '30px 10px'},
  contactItemContainer: {margin: '10px 5px'},
  limit: {
    label: {margin: '0 5px', color: grey800},
    container: {margin: '10px 0'},
    select: {width: 60}
  },
  copy: {
    btn: {margin: '0 5px', float: 'right'}
  },
  controls: {
    checkbox: {fill: blue500},
    container: {margin: '10px 0'}
  },
  selectLabel: {margin: '0 5px', float: 'right', color: grey700},
  dialog: {
    container: {height: 400},
  },
  container: {marginTop: 20, marginBottom: 10},
  text: {fontSize: '2em', marginRight: 10}
};

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: [],
    };
    this.handlePageLimitChange = this.handlePageLimitChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const page = this.props.page !== undefined ? this.props.page : 1;
    const limit = this.props.limit !== undefined ? this.props.limit : 20;
    if (nextProps.page !== page || nextProps.limit !== limit) {
      const start = (nextProps.page - 1) * nextProps.limit;
      const end = nextProps.page * nextProps.limit;
      if (end > this.props.contacts.length) {
        console.log('FETCH MORE');
        const query = JSON.parse(nextProps.query);
        this.props.fetchSearch(query);
      }
    }
  }

  handlePageLimitChange(e) {
    this.props.router.push({
      pathname: `/search`,
      query: {
        q: this.props.query,
        limit: parseInt(e.target.value, 10),
        page: 1
      }
    });
  }

  render() {
    const {total, isReceiving, contacts} = this.props;
    const page = this.props.page !== undefined ? this.props.page : 1;
    const limit = this.props.limit !== undefined ? this.props.limit : 20;

    const slicedContacts = contacts.slice(
      (page - 1) * limit,
      page * limit
      );

    const numPages = total % limit > 0 ? Math.floor(total / limit) + 1 : Math.floor(total / limit);
    // console.log(contacts);
    // console.log(slicedContacts);

    return (
      <div>
        <div style={{marginRight: 10, textAlign: 'right'}} >
          <span className='text' style={{color: grey700}} >{total} results found.</span>
        </div>
      {slicedContacts.map((contact, i) =>
        <div style={{margin: 5}} >
          <ContactListItem key={contact.email} {...contact} />
        </div>)}
        <div style={{margin: '30px 0'}} className='vertical-center horizontal-center'>
        {page > 1 &&
          <Link
            to={{
              pathname: `/search`,
              query: {
                q: this.props.query,
                limit: parseInt(limit, 10),
                page: page - 1
              }
            }}>
            <IconButton iconClassName='fa fa-arrow-left' label='Previous' />
          </Link>}
        {numPages &&
          <span style={{margin: '0 10px'}} >{page} of {numPages} pages</span>}
        {page < numPages &&
          <Link
          to={{
            pathname: `/search`,
            query: {
              q: this.props.query,
              limit: parseInt(limit, 10),
              page: page + 1
            }
          }}>
            <IconButton iconClassName='fa fa-arrow-right' label='Next' />
          </Link>}
        </div>
      </div>
    );
  }
}

export class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (!isEmpty(this.props.query)) {
      const query = JSON.parse(this.props.query);
      // this.props.fetchSearch(query);
      if (!this.props.cacheQuery || this.props.query !== JSON.stringify(this.props.cacheQuery)) {
        this.props.fetchSearch(query);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.query !== nextProps.query) {
      const query = JSON.parse(nextProps.query);
      // this.props.fetchSearch(query);
      this.props.fetchSearch(query);
    }
  }

  render() {
    const {isReceiving, contacts, query} = this.props;

    return (
      <div>
        <Paper zDepth={2} style={{
          display: 'block',
          position: 'absolute',
          width: 300,
          backgroundColor: '#ffffff',
          padding: '5px 10px',
          height: 'auto',
          minHeight: '100%'
        }} >
          <SearchPage queryString={query} />
        </Paper>
        <div style={{position: 'absolute', marginLeft: 300}} >
        {!contacts ? <div>LOADING...</div> : <SearchResults {...this.props} />}
        </div>
      </div>
    );
  }
}


export default connect(
  ({searchReducer, contactReducer}, {router}) => {
    const {q, page, limit} = router.location.query;
    return {
      isReceiving: searchReducer.isReceiving,
      contacts: searchReducer.mostRecentReceived.map(id => contactReducer[id]),
      query: q,
      cacheQuery: searchReducer.currentQuery,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      total: searchReducer.total,
    };
  },
  (dispatch) => ({
    fetchSearch: query => dispatch({type: 'FETCH_QUERY_SEARCH', query})
  })
  )(withRouter(SearchContainer));
