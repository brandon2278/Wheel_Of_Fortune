let db = require("./db.js");
let serverData = require("./data.js");
let communicate = require("./communicate.js");

const vowels = ['a','á','e','é','i','í','o','ó','u','ú'];

function resetsUserScores(RID) {
	for (var user of serverData.roomList[RID].userList) {
		user.score = 0;
	}
}

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

function getNextPlayer(currentPlayer, totalPlayers, RID) {
	var nextPlayer = currentPlayer + 1;

	if(nextPlayer == totalPlayers) {
		nextPlayer = 0;
	}

	if (serverData.roomList[RID].userList[nextPlayer].inGame === false) {
		nextPlayer = getNextPlayer(nextPlayer, totalPlayers, RID);
	}

	return nextPlayer;
}

function switchToNextPlayer(RID) {
	var userList = serverData.roomList[RID].userList;
	var currentPlayerIndex = serverData.roomList[RID].currentPlayerIndex;
	var nextPlayerIndex = getNextPlayer(currentPlayerIndex, userList.length, RID);
	serverData.roomList[RID].currentPlayerIndex = nextPlayerIndex;
}

function addScoreToPlayer(playerIndex, RID, score) {
	console.log("Score: ", score);
	if(isNaN(score) && serverData.roomList[RID].userList[playerIndex].score > 0) {
		serverData.roomList[RID].userList[playerIndex].score = 0; 
	} else if(!isNaN(score)) {

		serverData.roomList[RID].userList[playerIndex].score += parseInt(score); 
	}
}

