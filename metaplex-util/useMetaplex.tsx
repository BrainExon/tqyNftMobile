import {IdentitySigner, Metaplex} from '@metaplex-foundation/js';
import {
  transact,
  Web3MobileWallet,
} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {Connection, Transaction} from '@solana/web3.js';
import {useMemo} from 'react';
import {Account} from '../components/providers/AuthorizationProvider';
import {mobileWalletAdapterIdentity} from './mwaPlugin';

const useMetaplex = (
  connection: Connection,
  selectedAccount: Account | null,
  authorizeSession: (wallet: Web3MobileWallet) => Promise<Account>,
) => {
  return useMemo(() => {
    if (!selectedAccount) { console.log('[USEMETAPLEX] Error: selectedAccount is null'); return {mwaIdentitySigner: null, metaplex: null}; }
    if (!authorizeSession) { console.log( '[USEMETAPLEX] Error: authorizeSession is null', ); return {mwaIdentitySigner: null, metaplex: null}; }

    const mwaIdentitySigner: IdentitySigner = {
      publicKey: selectedAccount.publicKey,
      signMessage: async (message: Uint8Array): Promise<Uint8Array> => {
        return await transact(async (wallet: Web3MobileWallet) => {
          await authorizeSession(wallet);

          const signedMessages = await wallet.signMessages({
            addresses: [selectedAccount.publicKey.toBase58()],
            payloads: [message],
          });
          console.log( `[USEMETAPLEX][mwaIdentitySigner] signedMessage: ${JSON.stringify( signedMessages[0] )}`);
          return signedMessages[0];
        });
      },
      signTransaction: async (
        transaction: Transaction,
      ): Promise<Transaction> => {
        return await transact(async (wallet: Web3MobileWallet) => {
          await authorizeSession(wallet);

          const signedTransactions = await wallet.signTransactions({
            transactions: [transaction],
          });
          console.log( `[USEMETAPLEX][signedTransaction] transaction: ${JSON.stringify( signedTransactions[0])}`);

          return signedTransactions[0];
        });
      },
      signAllTransactions: async (
        transactions: Transaction[],
      ): Promise<Transaction[]> => {
        return transact(async (wallet: Web3MobileWallet) => {
          await authorizeSession(wallet);
          const signedTransactions = await wallet.signTransactions({
            transactions: transactions,
          });
          console.log( `[USEMETAPLEX][signAllTransactions] signedTransactions: ${JSON.stringify( signedTransactions[0] )}`);
          return signedTransactions;
        });
      },
    };

    const metaplex = Metaplex.make(connection).use(
      mobileWalletAdapterIdentity(mwaIdentitySigner),
    );

    return {metaplex};
  }, [authorizeSession, selectedAccount, connection]);
};

export default useMetaplex;
