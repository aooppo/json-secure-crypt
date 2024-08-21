# json-secure-crypt

`json-secure-crypt` is a Node.js package that provides tools to securely encrypt and decrypt JSON files using AES encryption. It supports both local files and remote files accessed via URLs, with optional proxy configuration.

## Installation

To install the package, use one of the following commands:

### Using npm:

```bash
npm install json-secure-crypt
```

### Using Yarn:

```bash
yarn add json-secure-crypt
```

## Usage

### Command-Line Interface (CLI) Usage

This package provides two primary command-line tools: `encrypt` and `decrypt`, which can be executed via npm or Yarn scripts.

#### 1. Encrypt a JSON File

Encrypt a local JSON file and save the encrypted content to a new file:

#### Using npm:

```bash
npm run encrypt -- <input-file-path> <output-file-path> <secret-key>
```

#### Using Yarn:

```bash
yarn encrypt <input-file-path> <output-file-path> <secret-key>
```

- `<input-file-path>`: Path to the JSON file you want to encrypt.
- `<output-file-path>`: Path where the encrypted file will be saved.
- `<secret-key>`: The secret key used for encryption. Keep this key safe, as it will be required to decrypt the file.

**Example:**

```bash
npm run encrypt -- ./data.json ./encrypted-data.json mySecretKey123
```

or using Yarn:

```bash
yarn encrypt ./data.json ./encrypted-data.json mySecretKey123
```

#### 2. Decrypt a Local JSON File

Decrypt a local encrypted JSON file and save the decrypted content to a new file:

#### Using npm:

```bash
npm run decrypt -- <input-file-path> <output-file-path> <secret-key>
```

#### Using Yarn:

```bash
yarn decrypt <input-file-path> <output-file-path> <secret-key>
```

- `<input-file-path>`: Path to the encrypted JSON file.
- `<output-file-path>`: Path where the decrypted file will be saved.
- `<secret-key>`: The secret key used to decrypt the file.

**Example:**

```bash
npm run decrypt -- ./encrypted-data.json ./decrypted-data.json mySecretKey123
```

or using Yarn:

```bash
yarn decrypt ./encrypted-data.json ./decrypted-data.json mySecretKey123
```

#### 3. Decrypt a Remote JSON File

You can also decrypt a JSON file hosted remotely via a URL:

#### Using npm:

```bash
npm run decrypt -- <url> <output-file-path> <secret-key> [proxy-host:proxy-port]
```

#### Using Yarn:

```bash
yarn decrypt <url> <output-file-path> <secret-key> [proxy-host:proxy-port]
```

- `<url>`: The URL of the remote JSON file.
- `<output-file-path>`: Path where the decrypted file will be saved.
- `<secret-key>`: The secret key used to decrypt the file.
- `[proxy-host:proxy-port]` (optional): If your network requires a proxy to access the internet, specify the proxy host and port here.

**Example:**

```bash
npm run decrypt -- https://example.com/encrypted.json ./decrypted.json mySecretKey123
```

or using Yarn:

```bash
yarn decrypt https://example.com/encrypted.json ./decrypted.json mySecretKey123
```

**Example with Proxy:**

```bash
npm run decrypt -- https://example.com/encrypted.json ./decrypted.json mySecretKey123 127.0.0.1:7890
```

or using Yarn:

```bash
yarn decrypt https://example.com/encrypted.json ./decrypted.json mySecretKey123 127.0.0.1:7890
```

### Programmatic Usage

You can also use the encryption and decryption functions in your Node.js code.

```javascript
const { encryptJson, decryptJson } = require('json-secure-crypt');

// Encrypt JSON data
const jsonData = { key: 'value' };
const secretKey = 'mySecretKey123';
const encryptedData = encryptJson(jsonData, secretKey);

// Decrypt JSON data
const decryptedData = decryptJson(encryptedData, secretKey);
console.log(decryptedData); // Output: { key: 'value' }
```

### Decrypting from a URL in Your Code

If you need to decrypt JSON data from a remote URL within your application, you can do so as follows:

```javascript
const { decryptJsonFromUrl } = require('json-secure-crypt');

const url = 'https://example.com/encrypted.json';
const secretKey = 'mySecretKey123';
const proxyConfig = {
    host: '127.0.0.1',
    port: 8080
};

decryptJsonFromUrl(url, secretKey, proxyConfig)
    .then(decryptedData => {
        console.log(decryptedData);
    })
    .catch(err => {
        console.error('Error during decryption:', err);
    });
```

### License

This package is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.