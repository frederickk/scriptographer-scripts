/**
 *	Kant Generator 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	A generator of mock philosophy
 *	based on the work done in python by Mark Pilgrim
 *
 *	Mark Pilgrim
 *	mark@diveintopython.org
 *	
 *	Revision: 1.4
 *	2004/05/05 21:57:19
 *	Copyright (c) 2001 Mark Pilgrim"
 *
 *	the actual kgp.py included with this example was taken
 *	from the nodebox source code https://github.com/nodebox/nodebox-pyobjc.git
 *
 *	I've implemented an odd work around to get the text
 *	by using java to execute a python runtime
 *	(because I couldn't port the original python to javascript)
 *
 */


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

script.coordinateSystem = 'bottom-up';
script.angleUnits = 'radians';


// ------------------------------------------------------------------------
// document properties
// ------------------------------------------------------------------------
var sel;


/*
 *	husserl.xml
 *	    generates several paragraphs of Husserl
 *	kant.xml
 *	    generates several paragraphs of Kantian philosophy
 *	thanks.xml
 *	    generates a thank you note
 */
var kant    = '/kant/kant.xml';
var husserl = '/kant/husserl.xml';
var thanks  = '/kant/thanks.xml';


// values
var values = {
	textAmount:				1,
	textType:				'Default',
	textStyle:				'Kant',

	delimitter:				'Enter',
	
	bReplace:				true,

	// to use this tool as constant palette on screen
	// change this value to 'true' 
	bPalette:				false
};

// components
var components = {
	// Amount & Type
	// textAmount: {
	// 	type: 'number',
	// },
	// textType: {
	// 	options: ['Sentences', 'Paragraphs', 'Default'],
	// 	fullSize: true,
	// },
	textStyle: {
		options: ['Kant', 'Husserl', 'Thanks'],
		fullSize: true,
	},

	amountRule: {
		type: 'ruler',
		fullSize: true
	},


	// Details
	delimitter: {
		// options: [' ', '\r', '/', '-', '\t'],
		options: ['Space', 'Enter', 'Slash', 'Dash', 'Tab'],
		fullSize: true,
	},


	detailRule: {
		type: 'ruler',
		fullSize: true,
	},


	// Replace
	bReplace: {
		type: 'checkbox',
		label: 'Replace existing text'
	},


	/**
	 *	the following elements are only visible/active
	 *	when using this tool in palette mode
	 */
	replaceRule: {
		type: 'ruler',
		fullSize: true,
		visible: values.bPalette
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: {
		type: 'button',
		value: 'Generate',
		fullSize: true,
		visible: values.bPalette,
		onClick: function() {
			Draw();
		}
	}
}



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the palette box
	if (values.bPalette) {
		palette = new Palette('Kant Generator', components, values);
	}
	else {
		palette = new Dialog.prompt('Kant Generator', components, values);
		Draw();
	}
}



// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {}



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// selection
	sel = activeDocument.getItems({
		type: 'TextItem',
		selected: true
	});


	// choose generation style
	var xml;
	if (values.textStyle == 'Binary') xml = binary;
	else if (values.textStyle == 'Husserl') xml = husserl;
	else if (values.textStyle == 'Kant') xml = kant;
	else if (values.textStyle == 'Thanks') xml = thanks;
	var pythonCmd = script.directory + '/kant/kgp.py -g ' + script.directory + xml;

	var delim;
	if(values.delimitter == 'Space') delim = ' ';
	if(values.delimitter == 'Enter') delim = '\r';
	if(values.delimitter == 'Slash') delim = '/';  
	if(values.delimitter == 'Dash') delim = '-';  
	if(values.delimitter == 'Tab') delim = '\t';
	// else delim = values.delimitter;


	// generate text
	var text;
	var obj;
	if (sel.length > 0) {
		for ( var i=0; i<sel.length; i++ ) {
			obj = sel[i];
		
			text = ExecPython(pythonCmd, delim);
			if(obj.children.length > 1) Recursive(obj, text);
			else CreateTextItem(obj, text);
		}
	}
	else {
		text = ExecPython(pythonCmd, delim);
		CreateTextItem(obj, text);
	}

}



// ------------------------------------------------------------------------
// methods
// ------------------------------------------------------------------------
function trim(str) {
	str = str.replace(/(^\s*)|(\s*$)/gi,'');
	str = str.replace(/[ ]{2,}/gi,' ');
	str = str.replace(/\n /,'\n');
	return str;
}


/**
 *
 * "Class" to execute and return the results of a python script
 * 
 */
function ExecPython(pythonCmd, delimitter) {
	var process = java.lang.Runtime.getRuntime().exec( 'python ' + pythonCmd );
	var pythonResult = '';
	var pythonResultArr = new Array();

	if(delimitter == '\r') delimitter = '\r\r';

	if(pythonCmd != '') {
		var reader = java.io.BufferedReader( java.io.InputStreamReader(process.getInputStream()) );

		while ( (line = reader.readLine()) != null ) {
			var m = String.split(line, delimitter);
			for(var i=0; i<m.length; i++) {
				pythonResultArr.push(pythonResultArr, m[i]);
			} 
			pythonResult += delimitter + trim(line);
		}
	}
	else {
		console.log('Not a valid python command/script');
	}

	return trim(pythonResult);
}


// ------------------------------------------------------------------------
function CreateTextItem(obj, text) {
	if( obj != undefined ) {
		if(obj.words) {
			if(values.bReplace) obj.content = text;
			else obj.content += ' ' + text;
		}
	}
	else {
		var rectangle = new Rectangle(new Point(0,0), new Size(210,297));
		var areaText = new AreaText(rectangle);
		areaText.position = new Point(activeDocument.bounds.width*0.5, activeDocument.bounds.height*0.5);
		areaText.content += text;
	}
}


// ------------------------------------------------------------------------
function Recursive(obj, text) {
	for (var k = 0; k < obj.children.length; k++) {
		CreateTextItem( obj.children[k], text );
		// if(obj.children[k].children.length > 1) {
			Recursive( obj.children[k], text );
		// }
	}
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();