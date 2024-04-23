import {NetworkInfo} from 'react-native-network-info';

export async function getIPAddress() {
  // Get the network interfaces

  // Get Local IP
  NetworkInfo.getIPAddress().then(ipAddress => {
    console.log('[network] ipAddress ');
    return ipAddress;
  });
}

