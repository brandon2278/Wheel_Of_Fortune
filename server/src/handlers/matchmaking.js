/*
 * This file contains the code related to matchmaking
 *
 * @author Colby O'Keefe (A00428974)
 */

// Requires
let serverData = require("../data.js");
let communicate = require("../api/communicate.js")

// max number of players that matchmaking will queue together
const maxPlayerCount = 8;

// Store the last time matchmaking as dispatched
let lastDispatch = Date.now();
// An array to store the pool of players looking for a match via match making
let playerPool = [];

// Define the max wait by players
const poolMaxWaitByPlayers = [
	Number.MAX_SAFE_INTEGER,
	Number.MAX_SAFE_INTEGER,
	60000,
	50000,
	40000,
	30000,
	20000,
	10000,
	0
];

// Sets an interval to update matchmaking
setInterval(matchmakingUpdate, 2000);

/**
 * Gets the timeout time
 * 
 * @return The timeout time
 * @author Colby O'Keefe (A00428974)
 */
function getTimeout() {
	return Date.now() - lastDispatch;
}

/**
 * This function places a user into a room
 *
 * @param RID The rooms ID
 * @param user The user wanting to  join
 * @param ws The users websocket
 * @return True if the user joined the lobby correctly and false oterwise 
 * @author Colby O'Keefe (A00428974)
 */
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

/**
 * This function dispatches the users to a mutliplayer lobby
 *  
 * @author Colby O'Keefe (A00428974)
 */
function dispatchPlayers() {
	// Gets players in dispatch group
	let players = playerPool.splice(0, playerPool.length % (maxPlayerCount + 1)); 

	// Generate lobby data
	let RID = Math.random().toString();
	let name = "Matchcmaking Lobby " + Math.floor(Math.random() * 1000).toString();
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

	// Puts each user in the dispatch in the lobby
	players.forEach(p => joinRoom(RID, p.user, p.ws));

	// Emits to room that players joined the lobby
	communicate.emitToRoom(RID, {
		"responseType": "joinMatchmaking",
		"RID": RID,
	});

	// updates last dispatch time
	lastDispatch = Date.now();
}

/**
 * This function updates the matchingmakin pool i.e. 
 * distpatches user when a group is found
 * 
 * @author Colby O'Keefe (A00428974)
 */
function matchmakingUpdate() {
	if (playerPool.length == 0) lastDispatch = Date.now();
	if (playerPool.length > maxPlayerCount)
		dispatchPlayers();
	else if (getTimeout() > poolMaxWaitByPlayers[playerPool.length])
		dispatchPlayers();
}

/**
 * This function is ran when a user leaves the matchmaking pool i.e. cancel or 
 * gets dispatched
 * 
 * @param data The data from client
 * @param req The requestors WebSocket
 * @author Colby O'Keefe (A00428974)
 */
function leaveMatchmaking(data, req) {
	let playerIndex = playerPool.findIndex(p => p.user.UID == data.user.UID);
	if (playerIndex != -1)
		playerPool.splice(playerIndex, 1);
}

/**
 *  Adds a user to matchmakng
 *
 * @param data The data from clinet
 * @param req The requestors WebSocket
 * @author Colby O'Keefe (A00428974)
 */
function joinMatchmaking(data, req) {
	playerPool.push({
		"user": data.user,
		"ws": req.ws,
	});
}

// Exports
module.exports = (requestHandler) => {
	requestHandler.on("joinMatchmaking", joinMatchmaking);
	requestHandler.on("leaveMatchmaking", leaveMatchmaking);

	return requestHandler;
};
