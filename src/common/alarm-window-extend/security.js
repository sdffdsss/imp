/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/* Barrett.js */
// BarrettMu, a class for performing Barrett modular reduction computations in
// JavaScript.
//
// Requires BigInt.js.
//
// Copyright 2004-2005 David Shapiro.
//
// You may use, re-use, abuse, copy, and modify this code to your liking, but
// please keep this header.
//
// Thanks!
//
// Dave Shapiro
// dave@ohdave.com

function BarrettMu(m) {
    this.modulus = biCopy(m);
    this.k = biHighIndex(this.modulus) + 1;
    const b2k = new BigInt();
    b2k.digits[2 * this.k] = 1; // b2k = b^(2k)
    this.mu = biDivide(b2k, this.modulus);
    this.bkplus1 = new BigInt();
    this.bkplus1.digits[this.k + 1] = 1; // bkplus1 = b^(k+1)
    this.modulo = BarrettMu_modulo;
    this.multiplyMod = BarrettMu_multiplyMod;
    this.powMod = BarrettMu_powMod;
}

function BarrettMu_modulo(x) {
    const q1 = biDivideByRadixPower(x, this.k - 1);
    const q2 = biMultiply(q1, this.mu);
    const q3 = biDivideByRadixPower(q2, this.k + 1);
    const r1 = biModuloByRadixPower(x, this.k + 1);
    const r2term = biMultiply(q3, this.modulus);
    const r2 = biModuloByRadixPower(r2term, this.k + 1);
    let r = biSubtract(r1, r2);
    if (r.isNeg) {
        r = biAdd(r, this.bkplus1);
    }
    let rgtem = biCompare(r, this.modulus) >= 0;
    while (rgtem) {
        r = biSubtract(r, this.modulus);
        rgtem = biCompare(r, this.modulus) >= 0;
    }
    return r;
}

function BarrettMu_multiplyMod(x, y) {
    /*
	x = this.modulo(x);
	y = this.modulo(y);
	*/
    const xy = biMultiply(x, y);
    return this.modulo(xy);
}

function BarrettMu_powMod(x, y) {
    let result = new BigInt();
    result.digits[0] = 1;
    let a = x;
    let k = y;
    while (true) {
        if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
        k = biShiftRight(k, 1);
        if (k.digits[0] == 0 && biHighIndex(k) == 0) break;
        a = this.multiplyMod(a, a);
    }
    return result;
}

/* BigInt.js */

// BigInt, a suite of routines for performing multiple-precision arithmetic in
// JavaScript.
//
// Copyright 1998-2005 David Shapiro.
//
// You may use, re-use, abuse,
// copy, and modify this code to your liking, but please keep this header.
// Thanks!
//
// Dave Shapiro
// dave@ohdave.com

// IMPORTANT THING: Be sure to set maxDigits according to your precision
// needs. Use the setMaxDigits() function to do this. See comments below.
//
// Tweaked by Ian Bunning
// Alterations:
// Fix bug in function biFromHex(s) to allow
// parsing of strings of length != 0 (mod 4)

// Changes made by Dave Shapiro as of 12/30/2004:
//
// The BigInt() constructor doesn't take a string anymore. If you want to
// create a BigInt from a string, use biFromDecimal() for base-10
// representations, biFromHex() for base-16 representations, or
// biFromString() for base-2-to-36 representations.
//
// biFromArray() has been removed. Use biCopy() instead, passing a BigInt
// instead of an array.
//
// The BigInt() constructor now only constructs a zeroed-out array.
// Alternatively, if you pass <true>, it won't construct any array. See the
// biCopy() method for an example of this.
//
// Be sure to set maxDigits depending on your precision needs. The default
// zeroed-out array ZERO_ARRAY is constructed inside the setMaxDigits()
// function. So use this function to set the variable. DON'T JUST SET THE
// VALUE. USE THE FUNCTION.
//
// ZERO_ARRAY exists to hopefully speed up construction of BigInts(). By
// precalculating the zero array, we can just use slice(0) to make copies of
// it. Presumably this calls faster native code, as opposed to setting the
// elements one at a time. I have not done any timing tests to verify this
// claim.

// Max number = 10^16 - 2 = 9999999999999998;
//               2^53     = 9007199254740992;

