import React, {Component} from 'react';
import dummydata from './data';
import {fromJS, is, List, Map} from 'immutable';

// FETCH endpoint
// PATCH endpoint
// json to edit
// path to store
//
// array: ADD, DELETE, EDIT
// object: EDIT, DELETE,

const Node = ({data, keyPath, onChange}) => {
  let renderNodes = [];
  let nodes = [];

  if (List.isList(data)) {
    nodes = data.map((child, i) => (
      <div style={{display: 'block'}} >
      {i}: <Node keyPath={[...keyPath, i]} data={child} onChange={onChange} />
      </div>
      ));
    renderNodes = [
      <div>[</div>,
      ...nodes,
      <div>]</div>
    ];
  } else if (Map.isMap(data)) {
    nodes = data.entrySeq().map(([key, val]) => (
      <div style={{display: 'block'}} >
      {key}: <Node keyPath={[...keyPath, key]} data={val} onChange={onChange} />
      </div>
      ));
    renderNodes = [
      <div>{'{'}</div>,
      ...nodes,
      <div>{'}'}</div>
    ];
  } else {
    if (data === null) {
      return <span>null</span>;
    }
    return <input type='text' value={data} onChange={e => onChange(keyPath, e.target.value)} />;
  }
  return (
    <div style={{display: 'block', margin: 30}}>
    {renderNodes}
    </div>
    );
};

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
    console.log(keyPath);
    console.log(newValue);
    const data = this.state.data.setIn(keyPath, newValue);
    console.log(data.toJS());
    this.setState({data});
  }

  render() {
    const {data, immudata} = this.state;
    return (
      <div>
        EDITOR
      {!is(data, immudata) &&
        <span style={{color: 'red'}} >CHANGED</span>}
        <Node data={data} keyPath={[]} onChange={this.onChange} />
      </div>
    );
  }
}


export default ObjectEditor;
