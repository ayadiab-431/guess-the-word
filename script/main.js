let numOfTry = 6;
let numOfInputs,words;
let currentTry = 1;
let numOfHints = 2;
let messageArea = document.querySelector('.message');
let floatingMsg = document.querySelector('.floating-message');


let wordToGuess = "";
let wordsOfLen4 = ["love","Play","Wind","Tree","Song","Wave","Time","Home","Ring","Star","Book","Ball"];
let wordsOfLen5 = ['apple', 'bread', 'crane', 'doubt', 'flame', 'grape', 'house', 'joker', 'kneel', 'lemon'];
let wordsOfLen6 = ["Orange","Puzzle","Forest","Stream","Guitar","Rocket","Market","Laptop","Circle","Friend"];


// Choose The length O|f The Word To Play
let lengthofLetters = document.querySelectorAll('.length-of-word li');
lengthofLetters.forEach((length) => {
    length.addEventListener('click', () => {
        [numOfInputs,words] = chooselength(length);
        wordToGuess = words[Math.floor(Math.random() * words.length)];
        // console.log(wordToGuess);
        // console.log(numOfInputs); 
        genrateInputs();
        floatingMsg.style.top = "-50%";
        document.querySelector('.guess-game').style.filter = "none";
    });
});

// Function to determine the num of inputs and which list will use
function chooselength(length) {
    let len = parseInt(length.id);
    if (len === 4) {
        return [len,wordsOfLen4];
    } else if (len === 5) {
        return [len,wordsOfLen5];
    }
    else if (len === 6) {
        return [len,wordsOfLen6]; 
    }
}

// show floating message to determine length in the beginning and play again
function showFloatingMsg () {
    floatingMsg.style.top = "50%";
    document.querySelector('.guess-game').style.filter = "blur(3px)";
    clearEverything ()
}

// Function to set everthing clear when you wanna play again
function clearEverything () {
    document.querySelector('.inputs').innerHTML = "";
    checkWordBtn.disabled = false;
    hintBtn.disabled = false;
    currentTry = 1;
    numOfHints = 2;
    hintBtn.querySelector('span').innerHTML = numOfHints;
    messageArea .innerHTML = "";
}

// Generate inputs depending of num of inputs you choose
function genrateInputs () {
    let inputsConatiner = document.querySelector('.inputs');
    // Create Main Try Div
    for (let i = 1; i <= numOfTry; i++){
        let div = document.createElement('div');
        div.setAttribute(`id`,`try-${i}`);
        div.classList.add("mb-3","d-flex","align-items-center","justify-content-center");
        let span = document.createElement('span');
        span.textContent = `Try ${i}`;
        div.append(span);

        // Disable The Divs not in use

        if (i !== 1) div.classList.add(`disabled-inputs`);
        for (let j = 1; j <= numOfInputs; j++){
            let input = document.createElement('input');
            input.setAttribute('id',`guess-${i}-letter-${j}`);
            input.type = 'text';
            input.maxLength = 1;
            if (i !== 1) input.disabled = true;
            div.append(input);
        }
        inputsConatiner.appendChild(div);
    }
    inputsConatiner.children[0].children[1].focus();

    let inputs = document.querySelectorAll('input');

    // focus on the next input after type in the current
    inputs.forEach((input,index) => {
    input.addEventListener("input", function () {
        this.value = this.value.toUpperCase();
        let nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
    })

    //determine every button you tap method 
    input.addEventListener('keydown', function(event) {
        // console.log(event);
        // the index of the element you where in
        const currentIndex = Array.from(inputs).indexOf(event.target);
        // console.log(currentIndex);

        if (event.key === 'ArrowRight') {
            nextInput = currentIndex + 1;
            if (nextInput < inputs.length) inputs[nextInput].focus();
        }
        if (event.key === 'ArrowLeft') {
            prevInput = currentIndex - 1;
            if (prevInput >= 0) inputs[prevInput].focus();
        }
        // Click enter to check the word
        if (event.key === 'Enter') {
            handleGuesses();
        }

        if (event.key === "Backspace"){
            // console.log("Remove");
            if (inputs[currentIndex].value === "" && currentIndex - 1 >= 0) {
                if (!inputs[currentIndex - 1].disabled) {
                    prevIndex = currentIndex - 1;
                // console.log(inputs[prevIndex].disabled)
                if (prevIndex >= 0) {
                    inputs[prevIndex].focus();
                    inputs[prevIndex].value = "";
                    // console.log(prevIndex);
                    // console.log(currentIndex);
                };
                }
            } else if (inputs[currentIndex].value !== "" && !inputs[currentIndex].disabled) {
                inputs[currentIndex].value = "";
            }
        }

    })
})

}