// const biRadixBase = 2;
const biRadixBits = 16;
const bitsPerDigit = biRadixBits;
const biRadix = 1 << 16; // = 2^16 = 65536
const biHalfRadix = biRadix >>> 1;
const biRadixSquared = biRadix * biRadix;
const maxDigitVal = biRadix - 1;
// const maxInteger = 9999999999999998;

// maxDigits:
// Change this to accommodate your largest number size. Use setMaxDigits()
// to change it!
//
// In general, if you're working with numbers of size N bits, you'll need 2*N
// bits of storage. Each digit holds 16 bits. So, a 1024-bit key will need
//
// 1024 * 2 / 16 = 128 digits of storage.
//

let maxDigits;
let ZERO_ARRAY;
let bigZero;
let bigOne;

export const setMaxDigits = (value) => {
    maxDigits = value;
    ZERO_ARRAY = new Array(maxDigits);
    for (let iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
    bigZero = new BigInt();
    bigOne = new BigInt();
    bigOne.digits[0] = 1;
};

setMaxDigits(20);

// The maximum number of digits in base 10 you can convert to an
// integer without JavaScript throwing up on you.
// const dpl10 = 15;
// lr10 = 10 ^ dpl10
// const lr10 = biFromNumber(1000000000000000);

function BigInt(flag) {
    if (typeof flag === 'boolean' && flag == true) {
        this.digits = null;
    } else {
        this.digits = ZERO_ARRAY.slice(0);
    }
    this.isNeg = false;
}

// function biFromDecimal(s) {
//     const isNeg = s.charAt(0) == '-';
//     let i = isNeg ? 1 : 0;
//     let result;
//     // Skip leading zeros.
//     while (i < s.length && s.charAt(i) == '0') ++i;
//     if (i == s.length) {
//         result = new BigInt();
//     } else {
//         const digitCount = s.length - i;
//         let fgl = digitCount % dpl10;
//         if (fgl == 0) fgl = dpl10;
//         result = biFromNumber(Number(s.substr(i, fgl)));
//         i += fgl;
//         while (i < s.length) {
//             result = biAdd(biMultiply(result, lr10), biFromNumber(Number(s.substr(i, dpl10))));
//             i += dpl10;
//         }
//         result.isNeg = isNeg;
//     }
//     return result;
// }

function biCopy(bi) {
    const result = new BigInt(true);
    result.digits = bi.digits.slice(0);
    result.isNeg = bi.isNeg;
    return result;
}

// function biFromNumber(i) {
//     const result = new BigInt();
//     result.isNeg = i < 0;
//     i = Math.abs(i);
//     let j = 0;
//     while (i > 0) {
//         result.digits[j++] = i & maxDigitVal;
//         i = Math.floor(i / biRadix);
//     }
//     return result;
// }

function reverseStr(s) {
    let result = '';
    for (let i = s.length - 1; i > -1; --i) {
        result += s.charAt(i);
    }
    return result;
}

const hexatrigesimalToChar = new Array(
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
);

function biToString(x, radix) {
    // 2 <= radix <= 36
    const b = new BigInt();
    b.digits[0] = radix;
    let qr = biDivideModulo(x, b);
    let result = hexatrigesimalToChar[qr[1].digits[0]];
    while (biCompare(qr[0], bigZero) == 1) {
        qr = biDivideModulo(qr[0], b);
        // const digit = qr[1].digits[0];
        result += hexatrigesimalToChar[qr[1].digits[0]];
    }
    return (x.isNeg ? '-' : '') + reverseStr(result);
}

// function biToDecimal(x) {
//     const b = new BigInt();
//     b.digits[0] = 10;
//     let qr = biDivideModulo(x, b);
//     let result = String(qr[1].digits[0]);
//     while (biCompare(qr[0], bigZero) == 1) {
//         qr = biDivideModulo(qr[0], b);
//         result += String(qr[1].digits[0]);
//     }
//     return (x.isNeg ? '-' : '') + reverseStr(result);
// }

const hexToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');

function digitToHex(n) {
    const mask = 0xf;
    let result = '';
    for (let i = 0; i < 4; ++i) {
        result += hexToChar[n & mask];
        n >>>= 4;
    }
    return reverseStr(result);
}

function biToHex(x) {
    let result = '';
    // const n = biHighIndex(x);
    for (let i = biHighIndex(x); i > -1; --i) {
        result += digitToHex(x.digits[i]);
    }
    return result;
}

function charToHex(c) {
    const ZERO = 48;
    const NINE = ZERO + 9;
    const littleA = 97;
    const littleZ = littleA + 25;
    const bigA = 65;
    const bigZ = 65 + 25;
    let result;

    if (c >= ZERO && c <= NINE) {
        result = c - ZERO;
    } else if (c >= bigA && c <= bigZ) {
        result = 10 + c - bigA;
    } else if (c >= littleA && c <= littleZ) {
        result = 10 + c - littleA;
    } else {
        result = 0;
    }
    return result;
}

function hexToDigit(s) {
    let result = 0;
    const sl = Math.min(s.length, 4);
    for (let i = 0; i < sl; ++i) {
        result <<= 4;
        result |= charToHex(s.charCodeAt(i));
    }
    return result;
}

function biFromHex(s) {
    const result = new BigInt();
    const sl = s.length;
    for (let i = sl, j = 0; i > 0; i -= 4, ++j) {
        result.digits[j] = hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
    }
    return result;
}

// function biFromString(s, radix) {
//     const isNeg = s.charAt(0) == '-';
//     const istop = isNeg ? 1 : 0;
//     let result = new BigInt();
//     let place = new BigInt();
//     place.digits[0] = 1; // radix^0
//     for (let i = s.length - 1; i >= istop; i--) {
//         const c = s.charCodeAt(i);
//         const digit = charToHex(c);
//         const biDigit = biMultiplyDigit(place, digit);
//         result = biAdd(result, biDigit);
//         place = biMultiplyDigit(place, radix);
//     }
//     result.isNeg = isNeg;
//     return result;
// }

// function biDump(b) {
//     return (b.isNeg ? '-' : '') + b.digits.join(' ');
// }

function biAdd(x, y) {
    let result;

    if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = biSubtract(x, y);
        y.isNeg = !y.isNeg;
    } else {
        result = new BigInt();
        let c = 0;
        let n;
        for (let i = 0; i < x.digits.length; ++i) {
            n = x.digits[i] + y.digits[i] + c;
            result.digits[i] = n % biRadix;
            c = Number(n >= biRadix);
        }
        result.isNeg = x.isNeg;
    }
    return result;
}

