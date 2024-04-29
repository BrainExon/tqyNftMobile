import Config from 'react-native-config';
import axios from 'axios';

export async function dbFindOne({endPoint, conditions, setError}) {
  console.log(
    `[dbFindOne] endpoint: ${endPoint} conditions: ${JSON.stringify(
      conditions,
    )}`,
  );

  if (!conditions) {
    const err = `[dbFindOne] "conditions" is null for endpoint ${endPoint}`;
    console.log(err);
    setError(err);
    return;
  }

  try {
    const url = `${Config.NODEJS_EXPRESS_SERVER}/${endPoint}`;
    console.log(`\n----\nURL: ${JSON.stringify(url)}\n----\n`);
    const response = await axios.post(url, conditions, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(
      `[dbFindOne] end point "${endPoint}" response: ${JSON.stringify(
        response.data,
      )}`,
    );
    if (response.status === 200) {
      console.log('[dbFindOne] Data retrieved successfully:', response.data);
      return response.data;
    } else {
      const er = `[dbFindOne] Error retrieving data: ${JSON.stringify(
        response.statusText,
      )}`;
      setError(er);
    }
  } catch (error) {
    const er = `[dbFindOne] An error occurred while searching endpoint: ${JSON.stringify(
      endPoint,
    )}`;
    setError(er);
  }
}

export async function dbUpsert({endPoint, conditions, callback}) {
  if (!conditions) {
    const err = `[dbUpsert] "conditions" is null for endpoint ${endPoint}`;
    console.log(err);
    callback(err);
    return;
  }
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(conditions);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  try {
    const response = await fetch(
      `${Config.NODEJS_EXPRESS_SERVER}/${endPoint}`,
      requestOptions,
    );
    console.log(
      `[dbUpsert] end point "${endPoint}" response: ${JSON.stringify(
        response,
      )}`,
    );
    console.log(`[dbUpsert] response.ok: ${JSON.stringify(response.ok)}`);
    if (response.ok) {
      const data = await response.json();
      console.log('[dbUpsert] ${endPoint} success:', data);
      return data;
    } else {
      const er = `[dbUpsert] ${endPoint}  : ${JSON.stringify(
        response.statusText,
      )}`;
      callback(er);
    }
  } catch (error) {
    const er = `[dbUpsert] An error occurred while upserting endpoint: ${JSON.stringify(
      endPoint,
    )}`;
    callback(er);
  }
}

/*
export async function dbFetch({endPoint, setError}) {
  try {
    //console.log( `[dbFetch] URL: ${Config.NODEJS_EXPRESS_SERVER}/${endPoint}`, );
    const requestOptions = {method: 'GET', redirect: 'follow'};
    const response = await fetch(
      `${Config.NODEJS_EXPRESS_SERVER}/${endPoint}`,
      requestOptions,
    );
    //const result = await response.text();
    return await response.json();
  } catch (error) {
    console.error('dbFetch error: ', JSON.stringify(error));
    setError(error);
  }
}
*/
interface DbFetch {
  endPoint: string;
  setError: (error: any) => void;
}
export async function dbFetch({endPoint, setError}) {
  try {
    const url = `${Config.NODEJS_EXPRESS_SERVER}/${endPoint}`;
    //console.log(`[dbFetch] url: ${JSON.stringify(url)}`);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('dbFetch error: ', JSON.stringify(error));
    setError(error);
  }
}
interface FetchImageParams {
  endPoint: string;
  imageName: string;
  callback: (error: any) => void;
}

export async function fetchImage({endPoint, imageName, callback}) {
  try {
    console.error(
      '\n-------\n[fetchImage] ENDPOINT: ',
      JSON.stringify(endPoint),
    );
    console.error('[fetchImage] imageName: ', JSON.stringify(imageName));
    const url = `${Config.NODEJS_EXPRESS_SERVER}/${endPoint}/${imageName}`;
    console.error('[fetchImage] URI: ', JSON.stringify(url));
    const response = await axios.get(url);
    console.error('[fetchImage] RSEPONSEC: ', JSON.stringify(resposne));
    const result = response.data;
    return result;
  } catch (error) {
    console.error('[fetchImage] error: ', JSON.stringify(error));
    callback('[fetchImage] error: ', JSON.stringify(error));
  }
}
