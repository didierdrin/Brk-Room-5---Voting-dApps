import { ethers } from "ethers";
import contractABI from "./contractABI.json";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

// Extract the ABI array from the artifact JSON
const VOTING_ABI = contractABI.abi;

export const getVotingContract = () => {
  return new ethers.Contract(
    process.env.CONTRACT_ADDRESS as string,
    VOTING_ABI,
    wallet
  );
};