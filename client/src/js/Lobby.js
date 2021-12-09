/* 
 * This file contains the client side code for the lobbies. 
 * 
 * @author Colby O'Keefe (A00428974)
 */

// Store the element containing a message box
let messageBox;

/*
 * This function gets runs when the window load and initalize the
 * message box by adding an event listener.
 */
window.onload = () => {
	messageBox = document.getElementById("message-box");
	messageBox.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			sendMessage(e.target.value);
			e.target.value = "";
		}
	}); 
}

/*
 * Kicks the user from the lobby if a kick request is 
 * recieved from the server. A notications is displayed
 * to the user leeting them know they were kicked.
 */
serverCallbacks.addEventListener("kick", (e) => {
	swal({
		title: "You Were Kicked From The Lobby",            
		button: {
					text: "ok",
					value: true,
					visible: true,
					className: "btn btn-warning",
					closeModal: true,
				},
		timer: 10000
	}).then(() => {
		document.location.href = "../";
	});
});

/*
 * Gets the room data and updates the lobby infomation
 */
serverCallbacks.addEventListener("getRoom", (e) => {
	const data = e.detail;
	updateRoom(data);
	var roomTitle = document.getElementById("room-name");
	roomTitle.innerHTML = currentRoom.roomName;
});


/*
 * Starts the game
 */
serverCallbacks.addEventListener("startGame", (e) => {
	const data = e.detail;
	updateRoom(data);
	startGame();

});

/*
 * Starts the count down for the match to start
 */
serverCallbacks.addEventListener("startCountdown", async (e) => {
	var audio = new Audio("../../assets/audio/lobbyCount.mp3");
	audio.play();

	await countdown(1000, "Starting!!!");
	const packet = {
		"requestType": "startGame",
		"RID": RID
	}
	ws.send(JSON.stringify(packet));
});

/*
 * Inits the lobby upon go ahead from server
 *
 * @author Colby  O'Keefe (A00428974)
 */
function init() {
	// Gets user infomation
	user = getUserInfomation();

	// Joins the room
	joinRoom(RID);

	// Sends a request to the server to get room infomation
	const packet = {
		"requestType": "getRoom",
		"RID": RID
	};

	ws.send(JSON.stringify(packet));
}

/*
 * This function removes the user from the room.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function leaveRoom() {
	const packet = {
		"requestType": "exitRoom",
		"RID": RID,
		"user": user
	}
	ws.send(JSON.stringify(packet));
	document.location.href = "../";
}

/*
 * This function updates the room infomation for the user.
 *
 * @param data A packet from the server containing an room struct
 * @author Colby O'Keefe (A00428974)
 */
function updateRoom(data) {
	// Find this user
	var me = data.room.userList.find(u => u.UID === user.UID);

	// checks if this user is the lobby leader if so
	// displays the force start button
	if (me.isLeader) {
		user.isLeader = true;
		var forceStart = document.getElementById("force-start");
		forceStart.style.display = "initial";
	}

	// Updates current room
	currentRoom = data.room;

	// Updates player count
	var playerCount = document.getElementById("player-count");
	playerCount.innerHTML = "Player Count: " + currentRoom.userList.length + "/" + currentRoom.maxPlayerCount;
	
	// Displays the new infomation from the server
	displayMessages("chat-window");
	displayUsers();
	displayOptions();

	// updates the user
	updateUser();
}

/*
 * This function displays the apporiate options for the current user depending on there status
 * i.e. is the lobby leader or not.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function displayOptions() {
	if (currentRoom.status === "In Game") {
		document.getElementById("force-start").style.visibility = "hidden";    
		document.getElementById("ready-up").style.visibility = "hidden";    
		document.getElementById("leave-room").style.visibility = "visible";    
		document.getElementById("reconnect").style.visibility = "visible";    
	} else {
		document.getElementById("force-start").style.visibility = "visible";    
		document.getElementById("ready-up").style.visibility = "visible";    
		document.getElementById("leave-room").style.visibility = "visible";    
		document.getElementById("reconnect").style.visibility = "hidden";
	}
}

/*
 * Reconnects the user to the game.
 *
 * @author Colby O'Keefe (A00428974)
 */
function reconnect() {
	document.location.href = "../game/?RID=" + RID;
}

/*
 * This function sends a request to kick a user from the room.
 *
 * @param UID The ID of the user being kicked
 * @author Colby O'Keefe (A00428974) 
 */
function kickPlayer(UID) {
	const packet = {
		"requestType": "kickPlayer",
		"RID": RID,
		"UID": UID
	};

	ws.send(JSON.stringify(packet));
}

/*
 * This function prompts the user to pick a color for there mouse pointer in-game
 * and for their message color (same color).
 * 
 * @author Colby O'Keefe (A00428974)
 */
function setPointerColor() {
	swal({
		title: "Choose Your Pointer Color",
		content: {
			element: "input",
			attributes: {
				type: "color",
				style: "height: 100px;"
			}
		},
		button: {
			text: "Submit",
			value: true,
			visible: true,
			className: "btn btn-warning",
			closeModal: true
		}
	}).then((color) => {
		// Sends a request to the server to update the mouse pointer color
		const packet = {
			"requestType": "updateUserPointerColor",
			"RID": RID,
			"UID": user.UID,
			"pointerColor": color
		};

		ws.send(JSON.stringify(packet));
	});
}

