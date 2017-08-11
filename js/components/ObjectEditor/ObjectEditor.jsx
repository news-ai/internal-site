import React, {Component} from 'react';
import {connect} from 'react-redux';
import dummydata from './data';
import {fromJS, is, isImmutable, List, Map} from 'immutable';
import TextField from 'material-ui/TextField';
import withRouter from 'react-router/lib/withRouter';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import {grey300, grey500} from 'material-ui/styles/colors';
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

// const convert = mapping => Object
// .entries(mapping)
// .reduce((newMap, [key, val]) => {
//   newMap[key] = val.properties ? convert(val.properties) : val;
//   return newMap;
// }, {});

// const mapping = convert(map.data.md1.mappings.contacts.properties.data.properties);

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
    const {data, immudata, keyPath, onChange, handleAddClick, handleRemoveClick, schema} = this.props;
    const {open} = this.state;
    let renderNodes = [];
    let nodes = [];
    let dataChanged = false;
    if (Map.isMap(data) || List.isList(data)) {
      dataChanged = !is(data, immudata);
    } else {
      dataChanged = data !== immudata;
    }

    // console.log(keyPath);
    // console.log(schema);
    const keyType = keyPath
    .filter(path => typeof path === 'string')
    .reduce((acc, path, i) => acc[path], schema);
    // console.log(keyType);
    // console.log(keyPath);

    if (List.isList(data)) {
      nodes = data.map((child, i) => {
        return (
          <div style={{display: 'block', marginLeft: 10}} >
            <FontIcon
            onClick={_ => handleRemoveClick([...keyPath, i])}
            color={grey300}
            hoverColor={grey500}
            className='fa fa-times'
            style={{fontSize: '0.9em', marginRight: 5}}
            />
            <span className='text' style={{color: 'green'}} >{i}: </span>
            <Node
            schema={schema}
            keyPath={[...keyPath, i]}
            data={child}
            immudata={immudata && immudata.get(i)}
            onChange={onChange}
            handleAddClick={handleAddClick}
            handleRemoveClick={handleRemoveClick}
            />
          </div>
          );
      });
      renderNodes = open ? [
        <GreenDiv>
          <span onClick={this.onClose}>[ </span>
          <FontIcon onClick={_ => handleAddClick(keyPath, keyType)} color={grey300} hoverColor={grey500} className='fa fa-plus' style={{fontSize: '0.9em', marginLeft: 5}} />
        </GreenDiv>,
        ...nodes,
        <GreenDiv onClick={this.onClose} > ]</GreenDiv>,
      ] : <GreenDiv onClick={this.onOpen} >[ ... ]</GreenDiv>;
    } else if (Map.isMap(data)) {
      nodes = data.entrySeq().map(([key, val]) => {
        const isProperty = !Map.isMap(val) && !List.isList(val);
        return (
        <ObjectBlock inline={isProperty} >
          <FontIcon
          onClick={_ => handleRemoveClick([...keyPath, key])}
          color={grey300}
          hoverColor={grey500}
          className='fa fa-times pointer'
          style={{fontSize: '0.9em', marginRight: 5}}
          />
          <span style={{color: 'blue'}} >{key}: </span>
          <Node
          schema={schema}
          keyPath={[...keyPath, key]}
          data={val}
          immudata={immudata && immudata.get(key)}
          onChange={onChange}
          handleAddClick={handleAddClick}
          handleRemoveClick={handleRemoveClick}
          />
        </ObjectBlock>
        );
      });
      const numKeyUnfilled = Object.keys(keyType).length - data.keySeq().filter(key => keyType[key]).count();
      renderNodes = open ? [
        <BlueDiv>
          <span onClick={this.onClose}>{'{ '}</span>
        {numKeyUnfilled > 0 &&
          <FontIcon
          onClick={_ => handleAddClick(keyPath, keyType)}
          color={grey300}
          hoverColor={grey500}
          className='fa fa-plus'
          style={{fontSize: '0.9em', marginLeft: 5}}
          />}
        </BlueDiv>,
        ...nodes,
        <BlueDiv onClick={this.onClose} > {' }'}</BlueDiv>,
      ] : <BlueDiv onClick={this.onOpen} >{'{ ... }'}</BlueDiv>;
    } else {
      if (data === null) {
        return <div className='pointer' style={{marginLeft: 10}} onClick={_ => handleAddClick(keyPath, keyType)} >null</div>;
      }
      return (
        <TextField
        placeholder={keyType.type}
        id={keyPath.join('-')}
        style={{marginLeft: 10, backgroundColor: dataChanged ? 'yellow' : '#ffffff'}}
        value={data}
        onChange={e => onChange(keyPath, e.target.value)}
        />
        );
    }
    return (
      <NodeContainer>
      {renderNodes}
      </NodeContainer>
      );
  }
}

