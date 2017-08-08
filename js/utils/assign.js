const assign = Object.assign || require('object-assign'); // Polyfill maybe needed for browser support

export function assignToEmpty(oldObject, ...newObjects) {
  return assign({}, oldObject, ...newObjects);
}

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch ( e ) {
    return false;
  }
  return true;
}

export function canAccessReducer(actionType, availableTypes) {
  return availableTypes.some( type => type === actionType );
}
