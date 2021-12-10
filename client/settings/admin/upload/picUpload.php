<!-- 
	Upload New Words to Word Categories containing Pictures 
 	@author Brandon Catwright (A00430851) 
-->

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
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" href="../../../src/style.css">
	<script src="../../../src/js/Keyboard.js"></script>
	<title>Wheel of Fortune</title>
</head>

<style>
	input {
		font-family: sans-serif;
	}
</style>


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
									<h2 class="text-uppercase text-center mb-5">Uploader</h2>
								</div>
								<form class="form-signin" action="" method="POST" enctype="multipart/form-data">
									<div class="form-outline mb-4">
										<input name="word" type="text" maxlength="255" class="useGameKeyboard form-control form-control-lg" required />
										<label class="form-label" for="word">Mikmaw Word</label>
									</div>
									<div class="form-outline mb-4">
										<input name="englishWord" type="text" maxlength="255" class="form-control form-control-lg" required />
										<label class="form-label" for="englishWord">English Word</label>
									</div>

									<div class="form-outline mb-4">
										<input type="file" name="sound" class="form-control form-control-lg" required />
										<label class="form-label" for="sound">Choose Audio</label>
									</div>

									<div class="form-outline mb-4">
										<input type="file" name="picture" class="form-control form-control-lg" required />
										<label class="form-label" for="picture">Choose Image</label>
									</div>

									<input class="btn btn-warning" type="submit" name="upload" style="font-family:fortune;" value="Upload">
								</form>
								<div>
									<p class="info">Make sure the input fields do not contain special characters such as !/'_. and no compound words such as I'm use I am.</p>
									<a href="./">Choose Another Category</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<?php

	require '../../../src/php/db.php';

	$con = mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName) or die($mysqli->connect_error);
	$table = $_GET['category'];

	if (isset($_POST['upload'])) {

		$word = $_POST['word'];
		$englishWord = $_POST['englishWord'];
		$query = "INSERT IGNORE INTO $table (word, englishWord) VALUES('$word', $englishWord)";



		if (mysqli_query($con, $query)) {
			echo "Word Uploaded successfully \n";
		} else {
			echo "Error uploading record: " . mysqli_error($con);
		}

		$name = $_FILES['picture']['name'];
		$target_dir = "../../../assets/game/pics/";
		$local_dir = "../../../assets/game/pics/";
		$target_file = $target_dir . basename($_FILES["picture"]["name"]);

		// Select file type
		$imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

		// Valid file extensions
		$extensions_arr = array("jpg", "jpeg", "png");

		// Check extension
		if (in_array($imageFileType, $extensions_arr)) {
			// Upload file
			if (move_uploaded_file($_FILES['picture']['tmp_name'], $local_dir . $name)) {
				// Insert record
				$sql = "UPDATE $table SET picture = '$target_file' WHERE word = '$word' ";
				$con->query($sql) or die($con->error);
			}
		}


		$audio = $_FILES['sound']['name'];
		$audio_dir = "../../../assets/game/sounds/";
		$local1_dir = "../../../assets/game/sounds/";
		$audio_file = $audio_dir . basename($_FILES["sound"]["name"]);

		// Select file type
		$audioFileType = strtolower(pathinfo($audio_file, PATHINFO_EXTENSION));

		// Valid file extensions
		$Aextensions_arr = array("mp3");

		// Check extension
		if (in_array($audioFileType, $Aextensions_arr)) {
			// Upload file
			if (move_uploaded_file($_FILES['sound']['tmp_name'], $local1_dir . $audio)) {
				// Insert record
				$sql1 = "UPDATE $table SET sound = '$audio_file' WHERE word = '$word' ";
				$con->query($sql1) or die($con->error);
			}
		}
	}
	?>


</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
	window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
	localStorage.setItem('tempScore', '0');
</script>
<script type="module" src="../../../src/js/index.js">
</script>

</html>