/**
 * This file contains various functions to communciate to the Clients
 *
 * @author Colby O'Keefe (A00428974)
 */

// Requires
let serverData = require("../data.js");

/**
 *  This function takes a room struct and then formats the room
 *  so the user doesn't receive infomation such as the puzzle solution.
 *
 * @param room A room struct
 * @return A formated room struct
 * @author Colby O'Keefe (A00428974)
 */
function formatRoom(room) {
	return {
		"userList": room.userList,
		"roomName": room.roomName,
		"messages": room.messages,
		"slots": room.slots,
		"solved": room.solved,
		"currentScore": room.currentScore,
		"currentPlayerIndex": room.currentPlayerIndex,
		"usedLetters": room.usedLetters,
		"currentRound": room.currentRound,
		"maxNumberOfRounds": room.maxNumberOfRounds, 
		"currentPuzzleNumber": room.currentPuzzleNumber,
		"puzzlesPerRound": room.puzzlesPerRound,
		"puzzleQuestion": room.puzzleQuestion,
		"puzzleHint": room.puzzleHint,
		"puzzlePhrase": room.puzzlePhrase,
		"correctScore": room.correctScore,
		"lastKey": room.lastKey,
		"lossModifier": room.lossModifier,
		"maxPlayerCount": room.maxPlayerCount,
		"status": room.status,
		"isSerect": room.isSerect,
		"hasVowel": room.hasVowel,
		"vowelPrice": room.vowelPrice,
		"hasPassword": room.hasPassword
	};
}

/**
 * This formats all rooms in the server and returns the formated list.
 * 
 * @return The list of all rooms that has been formated
 * @author Colby O'Keefe (A00428974)
 */
function formatRoomList() {
	var newRoomList = {};
	for (let key in serverData.roomList) {
		newRoomList[key] = (formatRoom(serverData.roomList[key]));
	}
	return newRoomList;
}

/**
 * This function emits data to ever user in a room
 * 
 * @param RID The ID of the room to be emitted to
 * @param packet Responce to be emittered 
 * @author Colby O'Keefe (A00428974)
 */
function emitToRoom(RID, packet) {
	serverData.roomList[RID].userList.forEach(u => serverData.userWebSockets[u.UID].send(JSON.stringify(packet)));
}

// Exports
module.exports = {
	"emitToRoom": emitToRoom,
	"formatRoom": formatRoom,
	"formatRoomList": formatRoomList
};
