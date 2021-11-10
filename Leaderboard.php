<?php session_start();?>
<!DOCTYPE html>
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
	    <script src="./Leaderboard.js"></script>
	    <script src="./Keyboard.js"></script>
	    <link rel="stylesheet" href="style.css">
	    <title>Wheel of Fortune</title>
	</head>

	<body align="center">

		<div id="lobby-view-container">
			<table id="lobby-table">
			<tbody>
			<tr style="text-decoration: underline; text-align: center">;
				<td>Username</td>
				<td>High Score</td>
			</tr>	
				<?php
					require "./includes/db.php";
					$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
					if ($conn->connect_error) {
						die("Connection failed: " . $conn->connect_error);
					}

					$result = $conn->query("SELECT username, highScore FROM users ORDER BY highScore DESC");
					
					while($row = $result->fetch_assoc()) {
						echo "<tr style=\"font-size: 1em; color: white; text-align: center\">";
						echo "<td>" . $row["username"] . "</td>";
						echo "<td>" . $row["highScore"] . "</td>";
						echo "</tr>";
					}

					mysqli_close($conn);
				?>
			</tbody>
			</table>
		</div>

	</body>	

</html>

