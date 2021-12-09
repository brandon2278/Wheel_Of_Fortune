let currentSortState = "bySingleplayerScore";
let descending = true;

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

function setDataOnRow(row, data) {
	let tds = Array.from(row.querySelectorAll("td"));
	tds[0].innerText = data.username;
	tds[1].innerText = "$" + data.singleplayerScore;
	tds[2].innerText = "$" + data.multiplayerHighScore;
	tds[3].innerText = data.winRatio;
}

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

function generateLeaderBoardFromData(lbData) {
	let table = document.querySelector("#lobby-view-container table tbody");
	let rows = Array.from(document.querySelectorAll("#lobby-view-container tr"));
	rows.shift();

	rows.forEach((row, i) => setDataOnRow(row, lbData[i]));
}

function compareNumber(a, b) {
	if (descending) return a - b;
	return b - a;
}

function compareString(a, b) {
	if (descending) return a > b;
	return b > a;
}

function sortByUsername() {
	if (currentSortState == "byUserName")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareString(b.username,a.username));

	generateLeaderBoardFromData(lbData);

	currentSortState = "byUserName";
}

function sortByScore() {
	if (currentSortState == "bySingleplayerScore")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareNumber(a.singleplayerScore, b.singleplayerScore));

	generateLeaderBoardFromData(lbData);

	currentSortState = "bySingleplayerScore";
}

function sortByHighScore() {
	if (currentSortState == "byMultiplayerHighScore")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareNumber(a.multiplayerHighScore, b.multiplayerHighScore));

	generateLeaderBoardFromData(lbData);

	currentSortState = "byMultiplayerHighScore";
}

function sortByWinRatio() {
	if (currentSortState == "byWinRatio")
		descending = !descending;
	else descending = true;

	let lbData = getLeaderBoardData();
	lbData = lbData.sort((a, b) => compareNumber(a.winRatio, b.winRatio));

	generateLeaderBoardFromData(lbData);

	currentSortState = "byWinRatio";
}

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



