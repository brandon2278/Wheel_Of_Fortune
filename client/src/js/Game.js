/**
 * This file contains the client side code for the game logic
 * 
 * @author Colby O'Keefe (A00428974)
 */

// Defines the min number of slots on the baord
const MIN_SLOTS = 42;
// Defines the number of row on the board
const BOARD_ROW_LENGTH = 14;

// Stores if the game has been started yet or not
var hasStarted = false;

/*
 * Listenrs for when the html loads 
 */
document.addEventListener("DOMContentLoaded", () => {
	// Sets up the message box
	messageBox = document.getElementById("game-panel-chat");
	messageBox.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			sendMessage(e.target.value);
			e.target.value = "";
		}
	}); 

	// sets up the letters for the game board
	var keys = document.querySelectorAll(".keyboard-letters");
	keys.forEach((key) => {
		// plays clicking audio upon clicking a letter key
		key.addEventListener("click", () => {
			let audio = new Audio("../../assets/audio/Clicking.mp3");
			audio.play();
			checkLetter(key.innerText);
		});
		// removes the color property to be set later
		key.style.removeProperty('color');
	});
	
	// Removes all used letters if the current toom infomation is set
	if (currentRoom != null) removeUsedLetters();
});

/*
 * Listens for a mouse move event
 */
document.addEventListener('mousemove', (e) => {
	// Checks if the users game started
	if (hasStarted) {
		// Updates the users mouse position
		updateMousePosition(e); 

		// Sends the users mouse infomation to the server
		const packet = {
			"requestType": "updatePointers",
			"RID": RID,
			"user": user
		};

		ws.send(JSON.stringify(packet));
	}
});

/*
 * Listens for an unload event
 */
window.addEventListener('beforeunload', (e) => {
	// checks if the users game started 
	if (hasStarted) {
		// sets the user property
		user.inGame = false;
		user.madeMove = false;

		// sends a timeout request to the server
		const packet = {
			"requestType": "startTimeout",
			"RID": RID,
			"user": user
		};

		ws.send(JSON.stringify(packet));
	}
}, false);

/*
 * Process the new room data from server
 */
serverCallbacks.addEventListener("getRoom", (e) => {
	const data = e.detail;

	updateRoom(data);
});

/*
 * Spins the wheel upon request from the server
 */
serverCallbacks.addEventListener("spinWheel", (e) => {
	const data = e.detail;

	var wheelContainer = document.getElementById("myModal");
	wheelContainer.style.display = "block";

	startSpin(data.stopAngle);

});

/*
 * Switches puzzle upon server request
 */ 
serverCallbacks.addEventListener("nextPuzzle", (e) => {
	const data = e.detail;

	currentRoom = data.room;

	displaySolvedDetails(data.solvedBy).then(() => {
		displayNextPlayer();
	});

	resetPuzzle();
	InitPuzzle(); 
	updateRoom(data);    
});

/*
 * Switches to next round upon server request
 */
serverCallbacks.addEventListener("nextRound", (e) => {
	const data = e.detail;

	currentRoom = data.room;

	displayNextRound(data.solvedBy);
	resetPuzzle();
	InitPuzzle(); 
	updateRoom(data);    
});

/*
 * Ends the current match upon server request
 */
serverCallbacks.addEventListener("endMatch", async (e) => {
	const data = e.detail;

	var audio = new Audio("../../assets/audio/winGame.mp3");
	audio.play();

	await displayWinner(data.solvedBy, data.winningPlayer, data.winningScore);
});

/*
 * Plays a sound upon server request
 */
serverCallbacks.addEventListener("playSound", (e) => {
		const data = e.detail;

		var audio = new Audio(data.soundPath);
		audio.play();
});

/*
 * Display results from a users letter guess 
 */
serverCallbacks.addEventListener("letterGuessResults", (e) => {
	const data = e.detail;

	displayScoreChange(data.playerIndex, data.score).then(() => {
		displayNextPlayer();
	});
});

/*
 * Starts the game upon callback from server 
 */
