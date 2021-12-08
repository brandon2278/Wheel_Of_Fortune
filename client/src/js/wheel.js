let theWheel = new Winwheel({
	'numSegments': 13, // Specify number of segments.
	'outerRadius': 195, // Set outer radius so wheel fits inside the background.
	'textFontSize': 26, // Set font size as desired.
	'innerRadius': 55, // Make wheel hollow so segments dont go all way to center.
	'textAlignment': 'outer',
	'textOrientation': 'vertical',
	'segments': // Define segments including colour and text.
		[{

			'fillStyle': '#add8e6',
			'text': '100'
		},
		{
			'fillStyle': '#FF0000',
			'text': '800'
		},
		{
			'fillStyle': '#FFD580',
			'text': '300'
		},
		{
			'fillStyle': '#FFC0CB',
			'text': '650'
		},
		{
			'fillStyle': '#CBC3E3',
			'text': '200'
		},
		{
			'fillStyle': '#90EE90',
			'text': '500'
		},
		{
			'fillStyle': '#FFA500',
			'text': '900'
		},
		{
			'fillStyle': '#000000',
			'text': 'BANKRUPT',
			'textFontSize': 16,
			'textFillStyle': '#ffffff'
		},
		{
			'fillStyle': '#aaa9ad',
			'text': '5000'
		},
		{
			'fillStyle': '#90EE90',
			'text': '500'
		},
		{
			'fillStyle': '#FFFF00',
			'text': '600'
		},
		{
			'fillStyle': '#FF7F50',
			'text': '400'
		},
		{
			'fillStyle': '#FFA500',
			'text': '700'
		}
		],
	'animation': // Specify the animation to use.
	{
		'type': 'spinToStop',
		'duration': 8,
		'spins': 4,
		'callbackFinished': alertPrize, // Function to call when the spinning has stopped.
		'callbackSound': playSound, // Called when the tick sound is to be played.
		'soundTrigger': 'pin' // Specify pins are to trigger the sound.
	},
	'pins': // Turn pins on.
	{
		'number': 13,
		'fillStyle': 'silver',
		'outerRadius': 4,
	}
});

// Loads the tick audio sound in to an audio object.
let audio = new Audio('../../assets/audio/tick.mp3');
let bankr = new Audio('../../assets/audio/bankr.mp3');
// This function is called when the sound is to be played.
function playSound() {
	// Stop and rewind the sound if it already happens to be playing.
	audio.pause();
	audio.currentTime = 0;

	// Play the sound.
	audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower = 0;
let wheelSpinning = false;

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel) {
	// Ensure that power can't be changed while wheel is spinning.
	if (wheelSpinning == false) {
		// Reset all to grey incase this is not the first time the user has selected the power.


		// Now light up all cells below-and-including the one selected by changing the class.

		document.getElementById('pw2').className = "pw2";

		// Set wheelPower var used when spin button is clicked.
		wheelPower = powerLevel;

		// Light up the spin button by changing it's source image and adding a clickable class to it.
		document.getElementById('spin_button').src = "..\wallpapers\spin_on.png";
		document.getElementById('spin_button').className = "clickable";
	}
}

if (localStorage.getItem('tempScore') == null || JSON.parse(localStorage.getItem('tempScore')) == 0) {
	document.getElementById('spinBtn').innerHTML = '<button class="btn btn-warning" id="spin_button" onClick="startSpin()"><i class="fas fa-sync"></i> SPIN <button/>';

}
// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {

	var spinModal = document.getElementById('spinModal');

	spinModal.style.display = "block";

	// Ensure that spinning can't be clicked again while already running.
	if (wheelSpinning == false) {
		// Based on the power level selected adjust the number of spins for the wheel, the more times is has
		// to rotate with the duration of the animation the quicker the wheel spins.
		if (wheelPower == 2) {
			theWheel.animation.spins = 8;
		}

		// Disable the spin button so can't click again while wheel is spinning.
		document.getElementById('spin_button').className = "";

		// Begin the spin animation by calling startAnimation on the wheel object.
		theWheel.startAnimation();

		// Set to true so that power can't be changed and spin button re-enabled during
		// the current animation. The user will have to reset before spinning again.
		wheelSpinning = true;
	}
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
// note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {

	// If the segment it lands on is "Bankrupt" it sets the score to 0.
	localStorage.setItem('tempScore', indicatedSegment.text);
	if (localStorage.getItem('tempScore') == "BANKRUPT") {
		localStorage.setItem('score', '0');
		localStorage.setItem('tempScore', '0');
	}

	// Do basic alert of the segment text. You would probably want to do something more interesting with this information.
	if (indicatedSegment.text == "BANKRUPT") {
		bankr.play();
		swal({
			icon: 'error',
			title: "You Are Now BANKRUPT",
			button: {
				text: "continue",
				value: true,
				visible: true,
				className: "btn btn-warning",
				closeModal: true,
			}
		})
			.then((value) => {
				bankrupt();
			});
		var close = document.getElementById("myModal");
		close.style.display = "none";
	} else {
		// Alert for how much you won after spinning wheel
		swal({
			title: "You have $" + indicatedSegment.text + " at Stake",
			button: {
				text: "continue",
				value: true,
				visible: true,
				className: "btn btn-warning",
				closeModal: true,
			}
		})
			.then((value) => {
				location.reload();
			});
		var close = document.getElementById("myModal");
		close.style.display = "none";
	}

}
function bankrupt() {
	document.bankrupt.submit();
}