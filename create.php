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
    <script src='./Winwheel.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
</head>


<body>
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

    <div class="create">
        <section class="vh-100">
            <div class="mask d-flex align-items-center h-100 gradient-custom-3">
                <div class="container h-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col-12 col-md-9 col-lg-7 col-xl-6">
                            <div class="card bg-dark" style="border-radius: 15px; color:  rgb(255, 223, 79); --bs-bg-opacity: 0.8;">
                                <div class="card-body p-5">
                                    <h2 class="text-uppercase text-center mb-5">Create an account</h2>

                                    <form action="includes/signup.inc.php" method="post" style="margin: 0 70px 0 70px;">

                                        <div class="form-outline mb-4">
                                            <input name="firstName" type="text" class="form-control form-control-lg" />
                                            <label class="form-label" for="firstName">First Name</label>
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="text" name="username" class="form-control form-control-lg" />
                                            <label class="form-label" for="username">Username</label>
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="password" name="pwd" class="form-control form-control-lg" maxlength="4"/>
                                            <label class="form-label" for="pwd">Enter a 4 digit Passcode</label>
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input type="password" name="pwd-repeat" class="form-control form-control-lg" maxlength="4"/>
                                            <label class="form-label" for="pwd-repeat">Repeat your passcode</label>
                                        </div>



                                        <div class="d-flex justify-content-center">
                                            <button name="signup-submit" type="submit" class="btn btn-warning"><i class="fas fa-user-plus"></i> Register</button>
                                        </div>

                                        <p class="text-center text-muted mt-5 mb-0">Already have an account? <a href="index.php" class="text-white-50 fw-bold"><u>Login here</u></a></p>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    </div>
</body>

</html>