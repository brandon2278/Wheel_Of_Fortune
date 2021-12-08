<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
	<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
	<link rel="stylesheet" href="../../../src/style.css">
	<title>Wheel of Fortune</title>
</head>


<?php
if (isset($_SESSION['Id'])) {
	if ($_SESSION['Id'] !==  1) {
		header("Location: ../../../?access=denied");
		exit();
	}
}
?>

<body>



	<style>
		* {
			box-sizing: border-box;
			margin-bottom: 20px;
		}

		ul {
			font-family: serif;
			list-style-type: none;
			padding: 0;
			margin: 0;
			max-width: 700px;
		}

		ul li {
			border: 1px solid #ddd;
			margin-top: -1px;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 12px;
		}
	</style>

	<div style="margin-top: 25px; margin-bottom: -15px;">
		<h2 class="text-uppercase text-center mb-5">Word Database</h2>
	</div>

	<center>
		<div>

			<ul>
				<?php
				require '../../../src/php/db.php';

				$table = $_GET['category'];

				$conn = mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName) or die($mysqli->connect_error);



				$sql = "SELECT id, word,englishWord, picture, sound FROM $table";
				$result = $conn->query($sql);

				if ($result->num_rows > 0) {
					// output data of each row
					while ($row = $result->fetch_assoc()) {
						echo "<li>Word Id: " . $row["id"] . " - Mi'kmaw Word: " . $row["word"] . " - English Word: " . $row["englishWord"] . "  - PictureFile: " . $row["picture"] . " - SoundFile: " . $row["sound"] . "</li>";
					}
				} else {
					echo "0 results";
				}




				$conn->close();
				?>

			</ul>
			<br>
			<a class="btn btn-warning" href="./">Back</a>
			<br>

		</div>
	</center>


</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
	window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
	localStorage.setItem('tempScore', '0');
</script>
<script type="module" src="../../../src/js/index.js">
</script>

</html>