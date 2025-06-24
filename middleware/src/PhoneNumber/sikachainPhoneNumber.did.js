export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'deleteAccount' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'getAllTransactions' : IDL.Func(
        [IDL.Text, IDL.Text],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Text,
              'to' : IDL.Text,
              'from' : IDL.Text,
              'timestamp' : IDL.Nat64,
              'amount' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'getAllTransactionsAdmin' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(
              IDL.Text,
              IDL.Vec(
                IDL.Record({
                  'id' : IDL.Text,
                  'to' : IDL.Text,
                  'from' : IDL.Text,
                  'timestamp' : IDL.Nat64,
                  'amount' : IDL.Text,
                })
              ),
            )
          ),
        ],
        ['query'],
      ),
    'getAllUsers' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(
              IDL.Text,
              IDL.Record({ 'pin' : IDL.Text, 'phone' : IDL.Text }),
            )
          ),
        ],
        ['query'],
      ),
    'getBalance' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text })],
        ['query'],
      ),
    'getBalances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))],
        ['query'],
      ),
    'getUserInfo' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'Ok' : IDL.Record({ 'pin' : IDL.Text, 'phone' : IDL.Text }),
            'Err' : IDL.Text,
          }),
        ],
        ['query'],
      ),
    'mintSika' : IDL.Func(
        [IDL.Text, IDL.Nat64, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'registerUser' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'resetPin' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'sendSika' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text })],
        [],
      ),
    'smsTransaction' : IDL.Func(
        [IDL.Text],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Text,
              'to' : IDL.Text,
              'from' : IDL.Text,
              'timestamp' : IDL.Nat64,
              'amount' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'verifyPin' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text })],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