serverCallbacks.addEventListener("startUp", (e) => {
	const data = e.detail;

	currentRoom = data.room;

	resetPuzzle();
	InitPuzzle();

	if (!hasStarted) displayNextPlayer();

	hasStarted = true;
	updateRoom(data);
});

/*
 * Display the current user solve attempt live
 */
serverCallbacks.addEventListener("showSolveAttempt", (e) => {
	const data = e.detail;

	// Checks if the user is the current player or not
	if (user.UID !== currentRoom.userList[currentRoom.currentPlayerIndex].UID) {
		swal({
			title: currentRoom.userList[currentRoom.currentPlayerIndex].Name + " Is Solving The Puzzle: ",
			content: {
				element: "span",
				attributes: {
					innerHTML: data.value
				}
			},
			buttons: false
		});
	}
});

/*
 * Displays the results from a attempt to solve the puzzle
 */
serverCallbacks.addEventListener("showSolveResult", (e) => {
	const data = e.detail;

	swal({
		title: data.solvedBy.Name + " Solved The Puzzle " + data.winState,
		content: {
			element: "span",
			attributes: {
				innerHTML: data.value
			}
		},
		buttons: false,
		timer: 3000
	}).then(() => {
		displayNextPlayer();
	});
})

/*
 * Displays the vowel bought and the user who bought it
 */
serverCallbacks.addEventListener("boughtVowel", (e) => {
	const data = e.detail;

	displayBoughtVowel(data.vowel, data.player).then(() => {
		displayNextPlayer();
	});
});

/*
 * Inits the game upon go ahead from server
 *
 * @author Colby O'Keefe (A00428974)
 */
function init() {
	// gets the user infomation for database
	user = getUserInfomation();

	// Sets the in game flag
	user.inGame = true;

	joinRoom(RID);

	// sends a reuqest to init the room and to update user staus to
	// the server
	const packet = {
		"requestType": "getInitRoom",
		"RID": RID
	};
	const packet2 = {
		"requestType": "updateUserStatus",
		"RID": RID,
		"user": user
	};

	ws.send(JSON.stringify(packet));
	ws.send(JSON.stringify(packet2));
}

/**
 * Swaps the display mode for the infomation window
 *
 * @author Colby O'Keefe (A00428974)
 */
function displayGameInfoWindow() {
	var gamePanel = document.getElementById("game-panel");

	if (gamePanel.style.display === "none") gamePanel.style.display = "block";
	else gamePanel.style.display = "none";
}

/**
 * Displays whos turn it is and the users score
 * 
 * @author Colby O'Keefe (A00428974)
 */
function updateUsersGameInfo() {
	var container = document.getElementById("user-game-info");
	container.innerHTML = "";

	var player = document.createElement("p");
	player.innerHTML = "Playing: " + currentRoom.userList[currentRoom.currentPlayerIndex].Name;

	var score = document.createElement("p");
	score.innerHTML = "Your Score: $" + user.score;

	container.appendChild(player);
	container.appendChild(score);
}

/**
 * This function displays a letter to the user.
 * Used to display when a user bought a vowel
 *
 * @param vowel The letter to display
 * @param name The name of the user who bought the vowel
 * @return A Promise 
 * @author Colby O'Keefe (A00428974)
 */
async function displayBoughtVowel(vowel, name) {
	return await new Promise((res, rej) => {
		swal({
			title: name + " Has Bought the Vowel " + vowel + " for $" + currentRoom.vowelPrice,
			button: false,
			timer: 3500
		}).then(() => {
			res();
		});
	});
}

/**
 * This function display the current player in an alert box
 * 
 * @author Colby O'Keefe (A00428974)
 */
function displayNextPlayer() {
	swal({
		title: "It's Now " + currentRoom.userList[currentRoom.currentPlayerIndex].Name + "'s Turn",
		timer: 3000,
		buttons: false
	});
}

/**
 * This function remove the user from the game and back to the lobby
 * 
 * @author Colby O'Keefe (A00428974)
 */
function leaveGame() {
	document.location.href = "../lobby/?RID=" + RID;
	user.inGame = false;

	const packet = {
		"requestType": "leaveGame",
		"RID": RID,
		"user": user
	};
	
	ws.send(JSON.stringify(packet));

}

