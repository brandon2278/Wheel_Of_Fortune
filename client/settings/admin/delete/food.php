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
	<section align="center">
		<div class="mask d-flex align-items-center h-100 gradient-custom-3">
			<div class="container h-100">
				<div class="row d-flex justify-content-center align-items-center h-100">
					<div class="col-12 col-md-9 col-lg-7 col-xl-6">
						<div class="card bg-dark" style="border-radius: 15px; color:  rgb(255, 223, 79); --bs-bg-opacity: 0.8;">
							<div class="card-body p-5">
								<div>
									<h2 class="text-uppercase text-center mb-5">Delete Word</h2>
								</div>
								<form class="form-signin" action="" method="POST" enctype="multipart/form-data">
									<div class="form-outline mb-4">
										<input name="id" type="number" class="form-control form-control-lg" />
										<label class="form-label" for="id">Word ID</label>
									</div>
									<input class="btn btn-warning" type="submit" name="delete" value="Delete">
								</form>
								<div>
									<a href="./">Choose Another Category</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>


	<style>
		* {
			box-sizing: border-box;
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
				$table = 'food';



				if (isset($_POST['delete'])) {
					$conn = mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName) or die($mysqli->connect_error);


					$id = $_POST['id'];

					$sql = "DELETE FROM $table WHERE id=$id";

					if (mysqli_query($conn, $sql)) {
						echo "Word deleted successfully \n";
					} else {
						echo "Error deleting record: " . mysqli_error($conn);
					}
					$set = 'SET @num = 0';
					$reset = 'UPDATE food SET id = @num := (@num+1)';
					$auto = 'ALTER TABLE food AUTO_INCREMENT = 1';
					mysqli_query($conn, $set);
					mysqli_query($conn, $reset);
					mysqli_query($conn, $auto);
					if (mysqli_query($conn, $set) && mysqli_query($conn, $reset) && mysqli_query($conn, $auto)) {
						echo "\n Reset success!";
					}


					mysqli_close($conn);
				}

				$conn = mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName) or die($mysqli->connect_error);



				$sql = "SELECT id, word, picture, sound FROM $table";
				$result = $conn->query($sql);

				if ($result->num_rows > 0) {
					// output data of each row
					while ($row = $result->fetch_assoc()) {
						echo "<li>Word Id: " . $row["id"] . " - Mi'kmaw Word: " . $row["word"] . " - PictureFile: " . $row["picture"] . " - SoundFile: " . $row["sound"] . "</li>";
					}
				} else {
					echo "0 results";
				}

				echo "<br> <br>";


				$conn->close();
				?>

			</ul>

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