import React, {Component} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import Link from 'react-router/lib/Link';

import {actions as loginActions} from 'components/Login';
import {loginConstant} from 'components/Login/constants';

import Login from './Login';

const TopBar = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border-bottom: 1px solid red;
`;

const Button = styled.li`
  float: left;
  height: 100%;
`;

const HomeButton = Button.extend`
  display: block;
  text-align: center;
  padding: 8px 16px;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didScroll: false,
    };
  }

  componentWillMount() {
    this.props.getAuth();
  }

  render() {
    const props = this.props;
    const state = this.state;
    let renderNode = <Login />;
    if (props.isLogin) {
      renderNode = <div>You don't have access to NewsAI Media Database solution. Get access here.</div>;
      if (props.person.mediadatabaseaccess) {
        renderNode = (
          <div>
            <TopBar>
              <HomeButton>
                <Link to='/'>Home</Link>
              </HomeButton>
            </TopBar>
            {this.props.children}
          </div>
          );
      }
    }

    return (
      <MainContainer>
      {renderNode}
      </MainContainer>
      );
  }
}

const mapStateToProps = (state, props) => {
  return {
    isLogin: state.personReducer.person ? true : false,
    loginDidInvalidate: state.personReducer.didInvalidate,
    person: state.personReducer.person,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAuth: _ => dispatch({type: loginConstant.REQUEST}),
    logoutClick: _ => dispatch(loginActions.logout()),
  };
};

export default connect( mapStateToProps, mapDispatchToProps)(App);
