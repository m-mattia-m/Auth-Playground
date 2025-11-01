# Auth Playground

**Auth Playground** is a playground 🎮 to help you to get all authentication codes and tokens during development 🧑‍💻. We do not save any token or code which you received to be sure about that 🔐, you can check 👁 our opensource Github Repository 📖. You are also welcome to contribute to this project.

## Contribution

We would love ❤️ if you contribute 🧑‍💻 to this project. You can for example add a new authentication provider 🏢, fix some issues 🔴 which you found or do something else.

---

# TODO

# How to generate your bearer token

## 1. Login

1. Enter this URL: `https://zitadel.makefermion.dev/oauth/v2/authorize?response_type=code&client_id=268116337262395395@formtion&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapp%2Fcallback&scope=openid%20profile%20email%20offlice_access&code_challenge=reBXOTkUlHA3qY0gKogjPJHNPDZl5BRwY0cPne0WH-Y&code_challenge_method=S256`
2. enter your user credentials (login with your user)
3. Copy the code you got in your callback url

## 2. Redeem your `id_token`

Run this curl to get your `id_token`:

```bash
curl -X POST "https://zitadel.makefermion.dev/oauth/v2/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=authorization_code" \
    -d "code=$AUTH_CODE" \
    -d "redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapp%2Fcallback" \
    -d "client_id=268116337262395395@formtion" \
    -d "code_verifier=ThisIsMyCodeChallenge123"
```

```bash
#!/bin/bash

# Set your variables here
CLIENT_ID="268116337262395395@formtion"
REDIRECT_URI="http://localhost:3000/app/callback"
AUTH_CODE="VeUStkA04lycTWkslpI7wqWcDVL7G0fhTV_GmOEZY69OYw"  # Replace with the actual authorization code
CODE_VERIFIER="ThisIsMyCodeChallenge123"  # Replace with your actual code verifier
TOKEN_ENDPOINT="https://zitadel.makefermion.dev/oauth/v2/token"

# Function to generate code_challenge from code_verifier
generate_code_challenge() {
    local code_verifier=$1

    # Create a SHA-256 hash of the code_verifier
    local hashed_code_verifier=$(echo -n "$code_verifier" | openssl dgst -sha256 -binary)

    # Base64 URL encode the hashed code verifier
    local code_challenge=$(echo -n "$hashed_code_verifier" | base64 | tr '+/' '-_' | tr -d '=')

    echo "$code_challenge"
}

# Generate the code_challenge
CODE_CHALLENGE=$(generate_code_challenge "$CODE_VERIFIER")

# Print the code_challenge (for debugging purposes)
echo "Generated Code Challenge: $CODE_CHALLENGE"

# Exchange the authorization code for tokens
response=$(curl -X POST "$TOKEN_ENDPOINT" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=authorization_code" \
    -d "code=$AUTH_CODE" \
    -d "redirect_uri=$REDIRECT_URI" \
    -d "client_id=$CLIENT_ID" \
    -d "code_verifier=$CODE_VERIFIER")

# Print the response (for debugging purposes)
echo "Token Response: $response"

```