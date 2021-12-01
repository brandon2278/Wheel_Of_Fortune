document.addEventListener("DOMContentLoaded", () => {
	messageBox = document.getElementById("game-panel-chat");
	messageBox.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			sendMessage(e.target.value);
			e.target.value = "";
		}
	}); 

	var keys = document.querySelectorAll(".keyboard-letters");
	keys.forEach((key) => {
		key.addEventListener("click", () => {
			let audio = new Audio("./audio/Clicking.mp3");
			audio.play();
			checkLetter(key.innerText);
		});
		key.style.removeProperty('color');
	});

	if (currentRoom != null) removeUsedLetters();
});

serverCallbacks.addEventListener("getRoom", (e) => {
	const data = e.detail;
	updateRoom(data);
});

serverCallbacks.addEventListener("spinWheel", (e) => {
	const data = e.detail;
	var wheelContainer = document.getElementById("myModal");
	wheelContainer.style.display = "block";
	startSpin(data.stopAngle);

});

serverCallbacks.addEventListener("nextPuzzle", (e) => {
	const data = e.detail;
	displaySolvedDetails(data.solvedBy);
	resetPuzzle(data.slots);
	updateRoom(data);	
});

serverCallbacks.addEventListener("nextRound", (e) => {
	const data = e.detail;
	displayNextRound(data.solvedBy);
	resetPuzzle(data.slots);
	updateRoom(data);	
});

serverCallbacks.addEventListener("endMatch", async (e) => {
	var audio = new Audio("./audio/winGame.mp3");
	audio.play();
	const data = e.detail;
	await displayWinner(data.solvedBy, data.winningPlayer, data.winningScore);
});

serverCallbacks.addEventListener("playSound", (e) => {
		const data = e.detail;
		var audio = new Audio(data.soundPath);
		audio.play();
		
});

serverCallbacks.addEventListener("letterGuessResults", (e) => {
	const data = e.detail;
	console.log("outFunction", data.score);
	displayScoreChange(data.playerIndex, data.score);
});

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
					document.location.href = "Lobby.php?RID=" + RID;
				});
			})
		});
	});
}

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
	
	var wheelSpin = document.createElement("p");
	wheelSpin.innerHTML = "Amount For Vowel: $" + currentRoom.currentScore;
	info.appendChild(wheelSpin);

	var scoreForCorrect = document.createElement("p");
	scoreForCorrect.innerHTML = "Score For Correct Guess: $" + currentRoom.correctScore;
	info.appendChild(scoreForCorrect);

	var lossPercent = document.createElement("p");
	lossPercent.innerHTML = "Percent Loss: " + currentRoom.lossModifier;
	info.appendChild(lossPercent);
}

function displayUsers() {
	var userListContainer = document.getElementById("game-panel-users");
	userListContainer.innerHTML = "";
	for(const user of currentRoom.userList) {
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

function gamePanelChangeTab(tab) {
    let audio = new Audio("./audio/Clicking.mp3");
    audio.play();

    let tabs = document.querySelectorAll(".game-panel-tab");
    let contentAreas = document.querySelectorAll(".game-panel-content-area");

    tabs.forEach(tab => tab.classList.remove("game-panel-tab-selected"));
    contentAreas.forEach(ca => ca.style.display = "none");

    tabs[tab].classList.add("game-panel-tab-selected");
    contentAreas[tab].style.display = "block";
    console.log(contentAreas);
}

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
			countdown(1000, "Start!");
		})
	});
}

function displayScoreChange(player, score) {
	var windowTitle;
	var audioPath;
	if (score >= 0 && !isNaN(score))  {
		windowTitle = currentRoom.userList[player].Name + " Has Gained " + score;
		audioPath = "./audio/ding.mp3";
	}
	else if(score <= 0 && !isNaN(score)) {
		windowTitle = currentRoom.userList[player].Name + " Has Lost " + Math.abs(score);
		audioPath = "./audio/buzz.mp3";
	} else {
		windowTitle = currentRoom.userList[player].Name + " Has Lost All Their Score";
		audioPath = "./audio/buzz.mp3";
	}

	const packet = {
		"requestType": "playSound",
		"RID": RID,
		"soundPath": audioPath
	};

	ws.send(JSON.stringify(packet));

	swal({
		title: windowTitle,
		button: {
			text: "continue",
			value: true,
			visible: true,
			className: "btn btn-warning",
			closeModal: true,
		}
	});
}