/**
 * Displays the current plays mouse to the screen
 * 
 * @author Colby O'Keefe (A00428974)
 */
function displayUsersMouse() {    
	// Loops through all users in the room
	currentRoom.userList.forEach( (u) => {
		// Finds the users mouse pointer
		var mousePointer = document.getElementById("UID=" + u.UID);

		// Removes the mouse pointer object if the user is not in the game
		if (u.inGame === false) {
			if (mousePointer !== null) mousePointer.remove();
			return;
		}

		// Gets the mouses mouse position (x, y)
		var mouseX = u.mouseX;
		var mouseY = u.mouseY;

		// Create a new mouse pointer element if it does not exist already
		if (mousePointer ==  null) {
			mousePointer = document.createElement("span");
			mousePointer.id = "UID=" + u.UID;
			mousePointer.className = "mouse-pointer";
			var nameTag = document.createElement("div");
			nameTag.innerHTML = u.Name;
			nameTag.style.margin = "15px";
			nameTag.style.color = u.pointerColor;
			mousePointer.appendChild(nameTag);
			document.getElementById("game-body").appendChild(mousePointer);
		}
		// stores if the mouse is visible
		var visible;
		// checks if the user is the current player or not
		if (u.UID === currentRoom.userList[currentRoom.currentPlayerIndex].UID && u.UID !== user.UID) {
			visible = "visible";    
		} else {
			visible = "hidden";
		}

		// This is sus but never had time to fix it
		mousePointer.style = "background-color: " + u.pointerColor + "; visibility: " + visible + "; margin-left: auto; margin-right: 0; pointer-events: none; position: absolute; left: " + mouseX + "px; top: " + mouseY + "px;";
	});
}

/**
 * Updates the users mouse infomation
 * 
 * @param e An event
 * @author Colby O'Keefe (A00428974)
 */
function updateMousePosition(e) {
	user.mouseX = e.clientX;
	user.mouseY = e.clientY;
}

/**
 * Displays the winner of the match to the users in the game.
 * 
 * @return A Promise
 * @author Colby O'Keefe (A00428974)
 */
async function displayWinner(solvedBy, winner, score) {
	return await new Promise ( (res, rej) => { 
		swal({
			title: solvedBy + " Solved The Final Puzzle Earning $" + currentRoom.correctScore,
		timer: 3000,
			buttons: false
		}).then(() => {
			swal({
				title: "The Game Has Ended... " + winner + " Won With A Score Of " + score,
				timer: 3000,
				buttons: false
			}).then(() => {
				countdown(1000, "Leaving...").then(() => {
					document.location.href = "../lobby/?RID=" + RID;
				});
			})
		});
	});
}

/**
 * Displays the game infomation in the game info panel
 * 
 * @author Colby O'Keefe (A00428974)
 */
function displayGameInfo() {
	var info = document.getElementById("game-panel-info");
	info.innerHTML = "";

	var playerCount = document.createElement("p");
	playerCount.innerHTML = "Player Count: " + currentRoom.userList.length + "/10";
	info.appendChild(playerCount);

	var round = document.createElement("p");
	round.innerHTML = "Round Number: " + currentRoom.currentRound + "/" + currentRoom.maxNumberOfRounds;
	info.appendChild(round);

	var puzzle = document.createElement("p");
	puzzle.innerHTML = "Puzzle Number: " + currentRoom.currentPuzzleNumber + "/" + currentRoom.puzzlesPerRound;
	info.appendChild(puzzle);
	
	var vowel = document.createElement("p");
	vowel.innerHTML = "Amount For Vowel: $" + currentRoom.vowelPrice;
	info.appendChild(vowel);

	var scoreForCorrect = document.createElement("p");
	scoreForCorrect.innerHTML = "Score For Correct Guess: $" + currentRoom.correctScore;
	info.appendChild(scoreForCorrect);

	var lossPercent = document.createElement("p");
	lossPercent.innerHTML = "Percent Loss: " + currentRoom.lossModifier;
	info.appendChild(lossPercent);
}

