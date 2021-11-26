<?php session_start();?>
<!DOCTYPE html>
<html lang="en">


<head>
	<script>
	function getUserInfomation() {
             return {
                 "Name": <?php echo '"'.$_SESSION['userId'].'"'; ?>,
                 "UID" : <?php echo '"'.$_SESSION['Id'].'"'; ?>
                }
        }
    </script>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" type="image/png" href="wallpapers/logo-5_0_0.png">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">	
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <script> window.name = 'null' </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/latest/TweenMax.min.js"></script>
    <script src ="./Client.js"></script>
    <script src="./SelectLobby.js"></script>
    <script src="./Keyboard.js"></script>
    <link rel="stylesheet" href="style.css">
    <title>Wheel of Fortune</title>
</head>

<body align="center">
</body>	

