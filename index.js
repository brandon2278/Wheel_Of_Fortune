// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var home = document.getElementById("home");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal

home.onload = function () {
  modal.style.display = "block";
}

var translater = document.getElementById("translater");

// Get the button that opens the modal
var btn = document.getElementById("translate");
var answer = document.getElementById("subm");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  translater.style.display = "block";
}
answer.onclick = function () {
  translater.style.display = "block";
}

// When the user clicks on <span> (x), close the modal


// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    translater.style.display = "none";
  }
}



//Fail counter
var failCount = 0;
var count = 1;
// Correct letters used
var savedLetter;
// All letters that have been guessed
var usedLetter;
if (localStorage.getItem('usedLetters') != null) {
  usedLetter = localStorage.getItem('usedLetters');
}
if (localStorage.getItem('savedLetter') != null) {
  savedLetter = localStorage.getItem('savedLetter');
  savedLetter.split("");
  var usedLength = savedLetter.length;
}
// Function to compare strings if they are equal
String.prototype.equalsIgnoreCase = function (compareString) {
  return this.toLowerCase() === compareString.toLowerCase();
};

// This prints out the letters that have already been guessed correctly
word.split("");
var wordLength = word.length;
for (var i = 0; i < wordLength; i++) {
  var id = i.toString();
  var letter = document.getElementById(id);
  if (word[i] !== " ") {
    $(letter).parent().css('background', '#9370DB');
    for (var j = 0; j < usedLength; j++) {
      if (localStorage.getItem('savedLetter') != null) {
        if (word[i].equalsIgnoreCase(savedLetter[j])) {
          letter.innerHTML += savedLetter[j];
          count++;
        }
      }
    }
  } else {
    count++;
  }
}
//console.log(count);
//console.log(wordLength);


// Gets each key from the keyboard and if clicked displays the letter in the puzzle grid if correct
var keys = document.querySelectorAll(".keyboard-letters")
keys.forEach(key => {
  key.onclick = function () {
    key = key.innerHTML;
    for (var i = 0; i < wordLength; i++) {
      var id = i.toString();
      var letter = document.getElementById(id);
      if (word[i].equalsIgnoreCase(key)) {
        reveal();
        if (localStorage.getItem('savedLetter') != null && !(localStorage.getItem('savedLetter').includes(key))) {
          savedLetter = savedLetter.concat(key);
        } else if (localStorage.getItem('savedLetter') == null) {
          savedLetter = key;
        }
        if (localStorage.getItem('usedLetters') != null && !(localStorage.getItem('usedLetters').includes(key))) {
          usedLetter = usedLetter.concat(key);
        } else if (localStorage.getItem('usedLetters') == null) {
          usedLetter = key;
        }
        localStorage.setItem('savedLetter', savedLetter);
        localStorage.setItem('usedLetters', usedLetter);
        letter.innerHTML += word[i].toUpperCase();
      } else {
        if (localStorage.getItem('usedLetters') != null && !(localStorage.getItem('usedLetters').includes(key))) {
          usedLetter = usedLetter.concat(key);
        } else if (localStorage.getItem('usedLetters') == null) {
          usedLetter = key;
        }
        localStorage.setItem('usedLetters', usedLetter);
        // Fail counter, if the letter clicked does not equal 
        //any letter in the word it counts each fail and if the 
        //fail matches the length of the word it plays the fail 
        //sound and removes points from user
        failCount++;
        if (failCount == wordLength) {
          fail();
        }

      }

    }
  }
});
// This disables all the used Letters or any letter that has already been pressed
var usedKeys = document.querySelectorAll(".temp-disabled")
usedKeys.forEach(key1 => {
  var key1 = key1.innerHTML;
  if (localStorage.getItem('usedLetters') !== null) {
    var usedLetters = localStorage.getItem('usedLetters');
    usedLetters.split("");
    var letterAmount = usedLetters.length;
    for (var i = 0; i < letterAmount; i++) {
      if (key1.equalsIgnoreCase(usedLetters[i])) {
        var letterId = document.getElementById(key1);
        letterId.style.pointerEvents = "none";
        letterId.style.color = "#014991";
      }
    }
  }
});

var solvePhrase = document.getElementById('solvePhrase');
var solver = document.getElementById('solve');
// Function to later allow user to solve
solvePhrase.onclick = function () {
  solver.style.display = "block";
  var solved = document.getElementById('solved');
  solved.innerHTML = '<span id=\"closed1\" class=\"close\">&times;</span><div><form class="container" action="" method="post" > ' +
    '<div class="form-outline mb-4">' +
    '<label class="form-label" for=\"guess\">Enter Guess:</label>' +
    '<input class="form-control form-control-lg useGameKeyboard" name="guess" type="text"></div>' +
    ' <input type="hidden" id="tempScore1" name="tempScore1" value="" />' +
    '<input type="hidden" id="usrScore1" name="usrScore1" value="" />' +
    '<input class="btn btn-warning" type="button" name="solved" value="SOLVE">' +
    '</form></div>';
  var closed1 = document.getElementById("closed1");
  closed1.onclick = function () {
    solver.style.display = "none";
  }
}
var win = document.getElementById('win');
var winner = document.getElementById('winner');
var tempScore = JSON.parse(localStorage.getItem('tempScore'));
document.getElementById("tempScore").value = tempScore;
document.getElementById("tempScore1").value = tempScore;
var usrScore = JSON.parse(localStorage.getItem('score'));
document.getElementById("usrScore").value = usrScore;
document.getElementById("usrScore1").value = usrScore;
document.getElementById("usrScore2").value = usrScore;
console.log(count);
console.log(wordLength);
// Reveal correct letter and add money to user bank
function reveal() {
  var letter = document.getElementById('letter');
  letter.play();
  if (count == wordLength) {
    win.style.display = 'block';
    winner.innerHTML = '<span id=\"close\" class=\"close\">&times;</span><h3>Congratulations</h3><div style=\"font-family: serif;\"><h2> The Correct Response: "'
      + word + '"</h2><h2> The Response Translation: "' + translation + '"</h2><h5>You have won a bonus of $5,000 for solving the puzzle</h5></div>';
    var winnerSound = document.getElementById('winnerSound');
    winnerSound.volume = 0.4;
    winnerSound.play();
    var span1 = document.getElementById('close');
    span1.onclick = function () {
      win.style.display = "none";
      document.winScore.submit();
    }
  } else {
    setTimeout(increaseScore, 2000);
  }
}
// Plays buzzer sound and removes money from user bank
function fail() {
  document.fail.submit();
}
function increaseScore() {
  document.theForm.submit();
}
// script to close modals
var solver = document.getElementById('solve');
var span = document.getElementsByClassName("close")[0];
var resetWin = document.getElementById("shuffling");
var hint = document.getElementById("hint");
var phraseSound = document.getElementById("phraseBtn");

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  translater.style.display = "none";
}

var hintAudio = document.getElementById("sounds");
var phrase = document.getElementById('phraseSound');

// PLays hint audio
hint.onclick = function () {
  hintAudio.play();
}
// Plays the phrase audio
phraseSound.onclick = function () {
  phrase.play();
}
