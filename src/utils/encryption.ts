import * as CryptoJS from 'crypto-js';

const deriveKeyFromPassphrase = (passphrase: string): string => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
  return CryptoJS.PBKDF2(passphrase, salt, {
    keySize: 256 / 32,
    iterations: 100000
  }).toString();
}

const encryptData = (data: string, passphrase: string): string => {
  const hash = CryptoJS.HmacSHA256(data, passphrase).toString(CryptoJS.enc.Base64);
  return hash;
}

const decryptData = (encryptedData: string, passphrase: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const encryptDataWithPhrase = (data: string, passphrase: string): string => {
  const key = CryptoJS.SHA256(passphrase);
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  const encryptedData = `${CryptoJS.enc.Base64.stringify(iv)}:${encrypted.ciphertext.toString(CryptoJS.enc.Base64)}`;
  return encryptedData;
}

export {
  deriveKeyFromPassphrase,
  encryptData,
  decryptData,
  encryptDataWithPhrase
}
