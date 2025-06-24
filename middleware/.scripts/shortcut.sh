# Exit on error
set -e

# STEP 1: Set Variables
export SUBSCRIPTION_KEY="subscriberkey"
export UUID=$(uuidgen)  # generate a new UUID
export CALLBACK_URL=0bd5-154-160-3-95.ngrok-free.app  # Replace with your own base URL

echo "Generated UUID: $UUID"

# STEP 2: Create API User
curl -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY" \
  -H "X-Reference-Id: $UUID" \
  -H "Content-Type: application/json" \
  -d "{\"providerCallbackHost\": \"$CALLBACK_URL\"}"

echo -e "\n✅ API user created."

# STEP 3: Create API Key
APIKEY=$(curl -s -X POST https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$UUID/apikey \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d ''| jq -r .apiKey)

echo "🔑 API Key: $APIKEY"

# STEP 4: Encode for Basic Auth
AUTH_STRING="$UUID:$APIKEY"
BASIC_AUTH=$(echo -n "$AUTH_STRING" | base64 -w 0)
echo "BASIC_AUTH: $BASIC_AUTH"

# STEP 5: Get Bearer Token
BEARER_TOKEN=$(curl -s -X POST https://sandbox.momodeveloper.mtn.com/collection/token/ \
  -H "Authorization: Basic $BASIC_AUTH" \
  -H "Ocp-Apim-Subscription-Key: $SUBSCRIPTION_KEY" \
  -H "Content-Type: application/json" \
  -d '{}' | jq -r .access_token)

echo -e "\n✅ Bearer Token:\n$BEARER_TOKEN"

# Summary
echo -e "\n=========================="
echo "✅ Setup Complete"echo 
echo ""
echo "export SUBSCRIPTION_KEY='$SUBSCRIPTION_KEY'"
echo ""
echo "export UUID=$(uuidgen)"
echo ""
echo "export APIKEY=$APIKEY"
echo ""
echo "export BASIC_AUTH='$BASIC_AUTH'"
echo ""
echo "export BEARER_TOKEN='$BEARER_TOKEN'"
echo ""
echo "=========================="


