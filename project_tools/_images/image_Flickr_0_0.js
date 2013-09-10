/**
*	Flickr 0.0
*
*	Ken Frederick
*	ken.frederick@gmx.de
*
*	http://kennethfrederick.de/
*	http://blog.kennethfrederick.de/
*
*/


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../../libraries/frederickkScript/frederickkScript.js');
importPackage(java.net);
importPackage(java.io);



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------

/**
*	Note from the Scriptographer.org Team
*	
*	In Scriptographer 2.9, we switched to a top-down coordinate system and
*	degrees for angle units as an easier alternative to radians.
*	
*	For backward compatibility we offer the possibility to still use the old
*	bottom-up coordinate system and radians for angle units, by setting the two
*	values bellow. Read more about this transition on our website:
*	http://scriptographer.org/news/version-2.9.064-arrived/
*/

//script.coordinateSystem = 'top-down';
script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';

// load frederickkScript
var f = frederickkScript;

// document properties
var sel = activeDocument.getItems({
	selected: true
});

// apply for a flickr api key here:
// http://www.flickr.com/services/apps/create/apply/?
// or if you have one already find it here:
// http://www.flickr.com/services/api/keys/
var apiKey = '681a16a0f5448bb7c7db02431e59c7fa';
var secret = '919c1384422fa4aa';

var data;
var results;
var fname = 'temp.json';

//values
var values = {
	// ------------------------------------
	// Flickr
	// ------------------------------------

	// url is built based on api search method
	// http://www.flickr.com/services/api/flickr.photos.search.html
	// only change this method if you know what you're doing
	// changing it could effect the url building below
	method:			'flickr.photos.search',


	// ------------------------------------
	// Photos
	// ------------------------------------
	// tags can be comma delimmited
	tags:			'',
	
	// use the groups id number (the last bit of the url)
	// example: http://www.flickr.com/groups/52240504976@N01/ = berlin group
	groups:			'52240504976@N01',

	// put as many images on a page as we have items selected
	// the maximum allowed value is 500
	perpage:		sel.length,

	// http://www.flickr.com/services/api/flickr.photos.licenses.getInfo.html
	// 'No known copyright restrictions' ideal, völlig frei verwendbar, ohne Namensnennung
	// 'Attribution-ShareAlike License' und 'Attribution-NoDerivs License'  (erfordern aber Namensnennung)
	license:		'Attribution-ShareAlike License',


	// ------------------------------------
	// Location
	// ------------------------------------
	lat:			48.15,
	lon:			11.583,

	// Recorded accuracy level of the location information, range of 1-16
	// 1 = World, ~3 = Country, ~6 = Region, ~11 = City, ~16 = Street
	// Defaults to 16 if not specified.
	acc:			11,

	// ------------------------------------
	// add'l
	// ------------------------------------
	scale:			false,
	random:			false,
	verbose:		false

};

