/**
 * This file contains code related to the leaderboards.
 * 
 * @author Colby O'Keefe (A00428974)
 */

// Stores the sort state
let currentSortState = "bySingleplayerScore";
// Sort by descending or ascending
let descending = true;

/**
 * Gets the data from a row on the leadaerbaords
 *
 * @param row Row containing the score data 
 * @return Data struct storing the users data
 * @author Colby O'Keefe (A00428974)
 */
function getDataFromRow(row) {
	let tds = Array.from(row.querySelectorAll("td"));
	let data = {
		"username": tds[0].innerText,
		"singleplayerScore": tds[1].innerText.substring(1),
		"multiplayerHighScore": tds[2].innerText.substring(1),
		"winRatio": tds[3].innerText,
		"dom": row,
	};
	return data;
}

/**
 * This function write a row to the leaderboard table
 *
 * @param row Row element in the leaderboard
 * @param data Struct storing the data to place in the row
 * @author Colby O'Keefe (A00428974)
 */
function setDataOnRow(row, data) {
	let tds = Array.from(row.querySelectorAll("td"));
	tds[0].innerText = data.username;
	tds[1].innerText = "$" + data.singleplayerScore;
	tds[2].innerText = "$" + data.multiplayerHighScore;
	tds[3].innerText = data.winRatio;
}

/**
 * This function gets all the data from the leaderboard data
 * 
 * @return An array of data from the leaderboard 
 * @author Colby O'Keefe (A00428974)
 */
function getLeaderBoardData() {
	let rows = Array.from(document.querySelectorAll("#lobby-view-container tr"));
	rows.shift();

	let data = [];

	rows.forEach(row => {
		let rowData = getDataFromRow(row);
		data.push(rowData);
	});

	return data;
}

/**
 * Displays the new leaderboard data
 * 
 * @param lbData Data for the leaderbaord
 * @author Colby O'Keefe (A00428974)
 */
function generateLeaderBoardFromData(lbData) {
	let table = document.querySelector("#lobby-view-container table tbody");
	let rows = Array.from(document.querySelectorAll("#lobby-view-container tr"));
	rows.shift();

	rows.forEach((row, i) => setDataOnRow(row, lbData[i]));
}

/**
 * Compares two numbers
 *
 * @param a num 1
 * @param b num 2
 * @author Colby O'Keefe (A00428974)
 */
function compareNumber(a, b) {
	if (descending) return a - b;
	return b - a;
}

/**
 * Compare two strings
 * 
 * @param a string 1
 * @param b string 2
 * @author Colby O'Keefe (A00428974)
 */
function compareString(a, b) {
	if (descending) return a > b;
	return b > a;
}

/**
 * Sorts the data by username
 *
 *  @author Colby O'Keefe (A00428974)
 */
function sortByUsername() {
	if (currentSortState == "byUserName")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareString(b.username,a.username));

	generateLeaderBoardFromData(lbData);

	currentSortState = "byUserName";
}

/** 
 * Sorts data by singleplayer score
 *   
 * @author Colby O'Keefe (A00428974)
 */
function sortByScore() {
	if (currentSortState == "bySingleplayerScore")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareNumber(a.singleplayerScore, b.singleplayerScore));

	generateLeaderBoardFromData(lbData);

	currentSortState = "bySingleplayerScore";
}

/**
 * Sorts by mutliplayer highscore
 * 
 * @author Colby O'Keefe (A00428974)
 */
function sortByHighScore() {
	if (currentSortState == "byMultiplayerHighScore")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareNumber(a.multiplayerHighScore, b.multiplayerHighScore));

	generateLeaderBoardFromData(lbData);

	currentSortState = "byMultiplayerHighScore";
}

/**
 * Sorts by win-lose ratio
 *
 * @author Colby O'Keefe (A00428974)
 */
function sortByWinRatio() {
	if (currentSortState == "byWinRatio")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareNumber(a.winRatio, b.winRatio));

	generateLeaderBoardFromData(lbData);

	currentSortState = "byWinRatio";
}

/**
 * updates leaderboard when searching for user
 *
 * @param e Evenet 
 * @author Colby O'Keefe (A00428974)
 */
function updateSearch(e) {
	let lbData = getLeaderBoardData();

	lbData.forEach(row => {
		row.dom.style.display = "none";
	});

	lbData.forEach(row => {
		if (row.username.toUpperCase().includes(e.value.toUpperCase()))
		{
			console.log(row.username);
			row.dom.style.display = "table-row";
		}
	});
}



