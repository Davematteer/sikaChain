import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'deleteAccount' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'getAllTransactions' : ActorMethod<
    [string, string],
    Array<
      {
        'id' : string,
        'to' : string,
        'from' : string,
        'timestamp' : bigint,
        'amount' : string,
      }
    >
  >,
  'getAllTransactionsAdmin' : ActorMethod<
    [],
    Array<
      [
        string,
        Array<
          {
            'id' : string,
            'to' : string,
            'from' : string,
            'timestamp' : bigint,
            'amount' : string,
          }
        >,
      ]
    >
  >,
  'getAllUsers' : ActorMethod<
    [],
    Array<[string, { 'pin' : string, 'phone' : string }]>
  >,
  'getBalance' : ActorMethod<[string], { 'Ok' : bigint } | { 'Err' : string }>,
  'getBalances' : ActorMethod<[], Array<[string, bigint]>>,
  'getUserInfo' : ActorMethod<
    [string],
    { 'Ok' : { 'pin' : string, 'phone' : string } } |
      { 'Err' : string }
  >,
  'mintSika' : ActorMethod<
    [string, bigint, string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'registerUser' : ActorMethod<
    [string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'resetPin' : ActorMethod<[string], { 'Ok' : string } | { 'Err' : string }>,
  'sendSika' : ActorMethod<
    [string, string, bigint, string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'smsTransaction' : ActorMethod<
    [string],
    [] | [
      {
        'id' : string,
        'to' : string,
        'from' : string,
        'timestamp' : bigint,
        'amount' : string,
      }
    ]
  >,
  'verifyPin' : ActorMethod<
    [string, string],
    { 'Ok' : boolean } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