function displaySolvedDetails(solvedBy) {
	swal({
		title: solvedBy + " Solved The Puzzle Earning $" + currentRoom.correctScore,
		button: {
			text: "continue",
			value: true,
			visible: true,
			className: "btn btn-warning",
			closeModal: true,
		}
	});

}

function playWheelSound() {
	var audio = new Audio("./sounds/tick.mp3");
	audio.play();
}	

function checkLetter(letter) {
	if (currentRoom.usedLetters.includes(letter)) return;
	lettersVisibility()
	const packet = {
		"requestType": "checkLetter",
		"user": user,
		"RID": RID,
		"letter": letter
	}
	ws.send(JSON.stringify(packet));
}

function removeUsedLetters() {
	var usedLetters = currentRoom.usedLetters;

	usedLetters.forEach((letter) => {
		var letterContainer = document.getElementById(letter.toUpperCase());
		letterContainer.style.color = "#3e3a47";
		
	});
}

function addAllKeys() {
	var keys = document.querySelectorAll(".keyboard-letters");
	keys.forEach((key) => {
		key.style.removeProperty('color');
	});
}

function resetPuzzle(slots) {
	addAllKeys() 
	for(var i = 0; i < slots.length; i++) {
		var letter = document.getElementById(slots[i]);
		var letterContainer = letter.parentElement;
		letterContainer.style.removeProperty('background');
		letter.innerHTML = "";
	}
}

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

function optionsVisibility() {
	var currentPlayer = currentRoom.userList[currentRoom.currentPlayerIndex]
	var optionContainer = document.getElementById("option-container");
	if(user.UID === currentPlayer.UID && !currentPlayer.madeMove) {
		optionContainer.style.visibility = "visible";
	} else {
		optionContainer.style.visibility = "hidden";
	}
}

function lettersVisibility() {
	var currentPlayer = currentRoom.userList[currentRoom.currentPlayerIndex]
	var keyboardContainer = document.getElementById("keyboard-section");
	if(user.UID === currentPlayer.UID && currentPlayer.madeMove) {
		keyboardContainer.style.visibility = "visible";
	} else {
		keyboardContainer.style.visibility = "hidden";
	}
}

/*
 *
 * @author Colby O'Keefe (A00428974)
 */
function updateRoom(data) {
	var spinWheelButton = document.getElementById("spin-wheel-btn");
	var buyVowelButton = document.getElementById("buy-vowel-btn");
	currentRoom = data.room;
	if (currentRoom.lastKey) {
		spinWheelButton.style.background = "#626756"; 
		buyVowelButton.style.background = "#626756"; 
	} else {
		spinWheelButton.style.removeProperty('background');
		buyVowelButton.style.removeProperty('background');
	}

	if(!currentRoom.hasVowel) {
		buyVowelButton.style.background = "#626756"; 
	} else {
		buyVowelButton.style.removeProperty('background');
	}

	lettersVisibility();
	optionsVisibility();
	removeUsedLetters();
	displayQuestion();
	displayHint();
	updatePuzzle();
	displayMessages("game-panel-chat-message-container");
	displayUsers();
	displayGameInfo();
}

/*
 *
 *
 * @author Colby O'Keefe (A00428974)
 */ 
function solve() {
	let audio = new Audio("./audio/Clicking.mp3");
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
					}
				}
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
 *
 *
 *
 * @author Colby O'Keefe (A00428974)
 */ 
