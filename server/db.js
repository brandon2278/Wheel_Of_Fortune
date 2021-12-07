let mySql = require('mysql')

let conn = mySql.createConnection( {
	host: 'sql5.freemysqlhosting.net',
	user: 'sql5441723',
	password: 'zkZfThlgHa',
	database: 'sql5441723',
	charset: 'latin1_swedish_ci'
});


conn.connect((err) => {
	console.log("Connected To Database!!!");
	if(err) throw err;
});

module.exports = {
	"getTables": async () => {
		return await new Promise((resolve, reject) => {
			conn.query("SHOW TABLES", (err, res) => {
				console.log("Before: ", res);
				res = res.filter((e) => (
					/*
					e.Tables_in_sql5441723 != 'users' && 
					e.Tables_in_sql5441723 != 'phraseID' && 
					e.Tables_in_sql5441723 != 'securityTest' &&
					*/
					e.Tables_in_sql5441723 == "phrases" ||
					e.Tables_in_sql5441723 == "animals"
				));
				console.log("After: ", res);
				resolve(res);
			});
		});
	},

	"getPuzzles": async (table) => {
		return await new Promise((resolve, reject) => {
			conn.query(`SELECT * FROM ${table}`, (err, res) => {
				resolve(res);
			});
		});
	},

	"updateStats": async (userList, winnerUID) => {

		userList.forEach(async (user) => {
			await conn.query("SELECT * FROM users WHERE id=" + user.UID, async (err, res) => {
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

				await conn.query(sql, (err, res) => {
				});
			});
		});
	}
};

