const isAlphaNumeric = str => /^[a-z]+$/gi.test(str)

function readFromStorage () {
    var numGuesses = parseInt(localStorage.getItem('numGuesses'));
    var guesses = JSON.parse(localStorage.getItem('guesses'));
    var responses = JSON.parse(localStorage.getItem('responses'));
    return [numGuesses,guesses,responses];
}

function writeToStorage (numGuesses,guesses,responses) {
    localStorage.setItem('numGuesses',numGuesses);
    localStorage.setItem('guesses',JSON.stringify(guesses));
    localStorage.setItem('responses',JSON.stringify(responses));
}

class Murdle {
    
    constructor() {
        var numGuesses = 0;
        var guesses = ["","","","","",""];
        var responses = ["","","","","",""];
        if (!localStorage.getItem('readFromLocal')) { // write to localstorage
            localStorage.clear();
            writeToStorage(numGuesses,guesses,responses);                    
        }
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
                success : function (result) {
                    console.log(result);
                    console.log(result['resp']);
                    
                    var [numGuesses,guesses,responses] = readFromStorage();
                    guesses[numGuesses] = guess;
                    responses[numGuesses] = result;
                    numGuesses += 1;
                    writeToStorage(numGuesses,guesses,responses);                    
    
                    $("#hidden-input").val('');
                },
                errorr : function (result) {
                    console.log(result);
                }
            })
        }
    }

    printMurdle(guess){
        console.log("printMurdle")
        const [numGuesses,guesses,responses] = readFromStorage();
        const rows = $(".row");
        for (let i = 0; i <= numGuesses; i++){
            var currentRow = rows[i].children;
            for (let j = 0; j < currentRow.length; j++){
                if (i < numGuesses) {
                    console.log(currentRow[j])
                    currentRow[j].innerHTML = ((guesses[i])[j] || '').toUpperCase();
                    console.log(responses[i][j])
                    switch (responses[i][j]) {
                        case 'G':
                            console.log(currentRow[j])
                            currentRow[j].addClass("correct-guess-char-box");
                            break;
                        case 'Y':
                            currentRow[j].addClass("correct-guess-incorrect-placement-char-box");
                            break;
                        case 'R':
                            currentRow[j].addClass("incorrect-guess-char-box");
                            break;
                    }


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
                console.log('Enter')
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