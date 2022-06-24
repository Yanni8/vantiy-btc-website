A = 0n
B = 7n
P = 115792089237316195423570985008687907853269984665640564039457584007908834671663n
GX = 55066263022277343669578718895168534326250603453777594175500187360389116729240n
GY = 32670510020758816978083085130507043184471273380659243275938904335757337482424n
G = [GX, GY]
import {binary_to_base58} from base58

function pseudoRandomPrivateKey() {
    return CryptoJS.SHA256((Math.random() * 25e12).toString() + (Math.random() * 250e12).toString()).toString()
}

function point_dubl(p1) {
    lam = BigInt((3n * p1[0] * p1[0] + A) * inverseMod(2n * p1[1], P))
    v = (p1[1] - lam * p1[0]) % P
    x = (lam * lam - 2n * p1[0]) % P
    y = BigInt(lam * x + v) * -1n
    return [x, ((y % P) + P) % P];

}

function point_add(p1, p2) {
    if (p1 != p2) {
        lam = BigInt(p1[1] - p2[1]) * BigInt(inverseMod(p1[0] - p2[0], P))
        x = (lam * lam - p1[0] - p2[0]) % P
        y = (lam * (p1[0] - x) - p1[1])
        return [x, ((y % P) + P) % P];
    }
    return point_dubl(p1)
}

function inverseMod(a, m) {
    a = ((a % m) + m) % m
    let m0 = m
    let y = 0n;
    let x = 1n;

    while (a > 1) {
        let q = BigInt(a / m);
        let t = m;

        m = a % m;
        a = t;
        t = y;

        y = x - q * y;
        x = t;
    }

    if (x < 0) {
        x += m0;
    }

    return x;

}

function privateToPubl(privateKey) {
    var sha256Dec = BigInt(BigInt("0x" + privateKey).toString(10))
    Q = G
    publicKey = undefined;
    while (sha256Dec) {
        if (sha256Dec % 2n == 1n) {
            if (publicKey == undefined) {
                publicKey = Q
            } else {
                publicKey = point_add(publicKey, Q)
            }
        }
        Q = point_dubl(Q)
        sha256Dec = sha256Dec / 2n
    }

    hex = publicKey[0].toString(16);

    if (publicKey[1] % 2n == 1n) {
        return "03" + hex;
    }
    return "02" + hex;
}



function publicKeyToAddress(publicKey) {
    sha256 = CryptoJS.SHA256(publicKey).toString()
    address = CryptoJS.RIPEMD160(sha256).toString()
    binary_to_base58(address)
    return address
}

function generateBTC() {
    for (element of document.getElementsByClassName("vanity-btc-input")) {
        prefix = element.value;
        if (element.value != undefined) {
            found = false;
            console.log(prefix)
            while (!found) {
                let privateKey = pseudoRandomPrivateKey();
                publicKey = privateToPubl(privateKey);
                let adress = publicKeyToAddress(publicKey);
                console.log(privateKey, adress);
                if (adress.startsWith(prefix)) {
                    found = true;
                }

            }
        }
    }

}

document.addEventListener('DOMContentLoaded', function () {
    p = pseudoRandomPrivateKey();
    publicKey = privateToPubl(p);
    console.log(p, publicKey.toUpperCase());
    document.getElementById('generate-btc-address').addEventListener('click', generateBTC);
})