function biSubtract(x, y) {
    let result;
    if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = biAdd(x, y);
        y.isNeg = !y.isNeg;
    } else {
        result = new BigInt();
        let n;
        let c;
        c = 0;
        for (let i = 0; i < x.digits.length; ++i) {
            n = x.digits[i] - y.digits[i] + c;
            result.digits[i] = n % biRadix;
            // Stupid non-conforming modulus operation.
            if (result.digits[i] < 0) result.digits[i] += biRadix;
            c = 0 - Number(n < 0);
        }
        // Fix up the negative sign, if any.
        if (c == -1) {
            c = 0;
            for (let i = 0; i < x.digits.length; ++i) {
                n = 0 - result.digits[i] + c;
                result.digits[i] = n % biRadix;
                // Stupid non-conforming modulus operation.
                if (result.digits[i] < 0) result.digits[i] += biRadix;
                c = 0 - Number(n < 0);
            }
            // Result is opposite sign of arguments.
            result.isNeg = !x.isNeg;
        } else {
            // Result is same sign.
            result.isNeg = x.isNeg;
        }
    }
    return result;
}

function biHighIndex(x) {
    let result = x.digits.length - 1;
    while (result > 0 && x.digits[result] == 0) --result;
    return result;
}

function biNumBits(x) {
    const n = biHighIndex(x);
    let d = x.digits[n];
    const m = (n + 1) * bitsPerDigit;
    let result;
    for (result = m; result > m - bitsPerDigit; --result) {
        if ((d & 0x8000) != 0) break;
        d <<= 1;
    }
    return result;
}

