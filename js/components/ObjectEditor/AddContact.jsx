import React, { Component } from 'react';
import {Map} from 'immutable';
import TextField from 'material-ui/TextField';
// import contacts from './50contacts';

const contactInfoShape = {
  familyName: {
    objectType: 'string',
    keyPath: ['contactInfo', 'familyName']
  },
  fullName: {
    objectType: 'string',
    keyPath: ['contactInfo', 'fullName']
  },
  givenName: {
    objectType: 'string',
    keyPath: ['contactInfo', 'givenName']
  },
  websites: {
    objectType: 'array',
    objectShape: {
      url: {
        objectType: 'string',
        keyPath: ['url']
      }
    },
    keyPath: ['contactInfo', 'websites']
  }
};

const Node = ({item, onChange, keyPath, base}) => {
  return Object.entries(item)
    .map(([name, shape]) => {
      return (
        <div>
          <TextField
          name={name}
          value={base.getIn([...keyPath, shape.keyPath])}
          floatingLabelText={name}
          hintText={shape.objectType}
          onChange={e => onChange(e.target.value, [...keyPath, shape.keyPath])}
          />
        </div>
      );
    });
};

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: Map({})
    };
    this.onChange = (value, keyPath) => this.setState({base: this.state.base.setIn(keyPath, value)});
  }

  render() {
    console.log(this.state.base.toJS());
    return (
      <div>
        <div style={{marginLeft: 20}} >
          <p>Contact Info</p>
          {Object.entries(contactInfoShape).map(([name, shape]) => {
            if (shape.objectType === 'array') {
              const list = this.state.base.getIn(shape.keyPath);
              if (list) {
                return [
                  ...list.map((listVal, i) =>
                  <Node base={this.state.base} keyPath={[...shape.keyPath, i]} item={shape.objectShape} onChange={this.onChange} />),
                  <Node base={this.state.base} keyPath={[...shape.keyPath, list.size]} item={shape.objectShape} onChange={this.onChange} />
                ];
              }
              return <Node base={this.state.base} keyPath={[...shape.keyPath, 0]} item={shape.objectShape} onChange={this.onChange} />;
            }
            return (
              <div>
                <TextField
                name={name}
                floatingLabelText={name}
                value={this.state.base.getIn(shape.keyPath)}
                hintText={shape.objectType}
                onChange={e => this.onChange(e.target.value, shape.keyPath)}
                />
              </div>
              );
          })}
        </div>
      </div>
    );
  }
}

export default AddContact;
