/**
 *  Spectrum
 *
 *  Ken Frederick
 *  ken.frederick@gmx.de
 *
 *  http://cargocollective.com/kenfrederick/
 *  http://kenfrederick.blogspot.com/
 *
 *  
 *  An exmaple of blending colors using Color.lerp
 *
 */


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../libraries/frederickkScript/frederickkScript.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------

/**
 *  Note from the Scriptographer.org Team
 *  
 *  In Scriptographer 2.9, we switched to a top-down coordinate system and
 *  degrees for angle units as an easier alternative to radians.
 *  
 *  For backward compatibility we offer the possibility to still use the old
 *  bottom-up coordinate system and radians for angle units, by setting the two
 *  values bellow. Read more about this transition on our website:
 *  http://scriptographer.org/news/version-2.9.064-arrived/
 */

script.coordinateSystem = 'top-down';
script.angleUnits = 'radians';

// load frederickkScript
var f = frederickkScript;

// the gradient
var spectrum;
var spectrumGradient;
var spectrumStops = [];
var path;

// colors
var spectrumColors = [
  new RGBColor( 115/255, 233/255, 255/255 ),
  new RGBColor(   0/255, 255/255, 178/255 ),
  new RGBColor( 144/255,  39/255, 142/255 ),
  new RGBColor( 255/255,  70/255, 100/255 )
];

// colors holder
var colors = new Array(2);

var index = 0;
var delta = 0.0;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {

	// the spectrum
	colors[0] = spectrumColors[0];
	colors[1] = spectrumColors[1];

	spectrumStops = [
		new GradientStop(colors[0], 0),
		new GradientStop(colors[1], 1)
	];
	spectrumGradient = new Gradient() {
		type: 'linear',
		stops: spectrumStops
	};
	spectrum = new GradientColor(
		spectrumGradient,
		view.bounds.topLeft,
		view.bounds.bottomRight
	);

	// the container
	path = new Path.Rectangle( new Point(0,0), view.bounds.size );
	path.fillColor = spectrum;


};



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
	if(delta > 1.0) {
		index++;
		delta = 0.0;
	}
	else {
		delta += 0.01;
	}

	Draw();
};



// ------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------
function Draw() {


	// update colors
	colors[0] = new RGBColor(0,0,0).lerp(
		spectrumColors[ index % 4 ],
		spectrumColors[ (index+1) % 4 ],
		delta
	);

	colors[1] = new RGBColor(0,0,0).lerp(
		spectrumColors[ (index+1) % 4 ],
		spectrumColors[ (index+2) % 4 ],
		delta
	);

	// update spectrum
	spectrumStops[0].color = colors[0];
	spectrumStops[1].color = colors[1];
	spectrumGradient = new Gradient() {
		type: 'linear',
		stops: spectrumStops
	};
	spectrum = new GradientColor(
		spectrumGradient,
		view.bounds.topLeft,
		view.bounds.bottomRight
	);
	path.fillColor = spectrum;

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------




// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true, 6);
Draw();




		





