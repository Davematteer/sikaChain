
curl -X GET https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay/$UUID \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "X-Target-Environment: sandbox" \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY"
