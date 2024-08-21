const { encryptJsonFile } = require('./encrypt-json');
const { decryptJson, decryptJsonFromUrl, decryptJsonFile } = require('./decrypt-json');

module.exports = {
    encryptJsonFile,
    decryptJson,
    decryptJsonFromUrl,
    decryptJsonFile
};