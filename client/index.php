<!--
	This file contains the code for the menu page and log-in popup.
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
	<script src='./src/js/Winwheel.js'></script>
	<script src='./src/js/Keyboard.js'></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
	<link rel="stylesheet" href="./src/style.css">
	<title>Wheel of Fortune</title>
</head>



<body id="home" class="index">

	<?php
	if (isset($_GET['error'])) {
		if ($_GET['error'] == "emptyfields") {
			echo '<p class="error">Fill in all fields</p>';
		} else if ($_GET['error'] == "invaliduid") {
			echo '<p class="error">Invalid Username</p>';
		} else if ($_GET['error'] == "passwordcheck") {
			echo '<p class="error">Your Password do not Match</p>';
		} else if ($_GET['error'] == "usertaken") {
			echo '<p class="error">Username is already taken</p>';
		} else if ($_GET['error'] == "wrongpwd") {
			echo '<p class="error">Your password is Incorrect</p>';
		} else if ($_GET['error'] == "nouser") {
			echo '<p class="error">No user registered </p>';
		}
	}
	if (isset($_GET['signup'])) {
		if ($_GET['signup'] == "success") {
			echo '<p class="error">Signup Successful</p>';
		}
	}
	if (isset($_GET['login'])) {
		if ($_GET['login'] == "success") {
			echo '<p class="error">Successfully Logged In</p>';
		}
	}
	?>

	<section class="container">
		<div align="center">
			<h1>MI'KMAW WHEEL oF FORTUNE</h1>
		</div>
		<?php
		if (isset($_SESSION['Id']) ==  1) {
			echo '<div style="margin: 15px; position: absolute; top: 5px; right: 5px;"><a href="./settings/" class="btn btn-warning" type="submit"><i class="fas fa-cog"></i> Settings</a></div>';
		}
		if (isset($_SESSION['userId'])) {
			echo ' <form class="logout" align="center" action="./src/php/logout.inc.php" method="post" >
					<button class="btn btn-warning" type="submit" name="logout-submit"><i class="fas fa-sign-out-alt"></i> Logout</button>
					</form>';
			echo '<ul id="select" align="center" class="list-unstyled">
			<li><a class="btn btn-dark" href="./singleplayer/select" role="button"> Single Player </a>
				<p>Play and Learn on your own at your own pace!</p>
			</li>
			<li><a class="btn btn-dark" href="./multiplayer/" role="button"> Multiplayer </a>
				<p>Play with your friends, chat online and learn together in a fun way!</p>
			</li>
			<li><a class="btn btn-dark" href="./leaderboard/" role="button"> Leaderboard </a>
			<p>See who is on top and has the most money in the Bank</p>
			</li>
		</ul>';
			echo "
					<style>
						.logout{
							margin: 1rem;
						}
					</style>";
		} else {
			echo "<div id='myModal' class='modal'>
					<!-- Modal content -->
					<div class='modal-content'>
						<!-- <span class='close'>&times;</span> -->
						<div class='login'>
							<section id='login'>
								<div>
									<div align='center'>
										<div class='col-12 col-md-8'>
											<div class='card bg-dark' style='color:  rgb(255, 223, 79); border-radius: 1rem; --bs-bg-opacity: 0.8;'>
												<form action='./src/php/login.inc.php' method='post' class='card-body p-6 text-center'>

													<div class='mb-md-5 mt-md-4 pb-5'>

														<h2 class='fw-bold mb-2 text-uppercase'>Login</h2>
														<p class='text-white-50 mb-5'>Please enter your Username and passcode!</p>

														<div style='margin: 0 70px 0 70px;' class='form-outline form-white mb-4'>
															<input name='username' class='form-control form-control-lg' placeholder='User'/>
															<label class='form-label' for='username'>Username</label>
														</div>

														<div style='margin: 0 70px 0 70px;' class='form-outline form-white mb-4'>
															<input type='password' name='pwd' class='form-control form-control-lg' placeholder='1234' maxlength=\"4\"/>
															<label class='form-label' for='pwd'>Passcode</label>
														</div>

														

														<button class='btn btn-warning' name='login-submit' type='submit'><i class='fas fa-sign-in-alt'></i> Login</button>

													</div>
													<div>
														<p class='mb-0'>Don't have an account? <a href='./create-account' class='text-white-50 fw-bold'>Sign Up</a></p>
													</div>

												</form>
											</div>
										</div>
									</div>
								</div>
							</section>

						</div>
					</div>

				</div>";
		}
		// Require Database Name and Password
		require 'src/php/db.php';
		// Create connection
		$conn = new mysqli($serverName, $dbUsername, $dbPassword, $dbName);
		// Check connection
		if ($conn->connect_error) {
			die("Connection failed: " . $conn->connect_error);
		}
		//Set phraseID to 0 incase different categories have different number of saved words so it does not return null
		// if a category had less words!
		if (isset($_SESSION['Id'])) {
			$phraseUP = "UPDATE users
            SET phraseID = '0' 
            WHERE username= '" . $_SESSION['userId'] . "' ";
			$conn->query($phraseUP);
		}
		?>
	</section>






</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script>
	window.jQuery || document.write('<script src="jquery.min.js"><\/script>')
	localStorage.clear();
</script>
<script type="module" src="./src/js/index.js">
</script>

</html>
