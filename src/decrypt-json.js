const fs = require('fs');
const CryptoJS = require('crypto-js');
const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// 解密函数，暴露给外部使用
function decryptJson(encryptedContent, secretKey) {
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// 通过HTTP获取远程JSON文件并解密
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

// 解析命令行参数
const args = process.argv.slice(2);
let inputFilePath = null;
let outputFilePath = './decrypted.json';
let secretKey = 'your-default-secret-key';
let url = null;
let proxyConfig = null;

// 参数处理
args.forEach((arg, index) => {
    if (arg.startsWith('http')) {
        url = arg; // 如果第一个参数是URL
    } else if (index === 0 && !arg.startsWith('http') && !arg.includes(':')) {
        inputFilePath = arg; // 第一个参数是本地文件路径
    } else if (index === 1 && !arg.includes(':')) {
        outputFilePath = arg; // 第二个参数是输出文件路径
    } else if (index === 2 && !arg.includes(':')) {
        secretKey = arg; // 第三个参数是密钥
    } else if (arg.includes(':')) {
        // 处理代理配置参数
        const [host, port] = arg.split(':');
        proxyConfig = {
            host: host,
            port: parseInt(port, 10)
        };
    }
});

// 检查是否提供了输入文件路径或URL
if (!inputFilePath && !url) {
    console.error('Please provide an input file path or URL.');
    process.exit(1);
}

if (url) {
    // 如果提供了URL，从远程获取并解密JSON
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
    // 读取加密后的JSON文件并解密
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the encrypted JSON file:', err);
            return;
        }

        try {
            // 解析加密的JSON内容
            const encryptedContent = JSON.parse(data).encrypted;

            if (!encryptedContent) {
                throw new Error('No encrypted content found in the JSON file.');
            }

            // 使用解密函数解密内容
            const decryptedString = decryptJson(encryptedContent, secretKey);

            // 将解密后的内容写入新的JSON文件
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

// 导出解密函数
module.exports = {
    decryptJson,
    decryptJsonFromUrl
};