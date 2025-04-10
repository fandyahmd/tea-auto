import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
import CONFIG from "./config.js";

dotenv.config();

const readFile = (path) => {
  try {
    return fs.readFileSync(path, "utf-8").trim();
  } catch {
    console.warn(`[⚠️] File not found or unreadable: ${path}`);
    return "";
  }
};

const getRandomAmount = (min, max) =>
  (Math.random() * (max - min) + min).toFixed(6);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const waitRandomDelay = async (minSec, maxSec) => {
  const seconds = Math.floor(Math.random() * (maxSec - minSec + 1)) + minSec;
  console.log(`[⏳] Waiting ${seconds}s before next transfer...`);
  await sleep(seconds * 1000);
};

const validateAddresses = (list) =>
  list.filter((addr) => {
    if (!ethers.isAddress(addr)) {
      console.warn(`[⚠️] Invalid address skipped: ${addr}`);
      return false;
    }
    return true;
  });

const scheduleNextRun = () => {
  const now = new Date();
  const next = new Date(now);
  next.setDate(now.getDate() + 1);
  next.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
    0
  );

  const delayMs = next.getTime() - now.getTime();
  console.log(`\n📅 Next run scheduled at: ${next.toLocaleString()}`);
  console.log(
    `⏲️  Waiting ${Math.round(delayMs / 1000)} seconds until next run...\n`
  );

  setTimeout(main, delayMs);
};

const fetchAddressList = async () => {
  try {
    const response = await fetch(CONFIG.address_url);
    const data = await response.text();

    const rawAddresses = data
      .split("\n")
      .map((line) => line.split(",")[1])
      .filter((address) => address?.trim())
      .map((address) => address.replace(/["'\r]/g, "").trim())
      .filter((address) => address.startsWith("0x"));

    const filtered = validateAddresses(rawAddresses);
    const shuffled = filtered.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, CONFIG.max_recipients);
  } catch (error) {
    console.error(`[❌] Failed to fetch address list: ${error.message}`);
    return [];
  }
};

const getRecipientList = async () => {
  if (CONFIG.address_url) {
    return await fetchAddressList();
  } else {
    return readFile(CONFIG.recipients).split("\n");
  }
};

const getTokenAddresses = () => {
  const raw = readFile(CONFIG.tokenAddress);
  return raw
    .split("\n")
    .map((addr) => addr.trim())
    .filter((addr) => addr.length > 0);
};

const sendToken = async (
  recipient,
  amount,
  contract,
  isNative,
  walletIndex
) => {
  console.log(
    `[🚀][Wallet ${walletIndex}] Sending ${
      isNative ? `${CONFIG.symbol}` : "token"
    } to ${recipient}...`
  );

  const tx = isNative
    ? await contract.sendTransaction({ to: recipient, value: amount })
    : await contract.transfer(recipient, amount);

  console.log(`[✅] Tx Hash: ${tx.hash}`);
  console.log(`[🌐] Explorer: ${CONFIG.ExplorerUrl}/tx/${tx.hash}`);
};

const processTransfers = async () => {
  const keys = process.env.PRIVATE_KEY?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  if (!keys || keys.length === 0)
    return console.error("[❌] No PRIVATE_KEY found in .env");

  const rawAddresses = await getRecipientList();
  const tokenAddresses = getTokenAddresses();

  const recipients = validateAddresses(
    rawAddresses.map((line) => line.trim()).filter(Boolean)
  );
  if (recipients.length === 0)
    return console.error("[❌] No valid recipients.");

  const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl, CONFIG.chainId);
  const abi = [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function decimals() public view returns (uint8)",
  ];

  for (let i = 0; i < keys.length; i++) {
    const wallet = new ethers.Wallet(keys[i], provider);
    console.log(`\n🔐 Using Wallet ${i + 1}: ${wallet.address}`);

    const tokensToSend = tokenAddresses.length > 0 ? tokenAddresses : [null];

    for (const tokenAddr of tokensToSend) {
      const isNative = !tokenAddr || !ethers.isAddress(tokenAddr);
      const contract = isNative
        ? wallet
        : new ethers.Contract(tokenAddr, abi, wallet);

      let decimals;
      try {
        decimals = isNative ? 18 : await contract.decimals();
      } catch (err) {
        console.error(
          `[❌] Error getting decimals for token ${tokenAddr}: ${err.message}`
        );
        continue;
      }

      let successCount = 0;
      let failCount = 0;

      for (const recipient of recipients) {
        try {
          const amount = getRandomAmount(CONFIG.min_amount, CONFIG.max_amount);
          const amountInWei = ethers.parseUnits(amount, decimals);
          console.log(
            `[💰][Wallet ${i + 1}] Sending ${amount} to ${recipient}`
          );
          await sendToken(recipient, amountInWei, contract, isNative, i + 1);
          successCount++;
        } catch (err) {
          console.error(
            `[❌] Error processing recipient ${recipient}: ${err.message}`
          );
          failCount++;
        }
        await waitRandomDelay(CONFIG.min_delay, CONFIG.max_delay);
      }

      console.log(`\n📊 Transfer Summary (Wallet ${i + 1}):`);
      console.log(`   ✅ Success: ${successCount}`);
      console.log(`   ❌ Failed : ${failCount}`);
    }
  }
};

const main = async () => {
  const timeStr = new Date().toLocaleString();
  console.log(`\n🏁 Running transfers at: ${timeStr}`);
  fs.appendFileSync("logs.txt", `[${timeStr}] Transfers executed.\n`);

  await processTransfers();
  scheduleNextRun();
};

main();
