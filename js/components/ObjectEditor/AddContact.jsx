import React, { Component } from 'react';
import {Map, List, fromJS} from 'immutable';
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
    keyPath: ['organizations']
  }
};

const socialProfileInfoShape = {
  socialProfiles: {
    objectType: 'array',
    objectShape: {
      'Social Profile Bio': {
        objectType: 'string',
        keyPath: ['bio']
      },
      'ID': {
        objectType: 'string',
        keyPath: ['id']
      },
      'Social Network ID': {
        objectType: 'string',
        placeholder: 'twitter',
        keyPath: ['type']
      },
      'Social Network Name': {
        objectType: 'string',
        placeholder: 'Twitter',
        keyPath: ['typeName']
      },
      'URL': {
        objectType: 'string',
        placeholder: 'https://twitter.com/imkialikethecar',
        keyPath: ['url']
      },
      'Username': {
        objectType: 'string',
        keyPath: ['username']
      },
    },
    keyPath: ['socialProfiles']
  }
};

const writingInfoShape = {
  isFreelancer: {
    objectType: 'bool',
    keyPath: ['writingInformation', 'familyName']
  },
  beats: {
    objectType: 'array',
    objectShape: 'string',
    keyPath: ['writingInformation', 'beats']
  },
  occasionalBeats: {
    objectType: 'array',
    objectShape: 'string',
    keyPath: ['writingInformation', 'occasionalBeats']
  },
  rss: {
    objectType: 'array',
    objectShape: 'string',
    keyPath: ['writingInformation', 'rss']
  },
};

const Node = ({item, onChange, keyPath, base}) => {
  return Object.entries(item)
  .map(([name, shape]) => {
    console.log(base.getIn([...keyPath, ...shape.keyPath]));
    return (
      <TextField
      name={name}
      value={base.getIn([...keyPath, ...shape.keyPath])}
      floatingLabelText={name}
      hintText={shape.objectType}
      onChange={e => onChange(e.target.value, [...keyPath, ...shape.keyPath])}
      />
    );
  });
};

const Section = ({title, onChange, onDelete, base, schema}) => {
  return (
     <div style={{marginLeft: 20}} >
      <h4>{title}</h4>
      {Object.entries(schema).map(([name, shape]) => {
        if (shape.objectType === 'array') {
          const list = base.getIn(shape.keyPath);
          if (list) {
            return (
              <div>
                <div>{name}</div>
                {typeof shape.objectShape === 'string' ?
                  [
                    ...list.map((listVal, i) =>
                      <TextField
                      name={`${name}-${i}`}
                      value={base.getIn([...shape.keyPath, i])}
                      floatingLabelText={name}
                      hintText={shape.objectShape}
                      onChange={e => onChange(e.target.value, [...shape.keyPath, i])}
                      />),
                      <TextField
                      name={`${name}-${list.size}`}
                      value={base.getIn([...shape.keyPath, list.size])}
                      floatingLabelText={name}
                      hintText={shape.objectShape}
                      onChange={e => onChange(e.target.value, [...shape.keyPath, list.size])}
                      />
                  ] :
                  [
                    ...list.map((listVal, i) =>
                      <div>
                        <Node base={base} keyPath={[...shape.keyPath, i]} item={shape.objectShape} onChange={onChange} />
                        <FontIcon className='fa fa-times pointer' color={grey500} hoverColor={grey700} onClick={_ => onDelete([...shape.keyPath, i])} />
                      </div>
                    ),
                    <Node base={base} keyPath={[...shape.keyPath, list.size]} item={shape.objectShape} onChange={onChange} />
                  ]
                }
              </div>);
          }
          return typeof shape.objectShape === 'string' ? (
            <div>
              <div>{name}</div>
              <TextField
              name={`${name}-0`}
              value={base.getIn([...shape.keyPath, 0])}
              floatingLabelText={name}
              hintText={shape.objectShape}
              onChange={e => onChange(e.target.value, [...shape.keyPath, 0])}
              />
            </div>
            ) : (
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
      base: fromJS({
        contactInfo: {
          websites: []
        },
        organizations: [],
        socialProfiles: [],
        writingInformation: {
          beats: [],
          occasionalBeats: [],
          rss: []
        }
      })
    };
    this.onChange = (value, keyPath) => {
      console.log(keyPath);
      this.setState({base: this.state.base.setIn(keyPath, value)});
    };
    this.onDelete = (keyPath) => this.setState({base: this.state.base.deleteIn(keyPath)});
  }

  render() {
    console.log(JSON.stringify(this.state.base.toJS(), 2));
    return (
      <div>
        <Section title='Contact Info' schema={contactInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <Section title='Organization Info' schema={organizationInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <Section title='Social Profiles' schema={socialProfileInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <Section title='Writing Info' schema={writingInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
      </div>
    );
  }
}

export default AddContact;
