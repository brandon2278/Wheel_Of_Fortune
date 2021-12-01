let db = require("./db.js");
let serverData = require("./data.js");
let communicate = require("./communicate.js");

/*
 * This routine fetches a random category from the database.
 *
 * @author Colby O'Keefe (A00428974)
 */
async function getRandomCategory(RID) {
	var categories = await db.getTables();
	var index = Math.floor(Math.random() * (categories.length));
	console.log("Used category: ",serverData.roomList[RID].usedCategories);
	if (serverData.roomList[RID].usedCategories.includes(categories[index].Tables_in_sql5441723)) {
		for (var i = 0; i < categories.length; i++) {
			if (i === index) continue;
			if(!serverData.roomList[RID].usedCategories.includes(categories[i].Tables_in_sql5441723)) {
				index = i;
				break;
			}
			if (i === categories.length - 1) serverData.roomList[RID].usedCategories = [categories[index].Tables_in_sql5441723];
		}
	}
	serverData.roomList[RID].usedCategories.push(categories[index].Tables_in_sql5441723);
	return categories[index].Tables_in_sql5441723;
}

/*
 * This routine fetches a random puzzle from the database
 * given the desired category.
 *
 * @author Colby O'Keefe (A00428974)
 */ 
async function getRandomPuzzle(category, RID) {
	var puzzles = await db.getPuzzles(category);
	var index = Math.floor(Math.random() * (puzzles.length));
	if (serverData.roomList[RID].usedPuzzles.includes(getPuzzleWord(puzzles[index], category))) {
		for (var i = 0; i < puzzles.length; i++) {
			if (i === index) continue;
			if(!serverData.roomList[RID].usedPuzzles.includes(getPuzzleWord(puzzles[i], category))) {
				index = i;
				break;
			}	
			if (i === puzzles.length - 1) serverData.roomList[RID].usedPuzzles = [];
		}
	}
	serverData.roomList[RID].usedPuzzles.push(getPuzzleWord(puzzles[index], category));
	return puzzles[index];
}

/*
 * This function is to account for shit database layout
 *
 * @author Colby O'Keefe (A00428974)
 */ 
function getPuzzleWord(puzzle, category) {
	var word;
	console.log(puzzle);
	switch(category) {
		case "phrases":
			word = puzzle.response;
			break;
		default:
			word = puzzle.word;
			break;
	}
	return word;
}

/*
 *
 * @author Colby O'Keefe (A00428974)
 */
function getPuzzleSlots(puzzle, category) {
	var word = getPuzzleWord(puzzle, category);	
	var slots = []

	for(var i = 0; i < word.length; i++ ) {
		if(word[i] !== " ") {
			slots.push(i);	
		}
	}

	return slots
}

function isLetterInWord(word, letter) {
	var temp = word.toUpperCase();
	console.log(letter.toUpperCase());
	return temp.includes(letter.toUpperCase());
}

function getLetterSlots(word, letter) {
	var slots = []
	for(var i = 0; i < word.length; i++) {
		if(word[i].toUpperCase() === letter.toUpperCase()) slots.push([i, word[i]])
	}
	return slots
}

function getNextPlayer(currentPlayer, totalPlayers) {
	var nextPlayer = currentPlayer + 1;

	if(nextPlayer == totalPlayers) {
		nextPlayer = 0
	}

	return nextPlayer;
}

function switchToNextPlayer(RID) {
	var userList = serverData.roomList[RID].userList;
	var currentPlayerIndex = serverData.roomList[RID].currentPlayerIndex;
	var nextPlayerIndex = getNextPlayer(currentPlayerIndex, userList.length);
	serverData.roomList[RID].currentPlayerIndex = nextPlayerIndex;
}

function addScoreToPlayer(playerIndex, RID, score) {
	if(score === "BANKRUPT") {
		serverData.roomList[RID].userList[playerIndex].score = 0; 
	} else {

		serverData.roomList[RID].userList[playerIndex].score += parseInt(score); 
	}
}

function subtractScoreFromPlayer(playerIndex, RID, score) {
	if(score === "BANKRUPT") {
		serverData.roomList[RID].userList[playerIndex].score = 0; 
	} else {

		serverData.roomList[RID].userList[playerIndex].score -= parseInt(score); 
	}
}

function getUniqueLetters(w) {
	var word = w.toUpperCase();
	var uniqueLetters = "";

	for (var i = 0; i < word.length; i++) {
		if(uniqueLetters.indexOf(word.charAt(i)) == -1) {
			uniqueLetters += word[i];
		}
	}

	return uniqueLetters;
}

