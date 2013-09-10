/**
 *	Lorem Ipsum 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	A Lorem Ipsum/Greeking/Dummy-Text generator for Illustrator
 *	instead of having to use InDesign or sites like lipsum.com
 *	
 *	http://blog.kennethfrederick.de/2011/06/scriptographer-lorem-ipsum.html
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
var dialog;

var lorem = new Array('lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum');


var loremTextStr;


// values
var values = {
	loremNum:			5,
	genType:			'Words',

	bTitle: 			false, 
	bPunctuation: 		true, 
	bReplace: 			true, 


	/**
	 *	hidden values for additional tweaking and features
	 */
	paraLengthAvg:	 	120,
	paraLengthRange:	40,
	sentLengthAvg:		14,

	// to use this tool as constant palette on screen
	// change this value to 'true' 
	mode:				false

};

// components
var components = {
	// ------------------------------------
	// Amount & Type
	// ------------------------------------
	loremNum: {
		type: 'number'
	},
	genType: {
		options: ['Words', 'Paragraphs']
	},

	amountRule: { 
		type: 'ruler',
		fullSize: true
	},

	// ------------------------------------
	// Details
	// ------------------------------------
	bTitle: {
		type: 'checkbox',
		label: 'Title Case',
		onChange: function(value) {
			if(value) components.bPunctuation.value = false;
		}
	},
	bPunctuation: {
		type: 'checkbox',
		label: 'Include Punctuation'
	},

	detailRule: { 
		type: 'ruler',
		fullSize: true,
	},

	// ------------------------------------
	// Replace
	// ------------------------------------
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
		visible: values.mode
	},

	// ------------------------------------
	// Invocation
	// ------------------------------------
	submit: { 
		type: 'button', 
		value: 'Generate',
		visible: values.mode,
		onClick: function() {
			Draw();
		}
	}


}



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	if(values.mode) {
		dialog = new Palette('Lorem Ipsum', components, values);
	} else {
		dialog = new Dialog.prompt('Lorem Ipsum', components, values);
		Draw();
	}
}


// ------------------------------------------------------------------------
// Update
// ------------------------------------------------------------------------
function Update(event) {
}


// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	// selection
	sel = activeDocument.getItems({
			type: 'TextItem',
			selected: true
	});

	loremTextStr = '';
	if (sel.length > 0) {
		// if text item is selected
		for ( var i=0; i<sel.length; i++ ) {
			obj = sel[i];
		
			// generate lorem ipsum text per item
			loremTextStr = '';
			if(values.genType == 'Words' ) LoremIpsumWords(values.loremNum);
			else if(values.genType == 'Paragraphs' ) LoremIpsumParagraphs();

			if(obj.children.length > 1) digger(obj);
			else generateText(obj);
		}

	} else {
		if(values.genType == 'Words' ) LoremIpsumWords(values.loremNum);
		else if(values.genType == 'Paragraphs' ) LoremIpsumParagraphs();

		// if no selection
		// create an empty text box
		generateText();
	}
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function random(minr, maxr) {
	return minr + Math.random() * (maxr - minr);
}
function randomInt(minr, maxr) {
	return parseInt( random(minr,maxr) );
}

// ------------------------------------------------------------------------
function LoremIpsumWords(num) {
	var punc = 1;
	var wordCount = 0;
	var word;

	// rudimentary lorem ipsum generator
	// uses random values to sprinkle punctuation marks
	// throughout the text in a "realistic" fashion
	for(var i=0; i<num; i++) {
		word = lorem[ randomInt(0,lorem.length) ];
		if(values.bTitle) word = word.initialCap();

		wordCount++;

		// add punctuation .,;:
		if(values.bPunctuation) {
			if(punc == 0 || i == num-1) loremTextStr += word + '.';		// 0 = period
			else if(punc == 3) loremTextStr += word + ', ';	// 3 = comma
			else if(wordCount > 3 && wordCount < 12 && punc == 6) loremTextStr += word + '; ';	// 6 = semi-colon
			else if(wordCount > 3 && wordCount < 12 && punc == 9) loremTextStr += word + ': ';	// 9 = colon
			else loremTextStr += word + ' ';				// space
		} else {
			loremTextStr += word + ' ';
		}

		// determine punctuation
		var newSentence = randomInt(0,2);
		if(wordCount > values.sentLengthAvg && num > 24 && newSentence == 0) {
			punc = 0;
			wordCount = 0;
		} else {
			punc = randomInt(1,36);
		}
	}

	if(!values.bTitle) loremTextStr = sentenceCase(loremTextStr);
}

