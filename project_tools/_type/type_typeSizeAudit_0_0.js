/**
 *	Type Size Audit 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *	Generates a report of all typestyles and sizes used in document
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


// document properties
var sel;
var report = [];
var artboard = activeDocument.activeArtboard.bounds;

var bVerbose = false;

// values
var values = {
	type: 'size',

	bSaveFile: true,
	bOnScreen: true
};


// components
var components = {
	type: {
		label: 'Report Type',
		options: ['typeface', 'weight', 'size', 'leading'],
		fullSize: true,
	},

	typeRule: {
		type: 'ruler',
		fullSize: true,
	},
	bSaveFile: {
		type: 'checkbox',
		label: 'Publish report as file?'
	},
	bOnScreen: {
		type: 'checkbox',
		label: 'Publish report on screen?'
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: 'TextItem',
		visible: true
	});

	var dialog = new Dialog.prompt('Typesize Audit', components, values);
};



// ------------------------------------------------------------------------
// Draw
// ------------------------------------------------------------------------
function Draw() {
	if(sel.length > 0) {
		// gather info
		for( var i=0; i<sel.length; i++ ) {
			var typeFace = typeWeight = typeSize = typeLeading = '';
		
			if( sel[i].characterStyle.font != undefined) {
				typeFace = sel[i].characterStyle.font.family.name;
				typeWeight = sel[i].characterStyle.font.name;
				typeSize = sel[i].characterStyle.fontSize;
				typeLeading = sel[i].characterStyle.leading;
			}
		
			var info = {
				typeface: typeFace,
				weight: typeWeight,
				size: roundDecimal(typeSize, 2),
				leading: roundDecimal(typeLeading, 2)
			};
			report.push(info);
		}


		// clean out duplicates
		report.sort(compare);
		report = report.eliminateDuplicates( values.type );
	
	
		// format and generate final report
		var reportStr = 'Typeface\tWeight\tSize\tLeading\r';
		for (var i = 0; i < report.length; i++) {
			reportStr += report[i].typeface + '\t';
			reportStr += report[i].weight + '\t';
			reportStr += report[i].size + '\t';
			reportStr += report[i].leading + '\r';
		}
		if (bVerbose) print(reportStr);
	
	
		// save
		if (values.bSaveFile) {
			var d = new Date().yyyymmdd();
			var t = new Date().hhmmss();
			saveFile(reportStr, 'TypeSizeAudit_' + d + '_' + t + '.txt');
		}
	
	
		// draw on screen
		if (values.bOnScreen) {
			var pointText = new PointText(new Point(-250, artboard.height));
			pointText.content += reportStr;
		}
	}
};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
report.eliminateDuplicates = function(key) {
	var r = new Array();
	outer: for (var i=0; i<this.length; i++) {
		for (var j=0; j<r.length; j++) {
			if (r[j][key] == this[i][key]) continue outer;
		}
		r[r.length] = this[i];
	}
	return r;
};

function compare(a, b) {
	if (a.typeface < b.typeface) return -1;
	if (a.typeface > b.typeface) return 1;
	return 0;
};


function roundDecimal(orig, deci) {
	var multi = Math.pow(10, deci);
	return Math.round(orig * multi) / multi;
};


/*
 *	http://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
 */
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString();
	var dd = this.getDate().toString();
	return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
};
Date.prototype.hhmmss = function() {
	var hh = this.getHours().toString();
	var mm = this.getMinutes().toString();
	var ss = this.getSeconds().toString();
	return (hh[1] ? hh : "0" + hh[0]) + (mm[1] ? mm : "0" + mm[0]) + (ss[1] ? ss : "0" + ss[0]);
};

// ------------------------------------------------------------------------
/*
 *	Jürg Lehni
 *	http://scriptographer.org/forum/help/save-array-data-to-external-file/?pos=0#Post-3279
 */
function saveFile(str, fname) {
	var file = new File(script.file.parent, fname);
	if (file.exists()) file.remove();
	file.open();
	file.write(str);
	file.close();
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Draw();
