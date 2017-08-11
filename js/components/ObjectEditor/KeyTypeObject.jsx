import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';


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

export default KeyTypeObject;
