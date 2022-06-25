
//Validates the input field for Vanity-BTC
function inputValidatorBTC(target){

    if(target.target.id == "vanity-cpu-cores"){
        return;
    }
    target.target.required = true;
    for(var input of document.getElementsByClassName('vanity-btc-input')){
        if(input.id == "vanity-cpu-cores"){
            continue;
        }
        if(input.id != target.target.id){
            input.value = "";
            input.required = false;
        }
    }


}

document.addEventListener('DOMContentLoaded', function () {
    for(var input of document.getElementsByClassName('vanity-btc-input')){
        input.addEventListener('input', inputValidatorBTC);
    }
});

