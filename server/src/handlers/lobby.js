/**
 * This file contains all server code related to the lobby system.
 *
 * @author Colby O'Keefe (A00428974)
 */

// Requires
let serverData = require("../data.js");
let communicate = require("../api/communicate.js")
let filter = require("../api/filter.js");

// Max timeout for user is 30,000 ms (30s) 
const MAX_TIMEOUT = 30000;

// Checks for dissconnected WebSockets every 5s
const CHECK_DISCONNECTS_EVERY = 5000

/*
 * Checks for "dead" users on an interval
 */
setInterval(() => {
		clearRooms();
}, CHECK_DISCONNECTS_EVERY);

/**
 * This function finds a user given there WebSocket
 *
 * @param ws The user WebSocket
 * @return The found user
 * @author Colby O'Keefe (A00428974)
 */
function getUserFromWS(ws) {
	var UID = null;
	for (let key in serverData.userWebSockets) {
		if (serverData.userWebSockets[key] === ws) {
			UID = key;
			break;
		}
	}
	
	for (let key in serverData.roomList) {
		var foundUser = serverData.roomList[key].userList.find(u => u.UID === UID);
		if (foundUser !== undefined) return foundUser;
	}
	return undefined;
}

/**
 * This function find the index of a user in the room's user list given there UID
 *
 * @param UID The users UID
 * @return The users index
 * @author Colby O'Keefe (A00428974)
 */
function getUserIndex(UID) {
	for (let key in serverData.roomList) {
		var foundIndex = serverData.roomList[key].userList.findIndex(u => u.UID === UID);
		if (foundIndex !== -1) return foundIndex;
	}
	return -1;
}

/**
 * This function adds a user to a room.
 * 
 * @param RID The ID of the room
 * @param user The user that want to join the room
 * @param ws The users WebSocket
 * @return True if the user succssfully joinned the lobby False otherwise
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
 * Removes a user from a room
 * 
 * @param RID The room ID
 * @param userIndex The index of the user in the room's user list
 * @author Colby O'Keefe (A00428974)
 */
function removeUser(RID, userIndex) {
	let isLeader = serverData.roomList[RID].userList[userIndex].isLeader; 
	serverData.roomList[RID].userList.splice(userIndex, 1);
	if (isLeader && serverData.roomList[RID].userList.length !== 0) {
		serverData.roomList[RID].userList[0].isLeader = true;
	}

	updateRoom(RID);
}

/**
 * This function find any user with dead WebSockets and remove then from the
 * lobby if there WebSocket was dead for longer than the max timeout. 
 * 
 * @author Colby O'Keefe (A00428974) 
 */
function clearRooms() {
	// Loops through each room
	for (let key in serverData.roomList) {
		// Remove users in each room if they exceed the max timeout
		serverData.roomList[key].userList.forEach((user, index, array) => {
			if(serverData.userWebSockets[user.UID].readyState === 3) {
				if(Date.now() - user.closeTime > MAX_TIMEOUT) {
					removeUser(key, index);
				}
			}
		});

		// Check if room is empty and if it is the lobby is removed
		if (serverData.roomList[key].userList.length === 0) {
			communicate.emitToRoom(key, {
				"responseType": "removeLobby",
				"RID": key
			});

			delete serverData.roomList[key];
		}
	}

}

/**
 *  This function emits an updated room to 
 *  every user in a lobby.
 * 
 * @param RID The ID of the room
 * @author Colby O'Keefe (A00428974)
 */
function updateRoom(RID) {	
	communicate.emitToRoom(RID, {
		"responseType": "updateRoom",
		"room": communicate.formatRoom(serverData.roomList[RID])
	});
}

/**
 * This function add a message to a room
 *
 * @param text The message being sent 
 * @param RID The rooms ID
 * @param user The user sending a message
 * @author Colby O'Keefe (A00428974)
 */
function addMessage(text, RID, user) {

	const message =  {
		"message": filter.filterMessage(text),
		"userName": user.Name,
		"color": user.pointerColor
	}
	serverData.roomList[RID].messages.push(message);

	updateRoom(RID);
}