function biMultiply(x, y) {
    const result = new BigInt();
    let c;
    const n = biHighIndex(x);
    const t = biHighIndex(y);
    // let u;
    let uv;
    let k;

    for (let i = 0; i <= t; ++i) {
        c = 0;
        k = i;
        for (let j = 0; j <= n; ++j, ++k) {
            uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
            result.digits[k] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
            // c = Math.floor(uv / biRadix);
        }
        result.digits[i + n + 1] = c;
    }
    // Someone give me a logical xor, please.
    result.isNeg = x.isNeg != y.isNeg;
    return result;
}

function biMultiplyDigit(x, y) {
    let n;
    let c;
    let uv;

    const result = new BigInt();
    // eslint-disable-next-line prefer-const
    n = biHighIndex(x);
    c = 0;
    for (let j = 0; j <= n; ++j) {
        uv = result.digits[j] + x.digits[j] * y + c;
        result.digits[j] = uv & maxDigitVal;
        c = uv >>> biRadixBits;
        // c = Math.floor(uv / biRadix);
    }
    result.digits[1 + n] = c;
    return result;
}

function arrayCopy(src, srcStart, dest, destStart, n) {
    const m = Math.min(srcStart + n, src.length);
    for (let i = srcStart, j = destStart; i < m; ++i, ++j) {
        dest[j] = src[i];
    }
}

const highBitMasks = new Array(
    0x0000,
    0x8000,
    0xc000,
    0xe000,
    0xf000,
    0xf800,
    0xfc00,
    0xfe00,
    0xff00,
    0xff80,
    0xffc0,
    0xffe0,
    0xfff0,
    0xfff8,
    0xfffc,
    0xfffe,
    0xffff,
);

function biShiftLeft(x, n) {
    const digitCount = Math.floor(n / bitsPerDigit);
    const result = new BigInt();
    arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
    const bits = n % bitsPerDigit;
    const rightBits = bitsPerDigit - bits;
    let i = result.digits.length - 1;
    let i1 = i - 1;
    for (; i > 0; --i, --i1) {
        result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) | ((result.digits[i1] & highBitMasks[bits]) >>> rightBits);
    }
    // result.digits[0] = (result.digits[i] << bits) & maxDigitVal;
    result.isNeg = x.isNeg;
    return result;
}

const lowBitMasks = new Array(
    0x0000,
    0x0001,
    0x0003,
    0x0007,
    0x000f,
    0x001f,
    0x003f,
    0x007f,
    0x00ff,
    0x01ff,
    0x03ff,
    0x07ff,
    0x0fff,
    0x1fff,
    0x3fff,
    0x7fff,
    0xffff,
);

function biShiftRight(x, n) {
    const digitCount = Math.floor(n / bitsPerDigit);
    const result = new BigInt();
    arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
    const bits = n % bitsPerDigit;
    const leftBits = bitsPerDigit - bits;
    for (let i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
        result.digits[i] = (result.digits[i] >>> bits) | ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
    }
    result.digits[result.digits.length - 1] >>>= bits;
    result.isNeg = x.isNeg;
    return result;
}

function biMultiplyByRadixPower(x, n) {
    const result = new BigInt();
    arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
    return result;
}

function biDivideByRadixPower(x, n) {
    const result = new BigInt();
    arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
    return result;
}

function biModuloByRadixPower(x, n) {
    const result = new BigInt();
    arrayCopy(x.digits, 0, result.digits, 0, n);
    return result;
}

function biCompare(x, y) {
    if (x.isNeg != y.isNeg) {
        return 1 - 2 * Number(x.isNeg);
    }
    for (let i = x.digits.length - 1; i >= 0; --i) {
        if (x.digits[i] != y.digits[i]) {
            if (x.isNeg) {
                return 1 - 2 * Number(x.digits[i] > y.digits[i]);
            }
            return 1 - 2 * Number(x.digits[i] < y.digits[i]);
        }
    }
    return 0;
}

