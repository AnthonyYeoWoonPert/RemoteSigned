import CryptoJS from 'crypto-js';
import { KEY } from './constants';

export const encryptObject = (object: any, key: string): string => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(object), `${KEY}.${key}`).toString();
  } catch (e) {
    return null;
  }
};

export const decryptObject = (ciphertext: string, key: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, `${KEY}.${key}`);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    console.log(plaintext);

    return JSON.parse(plaintext);
  } catch (e) {
    console.log(e);

    return null;
  }
};
