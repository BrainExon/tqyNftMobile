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
  if (url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
  return url;
}
function getMimeType(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  console.log(`[getMimeType] ext: ${extension}`);
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    case 'txt':
      return 'text/plain';
    case 'html':
      return 'text/html';
    case 'json':
      return 'application/json';
    case 'xml':
      return 'application/xml';
    default:
      return 'application/octet-stream';
  }
}
const formatDate = dateString => {
  const date = new Date(parseInt(dateString));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};
function removeExtension(filename) {
  // Split the filename based on the dot (.)
  const parts = filename.split('.');

  // Remove the last part (which is the extension)
  const filenameWithoutExtension = parts.slice(0, -1).join('.');

  return filenameWithoutExtension;
}
const capitalizeFirstLetter = str => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
};
export {
  capitalizeFirstLetter,
  removeExtension,
  formatDate,
  getMimeType,
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
