<?php
function exception_handler($exception) {
    header("HTTP/1.1 500 International Server Error");
    die("Plase try again later.");
}
 
set_exception_handler('exception_handler');

$mysqli = new mysqli('localhost','root','true','janebyxa_vanitybtc', "3306");

$mysqli->set_charset('utf8');

$insert = $mysqli->prepare("INSERT INTO `report` (name, email, ip, commentar) VALUES (?, ?, ?, ?)");

$name=htmlspecialchars($_GET['name']);
$email=htmlspecialchars($_GET['email']);
$ip=htmlspecialchars($_SERVER['REMOTE_ADDR']);
$commentar=htmlspecialchars($_GET['commentar']);


$insert->bind_param('ssss', $name, $email, $ip, $commentar);
$insert->execute();

header("Location: ../impressum.html");


?>


