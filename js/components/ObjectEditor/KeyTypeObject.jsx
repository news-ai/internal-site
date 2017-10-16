import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';


class KeyTypeObject extends Component {
  render() {
    const {originalKeyPath, keyType, parentName, keyPath, onChange, data, plugin} = this.props;
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
    .map(typeName => {
      const pluginKey = [...keyPath, typeName].join('.');
      return (<div style={{marginLeft: 15}} >
        <div>
        {typeof keyType[typeName].type !== 'string' &&
          <span>{typeName}: </span>}
        {typeof plugin[pluginKey] === 'string' &&
          <span style={{color: 'red'}} >({plugin[pluginKey]})</span>}
        </div>
        <KeyTypeObject
        keyPath={[...keyPath, typeName]}
        parentName={typeName}
        keyType={keyType[typeName]}
        onChange={onChange}
        data={data}
        originalKeyPath={originalKeyPath}
        plugin={plugin}
        />
      </div>
      );
    });

    return (
      <div>
      {renderNodes}
      </div>
      );
  }
}

export default KeyTypeObject;