function isSolved(word, RID) {
	var slots = serverData.roomList[RID].slots;
	var solved = serverData.roomList[RID].solved;
	var foundWord = "";
	for (var i = 0; i < slots.length; i++ ) {
		if(slots[i] in solved) foundWord += solved[slots[i]];
	}
	word = word.replace(/\s/g, "");

	lettersInFound = getUniqueLetters(foundWord).length;
	lettersInWord = getUniqueLetters(word).length;
	uniqueLetters = lettersInWord - lettersInFound
	console.log("Num Unique Letters: ", uniqueLetters);
	if(uniqueLetters == 1) {
		console.log("Here!");
		serverData.roomList[RID].lastKey = true;
	}

	return word.toUpperCase() === foundWord.toUpperCase();
}

async function nextPuzzle(RID) {
	serverData.roomList[RID].currentPuzzleNumber += 1;
	serverData.roomList[RID].currentPuzzle = await getRandomPuzzle(serverData.roomList[RID].currentCategory, RID);
	serverData.roomList[RID].slots = getPuzzleSlots(serverData.roomList[RID].currentPuzzle, serverData.roomList[RID].currentCategory);
	serverData.roomList[RID].puzzleQuestion = getPuzzleQuestion(serverData.roomList[RID].currentPuzzle, serverData.roomList[RID].currentCategory);
	serverData.roomList[RID].puzzleHint = getPuzzleHint(serverData.roomList[RID].currentPuzzle, serverData.roomList[RID].currentCategory);
	serverData.roomList[RID].puzzlePhrase = getPuzzlePhrase(serverData.roomList[RID].currentPuzzle, serverData.roomList[RID].currentCategory);
	serverData.roomList[RID].usedLetters = [];
	serverData.roomList[RID].solved = {};
}

async function nextRound(RID) {
	serverData.roomList[RID].currentRound += 1;
	serverData.roomList[RID].currentPuzzleNumber = 0;
	serverData.roomList[RID].currentCategory = await getRandomCategory(RID);
	await nextPuzzle(RID);
}

function endMatch(RID) {
	console.log("Game Has Ended!!!");
}

async function updateGame(RID) {
	serverData.roomList[RID].lastKey = false;
	var oldSlots = serverData.roomList[RID].slots;
	var oldPlayer = serverData.roomList[RID].userList[serverData.roomList[RID].currentPlayerIndex].Name;
	var currentPuzzle = serverData.roomList[RID].currentPuzzleNumber;
	var currentRound = serverData.roomList[RID].currentRound;
	var maxPuzzle = serverData.roomList[RID].puzzlesPerRound;
	var maxRound = serverData.roomList[RID].maxNumberOfRounds;
	

	if(currentRound === maxRound && currentPuzzle === maxPuzzle) {
		endMatch(RID);
		communicate.emitToRoom(RID, {
			"responseType": "endMatch",
			"room": communicate.formatRoom(serverData.roomList[RID]),
			"solvedBy": oldPlayer
		});
	} else if(currentPuzzle === maxPuzzle) {
		await nextRound(RID);
		communicate.emitToRoom(RID, {
			"responseType": "nextRound",
			"room": communicate.formatRoom(serverData.roomList[RID]),
			"slots": oldSlots,
			"solvedBy": oldPlayer
		});
	}
	else {
		await nextPuzzle(RID);
		communicate.emitToRoom(RID, {
			"responseType": "nextPuzzle",
			"room": communicate.formatRoom(serverData.roomList[RID]),
			"slots": oldSlots,
			"solvedBy": oldPlayer
		});
	}
}

function getPuzzlePhrase(puzzle, category) {
	return (category === "phrases") ?  puzzle.phrase :  undefined;

}

function getPuzzleQuestion(puzzle, category) {
	var question;
	switch(category) {
		case "phrases":
			question = puzzle.phraseSound;
			break;
		default:
			question = puzzle.picture;
			break;

	}

	return question;
}

function getPuzzleHint(puzzle, category) {
	var hint
	switch(category) {
		case "phrases":
			hint = puzzle.responseSound;
			break;
		default:
			hint = puzzle.sound;
			break;
	}

	return hint;
}

function guessIsCorrect(guess, answer) {
	return guess.toUpperCase() === answer.toUpperCase();
}

