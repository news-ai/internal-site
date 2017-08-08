import React, { Component } from 'react';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';

class PublicationContainer extends Component {
  constructor() {
    super();
    this.state = {value: ''};
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({value: e.target.value});
    this.props.fetchQueryPublications(e.target.value);
  }

  render() {
    const {publications} = this.props;
    return (
      <div>
        <TextField id='publication-query-input' onChange={this.onChange} />
        {publications && publications.map((pub, i) =>
          <div key={pub.id} >{pub.name}</div>
          )}
      </div>
    );
  }
}

export default connect(
  ({publicationReducer}) => ({publications: publicationReducer.latestReceivedBatch.map(id => publicationReducer[id])}),
  dispatch => ({
    fetchQueryPublications: query => dispatch({type: 'FETCH_QUERY_PUBLICATIONS', query})
  })
  )(PublicationContainer);
