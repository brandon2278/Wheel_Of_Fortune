<?php

$serverName = "sql5.freemysqlhosting.net";
$dbUsername = "sql5441723";
$dbPassword = "zkZfThlgHa";
$dbName = "sql5441723";

$conn= mysqli_connect($serverName, $dbUsername, $dbPassword, $dbName);

if(!$conn){
die("Connection Failed: ".mysqli_connect_error());
}


