#!/usr/bin/env node

const fs = require('fs');
const CryptoJS = require('crypto-js');

// 加密函数
function encryptJsonFile(inputFilePath, outputFilePath = './encrypted.json', secretKey = 'your-default-secret-key') {
    if (!inputFilePath) {
        throw new Error('Please provide an input file path.');
    }

    // 读取JSON文件
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return;
        }

        try {
            const jsonContent = JSON.parse(data);
            const jsonString = JSON.stringify(jsonContent);
            const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();

            fs.writeFile(outputFilePath, JSON.stringify({ encrypted }), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the encrypted JSON file:', err);
                    return;
                }
                console.log('JSON file has been encrypted and saved to:', outputFilePath);
            });
        } catch (error) {
            console.error('Error processing JSON data:', error);
        }
    });
}

// 如果是命令行调用
if (require.main === module) {
    const inputFilePath = process.argv[2];
    const outputFilePath = process.argv[3] || './encrypted.json';
    const secretKey = process.argv[4] || 'your-default-secret-key';

    if (!inputFilePath) {
        console.error('Please provide an input file path.');
        process.exit(1);
    }

    encryptJsonFile(inputFilePath, outputFilePath, secretKey);
}

module.exports = {
    encryptJsonFile
};