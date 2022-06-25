A = 0n
B = 7n
P = 115792089237316195423570985008687907853269984665640564039457584007908834671663n
GX = 55066263022277343669578718895168534326250603453777594175500187360389116729240n
GY = 32670510020758816978083085130507043184471273380659243275938904335757337482424n
G = [GX, GY]
BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"



function pseudoRandomPrivateKey() {
    return CryptoJS.SHA256((Math.random() * 25e12).toString()).toString()
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
    sha256Dec = BigInt(BigInt("0x" + privateKey).toString(10));
    Q = G;
    publicKey = undefined;
    while (sha256Dec) {
        if (sha256Dec % 2n == 1n) {
            if (publicKey == undefined) {
                publicKey = Q;
            } else {
                publicKey = point_add(publicKey, Q);
            }
        }
        Q = point_dubl(Q)
        sha256Dec = sha256Dec / 2n
    }

    hex = publicKey[0].toString(16).toUpperCase();

    if (publicKey[1] % 2n == 1n) {
        return "03" + hex;
    }
    return "02" + hex;
}


function base58Check(address) {
    n = BigInt("0x" + address)
    address = ""
    while (n > 0) {
        x = n % 58n
        n = n / 58n
        address = BASE58_ALPHABET[x] + address
    }
    return address
}
function publicKeyToAddress(publicKey) {
    //Parses the public key from hex to binary data
    publicKey = CryptoJS.enc.Hex.parse(publicKey);
    publicKey = CryptoJS.RIPEMD160(CryptoJS.SHA256(publicKey));
    publicKey = "00" + publicKey.toString();
    checksum = (CryptoJS.SHA256(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(publicKey))).toString()).substring(0, 8);
    return "1" + base58Check(publicKey + checksum).replace(/^1*/, '');;
}

function generateFromSeed(seed) {
    privateKey = CryptoJS.SHA256(seed).toString();
    publicKey = privateToPubl(privateKey);
    address = publicKeyToAddress(publicKey);
    this.self.postMessage([privateKey, publicKey, address]);
}
function generateBTC(prefix, regex) {
    console.log("Generating BTC address...")
    if (regex == "") {

        searched = "1" + prefix;
        do {
            privateKey = pseudoRandomPrivateKey();
            publicKey = privateToPubl(privateKey);
            address = publicKeyToAddress(publicKey);
        } while (!address.startsWith(searched));

    } else {

        searched = regex;
        do {
            privateKey = pseudoRandomPrivateKey();
            publicKey = privateToPubl(privateKey);
            address = publicKeyToAddress(publicKey);
        } while (!address.match(searched));
    }
    this.self.postMessage([privateKey, publicKey, address]);
}

self.addEventListener("message", function (message) {
    importScripts("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js");
    data = message.data;
    if(typeof data == "string"){
        generateFromSeed(data);
        return
    }
    generateBTC(data[0], data[1]);

}, false);

function fromSeed() { }