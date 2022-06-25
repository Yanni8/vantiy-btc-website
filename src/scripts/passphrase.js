function getPassphrase(target){
    target.preventDefault();
    seed = document.getElementById("passphrase-input").value;
    w = new Worker("./scripts/vanity-btc-generator.js");
    w.postMessage(seed);
    w.onmessage = function(message) {
        data = message.data
        document.getElementById("private-key").innerText = data[0];
        document.getElementById("public-key").innerText = data[1];
        document.getElementById("btc-address").innerText = data[2];
        output = document.getElementById("passphrase-output");
        output.classList.remove("hidden");
    }
    
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("passphrase-form").addEventListener('submit', getPassphrase);
});

