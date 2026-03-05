import CryptoJS from 'crypto-js/crypto-js';
const RES_KEY = 'Zf}0hrvX_4OeC+;jmbNF025f;]&R$"]t';
const RES_IV = 'c598Gq0YQK2QUlMA';
const KEY = CryptoJS.enc.Utf8.parse(RES_KEY);
const IV = CryptoJS.enc.Utf8.parse(RES_IV);
/**
 * AES加密 ：字符串 key iv  返回base64
 */
export const dncrypt = (word, keyStr, ivStr) => {
    let key = KEY;
    let iv = IV;

    if (keyStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
        iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    const srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
    });
    // console.log("-=-=-=-", encrypted.ciphertext)
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};
/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
export const decrypt = (word, keyStr) => {
    let key = KEY;
    let iv = IV;
    if (keyStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
    }

    const base64 = CryptoJS.enc.Base64.parse(word);
    const src = CryptoJS.enc.Base64.stringify(base64);

    var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
    });

    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
};
