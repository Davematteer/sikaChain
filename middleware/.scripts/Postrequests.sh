export UUID=$(uuidgen)

echo "UUID: $UUID"

curl -i -X POST https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "X-Reference-Id: $UUID" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -H "X-Callback-Url":"http://0bd5-154-160-3-95.ngrok-free.app/ussd"\
  -d '{
        "amount": "1000",
        "currency": "EUR",
        "externalId": "123456",
        "payer": {
            "partyIdType": "MSISDN",
            "partyId": "46733123454"
        },
        "payerMessage": "Thanks for buying Sika",
        "payeeNote": "Sika deposit"
      }'
