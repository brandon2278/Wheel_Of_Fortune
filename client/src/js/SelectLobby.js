/*
 * This file contains the code for the lobby selection page
 * including functions and server callbacks.
 *
 * @author Colby O'Keefe (A00428974)
 */

// Time interval (in ms) to request a new roomlist from the server
const REQUEST_ROOMLIST_INTERVAL = 5000;

// stores a list of rooms
var roomList;

/*
 * Gets the lobby creation element and sets it's visibility to hidden
 * once the DOM has loaded.
 */
document.addEventListener("DOMContentLoaded", () =>  {
	var createLobby = document.getElementById("create-lobby");
	createLobby.style.visibility = "hidden";
});

/*
 * Joins Looby Via Matchmaking
 */
serverCallbacks.addEventListener("joinMatchmaking", (e) => {
    const data = e.detail;
    document.location.href = "./lobby/?RID=" + data.RID;
});

/*
 * Updates the list of rooms on the request of the server.
 */
serverCallbacks.addEventListener("updateRoomList", (e) => {
	const data = e.detail;
	roomList = data.roomList;
	displayRooms();
});

/*
 * Display the results from a attempt to enter a password protected lobby.
 * Alerts the user if their login attempt was unsuccessful.
 */
serverCallbacks.addEventListener("passwordCheckResult", (e) => {
	const data = e.detail;
	if (data.correct) document.location.href = "./lobby/?RID=" + data.RID;
	else displayIncorrectPasswordMessage();
});

/**
 * This function starts matchmaking
 *
 * @author Colby O'Keefe (A00428974)
 */
function joinMatchmaking() {
    let intervalId;

    swal({
        title: "matchmaking",
        content: {
            element: "p",
            innerText: "finding players",
            attributes: {
                id: "matchmaking-loading",
            },
        },
        button: {
            text: "cancel",
            value: true,
            visible: true,
            className: "btn btn-warning",
            closeModal: true,
        }
    }).then(() => {
        const packet = {
            "requestType": "leaveMatchmaking",
            "user": user,
        };
        ws.send(JSON.stringify(packet));

        clearInterval(intervalId);
    });

    let count = 0;
    let waitTime = 0;
    intervalId = setInterval(() => {
        let loading = document.getElementById("matchmaking-loading");
        if (loading)
        {
            loading.innerText = waitTime.toString() + "s. finding players" + ".".repeat(count);
            count++;
            if (count == 4) count = 0;
            waitTime++;
        }
    }, 1000);

    const packet = {
        "requestType": "joinMatchmaking",
        "user": user,
    };

    ws.send(JSON.stringify(packet));
    
}

/*
 * Display an alert to the user letting them know their login attempt
 * was unsuccessful.
 *
 * @author Colby O'Keefe (A00428974)
 */
function displayIncorrectPasswordMessage() {
	swal({
		title: "You Entered An Incorrect Password. Try To Rejoin.",
		timer: 3000,
		buttons: false
	})
}

/*
 * Displays the password creation box in the create lobby menu.
 *
 * @author Colby O'Keefe (A00428974)
 */
function displayPasswordCreation() {
	var pwd = document.getElementById("create-password");
	if (pwd.style.display === "none") pwd.style.display = "block";
	else pwd.style.display = "none";
}

/*
 * This function takes struct with the lobby infomation and sends a request to the server to create
 * a new lobby. The user is then moved to the lobby page.
 * 
 * @param roomData A struct that contains all the relvent infomation to create a new lobby
 * @author Colby O'Keefe (A00428974)
 */
function createRoom(roomData) {
	// Generates a random room ID (RID)
	const RID = Math.random().toString();

	// Stores room infomation into a request packet
	const packet = {
		"requestType": "createRoom",
		"roomName": roomData.Name,
		"RID": RID,
		"playerCount": parseInt(roomData.playerCount),
		"numRounds": parseInt(roomData.numRounds),
		"numPuzzles": parseInt(roomData.numPuzzles),
		"score": parseInt(roomData.score),
		"loss": parseFloat(roomData.loss),
		"vowelPrice": parseInt(roomData.vowelPrice),
		"user": user,
		"password": roomData.password,
		"hasPassword": roomData.hasPassword,
		"status": "Waiting"
	};

	// Sends the packet to the server for processing
	ws.send(JSON.stringify(packet));

	// Moves the user to the lobby page
	document.location.href = "./lobby/?RID=" + RID;
}

/*
 * Gets the users input from the create lobby menu then sends the 
 * infomation to the server.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function createGame() {
	// Gets the value from each input field
	var name = document.getElementById("create-game-name").value;
	var playerCount = document.getElementById("create-game-player-count").value;
	var numRounds = document.getElementById("create-game-round-count").value;
	var numPuzzles = document.getElementById("create-game-puzzle-count").value;
	var score = document.getElementById("create-game-round-reward").value;
	var loss = document.getElementById("create-game-bankrupt-multiplier").value;
	var vowelPrice = document.getElementById("create-game-vowel-price").value;
	var pwd = document.getElementById("create-game-password").value;

	// Stores if the room is password protected or not
	var hasPwd = pwd !== "";

	// Create a struct with all relvent room infomation
	const roomData = {
		"Name": name,
		"playerCount": playerCount,
		"numRounds": numRounds,
		"numPuzzles": numPuzzles,
		"score": score,
		"loss": loss,
		"vowelPrice": vowelPrice,
		"password": pwd,
		"hasPassword": hasPwd
	};
	
	// Sends the room infomation to the server
	createRoom(roomData);
}

/*
 * Displays an alert box to the user asking them to enter the lobbies password.
 * Once the user submits their password attempt a request is send to the server to check 
 * if the entered password was correct or not.
 * 
 * @param RID The ID form the room the user is attempting to join
 * @author Colby O'Keefe (A00428974)
 */
