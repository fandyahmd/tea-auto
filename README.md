# Tea Auto

This script automates the process of sending ERC-20 tokens to multiple recipients on the Tea Sepolia using the [`ethers.js`](https://docs.ethers.org/) library.

---

## Features

- **Automated Token Transfers**: Distributes ERC-20 tokens to multiple recipients.
- **File-Based Configuration**: Reads private key, recipient addresses, and token contract address from local files.
- **Input Validation**: Ensures valid EVM addresses and user inputs.
- **Error Handling**: Logs errors for invalid inputs, failed transactions, and other issues.
- **Transaction Delay**: Introduces a delay between transactions to avoid overwhelming the network.

---

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your system.
2. **Dependencies**: Install the required dependencies using `npm install`.

---

## Installation

1. Clone this repository.

   ```bash
   git clone https://github.com/fandyahmd/tea-auto.git
   ```

2. Install the required dependencies by running:

   ```bash
   npm install
   ```

---

## Configuration

Create the following files in the same directory as the script:

1. **`privatekey.txt`**: Contains the private key of the wallet that will send the tokens.
2. **`address.txt`**: Contains a list of recipient EVM addresses, one per line.
3. **`token.txt`**: Contains the contract address of the ERC-20 token to be sent.

---

## Usage

1. Run the script using Node.js:

   ```bash
   node index.js
   ```

2. Enter the amount of tokens to send when prompted:

   ```plaintext
   [💰] Enter the amount of tokens to send:
   ```

3. The script will validate the inputs, connect to the Tea Sepolia, and send the specified amount of tokens to each recipient.

---

## File Structure

- **`privatekey.txt`**: Stores the private key of the sender's wallet.
- **`address.txt`**: Stores the list of recipient EVM addresses.
- **`token.txt`**: Stores the ERC-20 token contract address.
- **`index.js`**: The main script for token send.

---

## How It Works

1. **Read Input Files**:
   - The script reads the private key, recipient addresses, and token contract address from the respective files.
2. **Validate Inputs**:
   - Ensures the private key, token contract address, and recipient addresses are valid.
3. **Connect to Blockchain**:
   - Uses the RPC URL to connect to the Tea Sepolia.
4. **Send Tokens**:
   - Sends the specified amount of tokens to each valid recipient address.
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
[🎉] Transaction confirmed! Receipt: 0xdef456...
[🚀] Sending tokens to 0x5678...efgh...
[✅] Transaction sent! Hash: 0xghi789...
[🎉] Transaction confirmed! Receipt: 0xjkl012...
```

---

## Error Handling

- **File Errors**: Logs an error if any required file is missing or unreadable.
- **Invalid Addresses**: Skips invalid EVM addresses and logs a warning.
- **Transaction Errors**: Logs errors for failed transactions but continues with the next recipient.