module.exports = (requestHandler) => {
	requestHandler.on("startGame", async (data, req) => {
		serverData.roomList[data.RID].usedCategories = [];
		serverData.roomList[data.RID].usedPuzzles = [];

		var firstPlayerIndex = Math.floor(Math.random() * serverData.roomList[data.RID].userList.length); 
		var firstCategory = await getRandomCategory(data.RID);
		var firstPuzzle = await getRandomPuzzle(firstCategory, data.RID);

		serverData.roomList[data.RID].currentCategory = firstCategory;
		serverData.roomList[data.RID].currentPuzzle = firstPuzzle;
		serverData.roomList[data.RID].puzzleQuestion = getPuzzleQuestion(firstPuzzle, firstCategory);
		serverData.roomList[data.RID].puzzleHint = getPuzzleHint(firstPuzzle, firstCategory);
		serverData.roomList[data.RID].puzzlePhrase = getPuzzlePhrase(firstPuzzle, firstCategory);
		serverData.roomList[data.RID].slots = getPuzzleSlots(firstPuzzle, firstCategory);
		serverData.roomList[data.RID].currentPlayerIndex = firstPlayerIndex;
		serverData.roomList[data.RID].solved = {};
		serverData.roomList[data.RID].usedLetters = [];
		serverData.roomList[data.RID].currentRound = 1;
		serverData.roomList[data.RID].currentPuzzleNumber = 1;
		serverData.roomList[data.RID].lastKey = false;

		/*To Be Set In Lobby Creation*/
		serverData.roomList[data.RID].maxNumberOfRounds = 2;
		serverData.roomList[data.RID].puzzlesPerRound = 2;
		serverData.roomList[data.RID].correctScore = 1000;
		serverData.roomList[data.RID].lossModifier = 0.5;


		communicate.emitToRoom(data.RID, {
			"responseType": "startGame",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});
	
	requestHandler.on("checkLetter", async (data, req) => {
		var currentPuzzle = serverData.roomList[data.RID].currentPuzzle;
		var currentCategory = serverData.roomList[data.RID].currentCategory;
		var currentWord = getPuzzleWord(currentPuzzle, currentCategory);
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;
		var score;

		serverData.roomList[data.RID].userList[currentPlayerIndex].madeMove = false;
		
		if(isLetterInWord(currentWord, data.letter)) {
			addScoreToPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].currentScore);
			var slots = getLetterSlots(currentWord, data.letter);
			console.log(slots);
			slots.forEach((slot) => {
				serverData.roomList[data.RID].solved[slot[0]] = slot[1];
			});

			score = serverData.roomList[data.RID].currentScore;


		} else {
			subtractScoreFromPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].currentScore * serverData.roomList[data.RID].lossModifier);
			score = -1 * serverData.roomList[data.RID].currentScore;
		}

		communicate.emitToRoom(data.RID, {
			"responseType": "letterGuessResults",
			"playerIndex": currentPlayerIndex,
			"score": score
		});
		
		serverData.roomList[data.RID].usedLetters.push(data.letter);
		switchToNextPlayer(data.RID);

		if(isSolved(currentWord, data.RID)) {
			await updateGame(data.RID);
		} else {
			//TODO: Use UpdateRoom
			communicate.emitToRoom(data.RID, {
				"responseType": "updateRoom",
				"room": communicate.formatRoom(serverData.roomList[data.RID])
			});
		}
	});

	requestHandler.on("spinWheel", (data, req) => {
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;
		serverData.roomList[data.RID].userList[currentPlayerIndex].madeMove = true;
		communicate.emitToRoom(data.RID, {
			"responseType": "spinWheel",
			"stopAngle": Math.random() * 360
		});
	});

	requestHandler.on("newScore", (data, req) => {
		console.log(data.score);
		serverData.roomList[data.RID].currentScore = data.score;

		//TODO: Use UpdateRoom
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("playSound", (data, req) => {
		communicate.emitToRoom(data.RID, {
			"responseType": "playSound",
			"soundPath": data.soundPath
		});
	});

	requestHandler.on("solvePuzzle", async (data, req) => {
		var currentPuzzle = serverData.roomList[data.RID].currentPuzzle;
		var currentCategory = serverData.roomList[data.RID].currentCategory;
		var currentWord = getPuzzleWord(currentPuzzle, currentCategory);
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;

		serverData.roomList[data.RID].userList[currentPlayerIndex].madeMove = false;
		switchToNextPlayer(data.RID);
		

		if(guessIsCorrect(data.guess, currentWord)) {
			addScoreToPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].correctScore);
			await updateGame(data.RID);
		} else {
			subtractScoreFromPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].correctScore);
			communicate.emitToRoom(data.RID, {
				"responseType": "updateRoom",
				"room": communicate.formatRoom(serverData.roomList[data.RID])
			});
		}
		
	});

	return requestHandler;
};
