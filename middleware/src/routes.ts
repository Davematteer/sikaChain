import express, { Request, Response } from "express";
import { createCanisterActor } from "./icpClient";
import aft from "./africastalkingClient"
import { collections,momo, runPayment, sendMoMo } from "./momoConfig";
import { getLLMReply } from "./AI_insights";

const router = express.Router();
const admin = "0244365907"
const adminPin= "5786"
const countrycodes: Map<string, string> = new Map([
    ["Ghana", "+233"],
    ["Kenya", "+254"],
    ["Uganda", "+256"],
    ["Tanzania", "+255"],
    ["Rwanda", "+250"],
    ["Malawi", "+265"],
    ["Nigeria", "+234"],
    ["Ethiopia", "+251"],
    ["Zambia", "+260"],
    ["Côte d'Ivoire", "+225"],
    ["Turkey","+90"]
]);

const conversionRates: Record<string, number> = {
  Ghana: 1000,
  Nigeria: 3,
  Kenya: 8,
  Uganda: 0.25,
  Tanzania: 0.39,
  Rwanda: 0.9,
  Malawi: 0.57,
  Ethiopia: 17,
  Zambia: 56,
  "Côte d'Ivoire": 1.46,
};

// payment confirmation via SMS forwarding
router.post("/pay", async (req, res) => {
  const raw = req.body.message;

  // Clean HTML artifacts
  const cleaned = raw.replace(/<br\/?>(\s+)?/gi, "").replace("Message:", "").trim();

  // Extract data
  const amountMatch = cleaned.match(/Payment received for GHS ([\d.]+)/);
  const amount = amountMatch?.[1] ?? null;

  const refMatch = cleaned.match(/Reference: (.+?)\./);
  const reference = refMatch?.[1].trim(); // phone number in ref

  const txIdMatch = cleaned.match(/Transaction ID: (\d+)/);
  const transactionId = txIdMatch?.[1] ?? null;

  const dateTimeMatch = cleaned.match(/\((\d{2}\/\d{2}\/\d{4} \d{1,2}:\d{2}\u202f[ap]m)\)/);
  const timestamp = dateTimeMatch?.[1] ?? null;

  if (reference && amount && transactionId && timestamp) {
    const payload = `AMT:${amount};TXID:${transactionId};TIME:${timestamp}`;
    const token = Buffer.from(payload).toString("base64");

    await aft.SMS.send({
      to: "+233" + reference.slice(1),
      from: "sikaChain",
      message: `Your Sika token is: ${token}`
    });
  }

  console.log("Token generated for MoMo sender:", reference);
  res.sendStatus(200);
});


