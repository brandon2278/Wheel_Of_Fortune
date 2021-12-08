let ws = new WebSocket("ws://127.0.0.1:8010");

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
}, 3000);

var user = {
	"Name": "Tester",
	"UID" : -1,
	"closeTime": -1,
	"isLeader": false,
	"isReady": false,
	"mouseX": 0,
	"mouseY": 0,
	"inGame": false,
	"pointerColor": "red"
}

var roomList;

var currentRoom = null;
const RID = document.location.href.split("=")[1];

var serverCallbacks = new EventTarget(); 

serverCallbacks.addEventListener("updateRoomList", (e) => {
	const data = e.detail;
	roomList = data.roomList;
	displayRooms();
});

serverCallbacks.addEventListener("updateRoom", (e) => {
	const data = e.detail;
	updateRoom(data);
});

serverCallbacks.addEventListener("passwordCheckResult", (e) => {
	const data = e.detail;
	if (data.correct) document.location.href = "./lobby/?RID=" + data.RID;
	else displayIncorrectPasswordMessage();
});

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

function updateUser() {
	currentRoom.userList.forEach(u => {
		if (u.UID === user.UID) {
			user = u;
		}
	});
}

function displayIncorrectPasswordMessage() {
	swal({
		title: "You Entered An Incorrect Password. Try To Rejoin.",
		timer: 3000,
		buttons: false
	})
}

function displayPasswordCreation() {
	var pwd = document.getElementById("create-password");
	if (pwd.style.display === "none") pwd.style.display = "block";
	else pwd.style.display = "none";
}

function displayMessages(id) {
	var chatWindow = document.getElementById(id);
	chatWindow.innerHTML = "";
	if(currentRoom.messages !== undefined) {
		currentRoom.messages.reverse().forEach(m => {
			var messageElement = document.createElement("p");
			var nameElement = document.createElement("span");
			var textElement = document.createElement("span");
			nameElement.innerHTML = m.userName;
			textElement.innerHTML = ": " + m.message;
			messageElement.appendChild(nameElement);
			messageElement.appendChild(textElement);
			if (m.userName === "Server") {
				messageElement.style.color = "red";
			} else {
				nameElement.style.color = m.color;
			}
			chatWindow.appendChild(messageElement);
		});
	}
}

function sendMessage(text) {
	const packet = {
		"requestType": "sendMessage",
		"message": text,
		"user": user,
		"RID": RID
	}
	ws.send(JSON.stringify(packet));
}

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

function leaveRoom() {
	const packet = {
		"requestType": "exitRoom",
		"RID": RID,
		"user": user
	}
	ws.send(JSON.stringify(packet));
	document.location.href = "../";
}

function joinRoom(RID) {
	const packet = {
		"requestType": "joinRoom",
		"RID": RID,
		"user": user
	};
	ws.send(JSON.stringify(packet));
}

function createRoom(roomData) {
	const RID = Math.random().toString();
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
	ws.send(JSON.stringify(packet));
	document.location.href = "./lobby/?RID=" + RID;
}

function createGame() {
	var name = document.getElementById("create-game-name").value;
	var playerCount = document.getElementById("create-game-player-count").value;
	var numRounds = document.getElementById("create-game-round-count").value;
	var numPuzzles = document.getElementById("create-game-puzzle-count").value;
	var score = document.getElementById("create-game-round-reward").value;
	var loss = document.getElementById("create-game-bankrupt-multiplier").value;
	var vowelPrice = document.getElementById("create-game-vowel-price").value;
	var pwd = document.getElementById("create-game-password").value;
	var hasPwd = pwd !== "";
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

	createRoom(roomData);
}

function closeCreateGame() {
	var createLobby = document.getElementById("create-lobby");
	createLobby.style.visibility = "hidden";
}

function enterRoomPassword(RID) {
	swal({
		title: "Enter Lobby's Password",
		content: {
			element: "input"
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

function joinLobby(RID) {
	if(roomList[RID].status === "Waiting" && roomList[RID].userList.length < roomList[RID].maxPlayerCount) {
		if (roomList[RID].hasPassword === false) document.location.href = "./lobby/?RID=" + RID;
		else enterRoomPassword(RID);
	}
}

function displayRooms() {
	var lobbyTable = document.getElementById("lobby-section");
	lobbyTable.innerHTML = "";
	for(let key in roomList) {
		var lobbyRow = document.createElement("tr");
		lobbyRow.classList.add("lobby-entry");

		if(roomList[key].status === "Waiting" && roomList[key].userList.length < roomList[key].maxPlayerCount) {
			lobbyRow.style.color = "white";
		} else {
			lobbyRow.style.color = "grey";
		}

		lobbyRow.onclick = () => joinLobby(key);

		var lobbyName = document.createElement("td");
		var lobbyCount = document.createElement("td");
		var lobbyLeader = document.createElement("td");
		var lobbyStatus = document.createElement("td");
		var lobbyHasPassword = document.createElement("td");

		lobbyName.innerHTML = roomList[key].roomName;

		lobbyCount.innerHTML = roomList[key].userList.length + "/" + roomList[key].maxPlayerCount;

		var leader = null;
		roomList[key].userList.forEach(u => {
			if(u.isLeader) {
				leader = u.Name;
			}
		});

		lobbyLeader.innerHTML = leader;

		lobbyStatus.innerHTML = roomList[key].status;
		
		lobbyHasPassword.innerHTML = (roomList[key].hasPassword) ? "Yes" : "No"

		lobbyRow.appendChild(lobbyName);
		lobbyRow.appendChild(lobbyCount);
		lobbyRow.appendChild(lobbyLeader);
		lobbyRow.appendChild(lobbyStatus);
		lobbyRow.appendChild(lobbyHasPassword);
		lobbyTable.appendChild(lobbyRow);
	}
}


ws.onmessage = (e) => {
	const data = JSON.parse(e.data);
	serverCallbacks.dispatchEvent(new CustomEvent(data.responseType, {"detail": data}));

};

