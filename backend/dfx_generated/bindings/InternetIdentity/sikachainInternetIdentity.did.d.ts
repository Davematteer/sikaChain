import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getBalance' : ActorMethod<
    [Principal],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'getUserInfo' : ActorMethod<
    [Principal],
    { 'Ok' : { 'pin' : string, 'phone' : string } } |
      { 'Err' : string }
  >,
  'mintSika' : ActorMethod<
    [Principal, bigint],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'registerUser' : ActorMethod<
    [Principal, string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'sendSika' : ActorMethod<
    [Principal, Principal, bigint],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'verifyPin' : ActorMethod<
    [Principal, string],
    { 'Ok' : boolean } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
