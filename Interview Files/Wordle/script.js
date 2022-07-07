document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');

    
    for (let i = 0; i < 30; i++) {
        let tile = document.createElement('div');
        tile.classList.add('tiles');
        tile.setAttribute('id', i + 1);
        board.appendChild(tile);
    }
})

// ADD TIMER with point system


const keyboard = document.getElementById('keyboard');
const dictionary = Dictionary;
const WORD_LENGTH = 5;
const offsetFromDay = new Date(2022, 1, 1);
const msOffset = Date.now() - offsetFromDay;
const dayOffset = msOffset / 1000 / 60 / 60 / 24;
// const targetWord = targetWords[Math.floor(dayOffset)];

let targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];


////////////////////////////////////////////////////////////////
// When done adding words this function randomises the array //
//////////////////////////////////////////////////////////////
// const targetWord = targetWords.sort(() => Math.random() - 0.5);

console.log(dayOffset);
console.log(targetWords.length);
let id = 1;
currentTile = id;
StartInteraction();
function StartInteraction() {
    window.addEventListener('click', KeyboardClick);
    window.addEventListener('keydown', Typing);
}
function StopInteraction() {
    window.removeEventListener('click', KeyboardClick);
    window.removeEventListener('keydown', Typing);
}



function BounceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('win');
            tile.addEventListener('animationend', () => {
                tile.classList.remove('win');
            }, {once:true} )
        }, index * 100);
    });
}


function KeyboardClick(e) {
    if (e.target.matches('[data-key]')) {
        PressedKey(e.target.dataset.key);
        return
    }
    if (e.target.matches('[data-enter]')) {
        TestWord();
        return
    }
    if ( e.target.matches('[data-delete]')) {
        DeleteKey();
        return
    }
    
}
let typing;
function Typing(e) {
    if (e.key.match(/^[a-z]$/)) {
        PressedKey(e.key);
        typing = true;
        return
    }
    if (e.key.match('Enter')) {
        TestWord();
        typing = false
        return
    }
    if ( e.key.match('Backspace')) {
        DeleteKey();
        return
    }
}
let rows = 1;
function PressedKey(Key) {
    if ((
        (id - 1) % WORD_LENGTH === 0) &&
        (id > rows)
        ) return
        currentTile = document.getElementById(id);
        currentTile.innerHTML = Key;
        currentTile.classList.add('active');
        id++;
}

function TestWord() {

    // ERRORS //
    ActiveTiles = [...GetActiveTiles()]
    if (ActiveTiles.length != WORD_LENGTH) {
        shakeTiles(ActiveTiles);
        showAlert('Not Enough Letters');
        return
    }
    const guess = ActiveTiles.reduce((word, tiles) => {
        // console.log(word + tiles.innerHTML)
        return word + tiles.innerHTML
    }, "");
    if (!dictionary.includes(guess)) {
        showAlert('Not In Word List');
        shakeTiles(ActiveTiles);
        return
    }



    StopInteraction();
    ActiveTiles.forEach((...params) => flipTile(...params, guess));

    
    rows += 5;
    deleteMax += 5;
    function flipTile(tile, index, array, guess) {


        setTimeout(() => {
            tile.classList.add('flip');
        }, index * 350);

        tile.addEventListener('transitionend', () => {
            tile.classList.remove('flip');

            ActiveTiles = [...GetActiveTiles()];
            // console.log(tile.innerHTML != targetWord[index]) 


            colorTile(tile, index);
            

            if (index === array.length - 1) {
                tile.addEventListener('transitionend', () => {
                    StartInteraction();
                    checkWinLose(guess, tile);
                }, {once: true})
            }
        }, {once: true})
    }
}
let isGreen = false;
function colorTile(tile, index) {
    const letter = tile.innerHTML;
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)

    if (targetWord[index] === letter) {


        tile.classList.add('correct');
        key.classList.add('correct');
        return
    }

    else if (targetWord.includes(letter)) {
        checkGreen(letter);

        if (isGreen === false) {
        tile.classList.add('wrong-location');
        } else if (isGreen === true) {
            tile.classList.add('incorrect');
            key.classList.add('incorrect');
            console.log(tile)
            console.log(isGreen)
        }
    } 
    else if (!targetWord.includes(letter) || (
            (tile.innerHTML != targetWord[index])
    )) {

        tile.classList.add('incorrect');
        key.classList.add('incorrect');
    }
}
let greenLetter ;
function checkGreen(letter) {
    ActiveTiles.forEach(tile => {
        if (tile.classList.contains('correct')) {
            greenLetter = tile.innerHTML;
            if (letter === greenLetter) {
                isGreen = true;
            } else {
                isGreen = false;
            }
        }
    })
}
function showAlert(message, duration = 1000) {
    const Alert = document.createElement('div');
    Alert.textContent = message;
    Alert.classList.add('alert');
    document.getElementById('alert-container').prepend(Alert)
    if (duration === null) return
    setTimeout(() => {
        Alert.classList.add('hide');
        Alert.addEventListener('transitionend', () => {
            Alert.remove();
        })
    }, duration);
}
function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add('shake');
        tile.addEventListener('animationend', () => {
            tile.classList.remove('shake');
        }, {once:true} )
    })
}
let deleteMax = 1;
function DeleteKey() {
    // if (((id - 1) % 5 === 0)){
    //     if (id > 1) {
        if (id >= deleteMax + 1) {
            id--;
            currentTile = document.getElementById(id);
            currentTile.innerHTML = '';
            currentTile.classList.remove('active');
        }
    //     }
    // }
}
function GetActiveTiles() {
    return document.querySelectorAll('.active');
}
let selected;
// SELECT CERTAIN TILE
window.addEventListener('click', (e) => {
    ActiveTiles =[...GetActiveTiles()]
    if (e.target.classList.contains('active')) {
        selected = e.target.id;
        id = selected;
        id++

        // console.log(ActiveTiles);
        // console.log(e.target);
    }
})