function biDivideModulo(x, y) {
    let nb = biNumBits(x);
    let tb = biNumBits(y);
    const origYIsNeg = y.isNeg;
    let q;
    let r;
    if (nb < tb) {
        // |x| < |y|
        if (x.isNeg) {
            q = biCopy(bigOne);
            q.isNeg = !y.isNeg;
            x.isNeg = false;
            y.isNeg = false;
            r = biSubtract(y, x);
            // Restore signs, 'cause they're references.
            x.isNeg = true;
            y.isNeg = origYIsNeg;
        } else {
            q = new BigInt();
            r = biCopy(x);
        }
        return new Array(q, r);
    }

    q = new BigInt();
    r = x;

    // Normalize Y.
    let t = Math.ceil(tb / bitsPerDigit) - 1;
    let lambda = 0;
    while (y.digits[t] < biHalfRadix) {
        y = biShiftLeft(y, 1);
        ++lambda;
        ++tb;
        t = Math.ceil(tb / bitsPerDigit) - 1;
    }
    // Shift r over to keep the quotient constant. We'll shift the
    // remainder back at the end.
    r = biShiftLeft(r, lambda);
    nb += lambda; // Update the bit count for x.
    const n = Math.ceil(nb / bitsPerDigit) - 1;

    let b = biMultiplyByRadixPower(y, n - t);
    while (biCompare(r, b) != -1) {
        ++q.digits[n - t];
        r = biSubtract(r, b);
    }
    for (let i = n; i > t; --i) {
        const ri = i >= r.digits.length ? 0 : r.digits[i];
        const ri1 = i - 1 >= r.digits.length ? 0 : r.digits[i - 1];
        const ri2 = i - 2 >= r.digits.length ? 0 : r.digits[i - 2];
        const yt = t >= y.digits.length ? 0 : y.digits[t];
        const yt1 = t - 1 >= y.digits.length ? 0 : y.digits[t - 1];
        if (ri == yt) {
            q.digits[i - t - 1] = maxDigitVal;
        } else {
            q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
        }

        let c1 = q.digits[i - t - 1] * (yt * biRadix + yt1);
        let c2 = ri * biRadixSquared + (ri1 * biRadix + ri2);
        while (c1 > c2) {
            --q.digits[i - t - 1];
            c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
            c2 = ri * biRadix * biRadix + (ri1 * biRadix + ri2);
        }

        b = biMultiplyByRadixPower(y, i - t - 1);
        r = biSubtract(r, biMultiplyDigit(b, q.digits[i - t - 1]));
        if (r.isNeg) {
            r = biAdd(r, b);
            --q.digits[i - t - 1];
        }
    }
    r = biShiftRight(r, lambda);
    // Fiddle with the signs and stuff to make sure that 0 <= r < y.
    q.isNeg = x.isNeg != origYIsNeg;
    if (x.isNeg) {
        if (origYIsNeg) {
            q = biAdd(q, bigOne);
        } else {
            q = biSubtract(q, bigOne);
        }
        y = biShiftRight(y, lambda);
        r = biSubtract(y, r);
    }
    // Check for the unbelievably stupid degenerate case of r == -0.
    if (r.digits[0] == 0 && biHighIndex(r) == 0) r.isNeg = false;

    return new Array(q, r);
}

function biDivide(x, y) {
    return biDivideModulo(x, y)[0];
}

// function biModulo(x, y) {
//     return biDivideModulo(x, y)[1];
// }

// function biMultiplyMod(x, y, m) {
//     return biModulo(biMultiply(x, y), m);
// }

// function biPow(x, y) {
//     let result = bigOne;
//     let a = x;
//     while (true) {
//         if ((y & 1) != 0) result = biMultiply(result, a);
//         y >>= 1;
//         if (y == 0) break;
//         a = biMultiply(a, a);
//     }
//     return result;
// }

// function biPowMod(x, y, m) {
//     let result = bigOne;
//     let a = x;
//     let k = y;
//     while (true) {
//         if ((k.digits[0] & 1) != 0) result = biMultiplyMod(result, a, m);
//         k = biShiftRight(k, 1);
//         if (k.digits[0] == 0 && biHighIndex(k) == 0) break;
//         a = biMultiplyMod(a, a, m);
//     }
//     return result;
// }

/* RSA.js */
// RSA, a suite of routines for performing RSA public-key computations in
// JavaScript.
//
// Requires BigInt.js and Barrett.js.
//
// Copyright 1998-2005 David Shapiro.
//
// You may use, re-use, abuse, copy, and modify this code to your liking, but
// please keep this header.
//
// Thanks!
//
// Dave Shapiro
// dave@ohdave.com

