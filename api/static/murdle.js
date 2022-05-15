const isAlphaNumeric = str => /^[a-z]+$/gi.test(str)

class Murdle {
    constructor() {
        if (!localStorage.getItem('readFromLocal')) { // write to localstorage
            localStorage.setItem('readFromLocal',true);
            localStorage.setItem('numGuesses',0);
            localStorage.setItem('guesses',JSON.stringify(["","","","","",""]));
            localStorage.setItem('responses',JSON.stringify(["","","","","",""]));
        }
        //read from localstorage
        this.numGuesses = localStorage.getItem('numGuesses')
        this.guesses = JSON.parse(localStorage.getItem('guesses'));
        this.responses = JSON.parse(localStorage.getItem('responses'));
    }
    
    evaluate(guess) {
        $.ajax({
            type : "GET",
            url : "/evaluate",
            data : { "guess" : guess},
        }).done(function (data) {
            console.log(data['resp']);
            this.numGuesses += 1;
            this.guesses.push(guess);
            this.responses.push(data);
        })
    }

    printMurdle(vals){

        const lettersOut = $(".char-box");
        for (let i = 0; i < lettersOut.length; i++){
            lettersOut[i].innerHTML = (vals[i] || '').toUpperCase();
        }
    }
}

$(document).ready(function(){
    const input = $("#hidden-input");
    const murdle = new Murdle()

    input.keydown( (event) => {
        let vals = []
        switch (true) {
            case (event.key == 'Backspace'):
                vals = input.val().slice(0,-1);
                break;
            case (event.key == 'Enter'):
                murdle.evaluate(guess=input.val());
                break;
            case (event.key.length > 1):
                vals = input.val();
                break;
            case isAlphaNumeric(event.key):
                vals = input.val() + event.key;
                break;
            default:
                event.preventDefault();
                vals = input.val();
                break;
        }
        murdle.printMurdle(vals);
    });

    


});