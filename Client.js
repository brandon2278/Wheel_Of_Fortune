let ws = new WebSocket("wss://ddmo.xyz/wof/ws");

var user = {
	"Name": "Tester",
	"UID" : -1,
	"closeTime": -1,
	"isLeader": false,
	"isReady": false
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
	console.log("Updating Room")
	const data = e.detail;
	updateRoom(data);
});

function displayMessages(id) {
	var chatWindow = document.getElementById(id);
	chatWindow.innerHTML = "";
	if(currentRoom.messages !== undefined) {
		currentRoom.messages.reverse().forEach(m => {
			var messageElement = document.createElement("p");
			messageElement.innerHTML = m.userName + ": " + m.message;
			if (m.userName === "Server") {
				messageElement.style.color = "red";
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
	document.location.href = "SelectLobby.php";
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
		"status": "Waiting"
	};
	ws.send(JSON.stringify(packet));
	document.location.href = "Lobby.php?RID=" + RID;
}

function createGame() {
	var name = document.getElementById("create-game-name").value;
	var playerCount = document.getElementById("create-game-player-count").value;
	var numRounds = document.getElementById("create-game-round-count").value;
	var numPuzzles = document.getElementById("create-game-puzzle-count").value;
	var score = document.getElementById("create-game-round-reward").value;
	var loss = document.getElementById("create-game-bankrupt-multiplier").value;
	var vowelPrice = document.getElementById("create-game-vowel-price").value;

	const roomData = {
		"Name": name,
		"playerCount": playerCount,
		"numRounds": numRounds,
		"numPuzzles": numPuzzles,
		"score": score,
		"loss": loss,
		"vowelPrice": vowelPrice
	};

	createRoom(roomData);
}

function closeCreateGame() {
	var createLobby = document.getElementById("create-lobby");
	createLobby.style.visibility = "hidden";
}

function displayRooms() {
	var body = document.getElementById("lobby");
	body.innerHTML = "";
	
	var menuButton = document.createElement("button");
	menuButton.innerHTML = "Back";
	menuButton.className = "btn btn-warning";
	menuButton.onclick = () => { document.location.href = 'index.php'; }
	menuButton.style.fontSize = "1.2em";
	body.appendChild(menuButton);

	var createLobbyButton = document.createElement("button");
	createLobbyButton.innerHTML = "Create Lobby";
	createLobbyButton.className = "btn btn-warning";
	createLobbyButton.onclick = () => {
		createLobby.style.visibility = "visible";
	}
	createLobbyButton.style.fontSize = "1.2em";
	createLobbyButton.style.marginLeft = "20px";
	createLobbyButton.style.margin = "20px";
	body.appendChild(createLobbyButton);

	var lobbyContainer = document.createElement("div");
	lobbyContainer.id = "lobby-view-container";

	var lobbyTable = document.createElement("table");
	lobbyTable.id = "lobby-table";
	var lobbyTableBody = document.createElement("tbody");

	var titleRow = document.createElement("tr");
	titleRow.style.textDecoration = "underline overline";
	titleRow.style.textAlign = "center";
	var nameElement = document.createElement("td");
	nameElement.innerHTML = "Lobby Name";
	var playerCountElement = document.createElement("td");
	playerCountElement.innerHTML = "Player Count";
	var leaderElement = document.createElement("td");
	leaderElement.innerHTML = "Leader";
	var statusElement = document.createElement("td");
	statusElement.innerHTML = "Status";

	titleRow.appendChild(nameElement);
	titleRow.appendChild(playerCountElement);
	titleRow.appendChild(leaderElement);
	titleRow.appendChild(statusElement);
	lobbyTableBody.appendChild(titleRow);

	for(let key in roomList) {
		var lobbyRow = document.createElement("tr");
		lobbyRow.style.fontSize = "1em";
		if(roomList[key].status === "Waiting" && roomList[key].userList.length < roomList[key].maxPlayerCount) {
			lobbyRow.style.color = "white";
		} else {
			lobbyRow.style.color = "grey";
		}
		lobbyRow.style.textAlign = "center";


		lobbyRow.onclick = (e) => {
			const RID = key;
			if(roomList[RID].status === "Waiting" && roomList[key].userList.length < roomList[key].maxPlayerCount) {
				document.location.href = "Lobby.php?RID=" + RID;
			}
		};

		var lobbyName = document.createElement("td");
		var lobbyCount = document.createElement("td");
		var lobbyLeader = document.createElement("td");
		var lobbyStatus = document.createElement("td");

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

		lobbyRow.appendChild(lobbyName);
		lobbyRow.appendChild(lobbyCount);
		lobbyRow.appendChild(lobbyLeader);
		lobbyRow.appendChild(lobbyStatus);
		lobbyTableBody.appendChild(lobbyRow);
	}
	lobbyTable.appendChild(lobbyTableBody);
	lobbyContainer.appendChild(lobbyTable);
	body.appendChild(lobbyContainer);

}


ws.onmessage = (e) => {
	const data = JSON.parse(e.data);
	serverCallbacks.dispatchEvent(new CustomEvent(data.responseType, {"detail": data}));

};

