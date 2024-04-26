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
    const response = await axios.post(
      `${Config.NODEJS_EXPRESS_SERVER}/${endPoint}`,
      conditions,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

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

export async function dbUpsert({endPoint, conditions, setError}) {
  if (!conditions) {
    const err = `[dbUpsert] "conditions" is null for endpoint ${endPoint}`;
    console.log(err);
    setError(err);
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
      setError(er);
    }
  } catch (error) {
    const er = `[dbUpsert] An error occurred while upserting endpoint: ${JSON.stringify(
      endPoint,
    )}`;
    setError(er);
  }
}