let hintBtn = document.querySelector('.hint');
let checkWordBtn = document.querySelector('.check-word');
checkWordBtn.addEventListener('click', handleGuesses);

// Function to handle hint button
function getHint () {
    // Make sure that hint btn is not on focus mode
    hintBtn.blur();
    if (numOfHints > 0) {
        numOfHints--;
        hintBtn.querySelector('span').innerHTML = numOfHints;
    }
    if (numOfHints === 0){
        hintBtn.disabled = true;
    }
    // select all enabled inputs
    let enabledInputs = document.querySelectorAll('input:not([disabled])');
    // console.log(enabledInput);
    // list of empty enabled inputs
    let emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    // console.log(emptyEnabledInputs);

    if (emptyEnabledInputs.length > 0) {
        // get a random index of empty enabled inputs
        let randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        let randomInput = emptyEnabledInputs[randomIndex];
        // from enabled inputs get the index of the random input
        indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

hintBtn.addEventListener('click',getHint);

// Check The word you input
function handleGuesses() {
    
    let currentTryDiv = document.querySelector(`#try-${currentTry}`);
    // console.log(currentTryDiv);
    // console.log(wordToGuess);
    let successGuess = true;
    // console.log(currentTry);
    for (let i = 1; i <= numOfInputs; i++) {
        input = currentTryDiv.querySelector(`#guess-${currentTry}-letter-${i}`);
        // console.log(input);
        let letter = input.value.toLowerCase();
        // console.log(letter);
        // console.log(wordToGuess.charAt(i - 1));
        if (wordToGuess.charAt(i - 1).toLowerCase() === letter) {
            input.classList.add('yes-in-place');
        }
        else if (wordToGuess.includes(letter) && letter !== "") {
            // console.log(letter);
            input.classList.add('not-in-place');
            successGuess = false;
        }
        else {
            input.classList.add('wrong');
            successGuess = false;
        }
    }
    currentTryDiv.querySelectorAll('input').forEach((input) => {
        input.disabled = true;
    })
    if (!successGuess) {
        currentTryDiv.classList.add('disabled-inputs');

        currentTry++;
        
        nextTryDiv = document.querySelector(`#try-${currentTry}`);
        if (currentTry <= numOfTry) {
            nextTryDiv.classList.remove('disabled-inputs');
            nextTryDiv.querySelectorAll('input').forEach((input) => {
                input.disabled = false;
            })
            nextTryDiv.children[1].focus();
        } else {
            checkWordBtn.disabled = true;
            hintBtn.disabled = true;
            messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
            let playAgainBtn = document.createElement('button');
            playAgainBtn.textContent = "Play Again";
            playAgainBtn.classList.add('bttn','play-again');
            messageArea.append(playAgainBtn);
            playAgainBtn.addEventListener('click',showFloatingMsg);
        }
    }
    else {
        messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
        if (numOfHints === 2) {
            messageArea.innerHTML = `<p>Congratz You Didn't Use Hints</p>`;
        }
        let allTriesDiv = document.querySelectorAll('.inputs > div');
        allTriesDiv.forEach((tryDiv) => {
            tryDiv.classList.add('disabled-inputs');
        })
        checkWordBtn.disabled = true;
        hintBtn.disabled = true;
        let playAgainBtn = document.createElement('button');
        playAgainBtn.textContent = "Play Again";
        playAgainBtn.classList.add('bttn','play-again');
        messageArea.append(playAgainBtn);
        playAgainBtn.addEventListener('click',showFloatingMsg);
    }
}

window.onload = function() {
    showFloatingMsg();
}



