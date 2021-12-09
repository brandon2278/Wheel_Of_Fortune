<?php session_start();?>
<!DOCTYPE html>
<?php

	/*
	 *
	 * Author(s): Colby O'Keefe (A00428974)
	 */
	function displayLeaderboard($users) {            
		while($row = $users->fetch_assoc()) {
			$winRatio = $row['matchesWon'];
			if ($row['matchesLose'] != 0) {
				$winRatio = $winRatio / $row['matchesLose'];
			}
			echo "<tr style=\"font-size: 1em; color: white; text-align: center\">";
			echo "<td>" . $row["username"] . "</td>";
			echo "<td>$" . $row["score"] . "</td>";
			echo "<td>$" . $row["highscore"] . "</td>";
			echo "<td>" . $winRatio . "</td>";
			echo "</tr>";
		}
	}
	
	/*
	 *
	 * Author(s): Colby O'Keefe (A00428974)
	 */
	function getUserData() {
		require "../src/php/db.php";
		$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}

		$result = $conn->query("SELECT * FROM users ORDER BY highScore DESC");

		mysqli_close($conn);

		return $result;

	}
?>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">    
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
		<script> window.name = 'null' </script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
		<script src="../src/js/Leaderboard.js"></script>
		<script src="../src/js/Keyboard.js"></script>
		<script src="../src/js/leaderboard.js"></script>
		<link rel="stylesheet" href="../src/style.css">
		<title>Wheel of Fortune</title>
	</head>

	<body align="center">
		<a class="btn btn-dark" href="../" role="button">Back</a>
		<input class="input-group-text" href="../" onkeyup = "updateSearch(this)"></input>
		<div id="lobby-view-container">
			<table id="lobby-table">
			<tbody>
			<tr style="text-decoration: underline; text-align: center">
				<td onclick = "sortByUsername()">Username</td>
				<td onclick = "sortByScore()">Single-Player Score</td>
				<td onclick = "sortByHighScore()">Mutli-Player Highscore</td>
				<td onclick = "sortByWinRatio()">Mutli-Player Win-Lose Ratio</td>
			</tr>    
				<?php
					$userData = getUserData();
					displayLeaderboard($userData);
				?>
			</tbody>
			</table>
		</div>

	</body>    

</html>