function subtractScoreFromPlayer(playerIndex, RID, score) {
	if(isNaN(score) && serverData.roomList[RID].userList[playerIndex].score > 0) {
		serverData.roomList[RID].userList[playerIndex].score = 0; 
	} else if(!isNaN(score)){

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
	serverData.roomList[RID].hasVowel = true;
	getRandomVowel(getPuzzleWord(serverData.roomList[RID].currentPuzzle,serverData.roomList[RID].currentCategory), {}, RID); 
}

async function nextRound(RID) {
	serverData.roomList[RID].currentRound += 1;
	serverData.roomList[RID].currentPuzzleNumber = 0;
	serverData.roomList[RID].currentCategory = await getRandomCategory(RID);
	await nextPuzzle(RID);
}

function endMatch(RID) {
	serverData.roomList[RID].status = "Waiting";
}

function createBoardRow(startIndex) {
	
}

function findUserWithHigestScore(RID) {
	var userList = serverData.roomList[RID].userList;
	var highest = -100000000000000000000000000000000000;
	var higestUser = null;
	for (var user of userList) {
		if (user.score > highest) {
			highest = user.score;
			highestUser = user;
		}
	}

	return highestUser;
}

async function updateGame(RID, oldPlayerIndex) {
	serverData.roomList[RID].lastKey = false;
	var oldSlots = serverData.roomList[RID].slots;
	var oldPlayer = serverData.roomList[RID].userList[oldPlayerIndex].Name;
	console.log("index: ", oldPlayerIndex);
	var currentPuzzle = serverData.roomList[RID].currentPuzzleNumber;
	var currentRound = serverData.roomList[RID].currentRound;
	var maxPuzzle = serverData.roomList[RID].puzzlesPerRound;
	var maxRound = serverData.roomList[RID].maxNumberOfRounds;
	

	if(currentRound === maxRound && currentPuzzle === maxPuzzle) {
		endMatch(RID);
		var winner = findUserWithHigestScore(RID);
		communicate.emitToRoom(RID, {
			"responseType": "endMatch",
			"room": communicate.formatRoom(serverData.roomList[RID]),
			"solvedBy": oldPlayer,
			"winningPlayer": winner.Name,
			"winningScore": winner.score
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

function getRandomVowel(w, solved, RID) {
	var word = w.toUpperCase();
	var vowelsInWord = [];
	vowels.forEach((vowel) => {
		var used = false;
		var slots = getLetterSlots(word, vowel);
		slots.forEach((slot) => {
			if(slot[0] in solved) {
				used = true;
			}
		});

		if (!used && word.includes(vowel.toUpperCase())) vowelsInWord.push(vowel);
	});

	console.log("Vowels: ", vowelsInWord);

	if(vowelsInWord.length < 1) {
		serverData.roomList[RID].hasVowel = false;
	}

	var index = Math.floor(Math.random() * vowelsInWord.length);

	return vowelsInWord[index];
}

function guessIsCorrect(guess, answer) {
	return guess.toUpperCase() === answer.toUpperCase();
}

function hasPlayersLeftInGame(RID) {
	var hasPlayers = false;
	serverData.roomList[RID].userList.every((user) => {
		if (user.inGame === true) {
			hasPlayers = true;
			return false;
		}
		return true;
	});

	return hasPlayers;
}

function resetReadyStatus(RID) {
	serverData.roomList[RID].userList.forEach((user) => {
		user.isReady = false;
	});
}

module.exports = (requestHandler) => {
	requestHandler.on("startGame", async (data, req) => {
		resetReadyStatus(data.RID)
		resetsUserScores(data.RID)
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
		serverData.roomList[data.RID].status = "In Game";
		serverData.roomList[data.RID].hasVowel = true;

		getRandomVowel(getPuzzleWord(firstPuzzle, firstCategory), serverData.roomList[data.RID].solved, data.RID); 

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
		getRandomVowel(currentWord, serverData.roomList[data.RID].solved, data.RID) 

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
			await updateGame(data.RID, currentPlayerIndex);
		} else {
			subtractScoreFromPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].correctScore);
		}

		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
		
	});

	requestHandler.on("buyVowel", async (data, req) => {
		var currentPuzzle = serverData.roomList[data.RID].currentPuzzle;
		var currentCategory = serverData.roomList[data.RID].currentCategory;
		var currentWord = getPuzzleWord(currentPuzzle, currentCategory);
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;
		var solved = serverData.roomList[data.RID].solved;
		var vowel = getRandomVowel(currentWord, solved, data.RID);
		var slots = getLetterSlots(currentWord, vowel);
		var playerName = serverData.roomList[data.RID].userList[serverData.roomList[data.RID].currentPlayerIndex].Name;
		
		subtractScoreFromPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].vowelPrice);
		slots.forEach((slot) => {
			serverData.roomList[data.RID].solved[slot[0]] = slot[1];
		});

		serverData.roomList[data.RID].usedLetters.push(vowel);
		switchToNextPlayer(data.RID);
		getRandomVowel(currentWord, solved, data.RID);
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});

		communicate.emitToRoom(data.RID, {
			"responseType": "boughtVowel",
			"vowel": vowel,
			"player": playerName
		});
	});

	requestHandler.on("updatePointers", (data, req) => {
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);
		if (foundIndex !== -1) {
			serverData.roomList[data.RID].userList[foundIndex].mouseX = data.user.mouseX;	
			serverData.roomList[data.RID].userList[foundIndex].mouseY = data.user.mouseY;	
		}

		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("updateUserStatus", (data, req) => {
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);
		if (foundIndex !== -1) {
			serverData.roomList[data.RID].userList[foundIndex].inGame = data.user.inGame;	
		}

		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});

	});

	requestHandler.on("getInitRoom", (data, req) => {
		communicate.emitToRoom(data.RID, {
			"responseType": "startUp",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("leaveGame", (data, req) => {
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);
		if (foundIndex !== -1) {
			serverData.roomList[data.RID].userList[foundIndex].inGame = data.user.inGame;	
		}

		if (!hasPlayersLeftInGame(data.RID)) {
			serverData.roomList[data.RID].status = "Waiting"
		} else if (serverData.roomList[data.RID].userList[serverData.roomList[data.RID].currentPlayerIndex].UID === data.user.UID) {
			switchToNextPlayer(data.RID);
		}

		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("showSolveAttempt", (data, req) => {	
		communicate.emitToRoom(data.RID, {
			"responseType": "showSolveAttempt",
			"value": data.value
		});
	});

	return requestHandler;
};
