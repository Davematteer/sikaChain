# 📱 SikaChain: USSD-Based Digital Currency on the Internet Computer

SikaChain is a USSD-driven mobile money and digital wallet experience, built on the **Internet Computer Protocol (ICP)**. It leverages **canisters** for backend logic and storage, with a middleware Express.js server acting as the communication bridge between Africa's Talking (USSD frontend) and the ICP.

---

## ⚙️ Architecture Overview

The project consists of the following parts:

1. **Canisters (ICP)**  
   - `sikachainPhoneNumber`: Handles phone-number-based accounts, minting, sending, and user logic.
   - `sikachainInternetIdentity`: Identity-based canister (not fully implemented yet to avoid breaking user flow).

2. **Express.js Middleware (Node.js/TypeScript)**  
   Acts as the backend server that receives and responds to:
   - USSD webhooks from Africa’s Talking
   - SMS webhooks (for payment forwarding)
   - Routes calls to ICP canisters using DFINITY's SDK

3. **Africa’s Talking Sandbox (USSD Interface)**  
   Provides a USSD simulation using the code `*384*10305#` for testing on supported countries (e.g., Ghana).

4. **Payment Integration via SMS Forwarding**  
   While direct MTN Collections API integration is pending, payment is handled via SMS:
   - Users send money to a designated MTN number.
   - The confirmation SMS is forwarded to the backend.
   - The backend encodes transaction info into a **base64 coupon** and sends it back to the user as an SMS token for redemption via USSD.

---

## 🚀 Deployment

The middleware is deployed on [Railway](https://railway.app/), allowing public access to webhook routes and integration with the Africa’s Talking simulator.

You can test the app by going to Africa's Talking Sandbox and dialing:
*384*10305#

---

## ✨ Features

- **User Registration:** Register new users with automatic PIN assignment.
- **Check Balance:** View your current Sika balance.
- **Send Sika:** Transfer Sika to another phone number securely using your PIN.
- **Mint Sika:** Redeem prepaid MoMo using SMS-based coupons.
- **Chatbot (AI):**  
   - Receive **transaction summaries**.
   - Get **basic financial advice**.
- **Account Management:**
   - Reset PIN
   - View personal info
   - View transaction history
   - Delete account

---

## 🔍 Candid Interface (ICP Canisters)

You can interact directly with the backend canisters via their Candid UI:

- `sikachainPhoneNumber`:  
  🔗 [View on Candid](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=j2fd7-ciaaa-aaaad-qhmiq-cai)

- `sikachainInternetIdentity`:  
  🔗 [View on Candid](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=j5efl-pqaaa-aaaad-qhmia-cai)

---

## ⚠️ Limitations

- **MTN Collections API integration** is not functional due to lack of required paperwork and approval.
- As a workaround, **SMS forwarding** is used:
   - Payments to a dedicated MTN number trigger a webhook.
   - A base64 token is generated and sent to the sender via SMS.
   - Users redeem tokens via USSD to mint Sika.
- Currently **sandbox-only** via Africa’s Talking.

---

## 📬 Contact / Support

Have questions or want to contribute?

- Open an issue on this repo
- Or reach out directly

---

## 🧠 Future Improvements

- Enable live MTN Collections and Disbursement APIs.
- Implement identity management via **Internet Identity** (currently disabled to avoid breaking the USSD user flow).
- Expand the chatbot to support **fraud detection** and smarter financial behavior analytics.

---

## 📝 License

This project currently does not include a license. You can request one to make it easier for contributors.

---

## ❤️ Acknowledgments

- [DFINITY](https://dfinity.org) for the Internet Computer platform  
- [Africa’s Talking](https://africastalking.com) for their USSD and SMS APIs  
- [Railway](https://railway.app) for the cloud deployment

---

