/**
 * This file contains the server side game logic code
 * 
 * @author Colby O'Keefe (A00428974)
 */

// Requires
let db = require("../api/db.js");
let serverData = require("../data.js");
let communicate = require("../api/communicate.js");

// A list of vowels in the Mi'Kmaq alphabet 
const vowels = ['a','á','e','é','i','í','o','ó','u','ú'];

// Max timeout for user is 10,000 ms (10s) 
const MAX_TIMEOUT = 10000;

// Checks for dissconnected WebSockets every 5s
const CHECK_DISCONNECTS_EVERY = 5000

// Checks for players that timeed out on a interval
setInterval(() => {
	checkForTimeouts();
}, CHECK_DISCONNECTS_EVERY);


/*
 * This functiom checks if the current player of each room has timeout 
 * passed the maxiumum timeout time.
 *
 * @author Colby O'Keefe (A00428974)
 */
function checkForTimeouts() {
	for(let RID in serverData.roomList) {
		if (serverData.roomList[RID].userList[serverData.roomList[RID].currentPlayerIndex] == undefined) continue;

		if (serverData.roomList[RID].status === "In Game" && !serverData.roomList[RID].userList[serverData.roomList[RID].currentPlayerIndex].inGame) {
			if (Date.now() - serverData.roomList[RID].userList[serverData.roomList[RID].currentPlayerIndex].leftGameTime > MAX_TIMEOUT) {
				serverData.roomList[RID].userList[serverData.roomList[RID].currentPlayerIndex].madeMove = false;    
				if (hasPlayersLeftInGame(RID)) {
					switchToNextPlayer(RID);
					communicate.emitToRoom(RID, {
						"responseType": "updateRoom",
						"room": communicate.formatRoom(serverData.roomList[RID])
					});
				}

			}
		}
	}
}

/**
 * This function sets all users scores to zeros in a room
 *
 * @param RID The ID of the room
 * @author Colby O'keefe (A00428974)
 */
function resetsUserScores(RID) {
	for (var user of serverData.roomList[RID].userList) {
		user.score = 0;
	}
}

/**
 * This routine fetches a random category from the database.
 *
 * @param RID The ID of the room to get the category for
 * @return A random category from the database
 * @author Colby O'Keefe (A00428974)
 */
async function getRandomCategory(RID) {
	// fetches a list of categories from the database
	var categories = await db.getTables();

	// Gets a random index
	var index = Math.floor(Math.random() * (categories.length));
	
	// Checks if the category was already used in this room the next avaiable category is taken
	if (serverData.roomList[RID].usedCategories.includes(categories[index].Tables_in_group11)) {
		for (var i = 0; i < categories.length; i++) {
			if (i === index) continue;
			if(!serverData.roomList[RID].usedCategories.includes(categories[i].Tables_in_group11)) {
				index = i;
				break;
			}

			// If all category was already resets the used category list 
			if (i === categories.length - 1) serverData.roomList[RID].usedCategories = [categories[index].Tables_in_group11];
		}
	}
	
	// Add the categories to the used category list
	serverData.roomList[RID].usedCategories.push(categories[index].Tables_in_group11);
	return categories[index].Tables_in_group11;
}

/*
 * This routine fetches a random puzzle from the database
 * given the desired category.
 *
 * @param category The category to select a puzzle from
 * @param RID The ID of the room thats requesting a new puzzle
 * @return A random puzzle from the database
 * @author Colby O'Keefe (A00428974)
 */ 
async function getRandomPuzzle(category, RID) {
	// Gets a list of puzzle from the database
	var puzzles = await db.getPuzzles(category);

	// Gets a random index of a puzzle
	var index = Math.floor(Math.random() * (puzzles.length));
	
	// Checks if the puzzle was used already or not
	if (serverData.roomList[RID].usedPuzzles.includes(getPuzzleWord(puzzles[index], category))) {
		for (var i = 0; i < puzzles.length; i++) {
			if (i === index) continue;
			if(!serverData.roomList[RID].usedPuzzles.includes(getPuzzleWord(puzzles[i], category))) {
				index = i;
				break;
			} 

			// resets the used puzzle list if there are no unused puzzle left
			if (i === puzzles.length - 1) serverData.roomList[RID].usedPuzzles = [];
		}
	}

	// Adds puzzle to used puzzles list
	serverData.roomList[RID].usedPuzzles.push(getPuzzleWord(puzzles[index], category));
	console.log(puzzles[index]);
	return puzzles[index];
}

