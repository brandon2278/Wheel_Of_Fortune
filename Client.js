let ws = new WebSocket("wss://ddmo.xyz:8169");

var user = {
	"Name": "Tester",
	"UID" : -1,
	"closeTime": -1,
	"isLeader": false,
	"isReady": false
}

var roomList;

var makingLobby = false;

function joinRoom(RID) {
	const packet = {
		"requestType": "joinRoom",
		"RID": RID,
		"user": user
	};
	ws.send(JSON.stringify(packet));
}

function createRoom(roomName) {
	const RID = Math.random().toString();
	const packet = {
		"requestType": "createRoom",
		"roomName": roomName,
		"RID": RID,
		"user": user
	};
	ws.send(JSON.stringify(packet));
	document.location.href = "Lobby.php?RID=" + RID;
}

function displayRooms() {
	var body = document.getElementsByTagName("body")[0];
	body.innerHTML = "";
	
	var menuButton = document.createElement("button");
	menuButton.innerHTML = "Back";
	menuButton.className = "btn btn-dark";
	menuButton.onclick = () => { document.location.href = 'Menu.php'; }
	menuButton.style.fontSize = "2em";
	body.appendChild(menuButton);

	var textbox = document.createElement("input");
	textbox.id = "lobby-name-input";
	textbox.style.visibility = "hidden";
	body.appendChild(textbox);
	
	var createLobbyButton = document.createElement("button");
	createLobbyButton.innerHTML = "Create Lobby";
	createLobbyButton.className = "btn btn-dark";
	createLobbyButton.onclick = () => {
		makingLobby = true;
		textbox.style.visibility = "visible";
		textbox.addEventListener("keydown", (e) => {
			if(makingLobby) {
				if(e.key === "Enter" && e.target.value === "") {
					makingLobby = false;
					textbox.style.visibility = "hidden";
					textbox.removeEventListener("keydown", this,false)
				}
				else if (e.key === "Enter") {
					makingLobby = false;
					createRoom(e.target.value);
					e.target.value = "";
					textbox.style.visibility = "hidden";
					textbox.removeEventListener("keydown", this,false)

				}
			}
		});
	}
	createLobbyButton.style.fontSize = "2em";
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
		lobbyRow.style.color = "white";
		lobbyRow.style.textAlign = "center";

		lobbyRow.onclick = (e) => {
			const RID = key;
			document.location.href = "Lobby.php?RID=" + RID;
		};

		var lobbyName = document.createElement("td");
		var lobbyCount = document.createElement("td");
		var lobbyLeader = document.createElement("td");
		var lobbyStatus = document.createElement("td");

		lobbyName.innerHTML = roomList[key].roomName;

		lobbyCount.innerHTML = roomList[key].userList.length + "/10";

		var leader = null;
		roomList[key].userList.forEach(u => {
			if(u.user.isLeader) {
				leader = u.user.Name;
			}
		});

		lobbyLeader.innerHTML = leader;

		lobbyStatus.innerHTML = "Waiting";

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

var serverCallbacks = new EventTarget(); 

serverCallbacks.addEventListener("updateRoomList", (e) => {
	const data = e.detail;
	roomList = data.roomList;
	if (!makingLobby) displayRooms();
});

ws.onmessage = (e) => {
	const data = JSON.parse(e.data);
	serverCallbacks.dispatchEvent(new CustomEvent(data.responseType, {"detail": data}));

};