/**
 * Displays the users in the game
 *
 * @author Colby O'Keefe (A00428974)
 */
function displayUsers() {
	var userListContainer = document.getElementById("game-panel-users");
	userListContainer.innerHTML = "";
	for(const user of currentRoom.userList) {
		if (user.inGame === false) continue;
		var userContainer = document.createElement("div");
		var nameContainer = document.createElement("div");
		var scoreContainer = document.createElement("div");

		userContainer.className = "game-panel-user";
		nameContainer.className = "game-panel-user-name";
		scoreContainer.className = "game-panel-user-score";

		nameContainer.innerHTML = user.Name;
		scoreContainer.innerHTML = "$" + user.score;

		if(user.UID === currentRoom.userList[currentRoom.currentPlayerIndex].UID) nameContainer.style.color = "#00eb3b";

		userContainer.appendChild(nameContainer);
		userContainer.appendChild(scoreContainer);
		
		userListContainer.appendChild(userContainer);
	}

}

/**
 *  Handles chnage tab logic on the infomation menu
 *
 * @param tab The tab to be changed
 * @author Colby O'Keefe (A00428974)
 */
function gamePanelChangeTab(tab) {
	let audio = new Audio("../../assets/audio/Clicking.mp3");
	audio.play();

	let tabs = document.querySelectorAll(".game-panel-tab");
	let contentAreas = document.querySelectorAll(".game-panel-content-area");

	tabs.forEach(tab => tab.classList.remove("game-panel-tab-selected"));
	contentAreas.forEach(ca => ca.style.display = "none");

	tabs[tab].classList.add("game-panel-tab-selected");
	contentAreas[tab].style.display = "block";
}

/**
 * Display the next round infomation to the user via an alert box
 * 
 * @param solvedBy the user who solved the puzzle
 * @author Colby O'Keefe (A00428974) 
 */
async function displayNextRound(solvedBy) {
	swal({
		title: solvedBy + " Solved The Final Puzzle Earning $" + currentRoom.correctScore,
		timer: 3000,
		buttons: false
	}).then(() => {
		swal({
			title: "Round "  + (currentRoom.currentRound - 1).toString() + " Has Ended.  Round " + currentRoom.currentRound.toString() + " Is About To Start In...",
			timer: 3000,
			buttons: false
		}).then(() => {
			countdown(1000, "It's Now " + currentRoom.userList[currentRoom.currentPlayerIndex].Name + " Turn");
		})
	});
}

/**
 * This function display when a users score changes 
 *
 * @param player The player who score changed
 * @param score The score the player earned/loss
 * @return A Promise 
 * @author Colby O'Keefe (A00428974)
 */
async function displayScoreChange(player, score) {
	var windowTitle;
	var audioPath;

	// determine weather the score should be add or  subtracted or
	// if a bankrupt had occured
	if (score >= 0 && !isNaN(score))  {
		windowTitle = currentRoom.userList[player].Name + " Has Gained " + score;
		audioPath = "../../assets/audio/ding.mp3";
	}
	else if(score <= 0 && !isNaN(score)) {
		windowTitle = currentRoom.userList[player].Name + " Has Lost " + Math.abs(score);
		audioPath = "../../assets/audio/buzz.mp3";
	} else {
		windowTitle = currentRoom.userList[player].Name + " Has Lost All Their Score";
		audioPath = "../../assets/audio/buzz.mp3";
	}
	
	// Sends a request to play the win or losing sound
	const packet = {
		"requestType": "playSound",
		"RID": RID,
		"soundPath": audioPath
	};

	ws.send(JSON.stringify(packet));

	return await new Promise((res, rej) => {
		swal({
			title: windowTitle,
			button: false,
			timer: 3500
		}).then(() => {
			res();
		});
	});
}

/**
 * This function displays who solved a puzzle and how much they earned
 *
 * @param solvedBy who solved the puzzle
 * @return A Promise
 * @author Colby O'Keefe (A00428974)
 */