class KeyTypeObject extends Component {
  render() {
    const {originalKeyPath, keyType, parentName, keyPath, onChange, data} = this.props;
    if (typeof keyType.type === 'string') {
      return (
        <div className='vertical-center'>
          <span className='text' style={{marginRight: 15}} >{parentName}</span>
          <TextField
          id={parentName}
          disabled={data.hasIn([...originalKeyPath, parentName])}
          placeholder={keyType.type}
          type='text'
          onChange={e => onChange(keyPath, e.target.value)}
          />
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
      data={data}
      originalKeyPath={originalKeyPath}
      />);

    return (
      <div>
      {renderNodes}
      </div>
      );
  }
}

class ObjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: fromJS(this.props.rawData),
      immudata: fromJS(this.props.rawData),
      open: false,
      keyPath: null,
      keyType: null
    };
    this.onChange = this.onChange.bind(this);
    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.onTempMapChange = this.onTempMapChange.bind(this);
    this.onCloseAddPanel = _ => this.setState({open: false, keyPath: null, keyType: null});
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }

  componentWillMount() {
    if (!this.props.schema) this.props.fetchSchema();
  }

  onChange(keyPath, newValue) {
    // console.log(keyPath);
    // console.log(newValue);
    const data = this.state.data.setIn(keyPath, newValue);
    // console.log(data.toJS());
    this.setState({data});
  }

  onAddSubmit() {
    const existingData = this.state.data.getIn(this.state.keyPath);
    let data;
    if (existingData === null) {
      // add complete new data to previously null field
      const mergeObj = this.whichObject.value === 'array' ? List([this.state.tempMap]) : this.state.tempMap;
      data = this.state.data.setIn(this.state.keyPath, mergeObj);
    } else if (List.isList(existingData)) {
      // append existing List with new data
      const newList = existingData.push(this.state.tempMap);
      data = this.state.data.setIn(this.state.keyPath, newList);
    } else if (Map.isMap(existingData)) {
      data = this.state.data.setIn(this.state.keyPath, existingData.merge(this.state.tempMap));
    }
    this.setState({data}, this.onCloseAddPanel);
  }

  onTempMapChange(keyPath, newValue, isArray, keyType) {
    const tempMap = typeof this.state.keyType.type === 'string' ? newValue : this.state.tempMap.setIn(keyPath, newValue);
    this.setState({tempMap});
  }

  handleAddClick(keyPath, keyType) {
    const tempMap = typeof keyType.type === 'string' ? '' : Map({});
    this.setState({keyPath, keyType, tempMap}, _ => this.setState({open: true}));
  }

  handleRemoveClick(keyPath) {
    const data = this.state.data.deleteIn(keyPath);
    this.setState({data});
  }

  render() {
    const {data, immudata, open, keyPath, keyType} = this.state;
    const {schema, rawData} = this.props;
    // const schema = mapping;

    return data && schema ? (
      <div>
      {!is(data, immudata) &&
        <div>
          <RaisedButton label='Revert' secondary onClick={_ => this.setState({data: immudata})} />
          <RaisedButton label='Save' primary />
        </div>}
        <Dialog autoScrollBodyContent open={open} onRequestClose={this.onCloseAddPanel} >
        {!!keyPath && !!keyType &&
          <div>
            <div style={{margin: '15px 0'}} >
              <span>PATH: {keyPath.join(' --> ')}</span>
              <div style={{display: 'inline-block', float: 'right'}} >
                <PlainSelect disabled={!!data.getIn(keyPath)} innerRef={ref => this.whichObject = ref} defaultValue='object'>
                  <option value='object'>Object</option>
                  <option value='array'>Array</option>
                  <option value='string'>String</option>
                </PlainSelect>
              </div>
            </div>
            <div>
              <KeyTypeObject
              data={data}
              onChange={this.onTempMapChange}
              originalKeyPath={keyPath}
              keyPath={[]}
              parentName={keyPath[keyPath.length - 1]}
              keyType={keyType}
              />
            </div>
            <div className='right'>
              <RaisedButton primary label='Submit' onClick={this.onAddSubmit} />
            </div>
          </div>}
        </Dialog>
        <Node
        schema={schema}
        data={data}
        immudata={immudata}
        keyPath={[]}
        onChange={this.onChange}
        handleAddClick={this.handleAddClick}
        handleRemoveClick={this.handleRemoveClick}
        />
      </div>
    ) : <div>LOADING...</div>;
  }
}

export default connect(
  ({schemaReducer, contactReducer}, {router}) => {
    const {schemaType, id} = router.location.query;
    let rawData, schema;
    if (schemaType === 'contacts') {
      rawData = contactReducer[id];
      schema = schemaReducer[schemaType];
    }
    return {
      rawData,
      schema,
    };
  },
  (dispatch, {router}) => {
    const {schemaType, id} = router.location.query;
    return {
      fetchSchema: _ => dispatch({type: 'FETCH_SCHEMA', schemaType})
    };
  }
  )(withRouter(ObjectEditor));
