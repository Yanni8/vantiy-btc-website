
//Validates the input field for Vanity-BTC
function inputValidatorBTC(target){
    target.target.required = true;
    for(var input of document.getElementsByClassName('vanity-btc-input')){
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

