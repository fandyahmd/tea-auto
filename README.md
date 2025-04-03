# Tea Auto

This script automates the process of sending ERC-20 tokens or native cryptocurrency (e.g., TEA) to multiple recipients on the Tea Sepolia network using the [`ethers.js`](https://docs.ethers.org/) library.

---

## Features

- **Automated Token Transfers**: Distributes ERC-20 tokens or native cryptocurrency to multiple recipients.
- **File-Based Configuration**: Reads private key, recipient addresses, and token contract address from local files.
- **Native Token Support**: Automatically switches to native cryptocurrency (e.g., TEA) if no valid token contract address is provided.
- **Input Validation**: Ensures valid EVM addresses and user inputs.
- **Error Handling**: Logs errors for invalid inputs, failed transactions, and other issues.
- **Transaction Delay**: Introduces a delay between transactions to avoid overwhelming the network.
- **Blockchain Explorer Links**: Provides transaction links for easy verification on the Tea Sepolia block explorer.

---

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your system.
2. **Dependencies**: Install the required dependencies using `npm install`.

---

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/fandyahmd/tea-auto.git
   cd tea-auto
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

---

## Configuration

Create the following files in the same directory as the script:

1. **`privatekey.txt`**: Contains the private key of the wallet that will send the tokens.
2. **`address.txt`**: Contains a list of recipient EVM addresses, one per line.
3. **`token.txt`**: Contains the contract address of the ERC-20 token to be sent. Leave this file empty or invalid to send native cryptocurrency (e.g., TEA).

---

## Usage

1. Run the script using Node.js:

   ```bash
   npm start
   ```

2. Enter the amount of tokens to send when prompted:

   ```plaintext
   [💰] Enter the amount of tokens to send:
   ```

3. The script will validate the inputs, connect to the Tea Sepolia network, and send the specified amount of tokens or native cryptocurrency to each recipient.

---

## File Structure

- **`privatekey.txt`**: Stores the private key of the sender's wallet.
- **`address.txt`**: Stores the list of recipient EVM addresses.
- **`token.txt`**: Stores the ERC-20 token contract address. Leave empty to send native cryptocurrency.
- **`index.js`**: The main script for token send.

---

## How It Works

1. **Read Input Files**:
   - The script reads the private key, recipient addresses, and token contract address from the respective files.
2. **Validate Inputs**:
   - Ensures the private key, token contract address, and recipient addresses are valid.
3. **Connect to Blockchain**:
   - Uses the RPC URL to connect to the Tea Sepolia network.
4. **Send Tokens**:
   - Sends the specified amount of tokens or native cryptocurrency to each valid recipient address.
   - Introduces a 5-second delay between transactions.
5. **Log Results**:
   - Logs transaction hashes and confirmations.
   - Logs errors for invalid addresses or failed transactions.

---

## Example Output

```plaintext
[💰] Enter the amount of tokens to send: 10
[🚀] Sending tokens to 0x1234...abcd...
[✅] Transaction sent! Hash: 0xabc123...
[🔗] View on Block Explorer: https://sepolia.tea.xyz/tx/0xabc123...
```

---

## Error Handling

- **File Errors**: Logs an error if any required file is missing or unreadable.
- **Invalid Addresses**: Skips invalid EVM addresses and logs a warning.
- **Transaction Errors**: Logs errors for failed transactions but continues with the next recipient.
- **Token Decimals Error**: Logs an error if the script fails to fetch token decimals.

---

## Notes

- If `token.txt` is empty or contains an invalid address, the script will default to sending native cryptocurrency (e.g., TEA).
- Ensure the private key has sufficient funds to cover both the token transfers and gas fees.
- Use the provided block explorer links to verify transactions.