async function displaySolvedDetails(solvedBy) {
	return await new Promise((res, rej) => {
		swal({
			title: solvedBy + " Solved The Puzzle Earning $" + currentRoom.correctScore,
			button: false,
			timer: 3500
		}).then(() => {
			res();
		});
	});

}

/**
 * This function play the audio for the wheel spinning
 *
 * @author Colby O'Keefe (A00428974)
 */
function playWheelSound() {
	var audio = new Audio("../../assets/audio/tick.mp3");
	audio.play();
}    

/**
 * Sends a request to the server to check if a letter is in
 * the puzzles word
 *
 * @param letter The letter to be checked
 * @author Colby O'Keefe (A00428974)
 */
function checkLetter(letter) {
	// checks if the letter was already used just incase
	if (currentRoom.usedLetters.includes(letter)) return;

	lettersVisibility();

	// sends a request to the server to check the guessed letter
	const packet = {
		"requestType": "checkLetter",
		"user": user,
		"RID": RID,
		"letter": letter
	}

	ws.send(JSON.stringify(packet));
}

/**
 * Removes all used letters from the board
 *
 * @author Colby O'Keefe (A00428974)
 */
function removeUsedLetters() {
	var usedLetters = currentRoom.usedLetters;

	usedLetters.forEach((letter) => {
		var letterContainer = document.getElementById(letter.toUpperCase());
		letterContainer.style.color = "#3e3a47";
		
	});
}

/**
 * Adds all keys to the game board
 * 
 * @author Colby O'Keefe (A00428974)
 */
function addAllKeys() {
	var keys = document.querySelectorAll(".keyboard-letters");
	keys.forEach((key) => {
		key.style.removeProperty('color');
	});
}

/**
 * Finds the number of puzzles slots need to display the word.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function InitPuzzle() {
	// Finds the number of slots need to repersent a puzzle as a
	// mutliple of board row length
	var numLetters = currentRoom.slots[currentRoom.slots.length - 1] + 1;
	if (numLetters % BOARD_ROW_LENGTH !== 0) numLetters += 14 - numLetters % BOARD_ROW_LENGTH;

	// checks if the num slots as been reached
	if (numLetters < MIN_SLOTS) numLetters = MIN_SLOTS;

	var startLetter = document.getElementById("start-tile");

	// create the slots elements
	for (var i = 0; i < numLetters; i++) {
		var container = document.createElement("div");
		container.classList.add("letter-container", "useable-container");
		var letter = document.createElement("span")
		letter.className = "letter-content";
		letter.id = i.toString();

		container.appendChild(letter);
		document.getElementById("puzzle-grid").insertBefore(container, startLetter);
	}
	
}

/**
 * This function resets the puzzle board
 *
 * @author Colby O'Keefe (A00428974)
 */
function resetPuzzle() {
	addAllKeys();

	var letterContainers = document.querySelectorAll(".useable-container");
	letterContainers.forEach((container) => {
		container.remove();
	});
}

/**
 * This function updates the puzzle
 *
 * @author Colby O'Keefe *A00428974)
 */
function updatePuzzle() {
	for(var i = 0; i < currentRoom.slots.length; i++) {
		var letter = document.getElementById(currentRoom.slots[i]);
		var letterContainer = letter.parentElement;
		letterContainer.style.background = "#9370DB";
		if(currentRoom.solved[currentRoom.slots[i]] !== undefined) {
			letter.innerHTML = currentRoom.solved[currentRoom.slots[i]];
		}
	}
}

/**
 * Swaps the visibility of the game options
 * 
 * @author Colby O'Keefe (A00428974)
 */
function optionsVisibility() {
	var currentPlayer = currentRoom.userList[currentRoom.currentPlayerIndex]
	var optionContainer = document.getElementById("option-container");
	if(!currentPlayer.madeMove) {
		optionContainer.style.visibility = "visible";
	} else {
		optionContainer.style.visibility = "hidden";
	}
}

/**
 * This function swaps the letter buttons visibility
 *
 * @author Colby O'Keefe (A00428974)
 */
