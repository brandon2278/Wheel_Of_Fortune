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
    <script type="module" src='./index.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
</head>

<body>
    <div align="center">
        <h1>MI'KMAW WHEEL oF FORTUNE</h1>
    </div>
    <div class="home-screen">
        <div align="center">
            <h2>Choose a Category</h2>
            <ul class="list-unstyled">
                <form action="game/pictureGame.php" method="get">
                    <input type="hidden" id="category" name="category" value="animals">
                    <li><input type="submit" value="Animals" class="btn btn-dark" role="button"></li>
                </form>
                <form action="game/wordGame.php" method="get">
                    <input type="hidden" id="category" name="category" value="greetings">
                    <li><input type="submit" value="Greetings" class="btn btn-dark" role="button"></li>
                </form>
                <form action="game/phrases.php" method="get">
                    <li><input type="submit" value="Phrases" class="btn btn-dark" role="button"></li>
                </form>
                <form action="game/pictureGame.php" method="get">
                    <input type="hidden" id="category" name="category" value="food">
                    <li><input type="submit" value="Food" class="btn btn-dark" role="button"></li>
                </form>
                <form action="game/pictureGame.php" method="get">
                    <input type="hidden" id="category" name="category" value="earth">
                    <li><input type="submit" value="Earth" class="btn btn-dark" role="button"></li>
                </form>
                <form action="game/pictureGame.php" method="get">
                    <input type="hidden" id="category" name="category" value="numbers">
                    <li><input type="submit" value="Numbers" class="btn btn-dark" role="button"></li>
                </form>
                <center><a href="index.php" class="btn btn-warning">Back</a></center>
            </ul>
        </div>
    </div>
</body>
