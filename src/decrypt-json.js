#!/usr/bin/env node

const fs = require('fs');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

function decryptJson(encryptedContent, secretKey) {
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

async function decryptJsonFromUrl(url, secretKey, proxyConfig = null) {
    try {
        const axiosConfig = {};

        if (proxyConfig) {
            const agent = new HttpsProxyAgent(`http://${proxyConfig.host}:${proxyConfig.port}`);
            axiosConfig.httpsAgent = agent;
        }

        const response = await axios.get(url, axiosConfig);
        const encryptedContent = response.data.encrypted;

        if (!encryptedContent) {
            throw new Error('No encrypted content found in the JSON file.');
        }

        const decryptedString = decryptJson(encryptedContent, secretKey);
        return decryptedString;
    } catch (error) {
        console.error('Error fetching or decrypting JSON from URL:', error);
        throw error;
    }
}

function decryptJsonFile(inputFilePath, outputFilePath = './decrypted.json', secretKey = 'your-default-secret-key') {
    if (!inputFilePath) {
        throw new Error('Please provide an input file path.');
    }

    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the encrypted JSON file:', err);
            return;
        }

        try {
            const encryptedContent = JSON.parse(data).encrypted;

            if (!encryptedContent) {
                throw new Error('No encrypted content found in the JSON file.');
            }

            const decryptedString = decryptJson(encryptedContent, secretKey);

            fs.writeFile(outputFilePath, decryptedString, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the decrypted JSON file:', err);
                    return;
                }
                console.log('JSON file has been decrypted and saved to:', outputFilePath);
            });
        } catch (error) {
            console.error('Error processing encrypted data:', error);
        }
    });
}

// 如果是命令行调用
if (require.main === module) {
    const args = process.argv.slice(2);
    let inputFilePath = null;
    let outputFilePath = './decrypted.json';
    let secretKey = 'your-default-secret-key';
    let url = null;
    let proxyConfig = null;

    args.forEach((arg, index) => {
        if (arg.startsWith('http')) {
            url = arg;
        } else if (index === 0 && !arg.startsWith('http') && !arg.includes(':')) {
            inputFilePath = arg;
        } else if (index === 1 && !arg.includes(':')) {
            outputFilePath = arg;
        } else if (index === 2 && !arg.includes(':')) {
            secretKey = arg;
        } else if (arg.includes(':')) {
            const [host, port] = arg.split(':');
            proxyConfig = { host, port: parseInt(port, 10) };
        }
    });

    if (url) {
        decryptJsonFromUrl(url, secretKey, proxyConfig)
            .then(decryptedContent => {
                console.log('Decrypted JSON content:', decryptedContent);
                fs.writeFile(outputFilePath, decryptedContent, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing the decrypted JSON file:', err);
                        return;
                    }
                    console.log('Decrypted JSON has been saved to:', outputFilePath);
                });
            })
            .catch(err => {
                console.error('Error during decryption from URL:', err);
            });
    } else {
        decryptJsonFile(inputFilePath, outputFilePath, secretKey);
    }
}

module.exports = {
    decryptJson,
    decryptJsonFromUrl,
    decryptJsonFile
};