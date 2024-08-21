const fs = require('fs');
const CryptoJS = require('crypto-js');
const path = require('path');

// 从命令行参数获取输入文件、输出文件路径和加密密钥
const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3] || './encrypted.json';
const secretKey = process.argv[4] || 'your-default-secret-key';

// 检查是否提供了输入文件路径
if (!inputFilePath) {
    console.error('Please provide an input file path.');
    process.exit(1);
}

// 读取JSON文件
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }

    try {
        // 解析JSON文件内容
        const jsonContent = JSON.parse(data);

        // 将JSON对象转换为字符串
        const jsonString = JSON.stringify(jsonContent);

        // 使用AES加密
        const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();

        // 将加密后的内容写入新的JSON文件
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