router.post("/ussd", async (req: Request, res: Response) => {
  const actor = await createCanisterActor();
  let { phoneNumber, text } = req.body;
  let localNumber = phoneNumber;
  let countryCode: string | null = null;
  let userCountry: string | null = null;
  const menu = text.split("*");
  const action = menu[0];

  const testNumbers: string[] = [
    "46733123450",
    "46733123451",
    "46733123452",
    "46733123453",
    "46733123454",
    "46733123455",
    "46733123456",
    "46733123457",
    "46733123458",
    "46733123459",
    "46733123460",
  ];

  for (const [c, code] of countrycodes) {
    if (localNumber.startsWith(code)) {
      localNumber = "0" + phoneNumber.slice(code.length);
      userCountry = c;
      countryCode = code;
      break;
    }
  }

  phoneNumber = localNumber;
  console.log(phoneNumber, userCountry, countryCode);

  if (!countryCode) return res.send(`END We could not detect your country(${userCountry}) based on your phone number. Supported countries include Ghana, Kenya, Nigeria, etc.`);

  try {
    // Main menu
    if (text === "") {
      return res.send(
        `CON Welcome to SikaChain
1. Register
2. Check Balance
3. Send Sika
4. Mint Sika
5. Reset PIN
6. Get User Info
7. Delete Account
8. Transactions`
      );
    }

    switch (action) {
      case "1": {
        const result:any = await actor.registerUser(phoneNumber);
        if ("Ok" in result){
          console.log(`${phoneNumber} got registerd!`)
          aft.SMS.send({
            to:req.body.phoneNumber,
            from:"10305",
            message:"Thanks for registering with sikaChain! If you have further questions here is our chatbot! Happy spending :) !!!",
        })
        console.log(`Skipped if statement. Request body: ${JSON.stringify(req.body)}`)
      }
        return res.send(
          "Ok" in result
            ? `END Registered successfully. Your PIN is ${result.Ok}`
            : `END Registration failed: ${result.Err}`
        );
      
    }

      case "2": {
        const result:any = await actor.getBalance(phoneNumber);
        console.log(`Request body for get balance: ${JSON.stringify(req.body)}`);
        return res.send(
          "Ok" in result
            ? `END Your balance is: ${result.Ok}`
            : `END Could not retrieve balance: ${result.Err}`
        );
      }

      case "3": {
        const recipient = menu[1];
        const amount = menu[2];
        const pin = menu[3];
        if (!recipient) return res.send("CON Enter recipient phone number:");
        if (!amount) return res.send("CON Enter amount to send:");
        if (!pin) return res.send("CON Enter pin:");

        const result = await actor.sendSika(phoneNumber, recipient, BigInt(amount), pin);

        const resultText = await actor.smsTransaction(phoneNumber);
        const tx = resultText.map((e) => {
          const date = new Date(Number(e.timestamp)).toLocaleString('en-US', { timeZone: 'Africa/Accra' });
          return (
            `🧾 Transaction ID: ${e.id}\n` +
            `📤 From: ${e.from}\n` +
            `📥 To: ${e.to}\n` +
            `💰 Amount: ${e.amount} Sika (${userCountry})\n` +
            `🕒 Time: ${date}\n` +
            `-----------------------------\n`
          );
        }).join('');
        
        await aft.SMS.send({
          to: countryCode + phoneNumber.slice(1),
          message: tx,
          from: 'sikaChain'
        });

        return res.send(
          "Ok" in result
            ? `END Sent ${amount} Sika to ${recipient}`
            : `END Send failed: ${result.Err}`
        );
      }
      
      case "4": {
        const token = menu[1];
        const pin = menu[2];

        if (!token) {
          return res.send(
            `CON Do you have a coupon token?\n` +
            `1. Yes - Enter your token\n` +
            `2. No - Send MoMo to 0244365907 and wait for your token`
          );
        }

        // If they type '1' to continue, prompt again
        if (token === "1" && !menu[2]) {
          return res.send("CON Enter your token:");
        }

        // Handle if they selected "No"
        if (token === "2") {
          return res.send("END Send MoMo to 0244365907.\nYou’ll receive a token via SMS.");
        }

        if (!pin) return res.send("CON Enter your PIN:");

        const verify = await actor.verifyPin(phoneNumber, pin);
        if (!("Ok" in verify) || !verify.Ok) {
          return res.send("END PIN verification failed.");
        }

        // Decode base64 token
        let decoded: string;
        try {
          decoded = Buffer.from(token, "base64").toString("utf-8");
        } catch (e) {
          return res.send("END Invalid token.");
        }

        // Extract info from decoded string
        const parts = Object.fromEntries(
          decoded.split(";").map((pair) => pair.split(":"))
        );
        const amount = parts["AMT"];
        const txId = parts["TXID"];
        const timestamp = parts["TIME"];

        if (!amount || !txId || !timestamp) {
          return res.send("END Token is missing required fields.");
        }

        const rate = conversionRates[userCountry ?? "Ghana"] ?? 1000;
        const sikaAmount = Math.floor(parseFloat(amount) * rate);

        const result = await actor.mintSika(phoneNumber, BigInt(sikaAmount), pin);
        const resultText = await actor.smsTransaction(phoneNumber);
        const tx = resultText.map((e) => {
          const date = new Date(Number(e.timestamp)).toLocaleString('en-US', { timeZone: 'Africa/Accra' });
          return (
            `🧾 Transaction ID: ${e.id}\n` +
            `📤 From: ${e.from}\n` +
            `📥 To: ${e.to}\n` +
            `💰 Amount: ${e.amount} Sika (${userCountry})\n` +
            `🕒 Time: ${date}\n` +
            `-----------------------------\n`
          );
        }).join('');
        
        await aft.SMS.send({
          to: countryCode + phoneNumber.slice(1),
          message: tx,
          from: 'sikaChain'
        });

        return res.send(
          "Ok" in result
            ? `END Minted ${sikaAmount} Sika from token`
            : `END Mint failed: ${result.Err}`
        );
      }


      case "5": {
        const phone = menu[1];
        if (!phone) return res.send("CON Enter Phone number:");

        const result:any = await actor.resetPin(phone);
        return res.send(
          "Ok" in result
            ? `END PIN reset successful`
            : `END Reset failed: ${result.Err}`
        );
      }

      case "6": {
        const result = await actor.getUserInfo(phoneNumber);
        return res.send(
          "Ok" in result
            ? `END Phone: ${result.Ok.phone}\nPIN: ${result.Ok.pin}`
            : `END Could not retrieve user info: ${result.Err}`
        );
      }

      case "7": {
        const result = await actor.deleteAccount(phoneNumber);
        return res.send(
          "Ok" in result
            ? `END Account deleted successfully`
            : `END Deletion failed: ${result.Err}`
        );
      }

      case "8": {
        const PIN = menu[1];
        if (!PIN) return res.send("CON Enter your pin:");
        const result = await actor.getAllTransactions(phoneNumber, PIN);
        if (result.length === 0) return res.send(`END Wrong PIN!`);

        const text = result.map((e) => {
          // Convert timestamp to readable date
          const date = new Date(Number(e.timestamp)).toLocaleString();
        
          // Get sender and receiver country from phone prefixes: Doesnt work since i dont store country codes find fix 
          // const senderCountry = toLocalNumber(e.from).country;
          // const receiverCountry = toLocalNumber(e.to).country;
        
          return (
            `🧾 TRANSACTION ID: ${e.id}\n` +
            `🌍 FROM: ${e.from}\n` +
            `📥 TO: ${e.to}\n` +
            `💸 AMOUNT: ${e.amount} Sika\n` +
            `⏰ TIME: ${date}\n` +
            `-----------------------------\n`
          );
        }).join('');
        
        await aft.SMS.send({
          to: countryCode + phoneNumber.slice(1),
          message: text,
          from: 'sikaChain'
        });

        return res.send("END Transaction history sent via SMS!");
      }

      // mtn momo api said nahh, so this feature has been axed bro 
//       case "9": {
        
//         const amount = menu[1];
//         const pin = menu[2];
//         if (!amount) return res.send("CON Enter amount to withdraw:");
//         if (!pin) return res.send("CON Enter your PIN:");

//         const verify = await actor.verifyPin(phoneNumber, pin);
//         if (!("Ok" in verify) || !verify.Ok) {
//           return res.send("END PIN verification failed.");
//         }

//         const balanceCheck = await actor.getBalance(phoneNumber);
//         if (!("Ok" in balanceCheck) || BigInt(amount) > BigInt(balanceCheck.Ok)) {
//           return res.send("END Insufficient balance.");
//         }

//         const withdrawalStatus =process.env.NODE_ENV === "development"
//       ? "SUCCESSFUL"
//       : await runPayment(amount, testNumbers[4]);
// // test disbursement
//         console.log(amount , testNumbers[2]);
//         if (withdrawalStatus === "SUCCESSFUL") {
//           const result = await actor.sendSika(admin,phoneNumber, BigInt(amount), adminPin);
//           console.log(`adminNumber: ${admin} recipient: ${phoneNumber} pin: ${adminPin}`);
//           return res.send(
//             "Ok" in result
//               ? `END Withdrawal of ${amount} Sika successful!`
//               : `END Withdrawal failed: ${result.Err}`
//           );
//         } else if (withdrawalStatus === "FAILED" || withdrawalStatus === "REJECTED") {
//           return res.send("END Withdrawal failed. Please try again later.");
//         } else {
//           return res.send("END Withdrawal pending or timed out. Try again later.");
//         }
//       }

      default:
        return res.send("END Invalid option.");
    }
  } catch (err) {
    console.error("USSD Error:", err);
    return res.status(500).send("END Internal server error.");
  }
});