//components
var components = {
	// ------------------------------------
	// Flickr
	// ------------------------------------
	method: {
		label: 'API Method',
		options: [	'flickr.photos.search',
					'flickr.photos.geo.photosForLocation' ],
		onChange: function(value) {
			if (value == 'flickr.photos.geo.photosForLocation') {
				components.lat.enabled = true;
				components.lon.enabled = true;
				components.acc.enabled = true;
			}
			else {
				components.lat.enabled = false;
				components.lon.enabled = false;
				components.acc.enabled = false;
			}
		}
	},


	// ------------------------------------
	// Photos
	// ------------------------------------
	tags: {
		type: 'string',
		label: 'Tags\n(comma delimmited)'
	},
	groups: {
		type: 'string',
		label: 'Group id'
	},
	perpage: {
		type: 'number',
		label: 'Number of photos to return\n(max. 500)'
	},

	license: {
		label: 'License',
		options: [	'All Rights Reserved',
					'Attribution License',
					'Attribution-NoDerivs License',
					'Attribution-NonCommercial-NoDerivs License',
					'Attribution-NonCommercial License',
					'Attribution-NonCommercial-ShareAlike License',
					'Attribution-ShareAlike License',
					'No known copyright restrictions',
					'United States Government Work' ]
	},

	photosRule: { 
		type: 'ruler',
		fullSize: true,
	},


	// ------------------------------------
	// Location
	// ------------------------------------
	lat: {
		type: 'number',
		label: 'Latitude (-90 to 90)',
		enabled: false
	},
	lon: {
		type: 'number',
		label: 'Latitude (-180 to 180)',
		enabled: false
	},
	acc: {
		type: 'number',
		label: 'Accuracy',
		range: [0,16],
		increment: 1,
		steppers: true,
		enabled: false
	},

	locationRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// add'l
	// ------------------------------------
	scale: { 
		type: 'checkbox',
		label: 'Scale image to selection'
	},
	random: { 
		type: 'checkbox',
		label: 'Randomize results'
	},

	verbose: { 
		type: 'checkbox',
		label: 'Verbose Mode'
	}


};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// debug
	/*
	var u = new URL('http://labs.ideeinc.com/coloursearch/services/rest/?method=color.search&quantity=50&page=0&colors=3626af&imageset=flickr'); 
	var s = new DataInputStream(u.openStream()); 
	var json = ''; 
	var line; 
	while ((line = s.readLine()) != null) { 
	    json += line; 
	}; 
	var d = Json.decode(json); 
	for (n in d) print(n+": "+d[n]+"\n");
	*/

	// initialize the dialog box
	var dialog = new Dialog.prompt('Flickr 0.0', components, values);

	// values here must coincide with the
	// method used above
	var url = 'http://api.flickr.com/services/rest/?method=' + values.method + 
		'&api_key=' + apiKey +
		'&tags=' + values.tags +
		'&group_id=' + values.groups +
		'&per_page=' + (values.perpage*2) + 
		'&license=' + getLicense() + 
		//'&privacy_filter=1' + // 1: 'Public'
		'&format=json';
	if (values.verbose) print(' --- API URL ---\n', url);


	// get the json result and parse it
	var jsonRaw = processJson(url);
	//jsonFlickrApi( jsonRaw );
	data = Json.decode(jsonRaw);

	// make sure data is valid
	if (!data) {
		print('Data parse Error\n' + jsonRaw);
	}
	else {
		Draw();
	}

};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	/*
	var pathItems = activeDocument.getItems({
		type: Path,
		selected: true
	});
	var rasters = activeDocument.getItems({
		type: Raster,
		selected: true
	});
	*/


	if ( data.photos != null || data.photos != undefined || data.photos.photo.length != 0 ) {
		
		// find the the lowest value
		var amt;
		if( sel.length < data.photos.photo.length ) amt = sel.lenth;
		else amt = data.photos.photo.length;
		
		//for(var i in data.photos.photo) {
		//for( var i=0; i<sel.length; i++ ) {
		for(var i=0; i<amt; i++) {
			// supposedly we have the same number of photos
			// as objects selected
			var obj = sel[i];
	
			// place the photos
			var image;
			var num;
			if (values.random) {
				num = randomInt(0, data.photos.photo.length);
			}
			else {
				//num = f.clamp(i, data.photos.photo.length-1);
				num = i;
			}
			image = new PlacedFile( buildUrl(data,num) );

			// scale image to object
			if (values.scale) {
				var imageRatio;
				if (image.bounds.height > image.bounds.width) {
					imageRatio = image.bounds.height/image.bounds.width;
				}
				else {
					imageRatio = image.bounds.width/image.bounds.height;
				}

				if (obj.bounds.height > obj.bounds.width) {
					image.bounds.height = obj.bounds.height;
					image.bounds.width = obj.bounds.height*imageRatio;
				}
				else {
					image.bounds.height = obj.bounds.width*imageRatio;
					image.bounds.width = obj.bounds.width;
				}
			}
			image.position = obj.position;

			// finish up by either removing obj
			// or creating a mask from obj (!Raster, !PlacedFile)
			cleanup(obj,image);
		}

		Dialog.alert('Flickr complete');
	}
	else {
		Dialog.alert('Try again with different search criteria');
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function processJson(url) {
	var url = new java.net.URL(url);
	var stream = new DataInputStream(url.openStream());
	var jsonRaw = '';
	var line;
	while ((line = stream.readLine()) != null) {
		jsonRaw += line;
	};

	// clean up the string
	// flickr adds 'jsonFlickrApi(' at the beginning and ')' at the end
	// this has to be stripped away in
	// order to decode the json response
	jsonRaw = jsonRaw.substring(14, jsonRaw.length-1);

	if (values.verbose) {
		// show debug
		print(' --- jsonRaw ---\n', jsonRaw);
		print(' ---\n');
	}
	return jsonRaw;
};


// ------------------------------------------------------------------------
function getLicense() {
	if ( values.license == 'All Rights Reserved' ) return 0;
	else if ( values.license == 'Attribution License') return 4;
	else if ( values.license == 'Attribution-NoDerivs License') return 6;
	else if ( values.license == 'Attribution-NonCommercial-NoDerivs License' ) return 3;
	else if ( values.license == 'Attribution-NonCommercial License' ) return 2;
	else if ( values.license == 'Attribution-NonCommercial-ShareAlike License' ) return 1;
	else if ( values.license == 'Attribution-ShareAlike License' ) return 5;
	else if ( values.license == 'No known copyright restrictions' ) return 7;
	else if ( values.license == 'United States Government Work' ) return 8;
	else return '';
};

function buildUrl(data, num) {
	if (values.verbose) print( data.photos.photo.length + " : " + num );

	// build the file path url for the photo
	var farm = data.photos.photo[num].farm;
	var server = data.photos.photo[num].server;
	var id = data.photos.photo[num].id;
	var secret = data.photos.photo[num].secret;
	var size = ''; //'_o';

	var photoUrl = 'http://farm' + farm + '.static.flickr.com/' + server + '/' + id + '_' + secret + size + '.jpg';
	if (values.verbose) print(' --- Debug ---\n', i + ': ' + photoUrl);

	// place the photos
	var url = new java.net.URL( photoUrl ); 
	return url;
};


// ------------------------------------------------------------------------
function cleanup(obj, image) {
	//print( f.getType(obj) );
	if ( f.getType(obj) == 'Raster' || f.getType(obj) == 'PlacedFile' ) {
		// replace obj with image
		obj.remove();
	}
	else if (  f.getType(obj) == 'Group' ) {
		// recursive search through group
		digger(obj,image);
	}
	else {
		// mask image in selected object
		var group = new Group();
		group.appendTop( image );
		group.appendTop( obj );
		group.clipped = true;
		obj.clipMask = true;
	}
};

// ------------------------------------------------------------------------
function digger(digObj, image) {
	for(var k=0; k<digObj.children.length; k++) {
		cleanup(digObj.children[k], image);
		digger(digObj.children[k]);
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
//Draw();
