import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fromJS, is, List, Map} from 'immutable';
import withRouter from 'react-router/lib/withRouter';
import Link from 'react-router/lib/Link';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import styled from 'styled-components';
import dummydata from './data';

import PlainSelect from 'components/PlainSelect';
import Node from './Node';
import KeyTypeObject from './KeyTypeObject';
import plugin from './plugin';

// FETCH endpoint
// PATCH endpoint
// json to edit
// path to store
//
// array: ADD, DELETE, EDIT
// object: EDIT, DELETE,

class ObjectEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: fromJS(this.props.rawData),
      immudata: fromJS(this.props.rawData),
      open: false,
      keyPath: null,
      keyType: null,
      previousEdits: [],
    };
    this.onChange = this.onChange.bind(this);
    this.onAddSubmit = this.onAddSubmit.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.onTempMapChange = this.onTempMapChange.bind(this);
    this.onCloseAddPanel = _ => this.setState({open: false, keyPath: null, keyType: null});
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const data = fromJS(nextProps.rawData);
    if (!is(data, this.state.immudata)) {
      // reset data when receive new ones
      this.setState({data, immudata: data});
    }
  }

  onSubmit() {
    // console.log(this.state.data.toJS());
    this.props.updateData(this.state.data, this.state.immudata);
  }

  onChange(keyPath, newValue) {
    // console.log(keyPath);
    // console.log(newValue);
    const data = this.state.data.setIn(keyPath, newValue);
    // console.log(data.toJS());
    this.setState({data});
  }

  onAddSubmit() {
    const {data, keyPath, tempMap} = this.state;
    const existingData = data.getIn(this.state.keyPath);
    let newData;
    if (existingData === null) {
      // add complete new data to previously null field
      const mergeObj = this.whichObject.value === 'array' ? List([this.state.tempMap]) : this.state.tempMap;
      newData = data.setIn(keyPath, mergeObj);
    } else if (List.isList(existingData)) {
      // append existing List with new data
      const newList = existingData.push(tempMap);
      newData = data.setIn(keyPath, newList);
    } else if (Map.isMap(existingData)) {
      newData = data.setIn(keyPath, existingData.merge(tempMap));
    }
    this.setState({data: newData}, this.onCloseAddPanel);
  }

  onTempMapChange(keyPath, newValue) {
    console.log(keyPath);
    console.log(keyPath.slice(0, -1));
    const pluginKey = keyPath.slice(0, -1).join('.');
    console.log(plugin[pluginKey]);
    console.log(this.state.keyType.type);
    const pluginType = plugin[pluginKey];
    console.log(pluginKey);
    console.log(pluginType);
    console.log(newValue);
    let tempMap;
    if (typeof this.state.keyType.type === 'string') {
      tempMap = newValue;
    } else {
      tempMap = this.state.tempMap.setIn(keyPath, newValue);
    }
    // const tempMap = typeof this.state.keyType.type === 'string' ? newValue : this.state.tempMap.setIn(keyPath, newValue);
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
    const {schema} = this.props;
    // const schema = mapping;

    return (
      <div>
      {!is(data, immudata) &&
        <div className='right'>
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
              plugin={plugin}
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
    );
  }
}

const Label = styled.div`
  display: block;
  margin: 10px;
`;

const contactLink = {pathname: '/edit', query: {schemaType: 'contacts'}};

// THIS IS FETCHING LAYER
class ObjectEditorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previousEdits: [],
      useDummy: false
    };
    this.updateData = this.updateData.bind(this);
    this.postData = this.postData.bind(this);
    this.revertChange = this.revertChange.bind(this);
  }

  componentWillMount() {
    if (!this.props.schema) this.props.fetchSchema();
    if (!this.props.rawData) this.props.fetchObject();
  }

  updateData(data, prevData) {
    this.props.sendObject(data.toJS());
    this.setState({
      previousEdits: [...this.state.previousEdits, prevData]
    });
  }

  postData(data, prevData) {
    const json = data.toJS();
    this.props.sendObject(json);
    // this.setState({
    //   previousEdits: [...this.state.previousEdits, prevData]
    // });
    this.props.router.push({pathname: '/edit', query: {
      schemaType: this.props.schemaType,
      id: json.email
    }});
  }

  revertChange() {
    const {previousEdits} = this.state;
    const data = previousEdits[previousEdits.length - 1];
    // console.log(data.toJS());
    this.props.patchObject(data.toJS());
    this.setState({
      previousEdits: previousEdits.slice(0, -1)
    });
  }

  render() {
    const {schema, rawData, schemaType, id} = this.props;
    const {previousEdits, useDummy} = this.state;
    console.log(schema);
    console.log(schemaType);

    if (schemaType && id) {
      return schema && rawData ?
      <div>
      {previousEdits.length > 0 &&
        <RaisedButton label='Revert Submitted' secondary onClick={this.revertChange} />}
        <div>
          <Label>Type: {schemaType}</Label>
          <Label>ID: {id}</Label>
        </div>
        <ObjectEditor updateData={this.updateData} {...this.props} />
      </div> : <div>LOADING</div>;
    } else {
      const selector = (
        <div>
          <span>Select Type to Create: </span>
          <Link to={contactLink} >Contact</Link>
        </div>
        );
      switch (schemaType) {
        case 'contacts':
          return schema ? (
            <div>
              <Label>Create New Contact</Label>
              <RaisedButton label={useDummy ? 'Clear Placeholder' : 'Use Placehodler Data'} onClick={_ => this.setState({useDummy: !useDummy})} />
              <ObjectEditor updateData={this.postData} schema={schema} rawData={useDummy ? dummydata : {}} />
            </div>
            ) : <div>LOADING... </div>;
        default:
          return selector;
      }
    }
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
      schemaType,
      id
    };
  },
  (dispatch, {router}) => {
    const {schemaType, id} = router.location.query;
    return {
      fetchSchema: _ => dispatch({type: 'FETCH_SCHEMA', schemaType}),
      fetchObject: _ => {
        if (!id) return undefined;
        switch (schemaType) {
          case 'contacts':
            return dispatch({type: 'FETCH_CONTACT', email: id, useCache: false});
          default:
            return undefined;
        }
      },
      sendObject: data => {
        switch (schemaType) {
          case 'contacts':
            if (!id) return dispatch({type: 'POST_CONTACT', data});
            return dispatch({type: 'PATCH_CONTACT', email: id, data});
          default:
            return undefined;
        }
      },
    };
  }
  )(withRouter(ObjectEditorContainer));
