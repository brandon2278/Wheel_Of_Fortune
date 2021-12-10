/* 
 * This file starts a Serure WebSocet connection to the NodeJS server 
 * and then sets up an event system for the NodeJS server to communicate 
 * to the user. Some general client functions are also stored in the file.
 *
 * @author Colby O'Keefe (A00428974)
 */

// Time interval in ms to check if the user is still connected to the server 
const SERVER_TIMEOUT = 3000

// Opens a new connection to the NodeJS server  
let ws = new WebSocket("ws://ugdev.cs.smu.ca:6969");

// Variables to store the users current room structure and it's ID
var currentRoom = null;
const RID = document.location.href.split("=")[1];

// Defines a default user struct
var user = {
	"Name": "Tester",	// Stores the users username
	"UID" : -1,		// Stores the users UID
	"closeTime": -1,	// Stores the time since the user lost connect to the server
	"leftGameTime": -1,	// Stores the time since the user left an active game
	"isLeader": false,	// Stores if the user is the leader of the lobby
	"isReady": false,	// Stores if the user has readied up or not,
	"hasStarted": false,	// Stores if the user has started or not
	"mouseX": 0,		// Stores the users mouse x position
	"mouseY": 0,		// Stores the user mouse y position
	"inGame": false,	// Stores if the user is in a game or not
	"pointerColor": "red"	// Stores the color of the user mouse pointer
}

/*
 * This function checks if the WebSocket connection has been lost and
 * if so alerts the user and then returns them to the main menu.
 */
setTimeout(() => {
	if(ws.readyState !== 1) {
		swal({
			title: "Can't Connect To Server. Try Agian Later.",            
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
	}
}, SERVER_TIMEOUT);

// declares a new EventTarget that the server will use to
// communicate with the user.
var serverCallbacks = new EventTarget(); 

/*
 * Listener for a request from the server to update room infomation.
 */
serverCallbacks.addEventListener("updateRoom", (e) => {
	const data = e.detail;
	// Different definitions depend on what page the user is located
	// refer to Lobby.js and Game.js for the definitions.
	updateRoom(data);
});

/*
 * Gets the results from the vaild Room ID check
 */
serverCallbacks.addEventListener("validifyRIDResult", (e) => {
	const data = e.detail;
	if (data.isValid) init();
	else invalidRoom();
});

/*
 * Tells the user they attempted to connect to an invalid room and
 * bring back to the mutliplayer home.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function invalidRoom() {
	swal({
		title: "Invalid Room! Disconnecting...",            
		button: false,
		timer: 3000
	}).then(() => {
		document.location.href = "../";
	});
}

/*
 * This function send a request to the server for the user to join
 * a room.
 * 
 * @param RID The room ID the user is joining
 * @author Colby O'Keefe (A00428974)
 */
function joinRoom(RID) {
	const packet = {
		"requestType": "joinRoom",
		"RID": RID,
		"user": user
	};
	ws.send(JSON.stringify(packet));
}

/*
 * This routine finds the user in the current room's user list
 * and updates the user infomation. This function is called 
 * upon a room update request.
 *
 * @author Colby O'Keefe (A00428974)
 */
function updateUser() {
	currentRoom.userList.forEach(u => {
		if (u.UID === user.UID) {
			user = u;
		}
	});
}


/*
 * This routine display all messages sent in a room to a HTML element 
 * identified by the id parameter.
 *
 * @param id The HTML element id where the message will appended as a child to
 * @author Colby O'Keefe (A00428974)
 */
function displayMessages(id) {
	// Finds the chat window from it's id and then clear all old messages
	var chatWindow = document.getElementById(id);
	chatWindow.innerHTML = "";
	
	// Check if the room has any messges sent
	if(currentRoom.messages !== undefined) {
		// Loops through the messages starting from the most recent
		currentRoom.messages.reverse().forEach(m => {
			// Creates the message HTML element
			var messageElement = document.createElement("p");
			var nameElement = document.createElement("span");
			var textElement = document.createElement("span");
			// Sets the innerHTML to the users name and their message
			nameElement.innerHTML = m.userName;
			textElement.innerHTML = ": " + m.message;
			// Appends name and text to parnet message
			messageElement.appendChild(nameElement);
			messageElement.appendChild(textElement);
			// Checks if message is sent from the server and if so
			// color the message and name red
			if (m.userName === "Server") {
				messageElement.style.color = "red";
			} else {
				// colors the users name their current choosen color
				nameElement.style.color = m.color;
			}
				
			// appends message to the chat window
			chatWindow.appendChild(messageElement);
		});
	}
}

/*
 * The routine sends a message from the user to the server.
 * 
 * @param text message sent by the user 
 * @author Colby O'Keefe (A00428974)
 */
function sendMessage(text) {
	const packet = {
		"requestType": "sendMessage",
		"message": text,
		"user": user,
		"RID": RID
	}
	ws.send(JSON.stringify(packet));
}

/*
 * This routine display a countdown from 3 using sweet alert boxes and then
 * displays a final message.
 * 
 * @param message message to display once the countdown has ended
 * @param time The time in ms for each popup to display for
 * @return A Promise object
 * @author Colby O'Keefe (A00428974)
 */
async function countdown(time, message) {
	return await new Promise((res, rej) => {
		swal({
			title: 3,
			timer: time,
			buttons: false
		}).then(() => {
			swal({
				title: 2,
				timer: time,
				buttons: false
			}).then(() => {
				swal({
					title: 1,
					timer: time,
					buttons: false
				}).then(() => {
					swal({
						title: message,
						timer: time,
						buttons: false
					}).then(res());
				})
			})
		})
	});
}

// Listnes for messages from the server
ws.onmessage = (e) => {
	const data = JSON.parse(e.data);
	// sends the servers message to the callback system
	serverCallbacks.dispatchEvent(new CustomEvent(data.responseType, {"detail": data}));

};

