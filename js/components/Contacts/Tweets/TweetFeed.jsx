import React, { Component } from 'react';
import {connect} from 'react-redux';
import {List, CellMeasurer, CellMeasurerCache, AutoSizer} from 'react-virtualized';
import Tweet from './Tweet';
import 'react-virtualized/styles.css';
import {grey700} from 'material-ui/styles/colors';

class TweetFeed extends Component {
  constructor(props) {
    super(props);
    this._cache = new CellMeasurerCache({
      minHeight: 100,
      fixedWidth: true
    });
    this.rowRenderer = this.rowRenderer.bind(this);
  }

  componentWillMount() {
    // this.props.fetchTweets();
  }

  rowRenderer({key, index, parent, isScrolling, isVisible, style}) {
    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div key={key} style={Object.assign({}, style, {padding: 5})} >
          <Tweet {...this.props.tweets[index]} />
        </div>
      </CellMeasurer>
    );
  }

  render() {
    const {tweets, fetchTweets, height} = this.props;
    return tweets.length > 0 ? (
      <AutoSizer disableHeight>
      {({width}) => (
        <List
        ref={ref => this._TweetFeed = ref}
        deferredMeasurementCache={this._cache}
        width={width}
        height={height || 500}
        rowCount={tweets.length}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this.rowRenderer}
        onScroll={args => ((args.scrollHeight - args.scrollTop) / args.clientHeight) < 2 ? fetchTweets() : null}
        />
        )}
      </AutoSizer>
    ) : <div className='horizontal-center vertical-center' style={{height: 100, color: grey700}} >No tweets found.</div>;
  }
}

const mapStateToProps = (state, props) => {
  const contact = state.tweetReducer[props.email];
  return {
    tweets: contact && contact.received ? state.tweetReducer[props.email].received.map(id => state.tweetReducer[id]) : [],
    isReceiving: contact ? contact.isReceiving : false
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchTweets: _ => dispatch({type: 'FETCH_CONTACT_TWEETS', email: props.email}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetFeed);
