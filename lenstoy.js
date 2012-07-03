/*
 * Javascript Lens Toy
 * 2012 Stuart Lowe http://lcogt.net/
 *
 * Licensed under the MPL http://www.mozilla.org/MPL/MPL-1.1.txt
 *
 */

// First we will create the basic function
function LensToy(input){

	// Set some variables
	this.id = (input && typeof input.id=="string") ? input.id : "LensToy";
	this.src = (input && typeof input.src=="string") ? input.src : "";
	this.width = (input && typeof input.width=="number") ? input.width : 100;
	this.height = (input && typeof input.height=="number") ? input.height : 100;
	this.events = {load:"",click:"",mousemove:""};	// Let's define some events


	this.img = { complete: false };
	this.stretch = "linear";
	this.color = "gray";

	this.setup(this.id);

	if(this.src) this.load(this.src);
}

// We need to set up the canvas. This may mean attaching to an existing <div>
// By the end of this function we have this.ctx available with events attached.
// Make sure you have set the width/height of the canvas element
LensToy.prototype.setup = function(id){
	if(this.ctx) return this;

	// Now we want to build the <canvas> element that will hold our image
	var el = document.getElementById(id);
	if(console && typeof console.log=="function") console.log('setup',el,id)
	if(el!=null){
		// Look for a <canvas> with the specified ID or fall back on a <div>
		if(typeof el=="object" && el.tagName != "CANVAS"){
			// Looks like the element is a container for our <canvas>
			el.setAttribute('id',this.id+'holder');
			var canvas = document.createElement('canvas');
			canvas.style.display='block';
			canvas.setAttribute('width',this.width);
			canvas.setAttribute('height',this.height);
			canvas.setAttribute('id',this.id);
			el.appendChild(canvas);
			// For excanvas we need to initialise the newly created <canvas>
			if(/*@cc_on!@*/false) el = G_vmlCanvasManager.initElement(this.canvas);
		}else{
			// Define the size of the canvas
			// Excanvas doesn't seem to attach itself to the existing
			// <canvas> so we make a new one and replace it.
			if(/*@cc_on!@*/false){
				var canvas = document.createElement('canvas');
				canvas.style.display='block';
				canvas.setAttribute('width',this.width);
				canvas.setAttribute('height',this.height);
				canvas.setAttribute('id',this.id);
				el.parentNode.replaceChild(canvas,el);
				if(/*@cc_on!@*/false) el = G_vmlCanvasManager.initElement(elcanvas);
			}else{
				el.setAttribute('width',this.width);
				el.setAttribute('height',this.height);
			}   
		}
		this.canvas = document.getElementById(id);
	}else this.canvas = el;
	this.ctx = (this.canvas) ? this.canvas.getContext("2d") : null;

	// The object didn't exist before so we add event listeners to it
	var _obj = this;
	addEvent(this.canvas,"click",function(e){
		_obj.getCursor(e);
		_obj.trigger("click",{x:this.cursor.x,y:this.cursor.y});
	});
	addEvent(this.canvas,"mousemove",function(e){
		_obj.getCursor(e);
		_obj.trigger("mousemove",{x:_obj.cursor.x,y:_obj.cursor.y})
	});

	return this;
}

// Loads the image file. You can provide a callback or have
// already assigned one with .bind('load',function(){ })
LensToy.prototype.load = function(source,fnCallback){
	if(typeof source=="string") this.src = source;
	if(typeof this.src=="string"){

		this.image = null

		var _obj = this;

		this.img = new Image();
		this.img.onload = function(){
			// Call any callback functions
			if(typeof fnCallback=="function") fnCallback(_obj);
			_obj.trigger("load");
		}
		this.img.src = this.src;
	}
	return this;
}

LensToy.prototype.copyToClipboard = function(){
	if(this.ctx){
		this.clipboard = this.ctx.getImageData(0, 0, this.width, this.height);
		this.clipboardData = this.clipboard.data;
	}
	return this;
}
LensToy.prototype.pasteFromClipboard = function(){
	if(this.ctx){
		this.clipboard.data = this.clipboardData;
		this.ctx.putImageData(this.clipboard, 0, 0);
	}
	return this;
}


// Use <canvas> to draw a 2D image
LensToy.prototype.draw = function(type){
	if(console && typeof console.log=="function") console.log('draw',this.canvas)
	if(!this.ctx) return this;
	type = type || this.stretch;



	// create a new batch of pixels with the same
	// dimensions as the image:
	imageData = this.ctx.createImageData(this.width, this.height);

	var pos = 0;
	this.update(type,0);
	return this;
}

// Calculate the pixel values using a defined stretch type and draw onto the canvas
LensToy.prototype.update = function(inp){

	this.ctx.drawImage(this.img,0,0,this.width,this.height);

}

LensToy.prototype.getCursor = function(e){
	var x;
	var y;
	if (e.pageX != undefined && e.pageY != undefined){
		x = e.pageX;
		y = e.pageY;
	}else{
		x = e.clientX + document.body.scrollLeft + document.body.scrollLeft +document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.body.scrollTop +document.documentElement.scrollTop;
	}

	var target = e.target
	while(target){
		x -= target.offsetLeft;
		y -= target.offsetTop;
		target = target.offsetParent;
	}
	this.cursor = {x:x, y:y};
}

LensToy.prototype.bind = function(ev,fn){
	if(typeof ev!="string" || typeof fn!="function") return this;
	if(this.events[ev]) this.events[ev].push(fn);
	else this.events[ev] = [fn];
	return this;
}

// Trigger a defined event with arguments. This is meant for internal use to be 
// sure to include the correct arguments for a particular event
// this.trigger("zoom",args)
LensToy.prototype.trigger = function(ev,args){
	if(typeof ev != "string") return;
	if(typeof args != "object") args = {};
	var o = [];
	var _obj = this;
	if(typeof this.events[ev]=="object"){
		for(i = 0 ; i < this.events[ev].length ; i++){
			if(typeof this.events[ev][i] == "function") o.push(this.events[ev][i].call(_obj,args))
		}
	}
	if(o.length > 0) return o
}




// Helpful functions

// Cross-browser way to add an event
if(typeof addEvent!="function"){
	function addEvent(oElement, strEvent, fncHandler){
		if(oElement.addEventListener) oElement.addEventListener(strEvent, fncHandler, false);
		else if(oElement.attachEvent) oElement.attachEvent("on" + strEvent, fncHandler);
	}
}

function trim(s) {
	s = s.replace(/(^\s*)|(\s*$)/gi,"");
	s = s.replace(/[ ]{2,}/gi," ");
	s = s.replace(/\n /,"\n");
	return s;
}
