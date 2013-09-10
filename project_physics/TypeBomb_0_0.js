/**
 *	TypeBomb 0.0
 *
 *	Ken Frederick
 *	ken.frederick@gmx.de
 *
 *	http://kennethfrederick.de/
 *	http://blog.kennethfrederick.de/
 *
 *
 *	based on FontBomb just converted for use in Scriptographer
 *	http://fontbomb.ilex.ca/
 *
 *	Philippe-Anto Lehoux
 *	http://www.ilex.ca/
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


// ------------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------------
function Setup() {
	sel = activeDocument.getItems({
		type: TextItem,
	});
	print(sel.length);

	explosifyNodes( sel );
}	



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function Update(event) {
	
}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function Draw() {

}



// ------------------------------------------------------------------------
// Methods
// ------------------------------------------------------------------------
function explosifyNodes(textItemNodes) {
	var textItemNode, _j, _len2, _results;
	_results = [];
	for (_j = 0, _len2 = textItemNodes.length; _j < _len2; _j++) {
		textItemNode = textItemNodes[_j];
		_results.push( explosifyNode(textItemNode) );
	}
	return _results;
};



function explosifyNode(textItemNode) {
	var newNode;
	switch (textItemNode.hasChildren()) {
		case true:
			return explosifyNodes(textItemNode.children);
		case false:
			// if (!/^\s*$/.test(textItemNode.textItemNodeValue)) {
				if (textItemNode.children.length === 1) {
			// 		return textItemNode.parentNode.innerHTML = explosifyText(textItemNode.textItemNodeValue);
				} else {
			// 		newNode = document.createElement("particles");
					explosifyText(textItemNode.content);
			// 		newNode.innerHTML = explosifyText(textItemNode.textItemNodeValue);
			// 		return textItemNode.parentNode.replaceChild(newNode, textItemNode);
				}
			// }
	}
};


function explosifyText(string) {
	print("explosifyText(" + string + ")");
	var chr, chrs, index;

	chrs = (function() {
		var _len2, _ref2, _results;
		_ref2 = string.split('');
		_results = [];
		for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
			chr = _ref2[index];
			if (!/^\s*$/.test(chr)) {
	// 			_results.push("<particle style='display:inline-block;'>" + chr + "</particle>");
			} else {
				// _results.push('&nbsp;');
				_results.push(' ');
			}
		}
		return _results;

		print("_results 1");
		print(_results.length);
		print(_results);
	})();
	chrs = chrs.join('');

	chrs = (function() {
		var _len2, _ref2, _results;
		_ref2 = chrs.split(' ');
		_results = [];
		for (index = 0, _len2 = _ref2.length; index < _len2; index++) {
			chr = _ref2[index];
			if (!/^\s*$/.test(chr)) {
	// 			_results.push("<word style='white-space:nowrap'>" + chr + "</word>");
			} else {
				_results.push(chr);
			}
		}
		return _results;

		print("_results 2");
		print(_results.length);
		print(_results);
	})();

	return chrs.join(' ');
};



/**
 *
 *	Particle
 *
 */
Particle = (function() {
	// ------------------------------------
	// constructor
	// ------------------------------------
	function Particle(elem) {
		this.elem = elem;
		this.style = elem.style;
		this.elem.style['zIndex'] = 9999;
		this.transformX = 0;
		this.transformY = 0;
		this.transformRotation = 0;
		this.offsetTop = window.getOffset(this.elem).top;
		this.offsetLeft = window.getOffset(this.elem).left;
		this.velocityX = 0;
		this.velocityY = 0;
	}


	// ------------------------------------
	// methods
	// ------------------------------------
	Particle.prototype.tick = function(blast) {
		var distX, distXS, distY, distYS, distanceWithBlast, force, forceX, forceY, previousRotation, previousStateX, previousStateY, rad, transform;
		previousStateX = this.transformX;
		previousStateY = this.transformY;
		previousRotation = this.transformRotation;
		if (this.velocityX > 1.5) {
			this.velocityX -= 1.5;
		} else if (this.velocityX < -1.5) {
			this.velocityX += 1.5;
		} else {
			this.velocityX = 0;
		}
		if (this.velocityY > 1.5) {
			this.velocityY -= 1.5;
		} else if (this.velocityY < -1.5) {
			this.velocityY += 1.5;
		} else {
			this.velocityY = 0;
		}
		if (blast != null) {
			distX = this.offsetLeft + this.transformX - blast.x;
			distY = this.offsetTop + this.transformY - blast.y;
			distXS = distX * distX;
			distYS = distY * distY;
			distanceWithBlast = distXS + distYS;
			force = 100000 / distanceWithBlast;
			if (force > 50) force = 50;
			rad = Math.asin(distYS / distanceWithBlast);
			forceY = Math.sin(rad) * force * (distY < 0 ? -1 : 1);
			forceX = Math.cos(rad) * force * (distX < 0 ? -1 : 1);
			this.velocityX = +forceX;
			this.velocityY = +forceY;
		}
		this.transformX = this.transformX + this.velocityX;
		this.transformY = this.transformY + this.velocityY;
		this.transformRotation = this.transformX * -1;
		if ((Math.abs(previousStateX - this.transformX) > 1 || Math.abs(previousStateY - this.transformY) > 1 || Math.abs(previousRotation - this.transformRotation) > 1) && ((this.transformX > 1 || this.transformX < -1) || (this.transformY > 1 || this.transformY < -1))) {
			transform = "translate(" + this.transformX + "px, " + this.transformY + "px) rotate(" + this.transformRotation + "deg)";
			this.style['MozTransform'] = transform;
			this.style['WebkitTransform'] = transform;
			this.style['msTransform'] = transform;
			return this.style['transform'] = transform;
		}
	};

	return Particle;

})();


// ------------------------------------------------------------------------
// Invocation
// ------------------------------------------------------------------------
Setup();
// Update(event);
// Draw();

// set a timer that runs the Draw() function 
// every milisecond
// var timer = setInterval(Main, 1);