function enterRoomPassword(RID) {
	swal({
		title: "Enter Lobby's Password",
		content: {
			element: "input",
			attributes: {
				className: "password-box",
				onclick: () => {
					element = document.querySelectorAll(".password-box")[0];
					console.log(element);
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
			text: "Submit",
			value: true,
			visible: true,
			className: "btn btn-warning",
			closeModal: true
		}
	}).then((value) => {
		const packet = {
			"requestType": "checkLobbyPassword",
			"RID": RID,
			"passwordAttempt": value
		};

		ws.send(JSON.stringify(packet));
	});
}

/*
 * This function closes the create lobby page.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function closeCreateGame() {
	var createLobby = document.getElementById("create-lobby");
	createLobby.style.visibility = "hidden";
}

/*
 * This function moves the user to a room if there is no password otherwise
 * prompts the user to enter the rooms password.
 *
 * @param RID The ID for the room the user is joining.
 * @author Colby O'Keefe (A00428974)
 */
function joinLobby(RID) {
	if(roomList[RID].status === "Waiting" && roomList[RID].userList.length < roomList[RID].maxPlayerCount) {
		if (roomList[RID].hasPassword === false) document.location.href = "./lobby/?RID=" + RID;
		else enterRoomPassword(RID);
	}
}

/*
 * This function find the username for the leader of a lobby
 * 
 * @param RID The ID for a room
 * @return The username of the leader of the lobby
 * @author Colby O'Keefe (A00428974)
 */
function getLobbyLeadersName(RID) {
	
	var leader = null;

	roomList[RID].userList.forEach(u => {
		if(u.isLeader) {
			leader = u.Name;
		}
	});

	return leader;
}

/*
 * This function display all rooms that are currently available to the user.
 * 
 * @author Colby O'Keefe (A00428974)
 */
function displayRooms() {
	// Gets the table element storing the rooms
	var lobbyTable = document.getElementById("lobby-section");
	// Clears old list of rooms
	lobbyTable.innerHTML = "";

	// Loops through each room currently open
	for(let key in roomList) {
		// Checks of the lobby is hidden i.e. a matchmaking lobby
		if (roomList[key].isSerect) continue;

		// Creates a new table row element for the lobby
		var lobbyRow = document.createElement("tr");
		lobbyRow.classList.add("lobby-entry");

		// Checks if the room is open to join if so the text get colored white otherwise the room is colored grey 
		if(roomList[key].status === "Waiting" && roomList[key].userList.length < roomList[key].maxPlayerCount) {
			lobbyRow.style.color = "white";
		} else {
			lobbyRow.style.color = "grey";
		}
		
		// Set the onclick event to call the joinLobby function 
		lobbyRow.onclick = () => joinLobby(key);
		
		// Create table data element to stores the rooms data to be displayed
		var lobbyName = document.createElement("td");
		var lobbyCount = document.createElement("td");
		var lobbyLeader = document.createElement("td");
		var lobbyStatus = document.createElement("td");
		var lobbyHasPassword = document.createElement("td");

		// sets the text for the lobby room name and player count
		lobbyName.innerHTML = roomList[key].roomName;
		lobbyCount.innerHTML = roomList[key].userList.length + "/" + roomList[key].maxPlayerCount;
		
		// Gets the username of the lobby leader
		lobbyLeader.innerHTML = getLobbyLeadersName(key);

		// Gets the lobbies status
		lobbyStatus.innerHTML = roomList[key].status;
		
		// displays if the lobby is password protected or not
		lobbyHasPassword.innerHTML = (roomList[key].hasPassword) ? "Yes" : "No"

		// Appends each element to the lobby row
		lobbyRow.appendChild(lobbyName);
		lobbyRow.appendChild(lobbyCount);
		lobbyRow.appendChild(lobbyLeader);
		lobbyRow.appendChild(lobbyStatus);
		lobbyRow.appendChild(lobbyHasPassword);
		// appends the row to the table
		lobbyTable.appendChild(lobbyRow);
	}
}

/*
 * This function is called upon the WebSocket connection opening
 */
ws.onopen = () => {
	// Sends a request to get a list of rooms from the server
	var packet = {"requestType": "getRoomList"};
	ws.send(JSON.stringify(packet));

	// Inits user infomation
	user = getUserInfomation();

	// Sends a request to the server on a interval to get an updated list of rooms. 
	setInterval(() => {
		var packet = {"requestType": "getRoomList"};
		ws.send(JSON.stringify(packet));
	}, REQUEST_ROOMLIST_INTERVAL);
};
