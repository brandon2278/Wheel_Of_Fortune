function createWheel() {
	return new Winwheel({
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
		'stopAngle':0,
		'spins': 4,
		'callbackFinished': closeWheel, // Function to call when the spinning has stopped.
		'callbackSound': playWheelSound, // Called when the tick sound is to be played.
		'soundTrigger': 'pin' // Specify pins are to trigger the sound.
	    },
	    'pins': // Turn pins on.
	    {
		'number': 13,
		'fillStyle': 'silver',
		'outerRadius': 4,
	    }
	});
}