/**
 * This function update a user in a room
 *
 * @param user
 * @param RID The ID of the room
 * @author Colby O'Keefe (A00428974) 
 */
function updateUser(user, RID) {
	var userIndex = getUserIndex(user.UID);
	serverData.roomList[RID].userList[userIndex] = user;
	updateRoom(RID);
}

/**
 * Request handlers
 */
module.exports = (requestHandler) => {

	requestHandler.on("getRoomList", (data, req) => {
		// Sends the current room list to the client
		const packet = {
			"responseType": "updateRoomList",
			"roomList": communicate.formatRoomList()
		};
				
		req.ws.send(JSON.stringify(packet));
	});

	requestHandler.on("joinRoom", (data, req) => {
		// Emits the new room infomation to the lobby
		var hasNewUser = joinRoom(data.RID, data.user, req.ws);
		if(hasNewUser) {
			updateRoom(data.RID);
		}
		
	});

	requestHandler.on("createRoom", (data, req) => {
		// Sets up new room
		serverData.roomList[data.RID] = {
			"userList": [],
			"roomName": data.roomName,
			"messages": [],
			"lossModifier": data.loss,
			"correctScore": data.score,
			"puzzlesPerRound": data.numPuzzles,
			"maxNumberOfRounds": data.numRounds,
			"maxPlayerCount": data.playerCount,
			"status": data.status,
			"isSerect": false,
			"vowelPrice": data.vowelPrice,
			"password": data.password,
			"hasPassword": data.hasPassword
		}
		// Add clinet to room
		data.user.isLeader = true;
		joinRoom(data.RID, data.user, req.ws);
	});

	requestHandler.on("getRoom", (data, req) => {
		// Sends room to client
		const packet = {
			"responseType":"getRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		}
		req.ws.send(JSON.stringify(packet));
	});

	requestHandler.on("exitRoom", (data, req) => {
		// removes user from room
		let foundIndex = getUserIndex(data.user.UID);
		if (foundIndex !== -1) removeUser(data.RID, foundIndex);
	});

	requestHandler.on("sendMessage", (data, req) => {
		// Adds message to room
		addMessage(data.message, data.RID, data.user);
	});

	requestHandler.on("updateUser", (data, req) => {
		// updates the user
		updateUser(data.user, data.RID);
	});
	
	requestHandler.on("close", (data, req) => {
		// Detects when a users WebSocket closes
		let user = getUserFromWS(req.ws);
		if (user !== undefined) { 
			user.closeTime = Date.now();
		}
		req.ws.close();
	});

	requestHandler.on("startCountdown", (data, req) => {
		// Emits ti lobby to start countdown
		communicate.emitToRoom(data.RID, {
			"responseType": "startCountdown"
		});
	});

	requestHandler.on("checkLobbyPassword", (data, req) => {
		// check if the clinet entered the current lobby password
		var passwordIsCorrect = data.passwordAttempt === serverData.roomList[data.RID].password;
		// sends password check results back to client
		const packet = {
			"responseType": "passwordCheckResult",
			"correct": passwordIsCorrect,
			"RID": (passwordIsCorrect) ? data.RID : -1
		}

		req.ws.send(JSON.stringify(packet));
	});

	requestHandler.on("kickPlayer", (data, req) => {
		// Removes the user from the lobby
		removeUser(data.RID, getUserIndex(data.UID));
		const packet = {
			"responseType": "kick"
		};
		serverData.userWebSockets[data.UID].send(JSON.stringify(packet));
	});

	requestHandler.on("updateUserPointerColor", (data, req) => {
		// updates the color of the users mouse pointer
		serverData.roomList[data.RID].userList[getUserIndex(data.UID)].pointerColor = data.pointerColor;
		updateRoom(data.RID);
	});

	requestHandler.on("checkIfValidRID", (data, req) => {
		const packet = {
			"responseType": "validifyRIDResult",
			"isValid": data.RID in serverData.roomList
		};
		req.ws.send(JSON.stringify(packet));
	});
	
	return requestHandler;
};
