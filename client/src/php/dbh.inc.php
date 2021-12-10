<?php

$serverName = "localhost:3306";
$dbUsername = "group11";
$dbPassword = "SeveralSecond10";
$dbName = "group11";

$conn= mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName);

if(!$conn){
die("Connection Failed: ".mysqli_connect_error());
}


