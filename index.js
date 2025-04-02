const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");

const PRIVATE_KEY_FILE = "privatekey.txt";
const ADDRESS_FILE = "address.txt";
const TOKEN_FILE = "token.txt";
const RPC_URL = "https://tea-sepolia.g.alchemy.com/public";

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8").trim();
  } catch (error) {
    console.error(`[❌] Error reading file ${filePath}: ${error.message}`);
    throw error;
  }
}

function validateAddresses(addresses) {
  return addresses.filter((address) => {
    if (!ethers.isAddress(address.trim())) {
      console.warn(`[⚠️] Invalid address skipped: ${address}`);
      return false;
    }
    return true;
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendToRecipient(tokenContract, recipientAddress, amountInWei) {
  try {
    console.log(`[🚀] Sending tokens to ${recipientAddress}...`);
    const tx = await tokenContract.transfer(
      recipientAddress.trim(),
      amountInWei
    );
    console.log(`[✅] Transaction sent! Hash: ${tx.hash}`);
  } catch (error) {
    console.error(
      `[❌] Error sending to ${recipientAddress}: ${error.message}`
    );
  }
}

async function sendToken(amountToSend) {
  let privateKey, recipientAddresses;

  try {
    privateKey = readFileContent(PRIVATE_KEY_FILE);
    recipientAddresses = readFileContent(ADDRESS_FILE).split("\n");
  } catch (error) {
    console.error("[❌] Failed to read input files. Exiting...");
    return;
  }

  if (!RPC_URL || !privateKey) {
    console.error("[❌] Missing required parameters: RPC URL or private key.");
    return;
  }

  const tokenContractAddress = readFileContent(TOKEN_FILE);
  if (!ethers.isAddress(tokenContractAddress)) {
    console.error("[❌] Invalid token contract address.");
    return;
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const erc20Abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)",
  ];
  const tokenContract = new ethers.Contract(
    tokenContractAddress,
    erc20Abi,
    wallet
  );

  let amountInWei;
  try {
    const decimals = await tokenContract.decimals();
    amountInWei = ethers.parseUnits(amountToSend, decimals);
  } catch (error) {
    console.error(`[❌] Error fetching token decimals: ${error.message}`);
    return;
  }

  recipientAddresses = validateAddresses(recipientAddresses);
  if (recipientAddresses.length === 0) {
    console.error("[❌] No valid recipient addresses found.");
    return;
  }

  for (const recipientAddress of recipientAddresses) {
    await sendToRecipient(tokenContract, recipientAddress, amountInWei);
    await delay(5000);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("[💰] Enter the amount of tokens to send: ", (amountToSend) => {
  if (!amountToSend || isNaN(amountToSend) || Number(amountToSend) <= 0) {
    console.error("[❌] Invalid amount entered. Exiting...");
    rl.close();
    return;
  }

  sendToken(amountToSend).then(() => rl.close());
});