function LoremIpsumParagraphs() {
	var paraWordNum = randomInt(values.paraLengthAvg - values.paraLengthRange, values.paraLengthAvg + values.paraLengthRange);

	// paragraph
	for(var i=0; i<values.loremNum; i++) {
		LoremIpsumWords(paraWordNum);
		loremTextStr += '\r\r';
	}
}

// ------------------------------------------------------------------------
function generateText(obj) {
	if( obj != undefined ) {
		if(obj.words) {
			// we'll add on to the text in existing selection
			if(values.bReplace) obj.content = loremTextStr;
			else obj.content += ' ' + loremTextStr;
		}
	} else {
		// selected object is not valid or
		// doesn't exist so we'll create our own
		var rectangle = new Rectangle(new Point(0,0), new Size(210,297));
		var areaText = new AreaText(rectangle);
		areaText.position = new Point(activeDocument.bounds.width*0.5, activeDocument.bounds.height*0.5);
		areaText.content += loremTextStr;
	}
}


/**
 *	with a little guidance from
 *	http://www.tek-tips.com/viewthread.cfm?qid=1227066&page=1
 */
String.prototype.initialCap = function() {
	var str = this.substr(0, 1).toUpperCase() + this.substr(1);
	return str;
}
/**
 *	http://www.webdeveloper.com/forum/showthread.php?t=41676
 *	http://www.pit-r.de/
 */
function sentenceCase(text) {
	// val = text.value;
	val = text;
	result = new Array();
	result2 = '';
	count = 0;

	endSentence = new Array();
	for(var i=1; i<val.length; i++) {
		if(val.charAt(i) == '.' || val.charAt(i) == '!' || val.charAt(i) == '?'){
			endSentence[count] = val.charAt(i);
			count++
		}
	}

	var val2 = val.split(/[.|?|!]/);
	if(val2[val2.length-1] == '') val2.length = val2.length-1;

	for (var j=0; j<val2.length; j++) {
		val3 = val2[j];
		if(val3.substring(0,1)!=' ') val2[j] = ' '+val2[j];
		var temp = val2[j].split(' ');
		var incr = 0;
		if(temp[0] == '') {
			incr=1;
		}

		temp2 = temp[incr].substring(0,1);
		temp3 = temp[incr].substring(1,temp[incr].length);
		temp2 = temp2.toUpperCase();
		temp3 = temp3.toLowerCase();
		temp[incr] = temp2+temp3;

		for (var i=incr+1; i<temp.length; i++) {
			temp2 = temp[i].substring(0,1);
			temp2 = temp2.toLowerCase();
			temp3 = temp[i].substring(1,temp[i].length);
			temp3 = temp3.toLowerCase();
			temp[i] = temp2+temp3;
		}

		if(endSentence[j] == undefined) endSentence[j] = '';
		result2 += temp.join(' ')+endSentence[j];
	}

	if(result2.substring(0,1) == ' ') result2 = result2.substring(1,result2.length);
	// text.value = result2;
	return result2;
}

// ------------------------------------------------------------------------
function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		generateText(digObj.children[k]);
		// if(digObj.children[k].children.length > 1) {
			digger(digObj.children[k]);
		// }
	}
}



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
//Draw();