function lettersVisibility() {
	var currentPlayer = currentRoom.userList[currentRoom.currentPlayerIndex]
	var keyboardContainer = document.getElementById("keyboard-section");
	if(currentPlayer.madeMove) {
		keyboardContainer.style.visibility = "visible";
	} else {
		keyboardContainer.style.visibility = "hidden";
	}
}

/*
 * This function update the room and all HTML elements
 *
 * @author Colby O'Keefe (A00428974)
 */
function updateRoom(data) {
	var screenCover = document.getElementById("screen-cover");
	var spinWheelButton = document.getElementById("spin-wheel-btn");
	var buyVowelButton = document.getElementById("buy-vowel-btn");
	currentRoom = data.room;
	if (currentRoom.userList[currentRoom.currentPlayerIndex].UID === user.UID) {
		screenCover.style.display = "none";
	} else {
		screenCover.style.display = "block";
	}

	if (currentRoom.lastKey) {
		spinWheelButton.style.background = "#626756"; 
	} else {
		spinWheelButton.style.removeProperty('background');
	}

	if(!currentRoom.hasVowel || currentRoom.lastKey) {
		buyVowelButton.style.background = "#626756"; 
	} else {
		buyVowelButton.style.removeProperty('background');
	}

	updateUser();
	updateUsersGameInfo();
	lettersVisibility();
	optionsVisibility();
	removeUsedLetters();
	displayQuestion();
	displayHint();
	updatePuzzle();
	displayMessages("game-panel-chat-message-container");
	displayUsers();
	displayGameInfo();
	displayUsersMouse();
}

/*
 * This function displays an alert box for the user to
 * enter there solution to the puzzle
 *
 * @author Colby O'Keefe (A00428974)
 */ 
function solve() {
	let audio = new Audio("../../assets/audio/Clicking.mp3");
	audio.play();

	swal({
		title: "Enter Guess",
		content: {
			element: "input",
			attributes: {
				className: "useLobbyKeyboard",
				onclick: () => {
					element = document.querySelectorAll(".useLobbyKeyboard")[1];
					console.log();
					Keyboard.open("", currentValue => {
						element.select();
						let next = currentValue.substr(currentValue.length - 1);
						if (lastKey !== "backspace") element.value += next;
						else element.value = element.value.slice(0, -1);
					})
				},
				oninput: (e) => {
					var currentValue = e.srcElement.value;
					const packet = {
						"requestType": "showSolveAttempt",
						"RID": RID,
						"value": currentValue
					}
					ws.send(JSON.stringify(packet));
				}
			},
		},
			button: {
			text: "submit",
			value: true,
			visible: true,
			className: "btn btn-warning",
			closeModal: true,
			}
		}).then((value) => {
			console.log(value);
			if (value === null) {
				return false;
			}

			const packet = {
				"requestType": "solvePuzzle",
				"RID": RID,
				"guess": value
			};

			ws.send(JSON.stringify(packet));
		});
}

/*
 * This function request a random vowel from the server and plays a
 * clicking sound
 *  
 * @author Colby O'Keefe (A00428974)
 */ 
function buyVowel() {
	if(!currentRoom.lastKey && currentRoom.hasVowel) {
		let audio = new Audio("../../assets/audio/Clicking.mp3");
		audio.play();

		const packet = {
			"requestType": "buyVowel",
			"RID": RID
		}
		ws.send(JSON.stringify(packet));
	}        
}

/*
 * This function sends a request to the server to spin the wheel
 *
 * @author Colby O'Keefe (A00428974)
 */ 
function spinWheel() {
	if(!currentRoom.lastKey) {
		let audio = new Audio("../../assets/audio/Clicking.mp3");
		audio.play();

		const packet = {
			"requestType": "spinWheel",
			"RID": RID
		};

		ws.send(JSON.stringify(packet));
	}
}

/**
 * This function sends the result of spinning the wheel to the server
 * as well as plays audio depending on what the result of the spin was.
 *
 * @param indicatedSegment The segment of the wheel landed on
 * @author Colby O'Keefe (A00428974)
 */
