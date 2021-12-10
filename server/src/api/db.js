/*
 * This function acts as the servers access point to the database.
 * contains all SQL query code.
 *
 * @author Colby O'Keefe (A00428974)
 */

// Requires
let mySql = require('mysql2')

// Creates a pool
let pool = mySql.createPool( {
	connectionLimit: 10,	
	host: '127.0.0.1',
	port: 3306,
	user: 'group11',
	password: 'SeveralSecond10',
	database: 'group11',
	charset: 'latin1_swedish_ci'
});

/*
 * This function request a list of tables from the database.
 *
 * @return A Promise of a list of apporiate tables
 * @author Colby O'Keefe (A00428974)
 */
async function getTables() {
	return await new Promise((resolve, reject) => {
		pool.query("SHOW TABLES", (err, res) => {
			res = res.filter((e) => (
				e.Tables_in_group11 != 'users' && 
				e.Tables_in_group11 != 'phraseID' && 
				e.Tables_in_group11 != 'securityTest' &&
				e.Tables_in_group11 != 'food' && 
				e.Tables_in_group11 != 'earth' && 
				e.Tables_in_group11 != 'greetings' && 
				e.Tables_in_group11 != 'numbers'  
			));
			resolve(res);
		});
	});
}

/*
 * This function request a list of puzzle from a table of the database
 *
 * @param table The table to get list of puzzles from  
 * @return A Promise of a list of puzzles 
 * @author Colby O'Keefe (A00428974)
 */
async function getPuzzles(table) {
	return await new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM ${table}`, (err, res) => {
			resolve(res);
		});
	});
}

/*
 * This function takes a list of users and the winners UID and updates the stats in the database.
 *
 * @param userList A list of users 
 * @param winnerUID The Id of the winning player
 * @author Colby O'Keefe (A00428974)
 */
async function updateStats(userList, winnerUID) {

	userList.forEach(async (user) => {
		await pool.query("SELECT * FROM users WHERE id=" + user.UID, async (err, res) => {
			var sql = "UPDATE users SET ";
			if (res[0].highscore < user.score) {
				// Update highscore 
				sql += "highscore = " + user.score + ",";  
			}

			if (user.UID === winnerUID) {
				sql += "matchesWon = " + (res[0].matchesWon + 1)
			} else {
				sql += "matchesLose = " + (res[0].matchesLose + 1)
			}

			sql += " WHERE id = " + user.UID + ";";

			await pool.query(sql, (err, res) => {
			});
		});
	});
}

// Exports 
module.exports = {
	"getTables": getTables,

	"getPuzzles": getPuzzles,

	"updateStats": updateStats
};

