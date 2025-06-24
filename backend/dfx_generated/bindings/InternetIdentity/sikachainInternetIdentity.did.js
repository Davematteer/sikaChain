export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getBalance' : IDL.Func(
        [IDL.Principal],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        ['query'],
      ),
    'getUserInfo' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Variant({
            'Ok' : IDL.Record({ 'pin' : IDL.Text, 'phone' : IDL.Text }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'mintSika' : IDL.Func(
        [IDL.Principal, IDL.Nat64],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'registerUser' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'sendSika' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat64],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'verifyPin' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text })],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
