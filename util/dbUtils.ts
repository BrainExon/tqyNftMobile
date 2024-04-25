import Config from 'react-native-config';
import {User} from '../components/models/User';

export async function dbUpsert({endPoint, data, setError}) {
  if (!data) {
    const err = `[dbUpsert] "data" is null for endpoint ${endPoint}`;
    console.log(err);
    setError(err);
    return;
  }
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(data);
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
      console.log('[dbUpsert] User added successfully:', data);
      return data;
    } else {
      const er = `[dbUpsert] adding user: ${JSON.stringify(
        response.statusText,
      )}`;
      setError(er);
    }
  } catch (error) {
    const er = `An error occurred while upserting to end point: ${JSON.stringify(
      endPoint,
    )}`;
    setError(er);
  }
}
