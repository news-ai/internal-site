import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fromJS, is, List, Map} from 'immutable';
import withRouter from 'react-router/lib/withRouter';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import {grey300, grey500} from 'material-ui/styles/colors';
import styled from 'styled-components';

import Node from './Node';
import KeyTypeObject from './KeyTypeObject';

// FETCH endpoint
// PATCH endpoint
// json to edit
// path to store
//
// array: ADD, DELETE, EDIT
// object: EDIT, DELETE,

const PlainSelect = styled.select`
  height: auto;
  width: auto;
  padding: auto;
  appearance: menulist;
  MozAppearance: menulist;
  WebkitAppearance: menulist;
`;

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
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    if (!this.props.schema) this.props.fetchSchema();
  }

  onSubmit() {

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
          <RaisedButton label='Save' primary onClick={this.onSubmit} />
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