const statScreen = document.getElementById('StatScreen');
const playAgain = document.getElementById('playAgain');

function checkWinLose(guess) {

    if (guess === targetWord) {
        let win = true;
        Win(win);
        return
    } else if (id === 31) {
        let win = false;
        Lose(win);
    }
    ActiveTiles.forEach(tile => {
        tile.classList.remove('active');
    })
}

function Lose(win) {
    showAlert('You Lose, the word was ' + targetWord, 4000);
}
function Win(win) {
    if (id === 31) {
        showAlert('Phew', 5000)
    } else {
    showAlert('YOU WIN', 5000);
    }
    Statistics(win);

    BounceTiles(ActiveTiles);
    StopInteraction();
}

let graphDis1 = 0;
let graphDis2 = 0;
let graphDis3 = 0;
let graphDis4 = 0;
let graphDis5 = 0;
let graphDis6 = 0;
let numGuesses1 = document.getElementById('numGuesses1')
let numGuesses2 = document.getElementById('numGuesses2')
let numGuesses3 = document.getElementById('numGuesses3')
let numGuesses4 = document.getElementById('numGuesses4')
let numGuesses5 = document.getElementById('numGuesses5')
let numGuesses6 = document.getElementById('numGuesses6')
playAgain.addEventListener('click', function() {
    console.log('clicked')
    statScreen.style.display = 'none';
    const ALLTILES = document.getElementsByClassName('tiles');
    const key = document.getElementsByClassName('key');
    // const ALLTILES = document.getElementById('1');
    for (let i = 0; i < ALLTILES.length; i++) {
        ALLTILES[i].innerHTML = '';
        ALLTILES[i].classList.remove('active');
        ALLTILES[i].classList.remove('correct');
        ALLTILES[i].classList.remove('incorrect');
        ALLTILES[i].classList.remove('wrong-location');
        for (let j = 0; j < key.length; j++) {
            key[j].classList.remove('active');
            key[j].classList.remove('correct');
            key[j].classList.remove('incorrect');
            key[j].classList.remove('wrong-location');
        }
        
        StartInteraction();
        targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];
        id = 1;
        deleteMax = 1;
    }
})

let totalPlayed = 0;
let winAmount = 0;
let finalWinPerc = 0;
let currenStreak = 0;
let maximumStreak = 0;

function Statistics(win) {
    setTimeout(() => {
        statScreen.style.display = 'flex';
        
    }, 1000);


    totalplays = document.getElementById('totalplays');
    winPerc = document.getElementById('winPerc');
    currStreak = document.getElementById('currStreak');
    maxStreak = document.getElementById('maxStreak');



    totalPlayed++;
    if (win) {
        currenStreak++;
        maximumStreak++;
        winAmount++;

        if (id === 6) {
            graphDis1++;
            numGuesses1.innerHTML = graphDis1;
        }
        if (id === 11) {
            graphDis2++;
            numGuesses2.innerHTML = graphDis2;
        }
        if (id === 16) {
            graphDis3++;
            numGuesses3.innerHTML = graphDis3;
        }
        if (id === 21) {
            graphDis4++;
            numGuesses4.innerHTML = graphDis4;
        }
        if (id === 26) {
            graphDis5++;
            numGuesses5.innerHTML = graphDis5;
        }
        if (id === 31) {
            graphDis6++;
            numGuesses6.innerHTML = graphDis6;
        }


        let graphMax = Math.max(graphDis1, graphDis2, graphDis3, graphDis4, graphDis5, graphDis6);

        let dis1 = graphDis1 / graphMax;
        document.getElementById('graph1').style.width = dis1 * 100 + '%';
        let dis2 = graphDis2 / graphMax;
        document.getElementById('graph2').style.width = dis2 * 100 + '%';
        let dis3 = graphDis3 / graphMax;
        document.getElementById('graph3').style.width = dis3 * 100 + '%';
        let dis4 = graphDis4 / graphMax;
        document.getElementById('graph4').style.width = dis4 * 100 + '%';
        let dis5 = graphDis5 / graphMax;
        document.getElementById('graph5').style.width = dis5 * 100 + '%';
        let dis6 = graphDis6 / graphMax;
        document.getElementById('graph6').style.width = dis6 * 100 + '%';

    } else {
        currenStreak = 0;
    }
    finalWinPerc = (winAmount/totalPlayed) * 100;

    totalplays.innerHTML = totalPlayed;
    winPerc.innerHTML = Math.floor(finalWinPerc);
    currStreak.innerHTML = currenStreak;
    maxStreak.innerHTML = maximumStreak;

}