/**
 *	Type Breakup 0.0
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


//values
var values = {
	breakBy:	'words'
};

var components = {
	breakBy: {
		options: ['words', 'characters', 'line breaks']
	},
	
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: TextItem,
		selected: true
	});

	var dialog = new Dialog.prompt('Type Break Up', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	for( var i=0; i<sel.length; i++ ) {
		var obj = sel[i];
		var words = obj.words;
		var group = new Group();

		for(j=0; j<words.length; j++) {
			var word = words[j];

			// words
			if(values.breakBy == 'words') {
				var pText = new PointText(obj.position);
				pText.content = word.content; 
				pText.characterStyle = obj.characterStyle;
				pText.paragraphStyle = obj.paragraphStyle;
		
				pText.position += new Point( pText.characterStyle.fontSize*(j*1.5), 0 );
				group.appendTop(pText);

			} 
			// line breaks
			if(values.breakBy == 'line breaks') {
				var pText = new PointText(obj.position);
				pText.content = word.content; 
				pText.characterStyle = obj.characterStyle;
				pText.paragraphStyle = obj.paragraphStyle;
		
				pText.position += new Point( pText.characterStyle.fontSize*(j*1.5), 0 );
				group.appendTop(pText);

			} 
			// characters
			else {
				for(var k=0; k<word.content.length; k++) {
					var pText = new PointText(obj.position);
					pText.content = word.content[k]; 
					pText.characterStyle = obj.characterStyle;
					pText.paragraphStyle = obj.paragraphStyle;
				
					pText.position += new Point( pText.characterStyle.fontSize*k, 0 );
				}
			}

		}
		
		group.bounds.point = obj.bounds.point;
		obj.remove();
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