/*
 * Gets the puzzles answer (word) for a given puzzle.
 *
 * @param puzzle The puzzle stuct from database
 * @param category The category the puzzle is from
 * @author Colby O'Keefe (A00428974)
 */ 
function getPuzzleWord(puzzle, category) {
	var word;
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
 * This function determine the slot numbers the puzzle will take on the
 * clients puzzle board.  
 * 
 * @param puzzle The puzzle from the database
 * @param category The category the puzzle is from
 * @return An array of slot numbers
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

/*
 * This checks if a letters is contained with in a word
 * 
 * @param word The word to check
 * @param letter The letter to see if the word contains
 * @return A bool that reflects if the letetr is in the word or not
 * @author Colby O'Keefe (A00428974)
 */
function isLetterInWord(word, letter) {
	var temp = word.toUpperCase();
	return temp.includes(letter.toUpperCase());
}

/*
 * This functions gets the slot numbers that contain a specfied letter 
 * 
 * @param word The current word to be checked
 * @param letter The letter to find the slots numbers of	
 * @return An array of slots that contains the letter
 * @author Colby O'Keefe (A00428974)
 */
function getLetterSlots(word, letter) {
	var slots = []
	for(var i = 0; i < word.length; i++) {
		if(word[i].toUpperCase() === letter.toUpperCase()) slots.push([i, word[i]])
	}
	return slots
}

/*
 * This function finds the next player in the user list
 * 
 * @param currentPlayer The index of the current player in the user list
 * @param totalPlayers The total number of players in the room
 * @param RID The ID of the room
 * @return The index of the next player
 * @author Colby O'Keefe (A00428974)
 */
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

/*
 * This function switch a room current player to the next player in the list
 * 
 * @param RID The ID of the room
 * @author Colby O'Keefe (A00428974)
 */
function switchToNextPlayer(RID) {
	var userList = serverData.roomList[RID].userList;
	var currentPlayerIndex = serverData.roomList[RID].currentPlayerIndex;
	var nextPlayerIndex = getNextPlayer(currentPlayerIndex, userList.length, RID);
	serverData.roomList[RID].currentPlayerIndex = nextPlayerIndex;
}

/*
 * This function add score to a player
 * 
 * @param playerIndex The index of the player in the rooms user list
 * @param RID The ID of the room
 * @param score The score to be added to the player
 * @author Colby O'Keefe (A00428974)
 */
function addScoreToPlayer(playerIndex, RID, score) {
	if(isNaN(score) && serverData.roomList[RID].userList[playerIndex].score > 0) {
		serverData.roomList[RID].userList[playerIndex].score = 0; 
	} else if(!isNaN(score)) {

		serverData.roomList[RID].userList[playerIndex].score += parseInt(score); 
	}
}

/*
 * This function subtract score from a player
 * 
 * @param playerIndex The index of the player in the rooms user list
 * @param RID The ID of the room
 * @param score The score to be added to the player
 * @author Colby O'Keefe (A00428974)
 */
function subtractScoreFromPlayer(playerIndex, RID, score) {
	if(isNaN(score) && serverData.roomList[RID].userList[playerIndex].score > 0) {
		serverData.roomList[RID].userList[playerIndex].score = 0; 
	} else if(!isNaN(score)){

		serverData.roomList[RID].userList[playerIndex].score -= parseInt(score); 
	}
}

/*
 * This function finds all  unique letters in a word
 *
 * @param w The word to check
 * @return A string containing all unqiue letters in the word
 * @author Colby O'Keefe (A00428974)
 */
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

/*
 * Check if the puzzle has been solved. 
 *
 * @param word The word to be solved
 * @param RID The ID of the room
 * @return True if the word has been solved and false otherwise
 * @author Colby O'Keefe (A00428974)
 */
function isSolved(word, RID) {
	// Gets the slots list
	var slots = serverData.roomList[RID].slots;
	// Gets the solved letters
	var solved = serverData.roomList[RID].solved;
	// Stores the found word
	var foundWord = "";

	// constructs the word solved thus far
	for (var i = 0; i < slots.length; i++ ) {
		if(slots[i] in solved) foundWord += solved[slots[i]];
	}
	
	// Remove white spaces from the word
	word = word.replace(/\s/g, "");

	// Gets unique letters in word and solve attempt
	lettersInFound = getUniqueLetters(foundWord).length;
	lettersInWord = getUniqueLetters(word).length;

	// Find the difference in the unique letters
	uniqueLetters = lettersInWord - lettersInFound;

	// Checks if the puzzle is on the last letter
	if(uniqueLetters == 1) {
		serverData.roomList[RID].lastKey = true;
	}

	return word.toUpperCase() === foundWord.toUpperCase();
}

/*
 * The function switches the room to the next puzzle
 *
 * @param RID The ID of the room
 * @author Colby O'Keefe (A00428974)
 */
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

/*
 * Switches the room to the next round
 *
 * @param RID The ID of the room
 * @author Colby O'Keefe (A00428974)
 */
async function nextRound(RID) {
	serverData.roomList[RID].currentRound += 1;
	serverData.roomList[RID].currentPuzzleNumber = 0;
	serverData.roomList[RID].currentCategory = await getRandomCategory(RID);
	await nextPuzzle(RID);
}

/*
 * Perpares the lobby to end the game
 * 
 * @param RID The ID of the room
 * @author COlby O'Keefe (A00428974)
 */
function endMatch(RID) {
	serverData.roomList[RID].status = "Waiting";
}

/*
 * Finds the user with the highest score in a lobby
 *
 * @param RID The ID of the room
 * @return The user with the highest score
 * @author Colby O'Keefe (A00428974)
 */
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

/*
 * Updates the game state to either a new puzzle, round or ends the match
 *
 * @param RID The ID of the room
 * @param oldPlayerIndex The index of the player who made the last move
 * @author Colby O'Keefe (A00428974)
 */
async function updateGame(RID, oldPlayerIndex) {
	// Resets last key to false
	serverData.roomList[RID].lastKey = false;
	// Storess some variable from the room
	var oldSlots = serverData.roomList[RID].slots;
	var oldPlayer = serverData.roomList[RID].userList[oldPlayerIndex].Name;
	var currentPuzzle = serverData.roomList[RID].currentPuzzleNumber;
	var currentRound = serverData.roomList[RID].currentRound;
	var maxPuzzle = serverData.roomList[RID].puzzlesPerRound;
	var maxRound = serverData.roomList[RID].maxNumberOfRounds;
	
	
	// Checks if the next round is about to start or next puzzle or if the game ended
	if(currentRound === maxRound && currentPuzzle === maxPuzzle) {
		endMatch(RID);
		// Finds the winning player
		var winner = findUserWithHigestScore(RID);
		// updates the users stats
		await db.updateStats(serverData.roomList[RID].userList, winner.UID);
		// Emits to the room that the game has ended
		communicate.emitToRoom(RID, {
			"responseType": "endMatch",
			"room": communicate.formatRoom(serverData.roomList[RID]),
			"solvedBy": oldPlayer,
			"winningPlayer": winner.Name,
			"winningScore": winner.score
		});
	} else if(currentPuzzle === maxPuzzle) {
		// Emits to room that a new round has began
		await nextRound(RID);
		communicate.emitToRoom(RID, {
			"responseType": "nextRound",
			"room": communicate.formatRoom(serverData.roomList[RID]),
			"slots": oldSlots,
			"solvedBy": oldPlayer
		});
	}
	else {
		// Emits to room that a new puzzle is ready
		await nextPuzzle(RID);
		communicate.emitToRoom(RID, {
			"responseType": "nextPuzzle",
			"room": communicate.formatRoom(serverData.roomList[RID]),
			"slots": oldSlots,
			"solvedBy": oldPlayer
		});
	}
}

/*
 * The function gets the phrase correspounding to the puzzle
 *
 * @param puzzle The current puzzle
 * @param caregory The category the puzzle is from
 * @return The puzzles phrase
 * @author Colby O'Keefe (A00428974) 
 */
function getPuzzlePhrase(puzzle, category) {
	return (category === "phrases") ?  puzzle.phrase :  undefined;

}

/*
 * Finds the question correspounding to the puzzle
 *
 * @param puzzle The current puzzle
 * @param caregory The category the puzzle is from
 * @return The question corrspounding to the puzzle
 * @author Colby O'Keefe (A00428974)
 */
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

/**
 * Finds the hint correspounding to the puzzle
 *
 * @param puzzle The current puzzle
 * @param caregory The category the puzzle is from
 * @return The hint corrspounding to the puzzle
 * @author Colby O'Keefe (A00428974)
 */
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

/**
 * This function finds a avaivble random vowel in a word
 * 
 * @parm w The word to get the vowel from
 * @parm solved A hashmap of the solved letters
 * @parm RID The ID of the room
 * @return A random avaiable in the word
 * @author Colby O'Keefe (A00428974)
 */
function getRandomVowel(w, solved, RID) {
	// converts the word to upper case
	var word = w.toUpperCase();
	var vowelsInWord = [];
	// Finds all avaiable vowels in the word
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
	
	// Checks if there was a vowel found
	if(vowelsInWord.length < 1) {
		serverData.roomList[RID].hasVowel = false;
	}
	
	// Gets random index for the found vowel array
	var index = Math.floor(Math.random() * vowelsInWord.length);

	return vowelsInWord[index];
}

/**
 * This function checks if a users guess is correct or not
 *
 * @param guess The current guess 
 * @param answer The current answer
 * @return Returns True if the guess is correct and false otherwise
 * @author Colby O'Keefe (A00428974)
 */
function guessIsCorrect(guess, answer) {
	return guess.toUpperCase() === answer.toUpperCase();
}


/*
 * Checks if a room has any active players left
 *
 * @param RID The ID of the room
 * @return Ture if the room has active players left and False otherwise
 * @author Colby O'Keefe (A00428974)
 */
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

/*
 * This function reset every users reader status to false in a room 
 * 
 * @param RID The ID of the room
 * @author Colby O'Keefe (A00428974)
 */
function resetReadyStatus(RID) {
	serverData.roomList[RID].userList.forEach((user) => {
		user.isReady = false;
	});
}
/**
 * This function initializes the game setting for a new game to start
 *
 * @param data Data packet containing infomation from the client
 * @author Colby O'Keefe (A00428974)
 */
async function initGame(data) {
	// Reset User Infomation
	resetReadyStatus(data.RID)
	resetsUserScores(data.RID)

	// Reset used categories/puzzles
	serverData.roomList[data.RID].usedCategories = [];
	serverData.roomList[data.RID].usedPuzzles = [];

	// Gets first player
	var firstPlayerIndex = Math.floor(Math.random() * serverData.roomList[data.RID].userList.length); 
	
	// Gets the first category/puzzle
	var firstCategory = await getRandomCategory(data.RID);
	var firstPuzzle = await getRandomPuzzle(firstCategory, data.RID);

	// Inits the room data
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

	// ran for init purposes
	getRandomVowel(getPuzzleWord(firstPuzzle, firstCategory), serverData.roomList[data.RID].solved, data.RID); 

}

/*
 * This function check if all users in a list had request to start the game or not
 *
 * @param userList A list of users to check
 * @author Colby O'Keefe (A00428974)
 */
function hasAllPlayersStarted(userList) {
	for (let user in userList) {
		if (user.hasStarted === false) return false;
	}

	return true;
}

/*
 * Sets up request handlers
 */
module.exports = (requestHandler) => {
	requestHandler.on("startGame", async (data, req) => {
		// Finds the users index
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);
		// sets user started flag to true
		if (foundIndex !== -1) {
			serverData.roomList[data.RID].userList.hasStarted = true;
		}

		// Inits game if not already done
		if (hasAllPlayersStarted(serverData.roomList[data.RID].userList)) { 
			await initGame(data); 

			// Tells everyone in the lobby to start the game
			communicate.emitToRoom(data.RID, {
				"responseType": "startGame",
				"room": communicate.formatRoom(serverData.roomList[data.RID])
			});
		}
	});
	
	requestHandler.on("checkLetter", async (data, req) => {
		// Store values commonly used
		var currentPuzzle = serverData.roomList[data.RID].currentPuzzle;
		var currentCategory = serverData.roomList[data.RID].currentCategory;
		var currentWord = getPuzzleWord(currentPuzzle, currentCategory);
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;
		var score;

		// Reset made move to false
		serverData.roomList[data.RID].userList[currentPlayerIndex].madeMove = false;
		
		// checks of letter guessed is in the word or not
		if(isLetterInWord(currentWord, data.letter)) {
			// Adds score to player
			addScoreToPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].currentScore);
			// set the solved letters	
			var slots = getLetterSlots(currentWord, data.letter);
			slots.forEach((slot) => {
				serverData.roomList[data.RID].solved[slot[0]] = slot[1];
			});
			
			// scores the player score
			score = serverData.roomList[data.RID].currentScore;


		} else {
			// Subtracts score * lossModifier from player
			subtractScoreFromPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].currentScore * serverData.roomList[data.RID].lossModifier);
			// stores neagtive of the score
			score = -1 * serverData.roomList[data.RID].currentScore;
		}
		
		//Emits the update letter results to the lobby
		communicate.emitToRoom(data.RID, {
			"responseType": "letterGuessResults",
			"playerIndex": currentPlayerIndex,
			"score": score
		});
		
		// Updates infomation for next turn
		serverData.roomList[data.RID].usedLetters.push(data.letter);
		switchToNextPlayer(data.RID);
		getRandomVowel(currentWord, serverData.roomList[data.RID].solved, data.RID) 

		// checks if the word is solved
		if(isSolved(currentWord, data.RID)) {
			await updateGame(data.RID);
		} else {
			// Emitts the updated room to the lobby
			communicate.emitToRoom(data.RID, {
				"responseType": "updateRoom",
				"room": communicate.formatRoom(serverData.roomList[data.RID])
			});
		}
	});

	requestHandler.on("spinWheel", (data, req) => {
		// Send a request to the lobby to spin the wheel
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;
	 	serverData.roomList[data.RID].userList[currentPlayerIndex].madeMove = true;
		communicate.emitToRoom(data.RID, {
			"responseType": "spinWheel",
			"stopAngle": Math.random() * 360
		});
	});

	requestHandler.on("newScore", (data, req) => {
		// set new score and updates room
		serverData.roomList[data.RID].currentScore = data.score;
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("playSound", (data, req) => {
		// send a request to the lobby to play a sound
		communicate.emitToRoom(data.RID, {
			"responseType": "playSound",
			"soundPath": data.soundPath
		});
	});

	requestHandler.on("solvePuzzle", async (data, req) => {
		// variable that are commonly used
		var currentPuzzle = serverData.roomList[data.RID].currentPuzzle;
		var currentCategory = serverData.roomList[data.RID].currentCategory;
		var currentWord = getPuzzleWord(currentPuzzle, currentCategory);
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;
		var roundMax = serverData.roomList[data.RID].maxNumberOfRounds;
		var puzzleMax = serverData.roomList[data.RID].puzzlesPerRound;
		var roundNum = serverData.roomList[data.RID].currentRound;
		var puzzleNum = serverData.roomList[data.RID].currentPuzzleNumber;
	

		// sets currentplayer made move to false and switches to the next player
		serverData.roomList[data.RID].userList[currentPlayerIndex].madeMove = false;
		switchToNextPlayer(data.RID);
		
		var winMessage;
		// checks if the guess was correct or not
		if(guessIsCorrect(data.guess, currentWord)) {
			// Adds score to user and update game
			addScoreToPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].correctScore);
			await updateGame(data.RID, currentPlayerIndex);
			winMessage = "Correctly";
		} else {
			// subtract score from user
			subtractScoreFromPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].correctScore);
			winMessage = "Incorrectly";
		}
		
		if (!(roundNum === roundMax && puzzleNum === puzzleMax) && !(puzzleNum === puzzleMax)) {
			// Shows result from solve attempt if the macth has not ended
			communicate.emitToRoom(data.RID, {
				"responseType": "showSolveResult",
				"solvedBy": serverData.roomList[data.RID].userList[currentPlayerIndex],
				"winState": winMessage,
				"value": data.guess
			});
		}
		// updates the lobby with the current toom infomation
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
		
	});

	requestHandler.on("buyVowel", async (data, req) => {
		// Variables that are commonly used
		var currentPuzzle = serverData.roomList[data.RID].currentPuzzle;
		var currentCategory = serverData.roomList[data.RID].currentCategory;
		var currentWord = getPuzzleWord(currentPuzzle, currentCategory);
		var currentPlayerIndex = serverData.roomList[data.RID].currentPlayerIndex;
		var solved = serverData.roomList[data.RID].solved;
		var vowel = getRandomVowel(currentWord, solved, data.RID);
		var slots = getLetterSlots(currentWord, vowel);
		var playerName = serverData.roomList[data.RID].userList[serverData.roomList[data.RID].currentPlayerIndex].Name;
		
		// subtract the price of a vowel from the user score
		subtractScoreFromPlayer(currentPlayerIndex, data.RID, serverData.roomList[data.RID].vowelPrice);
		// set the vowel to solved 
		slots.forEach((slot) => {
			serverData.roomList[data.RID].solved[slot[0]] = slot[1];
		});

		// Updates room infomation
		serverData.roomList[data.RID].usedLetters.push(vowel);
		switchToNextPlayer(data.RID);
		getRandomVowel(currentWord, solved, data.RID);
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	
		// sends the result of bought 
		communicate.emitToRoom(data.RID, {
			"responseType": "boughtVowel",
			"vowel": vowel,
			"player": playerName
		});
	});

	requestHandler.on("updatePointers", (data, req) => {
		// Finds the users index
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);
		if (foundIndex !== -1) {
			// updates the mouse positions
			serverData.roomList[data.RID].userList[foundIndex].mouseX = data.user.mouseX;    
			serverData.roomList[data.RID].userList[foundIndex].mouseY = data.user.mouseY;    
		}
		
		// updates everyone in the room
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("updateUserStatus", (data, req) => {
		// Finds users index
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);
		
		if (foundIndex !== -1) {
			// updates the users in game status
			serverData.roomList[data.RID].userList[foundIndex].inGame = data.user.inGame;    
		}
	
		// updates lobby with new room info
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});

	});

	requestHandler.on("getInitRoom", (data, req) => {
		// ends startup request to lobby
		communicate.emitToRoom(data.RID, {
			"responseType": "startUp",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("leaveGame", (data, req) => {
		// finds user index
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);

		if (foundIndex !== -1) {
			// sets in game status
			serverData.roomList[data.RID].userList[foundIndex].inGame = data.user.inGame;    
			serverData.roomList[data.RID].userList[foundIndex].madeMove = false;    
		}

		// If no players are left in lobby chnage status to waiting else switch to next player
		if (!hasPlayersLeftInGame(data.RID)) {
			serverData.roomList[data.RID].status = "Waiting"
		} else if (serverData.roomList[data.RID].userList[serverData.roomList[data.RID].currentPlayerIndex].UID === data.user.UID) {
			switchToNextPlayer(data.RID);
		}

		// updates the room with new info
		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});
	});

	requestHandler.on("showSolveAttempt", (data, req) => {    
		// tell all clients to show the solve attempt
		communicate.emitToRoom(data.RID, {
			"responseType": "showSolveAttempt",
			"value": data.value
		});
	});

	requestHandler.on("startTimeout", (data, req) => {
		// finds user index
		var foundIndex = serverData.roomList[data.RID].userList.findIndex(u => u.UID === data.user.UID);
		if (foundIndex !== -1) {
			// sets in game status
			serverData.roomList[data.RID].userList[foundIndex].inGame = false;    
			serverData.roomList[data.RID].userList[foundIndex].leftGameTime = Date.now();    
		}

		communicate.emitToRoom(data.RID, {
			"responseType": "updateRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		});

	});
	return requestHandler;
};