function closeWheel(indicatedSegment) {
	var wonAudioPath = "../../assets/audio/Toss.mp3";
	var bankruptAudioPath = "../../assets/audio/bankr.mp3";
	var wheelContainer = document.getElementById("myModal");

	// determine if a score was recevived or if bankrupt
	if (indicatedSegment.text !== "BANKRUPT") {
		const packet = {
			"requestType": "playSound",
			"RID": RID,
			"soundPath": wonAudioPath
		};

		ws.send(JSON.stringify(packet));

		swal({
			title: currentRoom.userList[currentRoom.currentPlayerIndex].Name + " Has $" + indicatedSegment.text + " At Stake",
			button: false,
			timer: 3500
		});
	} else {
		const packet = {
			"requestType": "playSound",
			"RID": RID,
			"soundPath": bankruptAudioPath
		};

		ws.send(JSON.stringify(packet));

		swal({
			title: currentRoom.userList[currentRoom.currentPlayerIndex].Name + " Has Gone Brankrupt",
			button: false,
			timer: 3500
		});
	}

	wheelContainer.style.display = "none";

	if (user.UID === currentRoom.userList[currentRoom.currentPlayerIndex].UID) {
		var keyboardContainer = document.getElementById("keyboard-section");
		keyboardContainer.style.visibility = "visible";
	}

	// Sends request to server to updates the rooms score
	const packet = {
		"requestType": "newScore",
		"RID": RID,
		"score": indicatedSegment.text
	};

	ws.send(JSON.stringify(packet));
}

/*
 * Displays and starts the spin of the wheel
 * 
 * @param The stopping angle for the spin
 * @author Colby O'Keefe (A00428974)
 */
function startSpin(stopAngle) {
	var wheel = createWheel();
		wheel.animation.stopAngle = stopAngle;
		wheel.startAnimation();
}

/**
 * This function sends a request to the server to play
 * the audio hint for the puzzle.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function displayHint() {
	var hintButton = document.getElementById("hint");
	var hint = "../../assets/game/back/" + currentRoom.puzzleHint;
	hintButton.onclick = () => {
		let audio = new Audio("../../assets/audio/Clicking.mp3");
		audio.play();

		const packet = {
			"requestType": "playSound",
			"RID": RID,
			"soundPath": hint
		};

		ws.send(JSON.stringify(packet));
	}
}

/**
 * This function display the question which can be either an audio file or
 * a picture.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function displayQuestion() {
	var questionContainer = document.getElementById("question-container");
	var img = document.getElementById("question-image");
	var sound = document.getElementById("question-sound");
	var phraseButton = document.getElementById("phraseBtn");
	var questionWord = document.getElementById("question-word");
	var questionTitle = document.getElementById("question-title");

	var question = "../../assets/game/back/" + currentRoom.puzzleQuestion;
	fileType = question.split(".").slice(-1)[0];
	
	img.style.visibility = "hidden";
	sound.style.visibility = "hidden";
	
	// Check if the file is an audio or a image
	if(fileType === "jpeg" || fileType === "peg" || fileType === "jpg") {
		questionTitle.innerHTML = "Image";
		img.src = question; 
		img.style.height = '30%';
		img.style.width = '30vw';
		img.style.border = '1vw ridge rgba(0, 0, 0, 0.5)';
		img.style.borderRadius = '10%';
		img.style.visibility = "visible";
	} else if (fileType === "mp3") {
		questionTitle.innerHTML = "Mi'kmaw Phrase:";
		questionWord.innerHTML = " " + currentRoom.puzzlePhrase;
		phraseButton.onclick = () => {
			let audio = new Audio("../../assets/audio/Clicking.mp3");
			audio.play();

			const packet = {
				"requestType": "playSound",
				"RID": RID,
				"soundPath": question
			};

			ws.send(JSON.stringify(packet));
		};
		sound.style.visibility = "visible";
	}
}

// Runs on the opening of the WebSocket
ws.onopen = () => {
	// Sends a request to checks if the user is in a valid room
	const packet = {
		"requestType": "checkIfValidRID",
		"RID": RID
	}

	ws.send(JSON.stringify(packet));
};
