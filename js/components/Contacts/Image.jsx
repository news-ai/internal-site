import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import FontIcon from 'material-ui/FontIcon';

const ImagePlaceholder = ({style}) => (
  <ReactCSSTransitionGroup
    transitionAppear
    transitionName='loadingItem'
    transitionAppearTimeout={500}
    transitionEnterTimeout={500}
    transitionLeaveTimeout={300}>
    <div style={style} >
      <FontIcon className='fa fa-spin fa-spinner'/>
    </div>
  </ReactCSSTransitionGroup>
    );

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: true};
    this.onLoad = _ => this.setState({isLoading: false});
  }

  render() {
    return (
      <div>
        {this.state.isLoading && <ImagePlaceholder style={this.props.style} />}
        <img style={this.props.style} src={this.props.src} onLoad={this.onLoad} />
      </div>
      );
  }
}

export default Image;
