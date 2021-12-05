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
	}
};

