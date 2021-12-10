<?php session_start();?>

<script>
function getUserInfomation() {
	return {
		"Name": <?php echo '"'.$_SESSION['userId'].'"'; ?>,
		"UID" : <?php echo '"'.$_SESSION['Id'].'"'; ?>,
		"closeTime": -1,
		"leftGameTime": -1,
		"isLeader": false,
		"isReady": false,
		"hasStarted": false,
		"score": 0,
		"mouseX": 0,
		"mouseY": 0,
		"inGame": false,
		"pointerColor": "red"		
		}
	}
</script>