export function RSAKeyPair(encryptionExponent, decryptionExponent, modulus) {
    this.e = biFromHex(encryptionExponent);
    this.d = biFromHex(decryptionExponent);
    this.m = biFromHex(modulus);

    // We can do two bytes per digit, so
    // chunkSize = 2 * (number of digits in modulus - 1).
    // Since biHighIndex returns the high index, not the number of digits, 1 has
    // already been subtracted.
    // this.chunkSize = 2 * biHighIndex(this.m);

    /// /////////////////////////////// TYF
    this.digitSize = 2 * biHighIndex(this.m) + 2;
    this.chunkSize = this.digitSize - 11; // maximum, anything lower is fine
    /// /////////////////////////////// TYF

    this.radix = 16;
    this.barrett = new BarrettMu(this.m);
}

// function twoDigit(n) {
//     return (n < 10 ? '0' : '') + String(n);
// }

export function encryptedString(key, s) {
    // Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
    // string after it has been converted to an array. This fixes an
    // incompatibility with Flash MX's ActionScript.
    // Altered by Tang Yu Feng for interoperability with Microsoft's
    // RSACryptoServiceProvider implementation.
    /// /////////////////////////////// TYF
    if (key.chunkSize > key.digitSize - 11) {
        return 'Error';
    }
    /// /////////////////////////////// TYF

    const a = new Array();
    const sl = s.length;

    let i = 0;
    while (i < sl) {
        a[i] = s.charCodeAt(i);
        i++;
    }

    // while (a.length % key.chunkSize != 0) {
    //	a[i++] = 0;
    // }

    const al = a.length;
    let result = '';
    let j;
    let k;
    let block;
    for (i = 0; i < al; i += key.chunkSize) {
        block = new BigInt();
        j = 0;

        // for (k = i; k < i + key.chunkSize; ++j) {
        //	block.digits[j] = a[k++];
        //	block.digits[j] += a[k++] << 8;
        // }

        /// /////////////////////////////// TYF
        // Add PKCS#1 v1.5 padding
        // 0x00 || 0x02 || PseudoRandomNonZeroBytes || 0x00 || Message
        // Variable a before padding must be of at most digitSize-11
        // That is for 3 marker bytes plus at least 8 random non-zero bytes
        let x;
        const msgLength = i + key.chunkSize > al ? al % key.chunkSize : key.chunkSize;

        // Variable b with 0x00 || 0x02 at the highest index.
        const b = new Array();
        for (x = 0; x < msgLength; x++) {
            b[x] = a[i + msgLength - 1 - x];
        }
        b[msgLength] = 0; // marker
        const paddedSize = Math.max(8, key.digitSize - 3 - msgLength);

        for (x = 0; x < paddedSize; x++) {
            // b[msgLength + 1 + x] = Math.floor(Math.random() * 254) + 1; // [1,255]
            b[msgLength + 1 + x] = Math.floor((window.crypto || window.msCrypto) * 254) + 1; // [1,255]
        }
        // It can be asserted that msgLength+paddedSize == key.digitSize-3
        b[key.digitSize - 2] = 2; // marker
        b[key.digitSize - 1] = 0; // marker

        for (k = 0; k < key.digitSize; ++j) {
            block.digits[j] = b[k++];
            block.digits[j] += b[k++] << 8;
        }
        /// /////////////////////////////// TYF

        const crypt = key.barrett.powMod(block, key.e);
        const text = key.radix == 16 ? biToHex(crypt) : biToString(crypt, key.radix);
        result += `${text} `;
    }
    return result.substring(0, result.length - 1); // Remove last space.
}

// function decryptedString(key, s) {
//     const blocks = s.split(' ');
//     let result = '';
//     let i; let j; let block;
//     for (i = 0; i < blocks.length; ++i) {
//         let bi;
//         if (key.radix == 16) {
//             bi = biFromHex(blocks[i]);
//         } else {
//             bi = biFromString(blocks[i], key.radix);
//         }
//         block = key.barrett.powMod(bi, key.d);
//         for (j = 0; j <= biHighIndex(block); ++j) {
//             result += String.fromCharCode(block.digits[j] & 255, block.digits[j] >> 8);
//         }
//     }
//     // Remove trailing null, if any.
//     if (result.charCodeAt(result.length - 1) == 0) {
//         result = result.substring(0, result.length - 1);
//     }
//     return result;
// }
