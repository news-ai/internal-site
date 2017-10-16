import React, { Component } from 'react';
import {Map} from 'immutable';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {grey500, grey700} from 'material-ui/styles/colors';
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

const organizationInfoShape = {
  organizations: {
    objectType: 'array',
    objectShape: {
      'Organization Name': {
        objectType: 'string',
        keyPath: ['name']
      },
      'Start Date': {
        objectType: 'string',
        keyPath: ['startDate']
      },
      'Title': {
        objectType: 'string',
        keyPath: ['title']
      },
    },
    keyPath: ['contactInfo', 'organizations']
  }
};

const Node = ({item, onChange, keyPath, base}) => {
  return Object.entries(item)
    .map(([name, shape]) => {
      console.log(base.getIn([...keyPath, shape.keyPath]));
      return (
        <TextField
        name={name}
        value={base.getIn([...keyPath, shape.keyPath])}
        floatingLabelText={name}
        hintText={shape.objectType}
        onChange={e => onChange(e.target.value, [...keyPath, shape.keyPath])}
        />
      );
    });
};

const Section = ({title, onChange, onDelete, base, schema}) => {
  return (
     <div style={{marginLeft: 20}} >
      <h3>{title}</h3>
      {Object.entries(schema).map(([name, shape]) => {
        if (shape.objectType === 'array') {
          const list = base.getIn(shape.keyPath);
          if (list) {
            return (
              <div>
                <div>{name}</div>
                {[
                  ...list.map((listVal, i) =>
                    <div>
                      <Node base={base} keyPath={[...shape.keyPath, i]} item={shape.objectShape} onChange={onChange} />
                      <FontIcon className='fa fa-times pointer' color={grey500} hoverColor={grey700} onClick={_ => onDelete([...shape.keyPath, i])} />
                    </div>
                  ),
                  <Node base={base} keyPath={[...shape.keyPath, list.size]} item={shape.objectShape} onChange={onChange} />
                ]}
              </div>);
          }
          return (
            <div>
              <div>{name}</div>
              <Node base={base} keyPath={[...shape.keyPath, 0]} item={shape.objectShape} onChange={onChange} onDelete={onDelete} />
            </div>);
        }
        return (
          <div>
            <TextField
            name={name}
            floatingLabelText={name}
            value={base.getIn(shape.keyPath)}
            hintText={shape.objectType}
            onChange={e => onChange(e.target.value, shape.keyPath)}
            />
          </div>
          );
      })}
    </div>
    );
};

class AddContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base: Map({})
    };
    this.onChange = (value, keyPath) => this.setState({base: this.state.base.setIn(keyPath, value)});
    this.onDelete = (keyPath) => this.setState({base: this.state.base.deleteIn(keyPath)});
  }

  render() {
    console.log(this.state.base.toJS());
    return (
      <div>
        <Section title='Contact Info' schema={contactInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <Section title='Organization Info' schema={organizationInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
      </div>
    );
  }
}

export default AddContact;
