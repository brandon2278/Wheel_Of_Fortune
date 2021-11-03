var currentRoom;
const RID = document.location.href.split("=")[1];

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


serverCallbacks.addEventListener("updateRoom", (e) => {
	console.log("Updating Room")
	const data = e.detail;
	updateRoom(data);
});

function updateRoom(data) {
	var me = data.room.userList.find(u => u.user.UID === user.UID);
	if (me.user.isLeader) {
		user.isLeader = true;
		var forceStart = document.getElementById("force-start");
		forceStart.style.display = "initial";
	}
	currentRoom = data.room;

	var playerCount = document.getElementById("player-count");
	playerCount.innerHTML = "Player Count: " + currentRoom.userList.length + "/10";

	displayMessages();
	displayUsers();
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

function displayUsers() {
	var lobbyContainer = document.getElementById("user-list");
	lobbyContainer.innerHTML = '';
	const currentRID = document.location.href.split("=")[1];
	for(const user of currentRoom.userList) {
		var lobbyElement = document.createElement("li");
		var aElement = document.createElement("a");
		if (user.user.isLeader) aElement.style.color = "yellow";
		else if(user.user.isReady) aElement.style.color = "#22FF22";
		aElement.className = "btn btn-dark";
		aElement.setAttribute("role", "button");
		aElement.style.fontSize = "2em";
		aElement.innerHTML = user.user.Name;
		lobbyElement.appendChild(aElement);
		lobbyContainer.appendChild(lobbyElement);
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

function displayMessages() {
	var chatWindow = document.getElementById("chat-window");
	chatWindow.innerHTML = "";
	if(currentRoom.messages !== undefined) {
		currentRoom.messages.reverse().forEach(m => {
			var messageElement = document.createElement("p");
			messageElement.innerHTML = m.userName + ": " + m.message;
			chatWindow.appendChild(messageElement);
		});
	}
}

function readyUp() {
	var me = currentRoom.userList.find(u => u.user.UID === user.UID);
	me.user.isReady = !me.user.isReady;
	displayUsers();
}

function forceStart() {

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
