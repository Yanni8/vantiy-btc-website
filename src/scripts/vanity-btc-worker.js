function startWorker(target){
    target.preventDefault();
    let worker = new Worker("./scripts/vanity-btc-generator.js");
    worker.postMessage([document.getElementById("vanity-prefix").value, document.getElementById("vanity-regex").value]);

    console.log("Started Worker...")
    
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('vanity-form').addEventListener('submit', startWorker);

});
