/**
 *	LoremReplace 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 */


// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------


// document properties
var sel;
var lorem = new Array('lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum');
var toFindArr = new Array();
var toFindText;
var toReplaceArr = new Array();
var loremTextStr = '';


//values
var values = {
	// ------------------------------------
	// replace
	// ------------------------------------
	bREPLACE:			false,
	search:				'',
	
	// ------------------------------------
	// generate
	// ------------------------------------
	bLOREM:				false,
	loremWordsNum:		0
};

//components
var components = {
	// ------------------------------------
	// replace
	// ------------------------------------
	bREPLACE: {
		type: 'checkbox',
		label: 'Search & Replace',
	},
	search: {
		label: 'Words to Replace',
	},
	
	rRule: { 
		type: 'ruler',
		fullSize: true,
	},
	
	// ------------------------------------
	// generate
	// ------------------------------------
	bLOREM: {
		type: 'checkbox',
		label: 'Generate Lorem Ipsum',
	},
	loremWordsNum: {
		type: 'number',
		label: 'Number of Words',
	}
}

// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	// initialize the dialog box
	var dialog = new Dialog.prompt('Lorem Ipsum 0.0', components, values);
	LoremIpsum();

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
	//create holder for toFind text
	toFindArr = values.search.split(' ');
	toFindText = new PointText( new Point(0,0) );
	for(i in toFindArr) {
		toFindText.content += toFindArr[i] + ' ';
	}
	
	//selection
	sel = activeDocument.getItems(Item, { selected: true }); 
	for ( var i=0; i<sel.length; i++ ) {
		obj = sel[i];
		
		if(values.bREPLACE) replaceText(obj);
		if(values.bLOREM) {
			generateText(obj);
			if(i == sel.length-1) values.bLOREM = !values.bLOREM;
		}
	}

	//if no selection made
	if(values.bLOREM) generateText();
	
	//clean up
	toFindText.remove();
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
function LoremIpsum() {
	var punc = 2;
	var wordCount = 0;

	for(var i=0; i<values.loremWordsNum; i++) {
		if(punc == 0 || punc == 9 || i == values.loremWordsNum-1) {
			loremTextStr += lorem[ randomInt(0,lorem.length) ] + '.';
		} else if(punc == 3) {
			loremTextStr += lorem[ randomInt(0,lorem.length) ] + ', ';
		} else {
			loremTextStr += lorem[ randomInt(0,lorem.length) ] + ' ';
		}

		wordCount++;
		if(wordCount > 14 && values.loremWordsNum > 20 && randomInt(0,2) == 0) {
			punc = 0;
			wordCount = 0;
		} else {
			punc = randomInt(1,10);
		}

	}

	loremTextStr = sentenceCase(loremTextStr);

}

/** 
  * with a little guidance from
  * http://www.tek-tips.com/viewthread.cfm?qid=1227066&page=1
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
	//val = text.value; 
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
	//text.value = result2; 
	return result2; 
} 


// ------------------------------------------------------------------------
function replaceText(obj) {
	if(obj.words) {

		//go through obj words
		for(i in obj.words) {
			var objWord = obj.words[i].content;
			for(j in toFindText.words) {
				var toFindWord = toFindText.words[j].content;
				if(objWord == toFindWord) {
					//print(objWord + ' -> ' + toFindWord);
					obj.words[i].content = lorem[ parseInt(random(0,lorem.length)) ] + ' ';
				}
			}
		}
		
	}

	//recursive
	digger(obj);
}


// ------------------------------------------------------------------------
function generateText(obj) {
	if( obj !== undefined ) {
		if(obj.words) {
			// we'll add on to the text in existing selection
			obj.content += loremTextStr;
		}
	} else {
		// selected object is not valid or 
		// doesn't exist so we'll create our own
		var rectangle = new Rectangle(new Point(0,0), new Size(210,297)); 
		var areaText = new AreaText(rectangle);
		areaText.content += loremTextStr;
	}
}


// ------------------------------------------------------------------------
function digger(digObj) {
	for(var k=0; k<digObj.children.length; k++) {
		replaceText(digObj.children[k]);
		
		//if(digObj.children[k].children.length > 1) {
			digger(digObj.children[k]);
		//}
	}
}


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Update(event);
Draw();