router.post("/ai-chatbot",async (req, res) =>{
  try {
    const actor = await createCanisterActor();
    const result = req.body;
    console.log(result);
    console.log(`message: ${result.text}\ndate: ${result.date}\nsender: ${result.from}`)
    
    // international number from req (+233)
    const phoneNumber = result.from;
    const {localNumber,country} = toLocalNumber(phoneNumber) // conversion to local number
    // get user info
    const userInfo:any = await actor.getUserInfo(localNumber);
    const pin = userInfo.Ok.pin;

    console.log(userInfo.Ok.pin);
    console.log(localNumber);

    // get user transactions
    const txs= await actor.getAllTransactions(localNumber,pin);
    const text = txs.map((e) => {
      // Convert timestamp to readable date
      const date = new Date(Number(e.timestamp)).toLocaleString();
    
      // Get sender and receiver country from phone prefixes: Doesnt work since i dont store country codes find fix 
      // const senderCountry = toLocalNumber(e.from).country;
      // const receiverCountry = toLocalNumber(e.to).country;
    
      return (
        `🧾 TRANSACTION ID: ${e.id}\n` +
        `🌍 FROM: ${e.from}\n` +
        `📥 TO: ${e.to}\n` +
        `💸 AMOUNT: ${e.amount} Sika\n` +
        `⏰ TIME: ${date}\n` +
        `-----------------------------\n`
      );
    }).join('');
    const reply = await getLLMReply(localNumber, result.text, text,country!);
    console.log(text)
    console.log(`LLM Reply: ${reply}`)
    aft.SMS.send({
        to:result.from,
        from:result.to,
        message:reply,
      })
    return res.sendStatus(200);

  } catch (error:any) {
    console.error("Chatbot error:", error);
    return res.sendStatus(500);  
  }
});


//utility function 
function toLocalNumber(phoneNumber:string):{localNumber:string,country:string|null}{
  
  for (const [c, code] of countrycodes) {
    if (phoneNumber.startsWith(code)) {
      phoneNumber = "0" + phoneNumber.slice(code.length);
      return {localNumber:phoneNumber,country:c};
    }
  }
  return {localNumber:"",country:null}
}



export default router;