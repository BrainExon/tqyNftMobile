import {Connection, type ConnectionConfig} from '@solana/web3.js';
import Config from "react-native-config";
import React, {
  type FC,
  type ReactNode,
  useMemo,
  createContext,
  useContext,
} from 'react';

export const RPC_ENDPOINT = Config.RPC_ENDPOINT;

export interface ConnectionProviderProps {
  children: ReactNode;
  endpoint: string;
  config?: ConnectionConfig;
}

export const ConnectionProvider: FC<ConnectionProviderProps> = ({
  children,
  endpoint,
  config = {commitment: 'confirmed'},
}) => {
  console.log(`[ConnectionProvider] endpoint: ${JSON.stringify(endpoint)}`);
  console.log(`[ConnectionProvider] config: ${JSON.stringify(endpoint)}`);
  const connection = useMemo(
    () => new Connection(endpoint, config),
    [endpoint, config],
  );

  return (
    <ConnectionContext.Provider value={{connection}}>
      {children}
    </ConnectionContext.Provider>
  );
};

export interface ConnectionContextState {
  connection: Connection;
}

export const ConnectionContext = createContext<ConnectionContextState>(
  {} as ConnectionContextState,
);

export function useConnection(): ConnectionContextState {
  return useContext(ConnectionContext);
}
