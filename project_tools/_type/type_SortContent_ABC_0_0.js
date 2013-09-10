/**
 *	Type Sort Content ABC 0.0
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
var debug = false;



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	sel = activeDocument.getItems(TextItem, { selected: true }); 

	for( var i=0; i<sel.length; i++ ) {
		var ABCList = new Array();
		var obj = sel[i];

		//create list to sort
		for(j in obj.words) ABCList.push( obj.words[j].content );
		ABCList.sort(alphabetical);

		//clear and replace
		obj.content = '';
		for(j in ABCList) obj.content += ABCList[j];
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
/**
  *	http://www.brain4.de/programmierecke/js/arraySort.php
  */
function alphabetical(a, b) {
	/*
	var A = a.toLowerCase();
	var B = b.toLowerCase();

	if(A < B) return -1;
	else if(A > B) return  1;
	else return 0;
	*/

	a = a.toLowerCase();
	a = a.replace(/ä/g,"a");
	a = a.replace(/ö/g,"o");
	a = a.replace(/ü/g,"u");
	a = a.replace(/ß/g,"s");

	b = b.toLowerCase();
	b = b.replace(/ä/g,"a");
	b = b.replace(/ö/g,"o");
	b = b.replace(/ü/g,"u");
	b = b.replace(/ß/g,"s");

	return(a==b)?0:(a>b)?1:-1;
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
