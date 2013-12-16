/**
 *	Bomb 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 *	based on FontBomb, for use in Scriptographer
 *	http://fontbomb.ilex.ca/
 *
 *	Philippe-Anto Lehoux
 *	http://www.ilex.ca/
 *
 *
 *  Relies on folio.js for animation support
 *  http://github.com/frederickk/folio.js
 *
 */


// ------------------------------------------------------------------------
// Libraries
// ------------------------------------------------------------------------
include('../libraries/folio/scriptographer.folio.js');



// ------------------------------------------------------------------------
// Properties
// ------------------------------------------------------------------------
var sel;
var explosion;

// this keeps the mousedrag dropping reasonable
tool.minDistance = 48;

// values
var values = {
	bContain: true,
	bBreakGroups: true,
	bPause: false
};

//components
var components = {
	bContain: {
		type: 'checkbox',
		label: 'Contain the Blast'
	},
	bBreakGroups: {
		type: 'checkbox',
		label: 'Nothing is Safe'
	},
	arm: {
		type: 'button',
		value: 'Arm',
		fullSize: true,
		onClick: function() {
			ArmExplosion();
			this.enabled = false;
			this.value = 'Armed';
		}
	},

	pauseRule: {
		type: 'ruler',
		fullSize: true
	},

	pauseButton: {
		type: 'button',
		value: 'Pause',
		fullSize: true,
		onClick: function() {
			values.bPause = !values.bPause;

			if (values.bPause) this.value = 'Play';
			else this.value = 'Pause';
		}
	}
};



// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems(Item, {
		selected: true
	});

	explosion = new Explosion( sel );

	// show pallete
	palette = new Palette('Bomb', components, values );



};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function Update(event) {
	if( explosion.armed() ) {
		if( !values.bPause ) {
			explosion.tick();
		}
	}

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function Draw() {

};



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function ArmExplosion() {
	sel = activeDocument.getItems(Item, {
		selected: true
	});

	explosion = new Explosion( sel );
	explosion.contain( values.bContain );
	explosion.everything( values.bBreakGroups );
	explosion.arm();
}

/**
 *
 *	Particle
 *
 */
var Particle = function(item, contain) {
	var transform = new Point(0,0),
		transformRotation = 0,
		bContain = contain || false,
		velocity = new Point(0,0),
		damping = 0.8;

	var tick = function(blast) {
		var distX, distXS, distY, distYS,
			distanceFromBlast,
			force, forceX, forceY,
			previousState, previousRotation,
			rad;

		previousState = transform;
		previousRotation = transformRotation;

		if (velocity.x > 1.5) {
			velocity.x -= 1.5;
		}
		else if (velocity.x < -1.5) {
			velocity.x += 1.5;
		}
		else {
			velocity.x = 0;
		}
		if (velocity.y > 1.5) {
			velocity.y -= 1.5;
		}
		else if (velocity.y < -1.5) {
			velocity.y += 1.5;
		}
		else {
			velocity.y = 0;
		}
		if (blast != null) {
			distX = item.position.x + transform.x - blast.x;
			distY = item.position.y + transform.y - blast.y;
			distXS = distX * distX;
			distYS = distY * distY;
			distanceFromBlast = distXS + distYS;
			force = 100000 / distanceFromBlast;
			if (force > 9) force = 9;
			rad = Math.asin(distYS / distanceFromBlast);
			forceY = Math.sin(rad) * force * (distY < 0 ? -1 : 1);
			forceX = Math.cos(rad) * force * (distX < 0 ? -1 : 1);
			velocity.x = +forceX;
			velocity.y = +forceY;

			velocity.x *= damping;
			velocity.y *= damping;

		}
		transform.x = transform.x + velocity.x;
		transform.y = transform.y + velocity.y;
		transformRotation = transform.x * -1;


		if ((Math.abs(previousState.x - transform.x) > 1 ||
			 Math.abs(previousState.y - transform.y) > 1 ||
			 Math.abs(previousRotation - transformRotation) > 1) &&
		   ((transform.x > 1 || transform.x < -1) ||
		   	(transform.y > 1 || transform.y < -1))) {

			if( bContain ) {
				boundaries();
			}

			item.translate( new Point(transform.x,transform.y) );
			item.rotate( transformRotation );
		}
	};

	function boundaries() {
		if( item.position.x+transform.x >= activeDocument.activeArtboard.bounds.width-item.bounds.width ||
			item.position.x+transform.x <= 0 ) { //item.bounds.width ) {
			transform.x *= -1
		}
		if( item.position.y+transform.y >= activeDocument.activeArtboard.bounds.height-item.bounds.height ||
			item.position.y+transform.y <= 0 ) { //item.bounds.height) {
			transform.y *= -1
		}
	};

	return {
		tick: tick
	}
};


/**
 *
 *	Bomb
 *
 */
var Bomb = function(x, y) {
	var boom, casing, counter;

	var radius = 24;
	var state = 'planted';
	var count = 4;

	// scriptographer specific timers
	// http://scriptographer.org/reference/ai/timer/
	var timer = new Timer(800); // 2 seconds
	timer.onExecute = function() {
		countDown();
	};

	var drop = function() {
		casing = new Path.Circle( new Point(x,y), radius );
		casing.fillColor = new GrayColor(1.0);
		casing.opacity = 0.90;

		counter = new PointText({
			content: count,
			paragraphStyle: {
				justification:	'center'
			},
			characterStyle: {
				font: 			app.fonts['helvetica'],
				fontSize:		18,
				fillColor:		new GrayColor(0.0)
			}
		});
		counter.point = new Point(x,y+4.5);

		boom = new Group();
		boom.appendTop(casing);
		boom.appendTop(counter);

		return timer;
	};

	var countDown = function() {
		state = 'ticking';
		count--;
		counter.content = count;
		if (count <= 0) {
			timer.abort();
			return explode();
		}
	};

	var explode = function() {
		counter.content = '';
		return state = 'explode';
	};

	var exploded = function() {
		state = 'exploded';
		counter.content = '';
		return boom.opacity = 0.05;
	};

	function getState() {
		return state;
	};

	function getCount() {
		return count;
	};

	drop();


	return {
		boom: boom,
		state: getState,
		count: getCount,

		drop: drop,
		exploded: exploded
	}

};


/**
 *
 *	Explosion
 *
 */
function Explosion(items, arm) {
	var chr,
		particles = [],
		bombs = [],
		blast = null,
		bArmed = arm || false,
		bContain = false,
		bBreakGroups = false;

	function init() {
		var _ref = explosifyItems( items );

		particles = (function() {
			_results = [];
			for( var j=0; j<_ref.length; j++ ) {
				chr = _ref[j];
				_results.push( new Particle(chr,bContain) );
				chr.selected = false;
			}
			return _results;
		}).call(this);

		bArmed = true;
		return bArmed;
	};

	var explosifyItems = function(items) {
		var _results = [];
		for( var i=0; i<items.length; i++ ) {
			_results = _results.concat( explosifyItem(items[i]) );
		}
		return _results;
	};

	var explosifyItem = function(item) {
		if( item instanceof TextItem ) {
			return explosifyText(item);
		}
		else if( item instanceof Item ) {
			if( item instanceof Group && bBreakGroups ) {
				return explosifyGroup(item);
			}
			else {
				return item;
			}
		}
	};

	var explosifyGroup = function(item) {
		_results = [];
		for( var i=0; i<item.children.length; i++ ) {
			var kid = item.children[i];
			_results.push( kid );
			if( kid.children != undefined) {
				_results = _results.concat( explosifyGroup(kid) );
			}
		}
		return _results;

	};

	var explosifyText = function(item) {
		_results = [];
		_results = explosifyGroup( item.createOutline() );
		item.remove();

		// if( item instanceof AreaText ) {
		// 	_results = _results.concat( areaToPoint( item ) );
		// }
		// else if( item instanceof PointText ) {
		// 	if( item.content.indexOf('\n') === -1 ) {
		// 		item = new TextBreak().lines(item);
		// 	}

		// 	if( item.length != undefined ) {
		// 		for( var i=0; i<item.length; i++ ) {
		// 			_results = _results.concat( new TextBreak().characters( item[i] ) );
		// 		}
		// 	}
		// 	else {
		// 		_results = _results.concat( new TextBreak().characters( item ) );
		// 	}
		// }

		return _results;
	};

	var dropBomb = function(point) {
		return bombs.push(
			new Bomb( point.x, point.y )
		);
	};

	var tick = function() {
		var bomb, chr;
		var i, j, k;

		// bombs
		for( i=0; i<bombs.length; i++ ) {
			bomb = bombs[i];
			if (bomb.state() === 'explode') {
				bomb.exploded();
				blast = bomb.boom.position;
			}
		}
		if( bombs.length > 6 ) {
			if( bombs[0].state() === 'exploded' ) {
				try {
					bombs[0].boom.remove();
					bombs.splice(0, 1);
				}
				catch(err) {}
			}
		}

		// particles/characters
		try {
			if (blast != null) {
				for( j=0; j<particles.length; j++ ) {
					chr = particles[j];
					chr.tick(blast);
				}
				blast = null;
			}
			else {
				for( k=0; k<particles.length; k++ ) {
					chr = particles[k];
					chr.tick();
				}
			}
		}
		catch(err) {}

	};

	function contain(val) {
		bContain = val || false;
		return bContain;
	};

	function everything(val) {
		bBreakGroups = val || true;
		return bBreakGroups;
	};

	function getArmed() {
		return bArmed;
	};

	if( bArmed ) {
		init();
	}

	return {
		bombs: bombs,
		armed: getArmed,

		arm: init,
		contain: contain,
		everything: everything,
		dropBomb: dropBomb,
		tick: tick
	}

};

/**
 *
 *	A class for breaking up TextItems into various components
 *	whether it be characters, words, paragraphs
 *
 */
var TextBreak = function() {

	/**
	 * Breaks a PointText item into an array of new PointText items per character
	 *
	 * code inspired/borrowed from
	 * Carlos Canto
	 * http://forums.adobe.com/thread/782215
	 *
	 * @param  {PointText} pointTextItem
	 * @return {Array} an array of PointText items
	 */
	function breakupChars(pointTextItem) {
		var newChars = [];
		var positionX = pointTextItem.point.x,
			positionY = pointTextItem.point.y,
			charCount = pointTextItem.characters.length,
			width, areaTextWidth;

		for( var i=charCount-1; i>=0; i-- ) {
			var newChar = pointTextItem.clone();
			newChar.content = pointTextItem.characters[i].content;
			pointTextItem.characters[i].content = '';
			width = pointTextItem.bounds.width;
			newChar.point = new Point(positionX+width,positionY);

			if( /\s/.test(newChar.content) ) {
				newChar.remove();
			}
			else {
				newChars.push( newChar );
			}
		}
		pointTextItem.remove();

		return newChars;
	};

	/**
	 * Breaks a PointText item into an array of new PointText items per word
	 *
	 * code inspired/borrowed from
	 * Carlos Canto
	 * http://forums.adobe.com/thread/782215
	 *
	 * @param  {PointText} pointTextItem
	 * @return {Array} an array of PointText items
	 */
	function breakupWords(pointTextItem) {
		var newWords = [];
		var positionX = pointTextItem.point.x,
			positionY = pointTextItem.point.y,
			wordCount = pointTextItem.words.length,
			width, areaTextWidth;

		for( var i=wordCount-1; i>=0; i-- ) {
			var newWord = pointTextItem.clone();
			newWord.content = pointTextItem.words[i].content;
			newWord.content.trim();
			pointTextItem.words[i].content = '';
			width = pointTextItem.bounds.width;
			newWord.point = new Point(positionX+width,positionY);

			newWords.push( newWord );
		}
		pointTextItem.remove();

		return newWords;
	};

	/**
	 * Breaks a PointText item into an array of new PointText items per paragraph
	 *
	 * code inspired/borrowed from
	 * Carlos Canto
	 * http://forums.adobe.com/thread/782215
	 *
	 * @param  {PointText} pointTextItem
	 * @return {Array} an array of PointText items
	 */
	function breakupParagraphs(pointTextItem) {

	};

	/**
	 * Breaks a PointText item into an array of new PointText items per line
	 *
	 * code inspired/borrowed from
	 * John Wundes
	 * john@wundes.com
	 * http://www.wundes.com/js4ai/copyright.txt
	 *
	 * @param  {PointText} pointTextItem
	 * @return {Array} an array of PointText items
	 */
	function breakupLines(pointTextItem) {
		var newLines = [];
		var justification = pointTextItem.paragraphStyle.justification,
			leading = pointTextItem.characterStyle.leading,
			lineArr = fieldToArray(pointTextItem);

		pointTextItem.content = lineArr[0];
		newLines.push( pointTextItem );
		for( var j=1; j<lineArr.length; j++ ) {
			var newLine = pointTextItem.clone();
			newLine.content = lineArr[j];
			newLine.translate( new Point(0,leading*j) );
			if(justification === 'center') {
				newLine.point.x = (pointTextItem.point.x + (pointTextItem.bounds.width/2)) - (newLine.bounds.width/2);
			}
			else if(justification === 'right') {
				newLine.point.x = (pointTextItem.point.x + pointTextItem.bounds.width) - newLine.bounds.width;
			}
			else {
				newLine.point.x = pointTextItem.point.x;
			}
			newLines.push( newLine );
		}

		return newLines;
	};

	/**
	 * Converts a textItem into an array
	 *
	 * John Wundes
	 * john@wundes.com
	 * http://www.wundes.com/js4ai/copyright.txt
	 *
	 * @param  {TestItem} textItem
	 * @return {Array}
	 */
	function fieldToArray(textItem) {
		var ret_re = new RegExp('/[\x03]|[\f]|[\r\n]|[\r]|[\n]|[,]/');
		retChars = new Array('\x03','\f','\r','\n');
		var tmpTxt = textItem.content;
		for( all in retChars) {
			tmpArr = tmpTxt.split(retChars[all]);
		}
		return tmpTxt.split(ret_re);
	};

	return {
		characters: breakupChars,
		words: breakupWords,
		lines: breakupLines
	}

};

/**
 * Convert AreaText into PointText
 * TODO: currently only works for area text containing 1 type size/style
 *
 * @param  {TextItem} areaTextItem
 * @return {Array} an array of PointText items
 */
function areaToPoint(areaTextItem) {
	var leading = areaTextItem.characterStyle.leading;
	var areaTextWidth = Math.floor(areaTextItem.bounds.width)-leading*0.6,
		areaTextOrigin = areaTextItem.bounds.point,
		areaTextHyph = areaTextItem.paragraphStyle.hyphenation;

	var newObj = new PointText( areaTextItem.bounds.point );
	newObj.content = areaTextItem.content;
	newObj.paragraphStyle = areaTextItem.paragraphStyle;
	newObj.characterStyle = areaTextItem.characterStyle;

	var offsetY = Math.abs(areaTextItem.strokeBounds.topLeft.y - areaTextItem.bounds.topLeft.y)*2;
	newObj.translate( new Point(0,areaTextItem.characterStyle.fontSize-offsetY) );

	areaTextItem.remove();

	// convert to characters
	var chrs = new TextBreak().characters(newObj);

	// propertly flow characters
	var charLocX;
	for( var i=chrs.length-1; i>=0; i-- ) {
		charLocX = Math.abs(areaTextOrigin.x-chrs[i].point.x);
		if( charLocX > areaTextWidth ) {
			if(areaTextHyph) {
				var hyphen = new PointText( new Point(chrs[i].point.x,chrs[i].point.y) );
				hyphen.content = '-';
				hyphen.characterStyle = chrs[i].characterStyle;
				hyphen.paragraphStyle = chrs[i].paragraphStyle;
			}

			for( var j=i; j>=0; j-- ) {
				chrs[j].point.x -= charLocX;
				chrs[j].point.y += leading;
			}
		}
	}

	return chrs;
};

function pointToArea(textItem) {

};



// ------------------------------------------------------------------------
// Events
// ------------------------------------------------------------------------
function onMouseDown(event) {
	if( explosion.armed() ) {
		explosion.dropBomb(event.point);
	}
	else {
		Dialog.alert('Select Items and then click \'Arm\'');
	}
};

function onMouseDrag(event) {
	if( explosion.armed() ) {
		explosion.dropBomb(event.point);
	}
	else {
		Dialog.alert('Select Items and then click \'Arm\'');
	}
};



// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
Animate(true);
Draw();