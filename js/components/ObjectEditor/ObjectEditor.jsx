import React, {Component} from 'react';
import dummydata from './data';
import {fromJS, is, List, Map} from 'immutable';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
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
  newMap[key] = val.properties ? convert(val.properties) : val;
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

const NodeContainer = styled.div`
  display: block;
  margin-left: 30px;
`;

const PlainSelect = styled.select`
  height: auto;
  width: auto;
  padding: auto;
  appearance: menulist;
  MozAppearance: menulist;
  WebkitAppearance: menulist;
`;

class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {open: true};
    this.onOpen = _ => this.setState({open: true});
    this.onClose = _ => this.setState({open: false});
  }

  render() {
    const {data, keyPath, onChange, handleAddClick, schema} = this.props;
    const {open} = this.state;
    let renderNodes = [];
    let nodes = [];

    if (List.isList(data)) {
      nodes = data.map((child, i) => {
        return (
          <div style={{display: 'block', marginLeft: 10}} >
            <label style={{color: 'green'}} >{i}: </label>
            <Node schema={schema} keyPath={[...keyPath, i]} data={child} onChange={onChange} handleAddClick={handleAddClick} />
          </div>
          );
      });
      renderNodes = open ? [
        <GreenDiv onClick={this.onClose} >[ </GreenDiv>,
        ...nodes,
        <GreenDiv onClick={this.onClose} > ]</GreenDiv>,
      ] : <GreenDiv onClick={this.onOpen} >[ ... ]</GreenDiv>;
    } else if (Map.isMap(data)) {
      nodes = data.entrySeq().map(([key, val]) => {
        const isProperty = !Map.isMap(val) && !List.isList(val);
        return (
        <ObjectBlock inline={isProperty} >
          <span style={{color: 'blue'}} >{key}: </span>
          <Node schema={schema} keyPath={[...keyPath, key]} data={val} onChange={onChange} handleAddClick={handleAddClick} />
        </ObjectBlock>
        );
      });
      renderNodes = open ? [
        <BlueDiv onClick={this.onClose} >{'{ '}</BlueDiv>,
        ...nodes,
        <BlueDiv onClick={this.onClose} > {' }'}</BlueDiv>,
      ] : <BlueDiv onClick={this.onOpen} >{'{ ... }'}</BlueDiv>;
    } else {
      // console.log(keyPath);
      // console.log(schema);
      const type = keyPath
      .filter(path => typeof path === 'string')
      .reduce((acc, path, i) => {
        return acc[path];
      }, schema);
      // console.log(type);
      if (data === null) {
        return <div className='pointer' style={{marginLeft: 10}} onClick={_ => handleAddClick(keyPath, type)} >null</div>;
      }
      return <TextField id={keyPath.join('-')} style={{marginLeft: 10}} value={data} onChange={e => onChange(keyPath, e.target.value)} />;
    }
    return (
      <NodeContainer>
      {renderNodes}
      </NodeContainer>
      );
  }
}

const KeyTypeObject = ({keyType, parentName, keyPath, onChange}) => {
  if (keyType.type) {
    return (
      <div>
        <span>{parentName}: </span>
        <TextField id={parentName} placeholder={keyType.type} type='text' onChange={e => onChange(keyPath, e.target.value)} />
      </div>
      );
  }
  const renderNodes = Object
  .keys(keyType)
  .map(typeName =>
    <KeyTypeObject
    keyPath={[...keyPath, typeName]}
    parentName={typeName}
    keyType={keyType[typeName]}
    onChange={onChange}
    />);

  return (
    <div>
    {renderNodes}
    </div>
    );
};


class ObjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: fromJS(dummydata),
      immudata: fromJS(dummydata),
      open: false,
      keyPath: null,
      keyType: null
    };
    this.onChange = this.onChange.bind(this);
    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.onTempMapChange = this.onTempMapChange.bind(this);
  }

  onChange(keyPath, newValue) {
    // console.log(keyPath);
    // console.log(newValue);
    const data = this.state.data.setIn(keyPath, newValue);
    // console.log(data.toJS());
    this.setState({data});
  }

  onAddSubmit() {
    const mergeObj = this.whichObject.value === 'array' ? List([this.state.tempMap]) : this.state.tempMap;
    const data = this.state.data.setIn(this.state.keyPath, mergeObj);
    this.setState({data});
  }

  onTempMapChange(keyPath, newValue) {
    const tempMap = this.state.tempMap.setIn(keyPath, newValue);
    this.setState({tempMap});
  }

  handleAddClick(keyPath, keyType) {
    this.setState({keyPath, keyType, tempMap: Map({})}, _ => this.setState({open: true}));
  }

  render() {
    const {data, immudata, open, keyPath, keyType} = this.state;
    return (
      <div>
        EDITOR
      {!is(data, immudata) &&
        <div>
          <RaisedButton label='Revert' secondary onClick={_ => this.setState({data: immudata})} />
          <RaisedButton label='Save' primary />
        </div>}
        <Dialog open={open} onRequestClose={_ => this.setState({open: false, keyPath: null, keyType: null})} >
        {!!keyPath && !!keyType &&
          <div>
            <div>
              <span>
              PATH: {keyPath.join(' --> ')}
              </span>
              <div style={{display: 'inline-block', float: 'right'}} >
                <PlainSelect innerRef={ref => this.whichObject = ref} defaultValue='object'>
                  <option value='object'>Object</option>
                  <option value='array'>Array</option>
                </PlainSelect>
              </div>
            </div>
            <div>
              <KeyTypeObject onChange={this.onTempMapChange} keyPath={[]} parentName={keyPath[keyPath.length - 1]} keyType={keyType} />
            </div>
            <div className='right'>
              <RaisedButton primary label='Submit' onClick={this.onAddSubmit} />
            </div>
          </div>}
        </Dialog>
        <Node schema={mapping} data={data} keyPath={[]} onChange={this.onChange} handleAddClick={this.handleAddClick} />
      </div>
    );
  }
}


export default ObjectEditor;
