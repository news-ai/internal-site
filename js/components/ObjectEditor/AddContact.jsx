import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Map, List, fromJS} from 'immutable';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {grey500, grey700} from 'material-ui/styles/colors';
import PlainSelect from 'components/PlainSelect';

const contactInfoShape = {
  'First Name': {
    objectType: 'string',
    keyPath: ['contactInfo', 'givenName']
  },
  'Last Name': {
    objectType: 'string',
    keyPath: ['contactInfo', 'familyName']
  },
  'Full Name': {
    objectType: 'string',
    keyPath: ['contactInfo', 'fullName']
  },
  'Websites': {
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
  'Organizations': {
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
      'End Date': {
        objectType: 'string',
        keyPath: ['endDate']
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
  'Social Profiles': {
    objectType: 'array',
    objectShape: {
      'Social Network ID': {
        objectType: 'string',
        placeholder: 'e.g. twitter',
        keyPath: ['type']
      },
      'Social Network Name': {
        objectType: 'string',
        placeholder: 'e.g. Twitter',
        keyPath: ['typeName']
      },
      'Username': {
        objectType: 'string',
        keyPath: ['username']
      },
      'Social Profile Bio': {
        objectType: 'string',
        keyPath: ['bio']
      },
      'ID': {
        objectType: 'string',
        keyPath: ['id']
      },
      'URL': {
        objectType: 'string',
        placeholder: 'https://twitter.com/imkialikethecar',
        keyPath: ['url']
      },
    },
    keyPath: ['socialProfiles']
  }
};

const writingInfoShape = {
  isFreelancer: {
    objectType: 'bool',
    keyPath: ['writingInformation', 'isFreelancer']
  },
  'Beats': {
    objectType: 'array',
    objectShape: 'dropdown',
    possibleValues: [
      '---',
      'Arts and Entertainment',
      'Beauty',
      'Business and Finance',
      'Crime and Justice',
      'Education',
      'Energy',
      'Environment',
      'Fashion',
      'Food and Dining',
      'Health',
      'Media',
      'Opinion and Editorial',
      'Politics',
      'Real Estate',
      'Religion',
      'Science',
      'Sports',
      'Technology',
      'Transportation',
      'Travel',
      'Weather',
      'World',
    ],
    keyPath: ['writingInformation', 'beats']
  },
  'Occasional Beats': {
    objectType: 'array',
    objectShape: 'dropdown',
    possibleValues: [
      '---',
      'Arts and Entertainment',
      'Beauty',
      'Business and Finance',
      'Crime and Justice',
      'Education',
      'Energy',
      'Environment',
      'Fashion',
      'Food and Dining',
      'Health',
      'Media',
      'Opinion and Editorial',
      'Politics',
      'Real Estate',
      'Religion',
      'Science',
      'Sports',
      'Technology',
      'Transportation',
      'Travel',
      'Weather',
      'World',
    ],
    keyPath: ['writingInformation', 'occasionalBeats']
  },
  'RSS': {
    objectType: 'array',
    objectShape: 'string',
    keyPath: ['writingInformation', 'rss']
  },
};

const Node = ({item, onChange, keyPath, base}) => {
  return Object.entries(item)
  .map(([name, shape]) => {
    if (shape.objectType === 'bool') {
      return (
        <div>
          <div>{name}</div>
          <PlainSelect
          value={base.getIn([...keyPath, ...shape.keyPath])}
          onChange={e => {
            switch (e.target.value) {
              case '---':
                return onChange(undefined, [...keyPath, ...shape.keyPath]);
              case 'true':
                return onChange(true, [...keyPath, ...shape.keyPath]);
              case 'false':
                return onChange(false, [...keyPath, ...shape.keyPath]);
              default:
                return onChange(undefined, [...keyPath, ...shape.keyPath]);
            }
          }}
          >
            <option value='---' >---</option>
            <option value='true' >true</option>
            <option value='false'>false</option>
          </PlainSelect>
        </div>);
    }
    return (
      <TextField
      floatingLabelFixed
      name={name}
      value={base.getIn([...keyPath, ...shape.keyPath])}
      floatingLabelText={name}
      hintText={shape.placeholder || shape.objectType}
      onChange={e => onChange(e.target.value, [...keyPath, ...shape.keyPath])}
      />
    );
  });
};

const StringObjectShapeTypeItem = props => {
  const {shape, onChange, base, name} = props;
  switch (shape.objectShape) {
    case 'dropdown':
      return (
        <div>
          <div>{name}</div>
          <PlainSelect value={base.getIn([...shape.keyPath, 0])} onChange={e => onChange(e.target.value, [...shape.keyPath, 0])}>
          {shape.possibleValues.map((option, i) =>
            <option key={`${shape.keyPath.join('-')}-0-${i}`} value={option}>{option}</option>
            )}
          </PlainSelect>
        </div>
        );
    default:
      return (
          <div>
            <div>{name}</div>
            <TextField
            floatingLabelFixed
            name={`${name}-0`}
            value={base.getIn([...shape.keyPath, 0])}
            floatingLabelText={name}
            hintText={shape.objectShape}
            onChange={e => onChange(e.target.value, [...shape.keyPath, 0])}
            />
          </div>
        );
  }
};


// not last item in shapeMap, more to recursively render
const ArrayObjectShapeTypeNode = props => {
  const {list, shape, onDelete} = props;
  return [
      ...list.map((listVal, i) =>
      <div style={{border: '1px solid lightgrey', padding: 5, margin: 5}} >
        <Node key={`array-node-${listVal}-${i}`} {...props} keyPath={[...shape.keyPath, i]} item={shape.objectShape} />
        <FontIcon
        key={`array-icon-${listVal}-${i}`}
        className='fa fa-times pointer right'
        color={grey500}
        hoverColor={grey700}
        onClick={_ => onDelete([...shape.keyPath, i])}
        />
      </div>
    ),
    <Node key={`array-node-extra`} {...props} keyPath={[...shape.keyPath, list.size]} item={shape.objectShape} />
  ];
};


// last item in shapeMap
const ArrayObjectShapeTypeItem = props => {
  const {list, shape, onChange, onDelete, base, name} = props;
  switch (shape.objectShape) {
    case 'dropdown':
      return (
        [
          ...list.map((listVal, i) =>
            <span>
              <label>{name}</label>
              <PlainSelect value={base.getIn([...shape.keyPath, i])} onChange={e => onChange(e.target.value, [...shape.keyPath, i])}>
              {shape.possibleValues.map((option, j) =>
                <option key={`${shape.keyPath.join('-')}-${i}-${j}`} value={option}>{option}</option>
                )}
              </PlainSelect>
              <FontIcon
              className='fa fa-times pointer right'
              color={grey500}
              hoverColor={grey700}
              onClick={_ => onDelete([...shape.keyPath, i])}
              />
            </span>
            ),
          <span>
            <label>{name}</label>
            <PlainSelect
            value={base.getIn([...shape.keyPath, list.size])}
            onChange={e => onChange(e.target.value, [...shape.keyPath, list.size])}
            >
            {shape.possibleValues.map((option, j) =>
              <option key={`${name}-${list.size}-${j}`} value={option}>{option}</option>
              )}
            </PlainSelect>
          </span>
        ]
        );
    default:
      return (
        [
          ...list.map((listVal, i) =>
            <span>
              <TextField
              floatingLabelFixed
              name={`${name}-${i}`}
              value={base.getIn([...shape.keyPath, i])}
              floatingLabelText={name}
              hintText={shape.objectShape}
              onChange={e => onChange(e.target.value, [...shape.keyPath, i])}
              />
              <FontIcon
              className='fa fa-times pointer right'
              color={grey500}
              hoverColor={grey700}
              onClick={_ => onDelete([...shape.keyPath, i])}
              />
            </span>
            ),
          <TextField
          floatingLabelFixed
          name={`${name}-${list.size}`}
          value={base.getIn([...shape.keyPath, list.size])}
          floatingLabelText={name}
          hintText={shape.objectShape}
          onChange={e => onChange(e.target.value, [...shape.keyPath, list.size])}
          />
        ]
        );
  }
};


const Section = props => {
  const {title, onChange, base, schema} = props;
  return (
     <div style={{marginLeft: 20}} >
      <h5>{title}</h5>
      {Object.entries(schema).map(([name, shape]) => {
        if (shape.objectType === 'array') {
          const list = base.getIn(shape.keyPath);
          if (list) {
            // RETURN LIST OF ITEMS
            return (
              <div>
                <div>{name} [array]</div>
                {typeof shape.objectShape === 'string' ? (
                  <ArrayObjectShapeTypeItem key={`${name}-array-object`} list={list} shape={shape} {...props} />
                  ) : (
                  <ArrayObjectShapeTypeNode key={`${name}-array-object`} list={list} shape={shape} {...props} />
                  )
                }
              </div>);
          }
          // RETURN SINGLE ITEM

          return typeof shape.objectShape === 'string' ? (
            <StringObjectShapeTypeItem key={`${name}-array-object`} shape={shape} {...props} />
            ) : (
            <div>
              <div>{name} [array]</div>
              <Node key={`${name}-array-object`} {...props} keyPath={[...shape.keyPath, 0]} item={shape.objectShape} />
            </div>);
        }
        if (shape.objectType === 'bool') {
          return (
            <div>
              <div>{name}</div>
              <PlainSelect
              value={base.getIn(shape.keyPath)}
              onChange={e => {
                switch (e.target.value) {
                  case '---':
                    return onChange(undefined, shape.keyPath);
                  case 'true':
                    return onChange(true, shape.keyPath);
                  case 'false':
                    return onChange(false, shape.keyPath);
                  default:
                    return onChange(undefined, shape.keyPath);
                }
              }}
              >
                <option value='---' >---</option>
                <option value='true' >true</option>
                <option value='false' >false</option>
              </PlainSelect>
            </div>);
        }
        return (
          <div>
            <TextField
            floatingLabelFixed
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
    console.log(JSON.stringify(this.state.base.toJS(), null, 2));
    return (
      <div style={{marginBottom: 100}} >
        <div style={{marginLeft: 20}} >
          <TextField
          floatingLabelFixed
          name='email'
          value={this.state.base.getIn(['email'])}
          floatingLabelText='Email'
          hintText='string'
          onChange={e => this.onChange(e.target.value, ['email'])}
          />
        </div>
        <Section title='Contact Info' schema={contactInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <Section title='Organization Info' schema={organizationInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <Section title='Social Profiles' schema={socialProfileInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <Section title='Writing Info' schema={writingInfoShape} base={this.state.base} onChange={this.onChange} onDelete={this.onDelete} />
        <div style={{margin: 20}} >
          <RaisedButton primary label='Add Contact' />
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({postContact: data => dispatch({type: 'POST_CONTACT', data})})
  )(AddContact);
