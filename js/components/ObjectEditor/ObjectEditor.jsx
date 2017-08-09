import React, {Component} from 'react';
import dummydata from './data';
import {fromJS, is, List, Map} from 'immutable';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import {grey300} from 'material-ui/styles/colors';
import cn from 'classnames';
import styled from 'styled-components';
import map from './schema';
import get from 'lodash/get';

// FETCH endpoint
// PATCH endpoint
// json to edit
// path to store
//
// array: ADD, DELETE, EDIT
// object: EDIT, DELETE,

const convert = mapping => Object
.entries(mapping)
.reduce((newMap, [key, val]) => {
  if (val.properties) {
    newMap[key] = convert(val.properties);
  } else {
    newMap[key] = val;
  }
  return newMap;
}, {});

const mapping = convert(map.data.md1.mappings.contacts.properties);

const ObjectBlock = styled.div`
  display: ${props => props.inline ? 'flex' : 'block'};
  height: ${props => props.inline && '40px'};
  align-items: center;
  margin-left: 10px;
  white-space: nowrap;
`;

const GreenDiv = styled.div`
  cursor: pointer;
  color: green;
`;

const BlueDiv = styled.div`
  cursor: pointer;
  color: blue;
`;

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {open: true};
  }

  render() {
    const {data, keyPath, onChange, schema} = this.props;
    const {open} = this.state;
    let renderNodes = [];
    let nodes = [];

    if (List.isList(data)) {
      nodes = data.map((child, i) => {
        return (
          <div style={{display: 'block', marginLeft: 10}} >
            <label style={{color: 'green'}} >{i}: </label>
            <Node schema={schema} keyPath={[...keyPath, i]} data={child} onChange={onChange} />
          </div>
          );
      });
      renderNodes = open ? [
        <GreenDiv onClick={_ => this.setState({open: false})} >[ </GreenDiv>,
        ...nodes,
        <GreenDiv onClick={_ => this.setState({open: false})} > ]</GreenDiv>,
      ] : <GreenDiv onClick={_ => this.setState({open: true})} >[ ... ]</GreenDiv>;
    } else if (Map.isMap(data)) {
      nodes = data.entrySeq().map(([key, val]) => {
        const isProperty = !Map.isMap(val) && !List.isList(val);
        return (
        <ObjectBlock inline={isProperty} >
          <span style={{color: 'blue'}} >{key}: </span>
          <Node schema={schema} keyPath={[...keyPath, key]} data={val} onChange={onChange} />
        </ObjectBlock>
        );
      });
      renderNodes = open ? [
        <BlueDiv onClick={_ => this.setState({open: false})} >{'{ '}</BlueDiv>,
        ...nodes,
        <BlueDiv onClick={_ => this.setState({open: false})} > {' }'}</BlueDiv>,
      ] : <BlueDiv onClick={_ => this.setState({open: true})} >{'{'} ... {'}'}</BlueDiv>;
    } else {
      console.log(keyPath);
      console.log(schema);
      const type = keyPath
      .filter(path => typeof path === 'string')
      .reduce((acc, path, i) => {
        return acc[path];
      }, schema);
      console.log(type);
      if (data === null) {
        return <span style={{marginLeft: 10}}>null</span>;
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
        <Node schema={mapping} data={data} keyPath={[]} onChange={this.onChange} />
      </div>
    );
  }
}


export default ObjectEditor;
