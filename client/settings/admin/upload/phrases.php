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
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<script src="../../../src/js/Keyboard.js"></script>
	<script src="https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js"></script>
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
										<input name="phrase" type="text" maxlength="255" class="useGameKeyboard form-control form-control-lg" required/>
										<label class="form-label" for="phrase">Mikmaw Phrase</label>
									</div>
									<div class="form-outline mb-4">
										<input type="file" accept="audio/*" name="phraseSound" class="form-control form-control-lg" required/>
										<label class="form-label" for="phraseSound">Choose Phrase Audio</label>
									</div>
									<div class="form-outline mb-4">
										<input name="response" type="text" maxlength="255" class="useGameKeyboard form-control form-control-lg" required/>
										<label class="form-label" for="response">Mikmaw Response</label>
									</div>
									<div class="form-outline mb-4">
										<input type="file" accept="audio/*" name="responseSound" class="form-control form-control-lg" required/>
										<label class="form-label" for="responseSound">Choose Response Audio</label>
									</div>
									<div class="form-outline mb-4">
										<input name="englishPhrase" type="text" class="form-control form-control-lg" required/>
										<label class="form-label" for="englishPhrase">English Phrase Translation</label>
									</div>
									<div class="form-outline mb-4">
										<input name="englishResponse" type="text" class="form-control form-control-lg" required/>
										<label class="form-label" for="englishResponse">English Response Translation</label>
									</div>

									<input style="font-family: fortune;" class="btn btn-warning" type="submit" name="upload" value="Upload">
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
	$table = 'phrases';

	if (isset($_POST['upload'])) {

		$phrase = $_POST['phrase'];
		$response = $_POST['response'];
		$engPhrase = $_POST['englishPhrase'];
		$engResponse = $_POST['englishResponse'];
		$query = "INSERT INTO $table (phrase, response, translation, respTranslation) 
		VALUES('$phrase', '$response', '$engPhrase', '$engResponse')";
		

		if (mysqli_query($con, $query)) {
			echo "Word Uploaded successfully \n";
		} else {
			echo "Error uploading record: " . mysqli_error($conn);
		}
		



		$audio = $_FILES['phraseSound']['name'];
		$audio_dir = "../../../assets/game/sounds/";
		$local1_dir = "../../../assets/game/sounds/";
		$audio_file = $audio_dir . basename($_FILES["phraseSound"]["name"]);

		// Select file type
		$audioFileType = strtolower(pathinfo($audio_file, PATHINFO_EXTENSION));

		// Valid file extensions
		$Aextensions_arr = array("mp3");

		// Check extension
		if (in_array($audioFileType, $Aextensions_arr)) {
			// Upload file
			if (move_uploaded_file($_FILES['phraseSound']['tmp_name'], $local1_dir . $audio)) {
				// Insert record
				$sql1 = "UPDATE $table SET phraseSound = '$audio_file' WHERE phrase = '$phrase' ";
				$con->query($sql1) or die($con->error);
			}
		}


		$audio1 = $_FILES['responseSound']['name'];
		$audio_dir = "../../../assets/game/sounds/";
		$local1_dir = "../../../assets/game/sounds/";
		$audio1_file = $audio1_dir . basename($_FILES["responseSound"]["name"]);

		// Select file type
		$audioFileType1 = strtolower(pathinfo($audio1_file, PATHINFO_EXTENSION));

		// Valid file extensions
		$Aextensions_arr1 = array("mp3");

		// Check extension
		if (in_array($audioFileType1, $Aextensions_arr1)) {
			// Upload file
			if (move_uploaded_file($_FILES['responseSound']['tmp_name'], $local2_dir . $audio1)) {
				// Insert record
				$sql2 = "UPDATE $table SET responseSound = '$audio1_file' WHERE phrase = '$phrase' ";
				$con->query($sql2) or die($con->error);
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

</html>