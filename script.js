var originalBoard; /*Array of the table*/
const humanPlayer = 'X';
const AIPlayer = 'O';
const winningCombos = [ /*Array with arrays*/
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const cells = document.querySelectorAll('.cell'); /*Will store the cells of the table*/

startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none" /*When we click the replay button, the board announcing the winner or the draw will disappear again*/
    originalBoard = Array.from(Array(9).keys())
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = ''; /*Will empty the table when we click the button replay*/
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){ /*Take turns to play the game*/
/*The original board is filled with the numbers [0, 8] and when a square is clicked on, the index of that square will be replaced by an 'X' or an 'O depending on the player*/
    if(typeof originalBoard[square.target.id] == 'number') { /*Click on a square that hasn't been already clicked*/
        turn(square.target.id, humanPlayer)
        if(!checkTie()) turn(bestSpot(), AIPlayer); /*Before anyone takes a turn to play, we check if the game is a tie by checking if the table is full (every square is full with 'X' or 'O')*/
    }
}

function turn(square, player){ /*Can be called by either the human player or the ai player*/
    originalBoard[square] = player;
    document.getElementById(square).innerText = player;
    let wonGame = checkWin(originalBoard, player) /*Check if the game has been won by who*/
    if(wonGame) gameOver(wonGame) /*If the game has been won, the gameOver function will be called*/
}

function checkWin(board, player){ 
    let plays = board.reduce((a, e, i) => /*a = accumulator, e = every element of the board array, i = index*/
        (e === player) ? a.concat(i) : a, []); /*Find every index (spot/square) that the player has played in*/
    let wonGame = null;
    for(let [index, win] of winningCombos.entries()){ /*To get the index of the win in the winningCombos arrays*/
        if (win.every(elem => plays.indexOf(elem) > -1)){ /*Checks which winning combo the player won at AND which player is the winner*/
            wonGame = {index: index, player: player};
            break;
        }
    }
    return wonGame; /*If nobody wins gameWon = null. If someone wins, wonGame will which winningCombo and player it was*/
}

function gameOver(wonGame){
    for(let index of winningCombos[wonGame.index]){ /*Highlight the winning combo with 2 colors distinct color depending on the winner*/
        document.getElementById(index).style.backgroundColor =
            wonGame.player == humanPlayer ? "#827397" : "#827397";
    }
    for(var i = 0; i < cells.length; i++){ /*When the game is won the player can no longer click on the table until he resets the game*/
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(wonGame.player == humanPlayer ? "You won!" : "You lost.");
    score(wonGame.player);
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block"; /*This will show the box*/
    document.querySelector(".endgame .text").innerText = who; /*This will show the message on the box*/
}

function emptySquares(){ /*Filter the original board to see which squares are empty (an empty square is filled with a number*/
    return originalBoard.filter(s => typeof s == 'number');
}

function bestSpot(){ /*Random AI player who will play on the first empty square*/
    return emptySquares()[0];
}

function checkTie(){
    if(emptySquares().length == 0){ /*Checks if every square is filled and nobody won (= 0) */
        for(var i = 0; i < cells.length; i++){
            cells[i].style.backgroundColor = "#827397";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

var score1 = 0;
var score2 = 0;

function score(who){
    if(who == humanPlayer){
        score1++;
        document.querySelector("#human").innerText = score1;
    } else {
        score2++;
        document.querySelector("#robot").innerText = score2;
    } 
}