/*
 * Ask the user if they want to kick a user or not.
 *
 * @param username The username of the user that might be kicked
 * @param UID The ID of the user that might be kicked
 * @author Colby O'Keefe (A00428974)
 */
function askToKick(username, UID) {
	swal({
		title: "Do You Want To Kick " + username + "?",
		showCancelButton: true,
		buttons: [
			"No",
			"Yes"
		],
		dangerMode: true
	}).then((isConfirmed) => {
		if (isConfirmed) kickPlayer(UID);
	});
}

/*
 * This function display all users in the lobby.
 *
 * @author Colby O'Keefe (A00428974)
 */
function displayUsers() {
	// Stores this user
	var me = user;
	// Gets the user-list element
	var userList = document.getElementById("user-list");
	userList.innerHTML = '';

	// Loops through each user in the room
	for(const user of currentRoom.userList) {
		// Generate a container to store the user	
		var userContainer = document.createElement("center");
		userContainer.className = "lobby-user-container";

		// Creates the element that will display the users name
		var userElement = document.createElement("a");
		userElement.className = "btn btn-dark lobby-user";
		userElement.setAttribute("role", "button");
		userElement.innerHTML = user.Name;
		
		// Create an element that will display the users choosen pointer color
		var pointerColor = document.createElement("span");
		pointerColor.style.color = user.pointerColor;
		pointerColor.className = "user-color";
		pointerColor.innerHTML = "&#8226;";
		userElement.prepend(pointerColor);

		// Checks if the current user is this user and add
		// a onclick function to edit their color
		if(user.UID === me.UID) {
			userElement.onclick = (e) => {
				setPointerColor();
			};
		}
		// Sets background color to yellow if there are the lobby leader
		if (user.isLeader) userElement.style.backgroundColor = "#9B970C";
		// Sets the username to green if the player has readied up
		if(user.isReady) userElement.style.color = "#22FF22";

		// Appends user to user container
		userContainer.appendChild(userElement);

		// checks if this player is the leader and if so
		// add a onclick function to kick the user
		if (me.isLeader && !user.isLeader) {
			userContainer.onclick = (e) => {
				askToKick(user.Name, user.UID);
			};
		}

		// appends the user container to the user list
		userList.appendChild(userContainer);
	}
}

/*
 * This function swaps the user ready status and sends 
 * this infomation to the server.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function readyUp() {
	// Gets the this user
	var me = currentRoom.userList.find(u => u.UID === user.UID);
	// negates ready up status
	me.isReady = !me.isReady;

	// Determine the server message depending if 
	// the user readied up or un readied up.
	var readyMessage;
	if(me.isReady) {
		readyMessage = me.Name + " Is Ready To Play!";
		
	} else {
		readyMessage = me.Name + " Is No Longer Ready To Play!";
	}

	// Makes the message bold
	readyMessage.bold();
	
	// Sends the server message to the sevrer to emit to the rest of room
	const packetMessage = {
		"requestType": "sendMessage",
		"message": readyMessage,
		"user": {"Name": "Server"},
		"RID": RID
	}
	ws.send(JSON.stringify(packetMessage));

	// sends update user status to the server
	const packet =  {
		"requestType": "updateUser",
		"user": me,
		"RID": RID
	};
	ws.send(JSON.stringify(packet));
	
	// checks if all user are ready and if so starts the countdown
	if(checkReadyStatus()) {
		roundCountdown();
	}
}

/*
 * Checks if all players in the lobby are readied up
 *
 * @return A bool that incates if all players are readied up or not
 * @author Colby O'Keefe (A00428974)
 */
function checkReadyStatus() {
	var startGame = true;
	currentRoom.userList.forEach(user => {
		if (user.isReady == false) {
			startGame = false;
		}
	});

	return startGame;
}

/*
 * Force starts the game.
 *
 * @author Colby O'Keefe (A00428974)
 */
function forceStart() {
	// Gets server message
	var forceStartMessage = user.Name + " Has Force Started The Game!!!";
	forceStartMessage.bold();

	// sends message to server to emit to rest of room
	const packet = {
		"requestType": "sendMessage",
		"message": forceStartMessage,
		"user": {"Name": "Server"},
		"RID": RID
	}
	ws.send(JSON.stringify(packet));

	// starts the countdown
	roundCountdown();    
}

/*
 * Sends a request to the server to start the countdown to
 * start the match.
 * 
 * @author Colby O'Keefe (A00428974)
 */
async function roundCountdown() {
	const packet = { 
		"requestType": "startCountdown",
		"RID": RID
	}

	ws.send(JSON.stringify(packet));
}

/*
 * Starts the game.
 *
 * @author Colby O'Keefe (A00428974)
 */
function startGame() {
	document.location.href = "../game/?RID=" + RID;
}

/*
 * Runs when the WebSocket connection is opened
 */
ws.onopen = () => {
	const packet = {
		"requestType": "checkIfValidRID",
		"RID": RID
	}

	ws.send(JSON.stringify(packet));
};
