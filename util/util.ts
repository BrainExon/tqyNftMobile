import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

/**
 * isEmpty
 * Determine is a given value is empty.
 * @param value
 * @returns {boolean}
 */
function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

function isArray(input) {
  return Array.isArray(input);
}

function isArrayEmpty(input) {
  return Array.isArray(input) && input?.length === 0;
}

/**
 * arrayFindByProp
 * Find an array item by property.
 * @param array
 * @param property
 * @param value
 * @returns {*|string}
 */
function arrayFindByProp(array, property, value) {
  if (!Array.isArray(array)) {
    return '';
  }
  return array.find(obj => obj[property] === value);
}

function arrayFilterByProp(array, property, value) {
  if (!Array.isArray(array)) {
    return [];
  }
  return array.filter(obj => obj[property] === value);
}

/**
 * arrayFindDuplicateObjectsById
 * Find duplicate array objects by ID.
 * @param arr
 * @returns {*[]}
 * Alternative:
 *   const result = {};
 *   for (let i = 0; i < arr.length; i++) {
 *     const obj = arr[i];
 *     if (result.hasOwnProperty(obj.id)) {
 *       result[obj.id].push(obj);
 *     } else {
 *       result[obj.id] = [obj];
 *     }
 *   }
 *   return result;
 */

/**
 * arrayUpdateAllObjects
 * Update all array items with a given property.
 * @param array
 * @param property
 * @param value
 * @returns {*}
 */
function arrayUpdateAllObjects(array, property, value) {
  if (Array.isArray(array)) {
    return array.map(obj => ({...obj, [property]: value}));
  }
  return []; // Return an empty array for invalid input
}

/**
 * isTablet
 * Determine if width and height match Tablet dimensions defined
 * in environment variables.
 * @param width
 * @param height
 * @returns {boolean}
 */
function isTablet(width, height) {
  return (
    width >= process.env.EXPO_PUBLIC_TABLET_WIDTH_THRESHOLD &&
    height >= process.env.EXPO_PUBLIC_TABLET_HEIGHT_THRESHOLD
  );
}

/**
 * generateUuid
 * Generate a UUIDV4 token.
 * @returns {*}
 */
function generateUuid() {
  return uuidv4();
}

/**
 *
 * @param data
 * @param id
 * @returns {Promise<number>}
 */
function findIndexById(data, id) {
  let index = -1;
  if (!isEmpty(id) && isArray(data)) {
    index = data.findIndex(r => r.id === id);
  }
  return index;
}

/**
 * setOutline
 * Toggle border outlines using in global styles
 * for debugging layout issues.
 * @returns {boolean}
 */
function setOutline() {
  return false;
}

const isObjectEmpty = obj => {
  return typeof obj === 'object' && Object.keys(obj).length === 0;
};

const stripStringification = str => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (error) {
    // Return the original string if it's not a valid JSON string
    return str;
  }
};

const printDebug = (routine: string, error: any, debug) => {
  if (debug) {
    console.log(`${routine}: ${JSON.stringify(error, null, 2)}`);
  }
};
const replaceStringByKey = (inputString, key, replacement) => {
  console.log(
    '[replaceStringByKey] inputString: ',
    JSON.stringify(inputString),
  );
  console.log('[replaceStringByKey] key: ', JSON.stringify(key));
  console.log(
    '[replaceStringByKey] replacement: ',
    JSON.stringify(replacement),
  );
  // const clean = inputString.split(`{${key}}`).join(replacement);
  const regex = new RegExp(key, 'g');
  const clean = inputString.replace(regex, replacement);
  console.log('[replaceStringByKey] clean: ', JSON.stringify(clean));
  return clean;
};

function getUrlFileName(url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}
export {
  getUrlFileName,
  printDebug,
  isArray,
  setOutline,
  generateUuid,
  arrayFindByProp,
  arrayUpdateAllObjects,
  isTablet,
  isEmpty,
  findIndexById,
  arrayFilterByProp,
  isArrayEmpty,
  isObjectEmpty,
  stripStringification,
  replaceStringByKey,
};
