/*
 * This function acts as the servers access point to the database.
 * contains all SQL query code.
 *
 * @author Colby O'Keefe (A00428974)
 */

// Requires
let mySql = require('mysql')

// Creates a pool
let pool = mySql.createPool( {
	connectionLimit: 10,	
	host: 'sql5.freemysqlhosting.net',
	user: 'sql5441723',
	password: 'zkZfThlgHa',
	database: 'sql5441723',
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
			console.log("Before: ", res);
			res = res.filter((e) => (
				e.Tables_in_sql5441723 != 'users' && 
				e.Tables_in_sql5441723 != 'phraseID' && 
				e.Tables_in_sql5441723 != 'securityTest' &&
				e.Tables_in_sql5441723 != 'food' && 
				e.Tables_in_sql5441723 != 'earth' && 
				e.Tables_in_sql5441723 != 'greetings' && 
				e.Tables_in_sql5441723 != 'numbers'  
			));
			console.log("After: ", res);
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

