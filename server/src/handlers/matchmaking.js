let serverData = require("../data.js");
let communicate = require("../api/communicate.js")

const maxPlayerCount = 8;

let lastDispatch = Date.now();
let playerPool = [];

const poolMaxWaitByPlayers = [
	Number.MAX_SAFE_INTEGER,
	Number.MAX_SAFE_INTEGER,
	60000,
	50000,
	40000,
	30000,
	20000,
	10000,
	0,
];

setInterval(matchmakingUpdate, 2000);

function getTimeout() {
	return Date.now() - lastDispatch;
}

function joinRoom(RID, user, ws) {
	// Check if the room exist
	if (serverData.roomList[RID] === undefined) {
		return false;
	}
	// Checks if the user is already in the room i.e. dead WebSocket
	var foundUser = serverData.roomList[RID].userList.find((e) => {
		return e.UID == user.UID
	});

	// If user was not found adds them to room
	if (foundUser === undefined) {
		const packet = user
		serverData.userWebSockets[user.UID] = ws;
		serverData.roomList[RID].userList.push(packet);
		return true;
	}
	else {
		// Repalce users old WebSocket if they were in the room before
		serverData.userWebSockets[foundUser.UID] = ws; 
		return false;
	}
}

function dispatchPlayers() {
	let players = playerPool.splice(0, playerPool.length % (maxPlayerCount + 1)); 

	let RID = Math.random().toString();
	let name = Math.random().toString();
	let password = Math.random().toString();

	serverData.roomList[RID] = {
		"userList": [],
		"roomName": name,
		"messages": [],
		"lossModifier": 1,
		"correctScore": 500,
		"puzzlesPerRound": 3,
		"maxNumberOfRounds": 3,
		"maxPlayerCount": players.length,
		"status": "Hidden",
		"vowelPrice": 250,
		"password": password,
		"isSerect": true,
		"hasPassword": false,
	};

	players.forEach(p => joinRoom(RID, p.user, p.ws));

	communicate.emitToRoom(RID, {
		"responseType": "joinMatchmaking",
		"RID": RID,
	});

	lastDispatch = Date.now();
}

function matchmakingUpdate() {
	if (playerPool.length == 0) lastDispatch = Date.now();
	if (playerPool.length > maxPlayerCount)
		dispatchPlayers();
	else if (getTimeout() > poolMaxWaitByPlayers[playerPool.length])
		dispatchPlayers();
}

function leaveMatchmaking(data, req) {
	let playerIndex = playerPool.findIndex(p => p.user.UID == data.user.UID);
	if (playerIndex != -1)
		playerPool.splice(playerIndex, 1);
}

function joinMatchmaking(data, req) {
	playerPool.push({
		"user": data.user,
		"ws": req.ws,
	});
}

module.exports = (requestHandler) => {
	requestHandler.on("joinMatchmaking", joinMatchmaking);
	requestHandler.on("leaveMatchmaking", leaveMatchmaking);

	return requestHandler;
};
