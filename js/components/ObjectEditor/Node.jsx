import React, {Component} from 'react';
import {is, List, Map} from 'immutable';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import {grey300, grey500, blue500} from 'material-ui/styles/colors';
import styled from 'styled-components';

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

const NullDiv = styled.div`
  margin-left: 10px;
  cursor: pointer;
`;

const GreenDiv = styled.div`
  cursor: pointer;
  color: green;
`;

const BlueDiv = styled.div`
  cursor: pointer;
  color: blue;
`;

const BlueSpan = styled.span`
  color: ${blue500};
`;

const NodeContainer = styled.div`
  display: block;
  margin-left: 30px;
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
          <ObjectBlock key={`block-${keyPath.join('-')}-${i}`}>
            <FontIcon
            key={`icon-${keyPath.join('-')}-${i}`}
            onClick={_ => handleRemoveClick([...keyPath, i])}
            color={grey300}
            hoverColor={grey500}
            className='fa fa-times'
            style={{fontSize: '0.9em', marginRight: 5}}
            />
            <span className='text' style={{color: 'green'}} >{i}: </span>
            <Node
            key={`node-${keyPath.join('-')}-${i}`}
            schema={schema}
            keyPath={[...keyPath, i]}
            data={child}
            immudata={immudata && immudata.get(i)}
            onChange={onChange}
            handleAddClick={handleAddClick}
            handleRemoveClick={handleRemoveClick}
            />
          </ObjectBlock>
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
        <ObjectBlock inline={isProperty} key={`block-${keyPath.join('-')}-${key}`}>
          <FontIcon
          key={`icon-${keyPath.join('-')}-${key}`}
          onClick={_ => handleRemoveClick([...keyPath, key])}
          color={grey300}
          hoverColor={grey500}
          className='fa fa-times pointer'
          style={{fontSize: '0.9em', marginRight: 5}}
          />
          <BlueSpan style={{color: 'blue'}} >{key}: </BlueSpan>
          <Node
          key={`node-${keyPath.join('-')}-${key}`}
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
        return <NullDiv onClick={_ => handleAddClick(keyPath, keyType)} >null</NullDiv>;
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

export default Node;
