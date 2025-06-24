import "dotenv/config"
export const momo = require('mtn-momo');
import {v4 as uuidv4} from "uuid"



// Create SDK clients
const { Collections,Disbursements } = momo.create({
  callbackHost: process.env.CALLBACK_HOST!
});


// Initialize Collections client
export const collections = Collections({
  userSecret: process.env.COLLECTIONS_USER_SECRET!,
  userId: process.env.COLLECTIONS_USER_ID!,
  primaryKey: process.env.COLLECTIONS_PRIMARY_KEY!
});

// Initialize disbursements client 
export const disbursements = Disbursements({
  userSecret: process.env.DISBURSEMENTS_USER_SECRET!,
  userId: process.env.DISBURSEMENTS_USER_ID!,
  primaryKey: process.env.DISBURSEMENTS_PRIMARY_KEY!
});


// function for polling for collections 
export async function pollTransactionStatus(transactionID:string):Promise<string>{
    const MAX_ATTEMPTS = 10;
    const INTERVALS_MS = 3000;

    for (let i =0; i<= MAX_ATTEMPTS;i++){
      console.log(`Attempt ${i+1}, checking status...`);
      const transaction = await collections.getTransaction(transactionID);

      if (transaction.status === "SUCCESSFUL"){
        console.log(`Payment SUCCESSFUL: ${JSON.stringify(transaction)}`);
        return "SUCCESSFUL"
      }
      if (transaction.status === "FAILED"){
        console.log(`Payment FAILED!`);
        return "FAILED"
      }

      console.log(`Status: ${transaction.status} - Retrying in ${INTERVALS_MS/1000}s...\n`);
      await new Promise(res => setTimeout(res, INTERVALS_MS));
    }
    console.log(`Reached maximum number of attempts. Status still pending`);
    return "PENDING";
}

// function for polling for disbursements 
export async function pollDisbursementStatus(transactionID: string): Promise<string> {
  const MAX_ATTEMPTS = 10;
  const INTERVAL_MS = 3000;

  for (let i = 0; i <= MAX_ATTEMPTS; i++) {
    console.log(`Attempt ${i + 1}, checking status...`);
    try {
      const transaction = await disbursements.getTransaction(transactionID);

      if (transaction.status === "SUCCESSFUL") {
        console.log(`✅ Disbursement SUCCESSFUL:`, transaction);
        return "SUCCESSFUL";
      }
      if (transaction.status === "FAILED") {
        console.log(`❌ Disbursement FAILED`);
        return "FAILED";
      }

      console.log(`Status: ${transaction.status} — retrying in ${INTERVAL_MS / 1000}s...\n`);
    } catch (err) {
      console.error("❌ Disbursement polling error:", err);
    }

    await new Promise((res) => setTimeout(res, INTERVAL_MS));
  }

  return "PENDING";
}


export async function runPayment(amount:string,number:string ) :Promise<string> {
  try {
    const trackingId = uuidv4(); // for making uuid for tracking transaction 

    const transactionId = await collections.requestToPay({
      amount: Number(amount),
      currency: "EUR",
      externalId: trackingId,
      payer: {
        partyIdType: "MSISDN",
        partyId: number // try with this test number
      },
      payerMessage: "Thanks for buying Sika",
      payeeNote: "Sika deposit"
    });
    console.log("🧾 Transaction ID:", transactionId);

    const polling = await pollTransactionStatus(transactionId)
    return polling;

  } catch (error:any) {
    console.error("❌ Error occurred:", error.name);
    if (error.name === "ApprovalRejectedError") {
      return "REJECTED";
    }
    return "FAILED";
  }
}


export async function sendMoMo(amount: string, number: string): Promise<string> {
  try {
    const trackingId = uuidv4();

    const transactionId = await disbursements.transfer({
      amount: Number(amount),
      currency: "EUR",
      externalId: trackingId,
      payee: {
        partyIdType: "MSISDN",
        partyId: number
      },
      payerMessage: "Withdrawal from SikaChain",
      payeeNote: "You received Cedis from SikaChain"
    });

    console.log("📤 Disbursement Transaction ID:", transactionId);

    const polling = await pollDisbursementStatus(transactionId); // reuse existing polling logic
    return polling;

  } catch (error: any) {
    console.error("❌ Disbursement error:", error);
    if (error.name === "ApprovalRejectedError") return "REJECTED";
    return "FAILED";
  }
}

