import Config from 'react-native-config';
import {User} from '../components/models/User';

export async function addUser({user}: {user: User}, setError: any) {
  if (!user) {
    const err = '[addUser] null user!';
    console.log(err);
    setError(err);
  }
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(user);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  try {
    const response = await fetch(
      `${Config.NODEJS_EXPRESS_SERVER}/add_user`,
      requestOptions,
    );
    console.log(`[dbUtils][addUser] response: ${JSON.stringify(response)}`);
    if (response.ok) {
      const data = await response.json();
      console.log('User added successfully:', data);
      return data;
    } else {
      const er = `LoginScreenError adding user: ${JSON.stringify(
        response.statusText,
      )}`;
      setError(er);
    }
  } catch (error) {
    const er = `An error occurred while adding user: ${JSON.stringify(error)}`;
    setError(er);
  }
}
