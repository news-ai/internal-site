import React, {Component} from 'react';
import dummydata from './data';
import {fromJS, is, List, Map} from 'immutable';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {grey300} from 'material-ui/styles/colors';
import cn from 'classnames';
import styled from 'styled-components';

// FETCH endpoint
// PATCH endpoint
// json to edit
// path to store
//
// array: ADD, DELETE, EDIT
// object: EDIT, DELETE,

const ObjectBlock = styled.div`
  display: ${props => props.inline ? 'flex' : 'block'};
  height: ${props => props.inline && '40px'};
  align-items: center;
  margin-left: 10px;
  white-space: nowrap;
`;

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  render() {
    const {data, keyPath, onChange} = this.props;
    const {open} = this.state;
    let renderNodes = [];
    let nodes = [];

    if (List.isList(data)) {
      nodes = data.map((child, i) => {
        return (
          <div style={{display: 'block', marginLeft: 10}} >
            <label style={{color: 'green'}} >{i}: </label>
            <Node keyPath={[...keyPath, i]} data={child} onChange={onChange} />
          </div>
          );
      });
      renderNodes = open ? [
        <div className='pointer' style={{color: 'green'}} onClick={_ => this.setState({open: false})} >[ </div>,
        ...nodes,
        <div className='pointer' style={{color: 'green'}} onClick={_ => this.setState({open: false})} > ]</div>,
      ] : <span className='pointer' style={{color: 'green'}} onClick={_ => this.setState({open: true})} >[ ... ]</span>;
    } else if (Map.isMap(data)) {
      nodes = data.entrySeq().map(([key, val]) => {
        const isProperty = !Map.isMap(val) && !List.isList(val);
        return (
        <ObjectBlock inline={isProperty} >
          <span style={{color: 'blue'}} >{key}: </span>
          <Node keyPath={[...keyPath, key]} data={val} onChange={onChange} />
        </ObjectBlock>
        );
      });
      renderNodes = open ? [
        <div className='pointer' style={{color: 'green'}} onClick={_ => this.setState({open: false})} >{'{ '}</div>,
        ...nodes,
        <div className='pointer' style={{color: 'green'}} onClick={_ => this.setState({open: false})} > {' }'}</div>,
      ] : <span className='pointer' style={{color: 'green'}} onClick={_ => this.setState({open: true})} >{'{'} ... {'}'}</span>;
    } else {
      if (data === null) {
        return <span style={{marginLeft: 10}} >null</span>;
      }
      return <TextField style={{marginLeft: 10}} value={data} onChange={e => onChange(keyPath, e.target.value)} />;
    }
    return (
      <div style={{display: 'block', marginLeft: 30}}>
      {renderNodes}
      </div>
      );
  }
}

class ObjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: fromJS(dummydata),
      immudata: fromJS(dummydata)
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(keyPath, newValue) {
    // console.log(keyPath);
    // console.log(newValue);
    const data = this.state.data.setIn(keyPath, newValue);
    // console.log(data.toJS());
    this.setState({data});
  }

  render() {
    const {data, immudata} = this.state;
    return (
      <div>
        EDITOR
      {!is(data, immudata) &&
        <div>
          <RaisedButton label='Revert' secondary onClick={_ => this.setState({data: immudata})} />
          <RaisedButton label='Save' primary />
        </div>
      }
        <Node data={data} keyPath={[]} onChange={this.onChange} />
      </div>
    );
  }
}


export default ObjectEditor;
