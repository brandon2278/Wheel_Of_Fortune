let serverData = require("../data.js");
let communicate = require("../api/communicate.js")

const MAX_TIMEOUT = 2000;

setInterval(() => {
		clearRooms();
}, 5000);

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

function getUserIndex(UID) {
	for (let key in serverData.roomList) {
		var foundIndex = serverData.roomList[key].userList.findIndex(u => u.UID === UID);
		if (foundIndex !== -1) return foundIndex;
	}
	return -1;
}

function joinRoom(RID, user, ws) {
	console.log(Object.keys(serverData.userWebSockets).length);
	if (serverData.roomList[RID] === undefined) {
		return false;
	}
	var foundUser = serverData.roomList[RID].userList.find((e) => {
		return e.UID == user.UID
	});

	if (foundUser === undefined) {
		console.log("New User!!!");
		const packet = user
		serverData.userWebSockets[user.UID] = ws;
		serverData.roomList[RID].userList.push(packet);
		return true;
	}
	else {
		console.log("Here!")
		serverData.userWebSockets[foundUser.UID] = ws; 
		return false;
	}
}

function removeUser(RID, userIndex) {
	let isLeader = serverData.roomList[RID].userList[userIndex].isLeader; 
	serverData.roomList[RID].userList.splice(userIndex, 1);
	if (isLeader && serverData.roomList[RID].userList.length !== 0) {
		serverData.roomList[RID].userList[0].isLeader = true;
	}

	updateRoom(RID);
}

function clearRooms() {
	for (let key in serverData.roomList) {
		serverData.roomList[key].userList.forEach((user, index, array) => {
			if(serverData.userWebSockets[user.UID].readyState === 3) {
				if(Date.now() - user.closeTime > MAX_TIMEOUT) {
					removeUser(key, index);
				}
			}
		});
		if (serverData.roomList[key].userList.length === 0) {
			communicate.emitToRoom(key, {
				"responseType": "removeLobby",
				"RID": key
			});

			delete serverData.roomList[key];
		}
	}

}

function updateRoom(RID) {
	
	communicate.emitToRoom(RID, {
		"responseType": "updateRoom",
		"room": communicate.formatRoom(serverData.roomList[RID])
	});
}

function addMessage(text, RID, user) {
	const message =  {
		"message": text,
		"userName": user.Name,
		"color": user.pointerColor
	}
	serverData.roomList[RID].messages.push(message);

	updateRoom(RID);
}

function updateUser(user, RID) {
	var userIndex = getUserIndex(user.UID);
	serverData.roomList[RID].userList[userIndex] = user;
	updateRoom(RID);
}

module.exports = (requestHandler) => {
	requestHandler.on("getRoomList", (data, req) => {
		console.log("At Get Room List")
		const packet = {
			"responseType": "updateRoomList",
			"roomList": communicate.formatRoomList()
		};
				
		req.ws.send(JSON.stringify(packet));
	});

	requestHandler.on("joinRoom", (data, req) => {
		//console.log("At Join Room");
		//console.log(data);
		var hasNewUser = joinRoom(data.RID, data.user, req.ws);
		if(hasNewUser) {
			console.log("Emmiting to Room " + data.RID);
			updateRoom(data.RID);
		}
		
	});

	requestHandler.on("createRoom", (data, req) => {
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
			"vowelPrice": data.vowelPrice,
			"password": data.password,
			"hasPassword": data.hasPassword
		}
		data.user.isLeader = true;
		joinRoom(data.RID, data.user, req.ws);
	});

	requestHandler.on("getRoom", (data, req) => {
		const packet = {
			"responseType":"getRoom",
			"room": communicate.formatRoom(serverData.roomList[data.RID])
		}
		req.ws.send(JSON.stringify(packet));
	});

	requestHandler.on("exitRoom", (data, req) => {
		let foundIndex = getUserIndex(data.user.UID);
		console.log(foundIndex)
		if (foundIndex !== -1) removeUser(data.RID, foundIndex);
	});

	requestHandler.on("sendMessage", (data, req) => {
		addMessage(data.message, data.RID, data.user);
	});

	requestHandler.on("removeMessage", (data, req) => {
	});

	requestHandler.on("updateUser", (data, req) => {
		updateUser(data.user, data.RID);
	});
	
	requestHandler.on("close", (data, req) => {
		console.log("Closed! :<");
		let user = getUserFromWS(req.ws);
		if (user !== undefined) { 
			user.closeTime = Date.now();
		}
		req.ws.close();
	});

	requestHandler.on("startCountdown", (data, req) => {
		communicate.emitToRoom(data.RID, {
			"responseType": "startCountdown"
		});
	});

	requestHandler.on("checkLobbyPassword", (data, req) => {
		var passwordIsCorrect = data.passwordAttempt === serverData.roomList[data.RID].password;
		const packet = {
			"responseType": "passwordCheckResult",
			"correct": passwordIsCorrect,
			"RID": (passwordIsCorrect) ? data.RID : -1
		}

		req.ws.send(JSON.stringify(packet));
	});

	requestHandler.on("kickPlayer", (data, req) => {
		removeUser(data.RID, getUserIndex(data.UID));
		const packet = {
			"responseType": "kick"
		};
		serverData.userWebSockets[data.UID].send(JSON.stringify(packet));
	});

	requestHandler.on("updateUserPointerColor", (data, req) => {
		serverData.roomList[data.RID].userList[getUserIndex(data.UID)].pointerColor = data.pointerColor;
		updateRoom(data.RID);
	});
	
	return requestHandler;
};
