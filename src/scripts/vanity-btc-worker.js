let worker

function startWorker(target) {

    cpuCores = document.getElementById("vanity-cpu-cores").value;
    cpuInput = document.getElementById("vanity-cpu-cores");
    output = document.getElementById("vanity-output");

    if (!output.classList.contains("hidden")) {
        output.classList.add("hidden");
    }

    target.preventDefault();
    prefix = document.getElementById("vanity-prefix")
    regex = document.getElementById("vanity-regex")
    button = document.getElementById("generate-btc-address")

    if (typeof worker != 'undefined') {
        for(w of worker){
        console.log("Stoping Worker")
        w.terminate()
        }
        cpuInput.disabled = false;
        regex.disabled = false
        prefix.disabled = false
        button.value = "Generate"
        worker = undefined
        return
    }
    worker = []
    for (let i = 0; i < cpuCores; i++) {
        w = new Worker("./scripts/vanity-btc-generator.js");
        prefix.disabled = true
        regex.disabled = true
        cpuInput.disabled = true
        button.value = "Stop Generating"
        w.postMessage([prefix.value, regex.value])

        w.onmessage = function (event) {
            data = event.data;
            console.log(data)

            prefix.value = ""
            regex.value = ""
            prefix.disabled = false
            regex.disabled = false
            cpuInput.disabled = false
            button.value = "Generate"
            for(w of worker){
                w.terminate()
            }
            worker = undefined

            document.getElementById("private-key").innerText = data[0]
            document.getElementById("public-key").innerText = data[1]
            document.getElementById("btc-address").innerText = data[2]
            output = document.getElementById("vanity-output")
            output.classList.remove("hidden");

        };

        worker.push(w);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('vanity-form').addEventListener('submit', startWorker);

});
