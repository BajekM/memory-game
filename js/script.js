/* Elements */

const startButton = document.querySelector('.start');
const keys = Array.from(document.querySelectorAll('.row > div'));
const summary = document.querySelector('.summary');
const result = summary.querySelector('.summary p');
const repeat = document.querySelector('.repeat');
const repeatText = document.querySelector('.repeat h2');
const restartBtn = summary.querySelector('.summary button');

// console.log('restart', restartBtn);

/* Start data*/
let sequence = [];
let playerMoves = [];
let index = -1;

addMove();


/* Starting event listeners*/
startButton.addEventListener('click', startGame);
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
restartBtn.addEventListener('click', restart);

/* And its callbacks*/
function startGame() {
  // console.log('clicked');
  startButton.classList.add('hidden');
  playSequence();
}

function removeTransition(e) {
  console.log('transition');
  e.target.classList.remove('computerMove');
  e.target.classList.remove('goodMove');
  e.target.classList.remove('badMove');
}


function  restart() {
  // console.log('restart');
  sequence = [];
  playerMoves =[];
  window.removeEventListener('keydown', handleKeyClick);
  summary.classList.remove('visibleBlock');
  document.querySelector('.badMove').classList.remove('badMove');
  document.querySelector('.goodMove').classList.remove('goodMove');
  keys.forEach(key => key.addEventListener('transitionend', removeTransition));
  addMove();
  playSequence();
}

function anotherRound() {
  playerMoves =[];
  window.removeEventListener('keydown', handleKeyClick);
  const greenKeys = Array.from(document.querySelectorAll('.goodMove'));
  greenKeys.forEach(key => key.classList.remove('.goodMove'));
  addMove();
  setTimeout(playSequence(), 300);
}



/* Other functions */

function identifyMove(id) {
  switch (id) {
  case 1:
    return 38;

  case 2:
    return 37;

  case 3:
    return 40;

  case 4:
    return 39;

  default:
    break;
  }
}

function identifyKey(key) {
  switch (key) {
  case 38:
    return '.up';

  case 37:
    return '.left';

  case 40:
    return '.down';

  case 39:
    return '.right';

  default:
    break;
  }
}

function addMove() {
  const random = Math.floor((Math.random() * 4 + 1));
  console.log('random', random);

  sequence.push(identifyMove(random));

  // console.log('sequence', sequence);
}

function playSequence() {
  for (let i = 0; i < sequence.length; i++) {
    const key = document.querySelector(identifyKey(sequence[i]));
    // console.log('elem', key);
    setTimeout( function() {
      key.classList.add('computerMove');
      if (i === (sequence.length - 1)) {
        setTimeout( function() {
          repeatText.innerHTML = 'Powtórz!';
          repeat.classList.add('visibleFlex');
        }, 1000);
        setTimeout( function() {
          repeat.classList.remove('visibleFlex');
          playGame();
        }, 3000);
      }
    }, i * 1000);
  }
}

function handleKeyClick(e) {
  e.preventDefault();
  console.log('index', index);
  console.log('sequence', sequence);
  if(e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
    playerMoves.push(e.keyCode);
    index++;
    console.log('playermoves',playerMoves);
    const key = document.querySelector(identifyKey(e.keyCode));
    console.log('porównanie', sequence[index], playerMoves[index]);
    if (sequence[index] === playerMoves[index]) {
      key.classList.add('goodMove');
      if (index == (sequence.length - 1)) {
        index = -1;
        setTimeout( function() {
          repeatText.innerHTML = 'Dobrze !';
          repeat.classList.add('visibleFlex');
        }, 800);
        setTimeout( function() {
          repeat.classList.remove('visibleFlex');
          anotherRound();
        }, 2500);
      }
    } else {
      keys.forEach(keyBoard => keyBoard.removeEventListener('transitionend', removeTransition));
      key.classList.add('badMove');
      const goodKey = document.querySelector(identifyKey(sequence[index]));
      goodKey.classList.add('goodMove');
      summary.classList.add('visibleBlock');
      result.innerHTML = `Niestety zły ruch! Maksymalna liczba ruchów, które udało ci się zapamiętać:  ${sequence.length - 1}`;
      index = -1;
    }
  }
}

function playGame() {
  window.addEventListener('keydown', handleKeyClick);
}