function buyVowel() {
	if(!currentRoom.lastKey && currentRoom.hasVowel) {
		let audio = new Audio("./audio/Clicking.mp3");
		audio.play();

		const packet = {
			"requestType": "buyVowel",
			"RID": RID
		}
		ws.send(JSON.stringify(packet));
	}		
}

/*
 *
 *
 * @author Colby O'Keefe (A00428974)
 */ 
function spinWheel() {
	if(!currentRoom.lastKey) {
		let audio = new Audio("./audio/Clicking.mp3");
		audio.play();

		const packet = {
			"requestType": "spinWheel",
			"RID": RID
		};

		ws.send(JSON.stringify(packet));
	}
}

function closeWheel(indicatedSegment) {
	var wonAudioPath = "./audio/Toss.mp3";
	var bankruptAudioPath = "./audio/bankr.mp3";
	var wheelContainer = document.getElementById("myModal");
	if (indicatedSegment.text !== "BANKRUPT") {
		const packet = {
			"requestType": "playSound",
			"RID": RID,
			"soundPath": wonAudioPath
		};

		ws.send(JSON.stringify(packet));

		swal({
		    title: currentRoom.userList[currentRoom.currentPlayerIndex].Name + " Has $" + indicatedSegment.text + " At Stake",
		    button: {
			text: "continue",
			value: true,
			visible: true,
			className: "btn btn-warning",
			closeModal: true,
		    }
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
		    button: {
			text: "continue",
			value: true,
			visible: true,
			className: "btn btn-warning",
			closeModal: true,
		    }
		});
	}
	wheelContainer.style.display = "none";
	if (user.UID === currentRoom.userList[currentRoom.currentPlayerIndex].UID) {
		var keyboardContainer = document.getElementById("keyboard-section");
		keyboardContainer.style.visibility = "visible";
	}
	const packet = {
		"requestType": "newScore",
		"RID": RID,
		"score": indicatedSegment.text
	};

	ws.send(JSON.stringify(packet));
}

/*
 *
 *
 */
function startSpin(stopAngle) {
	var wheel = createWheel();
        wheel.animation.stopAngle = stopAngle;
        wheel.startAnimation();
}

function displayHint() {
	var hintButton = document.getElementById("hint");
	var hint = currentRoom.puzzleHint.substring(1);
	if (hint.charAt(0) !== '.') hint = '.' + hint;
	hintButton.onclick = () => {
		let audio = new Audio("./audio/Clicking.mp3");
		audio.play();

		const packet = {
			"requestType": "playSound",
			"RID": RID,
			"soundPath": hint
		};

		ws.send(JSON.stringify(packet));
	}
}

function displayQuestion() {
	var questionContainer = document.getElementById("question-container");
	var img = document.getElementById("question-image");
	var sound = document.getElementById("question-sound");
	var phraseButton = document.getElementById("phraseBtn");
	var questionWord = document.getElementById("question-word");
	var questionTitle = document.getElementById("question-title");

	var question = currentRoom.puzzleQuestion.substring(1);
	if (question.charAt(0) !== '.') question = '.' + question;
	fileType = question.split(".").slice(-1)[0];
	
	img.style.visibility = "hidden";
	sound.style.visibility = "hidden";
	if(fileType === "jpeg" || fileType === "peg" || fileType === "jpg") {
		questionTitle.innerHTML = "Image";
		img.src = question; 
		img.style.height = '300px';
    		img.style.width = '450px';
		img.style.border = '10px ridge rgba(0, 0, 0, 0.5)';
		img.style.borderRadius = '10%';
		img.style.visibility = "visible";
	} else if (fileType === "mp3") {
		questionTitle.innerHTML = "Mi'kmaw Phrase:";
		questionWord.innerHTML = " " + currentRoom.puzzlePhrase;
		phraseButton.onclick = () => {
			let audio = new Audio("./audio/Clicking.mp3");
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

ws.onopen = () => {
	user = getUserInfomation();
	joinRoom(RID);
	const packet = {
		"requestType": "getRoom",
		"RID": RID
	};

	ws.send(JSON.stringify(packet));
};
