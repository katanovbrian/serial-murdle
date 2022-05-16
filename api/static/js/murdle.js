const isAlphaNumeric = str => /^[a-z]+$/gi.test(str)

class Murdle {
    
    constructor() {
        console.log('constructor');
        this.numGuesses = 0;
        this.guesses = ["","","","","",""];
        this.responses = ["","","","","",""];
        if (!localStorage.getItem('readFromLocal')) { // write to localstorage
            localStorage.setItem('readFromLocal',true);
            localStorage.setItem('numGuesses',this.numGuesses);
            localStorage.setItem('guesses',JSON.stringify(this.guesses));
            localStorage.setItem('responses',JSON.stringify(this.responses));
        }
        //read from localstorage
        this.numGuesses = localStorage.getItem('numGuesses')
        this.guesses = JSON.parse(localStorage.getItem('guesses'));
        this.responses = JSON.parse(localStorage.getItem('responses'));
    }
    
    evaluate(guess) {
        if (guess.length != $('.row')[0].children.length) {
            console.log("wrong length");
            return;
        }
        else {
            console.log("sending request")
            $.ajax({
                type : "GET",
                url : "/evaluate",
                data : { "guess" : guess},
            }).done(function (data) {
                console.log("response");
                console.log(data['resp']);

                this.numGuesses += 1;
                this.guesses[this.numGuesses] = guess;
                this.responses[this.numGuesses] = data;

                console.log(this.guesses);
                localStorage.setItem('numGuesses',this.numGuesses);
                localStorage.setItem('guesses',JSON.stringify(this.guesses));
                localStorage.setItem('responses',JSON.stringify(this.responses));

                $("#hidden-input").val('');
    
            })
        }
    }

    printMurdle(guess){
        console.log(guess.length)
        const rows = $(".row");
        for (let i = 0; i <= this.numGuesses; i++){
            var currentRow = rows[i].children;
            for (let j = 0; j < currentRow.length; j++){
                if (i < this.numGuesses) {
                    currentRow[j].innerHTML = ((this.guesses[i])[j] || '').toUpperCase();
                }
                else {
                    currentRow[j].innerHTML = (guess[j] || '').toUpperCase();
                }
            }
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
                guess=input.val();
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