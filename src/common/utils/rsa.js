import JSEncrypt from 'jsencrypt';
const publicKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDc7i0VItfwG/8PRZ8/AEe55QFGJMs8Zt9vNZ1VRP3Wr1NbvkhrihX6MerUOR+EbKu8hb91ue0YrLR+Lb3TBy2Ihyddwx2jCoZ2Cx67nRVaBQmWdwsOMhRviRVbOyflGdZ2oolw3b9kefK/UvuAAdLpPZzrl4FZWfm7FJrBLHyQQwIDAQAB';
const privateKey =
    'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBANzuLRUi1/Ab/w9Fnz8AR7nlAUYkyzxm3281nVVE/davU1u+SGuKFfox6tQ5H4Rsq7yFv3W57RistH4tvdMHLYiHJ13DHaMKhnYLHrudFVoFCZZ3Cw4yFG+JFVs7J+UZ1naiiXDdv2R58r9S+4AB0uk9nOuXgVlZ+bsUmsEsfJBDAgMBAAECgYBKS5I/lFsXtOJ+KUSXNCnqurdF9mOeKV4kENya6zuNsaIPrRq/h01CuPymZ5tQtha+rB+poF+6N4HvGMTILZbCveYxjfpPWHn83CPF3YXCo0coRwku9kME1SfKfsn+0dafKEpZQ0IDxVvidwAsPQIyOH8gbS7WEE3D+I4+G72YCQJBAPRIdPlfrLnS7R/P6oe5F3dktHxwcXgExTGIRCHA5peRVcdtiaOarKIl4+92KUoZdTxhA7qkD7kGf6iVyDI8ffcCQQDnhvkAbkBAijawjEaVzOJ3mYcVUJuwFV4eBcg7psrj6y/+BSczIsoiKxwCNUeyRYZrXP/8MGg/CvLF70Q/eN0VAkAeAXBs2TWsNZ5u0+ko9rFNNw98YYtuhJd8OBK2Wq14XJ++uVO4xt0BpcnTth3oPixKWFhO6qwLvCKeIJfQo+GNAkBgQP7YLP3NVyixcUAPGySzsEI2nFJ9fASq2qCKHCeRZb+IDcBkQ/xhBCcay+fIt5rQm9NYlw9f1j9kBrsK4EaZAkEA3fc4WJ7DTNpe4m3Yss9e33CHZXVrZEPmJNc8u1awVlzk7MjG2a1RH3u4rpldzXv0NhKjaeJF7LWaoUfK70HFow==';
const encrypt = new JSEncrypt();
encrypt.setPublicKey(publicKey);
encrypt.setPrivateKey(privateKey);
// 加密
export const encrypts = (str) => {
    return encrypt.encrypt(str);
};
export const decrypts = (str) => {
    return encrypt.decrypt(str);
};
