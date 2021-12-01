let messageBox;
window.onload = () => {
	messageBox = document.getElementById("message-box");
	messageBox.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			sendMessage(e.target.value);
			e.target.value = "";
		}
	}); 
}

serverCallbacks.addEventListener("getRoom", (e) => {
	console.log("Fetching Room")
	const data = e.detail;
	updateRoom(data);
	var roomTitle = document.getElementById("room-name");
	roomTitle.innerHTML = currentRoom.roomName;
});



serverCallbacks.addEventListener("startGame", (e) => {
	const data = e.detail;
	updateRoom(data);
	startGame();

});

serverCallbacks.addEventListener("startCountdown", async (e) => {
	await countdown(1000, "Starting!!!");
	const packet = {
		"requestType": "startGame",
		"RID": RID
	}
	ws.send(JSON.stringify(packet));
});

function updateRoom(data) {
	var me = data.room.userList.find(u => u.UID === user.UID);
	if (me.isLeader) {
		user.isLeader = true;
		var forceStart = document.getElementById("force-start");
		forceStart.style.display = "initial";
	}
	currentRoom = data.room;

	var playerCount = document.getElementById("player-count");
	playerCount.innerHTML = "Player Count: " + currentRoom.userList.length + "/10";

	displayMessages("chat-window");
	displayUsers();
}

function displayUsers() {
	var lobbyContainer = document.getElementById("user-list");
	lobbyContainer.innerHTML = '';
	const currentRID = document.location.href.split("=")[1];
	for(const user of currentRoom.userList) {
		var lobbyElement = document.createElement("li");
		var aElement = document.createElement("a");
		if (user.isLeader) aElement.style.color = "yellow";
		else if(user.isReady) aElement.style.color = "#22FF22";
		aElement.className = "btn btn-dark";
		aElement.setAttribute("role", "button");
		aElement.style.fontSize = "2em";
		aElement.innerHTML = user.Name;
		lobbyElement.appendChild(aElement);
		lobbyContainer.appendChild(lobbyElement);
	}
}

function readyUp() {
	var me = currentRoom.userList.find(u => u.UID === user.UID);
	me.isReady = !me.isReady;
	const packet =  {
		"requestType": "updateUser",
		"user": me,
		"RID": RID
	};
	ws.send(JSON.stringify(packet));
	// NOTE: Potional Error
	if(checkReadyStatus()) {
		roundCountdown();
	}
}

function checkReadyStatus() {
	var startGame = true;
	currentRoom.userList.forEach(user => {
		if (user.isReady == false) {
			startGame = false;
		}
	});

	return startGame;
}

function forceStart() {
	roundCountdown();	
}

async function roundCountdown() {
	const packet = { 
		"requestType": "startCountdown",
		"RID": RID
	}

	ws.send(JSON.stringify(packet));
}

function startGame() {
	document.location.href = "Game.php?RID=" + RID;
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
