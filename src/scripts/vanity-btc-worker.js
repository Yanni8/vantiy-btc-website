let worker

function startWorker(target) {
    
    output = document.getElementById("vanity-output")

    if (!output.classList.contains("hidden")) {
        output.classList.add("hidden");
    }
    
    target.preventDefault();
    prefix = document.getElementById("vanity-prefix")
    regex = document.getElementById("vanity-regex")
    button = document.getElementById("generate-btc-address")
    
    if (typeof worker != 'undefined') {
        console.log("Stoping Worker")
        worker.terminate()
        regex.disabled = false
        prefix.disabled = false
        button.value = "Generate"
        worker = undefined
        return
    }

    worker = new Worker("./scripts/vanity-btc-generator.js");
    prefix.disabled = true
    regex.disabled = true
    button.value = "Stop Generating"
    worker.postMessage([prefix.value, regex.value])

    worker.onmessage = function (event) {
        ready = true;
        data = event.data;
        console.log(data)

        prefix.value = ""
        regex.value = ""
        prefix.disabled = false
        regex.disabled = false
        button.value = "Generate"
        worker = undefined

        document.getElementById("private-key").innerText = data[0]
        document.getElementById("public-key").innerText = data[1]
        document.getElementById("btc-address").innerText = data[2]
        output = document.getElementById("vanity-output")
        output.classList.remove("hidden");

    };
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('vanity-form').addEventListener('submit', startWorker);

});
