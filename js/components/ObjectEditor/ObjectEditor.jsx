import React, {Component} from 'react';
import dummydata from './data';

// FETCH endpoint
// PATCH endpoint
// json to edit
// path to store
//
// array: ADD, DELETE, EDIT
// object: EDIT, DELETE,

const Node = ({data}) => {
  let renderNodes = [];
  let nodes = [];

  if (Array.isArray(data)) {
    console.log('arr');
    nodes = data.map((child, i) => (
      <div style={{display: 'block'}} >
      {i}: <Node data={data[i]} />
      </div>
      ));
    renderNodes = [
      <div style={{display: 'block'}}>[</div>,
      ...nodes,
      <div style={{display: 'block'}}>]</div>
    ];
  } else if (typeof data === 'object') {
    if (data === null) {
      return <span>null</span>;
    } else {
      console.log('obj');
      nodes = Object.keys(data)
      .map((key, i) => (
        <div style={{display: 'block'}} >
        {key}: <Node data={data[key]} />
        </div>
        ));
      renderNodes = [
        <div style={{display: 'block'}}>{'{'}</div>,
        ...nodes,
        <div style={{display: 'block'}}>{'}'}</div>
      ];
    }
  } else {
    console.log('str');
    return <span>{data}</span>;
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
  }
  render() {
    const {data} = dummydata;
    console.log(data);
    return (
      <div>
        EDITOR
        <Node data={data} />
      </div>
    );
  }
}


export default ObjectEditor;
