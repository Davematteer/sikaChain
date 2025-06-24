import fetch from 'isomorphic-fetch';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { idlFactory as myIDL } from "../../backend/dfx_generated/bindings/PhoneNumber";
export { idlFactory as myIDL} from "../../backend/dfx_generated/bindings/PhoneNumber";
import "dotenv/config";

export async function createCanisterActor(): Promise<ActorSubclass> {
  const agent = new HttpAgent({
    fetch,
    host: process.env.CANISTERENV==="development" ? 'http://127.0.0.1:4943':"https://icp-api.io",
  });

  // Only fetch root key in local development
  if (process.env.DFX_NETWORK === 'local') {
    await agent.fetchRootKey();
  }

  const canisterId = process.env.CANISTER_ID_SIKACHAINPHONENUMBER;

  if (!canisterId) {
    throw new Error("Missing GREET_CANISTER_ID in environment variables");
  }

  return Actor.createActor(myIDL, {
    agent,
    canisterId,
  });
}

console.log(process.env.DFX_NETWORK)