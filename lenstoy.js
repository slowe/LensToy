/*
 * Javascript Lens Toy
 * 2012-3 Stuart Lowe http://lcogt.net/
 * Requires lens.js
 *
 * Licensed under the MPL http://www.mozilla.org/MPL/MPL-1.1.txt
 *
 */
// Enclose the Javascript
(function(exports) {
	exports.LensToy = LensToy;

<<<<<<< HEAD
// First we will create the basic function
function LensToy(input){

	// Set some variables
	this.id = (input && typeof input.id=="string") ? input.id : "LensToy";
	this.width = (input && typeof input.width=="number") ? input.width : parseInt(getStyle(this.id, 'width'), 10);
	this.height = (input && typeof input.height=="number") ? input.height : parseInt(getStyle(this.id, 'height'), 10);
	// DEPRECATED this.src = (input && typeof input.src=="string") ? input.src : "";
	this.src = "";
	this.events = {load:"",click:"",mousemove:"",mouseout:"",mouseover:"",init:""};	// Let's define some events
	this.img = { complete: false };
	this.showcrit = false;

	// Setup our canvas etc
	this.setup(this.id);

	// Create an instance of a lens,
	this.lens = new Lens({ 'width': this.width, 'height': this.height, 'pixscale':0.25});
 
    // List of examples - add your own here!
	this.models = new Array();
	
    this.models.push({
		name: 'Example',
		src: "SL2SJ140156+554446_irg_100x100.png",
		components: [
			{plane: "lens", theta_e: 10.0, x:  0.0, y:   0.0},
			{plane: "lens", theta_e:  3.0, x:  -7.0, y: -27.0},
			{plane: "source", size:  1.25, x: 1000.0, y:  1000.0}
		],
		/* This seems to significantly slow down the toy... and progressively so!
        events: {
			mousemove: function(e){
				var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
				var msg = "";
				if(k < 0.2) msg = "Out here the image of the source is only being weakly lensed";
				if(k >= 0.2 && k < 0.5) msg = "The space around that massive yellow galaxy is being warped, distorting the image of the source";
				if(k >= 0.5) msg = "The source is right behind the lens now - and is being multiply-imaged";
				this.setStatus(this.model.name+': '+msg);
			}
		}
        */
	});
	this.models.push({
		name: 'CFHTLS4',
		src: "SL2SJ140156+554446_irg_100x100.png",
		components: [
			{plane: "lens", theta_e: 10.0, x:  0.0, y:   0.0},
			{plane: "lens", theta_e:  3.0, x:  -7.0, y: -27.0},
			{plane: "lens", theta_e:  3.0, x: 37.0, y:  37.0},
			{plane: "lens", theta_e:  3.0, x: 17.0, y:  52.0},
			{plane: "source", size:  1.25, x: 1000.0, y:  1000.0}
		],
		/* This seems to significantly slow down the toy... and progressively so!
		events: {
			mousemove: function(e){
				var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
				var msg = "";
				if(k < 0.2) msg = "Out here the image of the source is only being weakly lensed";
				if(k >= 0.2 && k < 0.5) msg = "The space around that massive yellow galaxy is being warped, distorting the image of the source";
				if(k >= 0.5) msg = "The source is right behind the lens now - and is being multiply-imaged";
	
				this.setStatus(msg);
			}
		}
        */
	});


	this.init();

}

// Contour using conrec.js
LensToy.prototype.contour = function(data,z){
	// data should be a 2D array

	var c = new Conrec();

	// Check inputs
	if(typeof data!=="object") return c;
	if(typeof z!=="object") return c;
	if(data.length < 1) return c;
	if(data[0].length < 1) return c;

	var ilb = 0;
	var iub = data.length-1;
	var jlb = 0;
	var jub = data[0].length-1;
	var idx = new Array(data.length);
	var jdx = new Array(data[0].length);
	for(var i = 0 ; i < idx.length ; i++) idx[i] = i+1;
	for(var j = 0 ; j < jdx.length ; j++) jdx[j] = j+1;

	// contour(d, ilb, iub, jlb, jub, x, y, nc, z)
	// d               ! matrix of data to contour
	// ilb,iub,jlb,jub ! index bounds of data matrix
	// x               ! data matrix column coordinates
	// y               ! data matrix row coordinates
	// nc              ! number of contour levels
	// z               ! contour levels in increasing order
	c.contour(data, ilb, iub, jlb, jub, idx, jdx, z.length, z);
	return c;
}

LensToy.prototype.drawContours = function(c,opt){
	if(c.length < 1) return;
	var color = (opt && typeof opt.color==="string") ? opt.color : '#FFFFFF';
	var i, j, l;
	this.ctx.strokeStyle = color;
	for(l = 0; l < c.length ; l++){
		this.ctx.beginPath();
		// Move to the start of this contour
		this.ctx.moveTo(c[l][0].x,c[l][0].y);
		// Join the dots
		for(i = 1; i < c[l].length ; i++) this.ctx.lineTo(c[l][i].x,c[l][i].y);
		this.ctx.closePath();
		this.ctx.stroke();
=======
	// First we will create the basic function
	function LensToy(input){
	
		// Set some variables
		this.id = (input && typeof input.id=="string") ? input.id : "LensToy";
		this.events = {load:"",loadimage:"",click:"",mousemove:"",mouseout:"",mouseover:"",init:""};	// Let's define some events
		this.img = { complete: false };
		this.showcrit = false;
		// Setup our buttons etc
		this.setup();
	
	
		this.paper = new Canvas({ 'id': 'lenstoy' });
		this.width = this.paper.width;
		this.height = this.paper.height;
	
		// Create an instance of a lens,
		this.lens = new Lens({ 'width': this.width, 'height': this.height, 'pixscale':0.25});
	
		this.models = new Array();
		this.models.push({
			name: 'Example',
			src: "SL2SJ140156+554446_irg_100x100.png",
			components: [
				{plane: "lens", theta_e: 10.0, x:  0.0, y:   0.0},
				{plane: "lens", theta_e:  3.0, x:  -7.0, y: -27.0},
				{plane: "source", size:  1.25, x: 1000.0, y:  1000.0}
			],
			events: {
				mousemove: function(e){
					var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
					var msg = "";
					if(k < 0.2) msg = "Out here the image of the source is only being weakly lensed";
					if(k >= 0.2 && k < 0.5) msg = "The space around that massive yellow galaxy is being warped, distorting the image of the source";
					if(k >= 0.5) msg = "The source is right behind the lens now - and is being multiply-imaged";
					this.setStatus(this.model.name+': '+msg);
				}
			}
		});
		this.models.push({
			name: 'CFHTLS4',
			src: "SL2SJ140156+554446_irg_100x100.png",
			components: [
				{plane: "lens", theta_e: 10.0, x:  0.0, y:   0.0},
				{plane: "lens", theta_e:  3.0, x:  -7.0, y: -27.0},
				{plane: "lens", theta_e:  3.0, x: 37.0, y:  37.0},
				{plane: "lens", theta_e:  3.0, x: 17.0, y:  52.0},
				{plane: "source", size:  1.25, x: 1000.0, y:  1000.0}
			],
			events: {
				mousemove: function(e){
					var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
					var msg = "";
					if(k < 0.2) msg = "Out here the image of the source is only being weakly lensed";
					if(k >= 0.2 && k < 0.5) msg = "The space around that massive yellow galaxy is being warped, distorting the image of the source";
					if(k >= 0.5) msg = "The source is right behind the lens now - and is being multiply-imaged";
		
					this.setStatus(msg);
				}
			}
		});
	
	
		this.init();
	
>>>>>>> Refactoring
	}
	
<<<<<<< HEAD
	// Loop over the kappa map
	for(var i = 0; i < this.width*this.height ; i++){

		// Add to red channel
		imgData.data[pos+0] = c[0];

		// Add to green channel
		imgData.data[pos+1] = c[1];

		// Add to blue channel
		imgData.data[pos+2] = c[2];

		// Alpha channel - arc brightness.
		// MAGIC number 0.1, trades off with blur steps... Math.round(0.2*255) ~50 
		imgData.data[pos+3] = 50*this.lens.predictedimage[i];

		pos += 4;
	}

	// Blur the image
	imgData = this.blur(imgData);


	// Because of the way putImageData replaces all the pixel values, 
	// we have to create a temporary canvas and put it there.
	var overlayCanvas = document.createElement("canvas");
	overlayCanvas.width = this.width;
	overlayCanvas.height = this.height;
	overlayCanvas.getContext("2d").putImageData(imgData, 0, 0);

	// Now we can combine the new image with our existing canvas
	// whilst preserving transparency
	this.ctx.drawImage(overlayCanvas, 0, 0);
      
      // This procedure includes some interpolation on to the larger canvas, preventing us seeing the pixels...
}

LensToy.prototype.blur = function(imageData){
	//return this.convolve(imageData, this.kernel);

	var steps = 3;
    // Kernel width 0.9", trades off with alpha channel...
	var smallW = Math.round(this.width / this.scale);
	var smallH = Math.round(this.height / this.scale);

	var canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;
	var ctx = canvas.getContext("2d");
	ctx.putImageData(imageData,0,0);

	var copy = document.createElement("canvas");
	copy.width = smallW;
	copy.height = smallH;
	var copyCtx = copy.getContext("2d");

	// Convolution with square top hat kernel, by shifting and redrawing image...
    // Does not get brightness quite right...
    for (var i=0;i<steps;i++) {
		var scaledW = Math.max(1,Math.round(smallW - 2*i));
		var scaledH = Math.max(1,Math.round(smallH - 2*i));

		copyCtx.clearRect(0,0,smallW,smallH);
		copyCtx.drawImage(canvas,0,0,this.width,this.height,0,0,scaledW,scaledH);
		ctx.drawImage(copy,0,0,scaledW,scaledH,0,0,this.width,this.height);
=======
	// Contour using conrec.js
	LensToy.prototype.getContours = function(data,z){
		// data should be a 2D array
	
		var c = new Conrec();
	
		// Check inputs
		if(typeof data!=="object") return c;
		if(typeof z!=="object") return c;
		if(data.length < 1) return c;
		if(data[0].length < 1) return c;
	
		var ilb = 0;
		var iub = data.length-1;
		var jlb = 0;
		var jub = data[0].length-1;
		var idx = new Array(data.length);
		var jdx = new Array(data[0].length);
		for(var i = 0 ; i < idx.length ; i++) idx[i] = i+1;
		for(var j = 0 ; j < jdx.length ; j++) jdx[j] = j+1;
	
		// contour(d, ilb, iub, jlb, jub, x, y, nc, z)
		// d               ! matrix of data to contour
		// ilb,iub,jlb,jub ! index bounds of data matrix
		// x               ! data matrix column coordinates
		// y               ! data matrix row coordinates
		// nc              ! number of contour levels
		// z               ! contour levels in increasing order
		c.contour(data, ilb, iub, jlb, jub, idx, jdx, z.length, z);
		return c;
	}
	
	LensToy.prototype.drawContours = function(c,opt){
		if(c.length < 1) return;
		var color = (opt && typeof opt.color==="string") ? opt.color : '#FFFFFF';
		var i, j, l;
		this.paper.ctx.strokeStyle = color;
		for(l = 0; l < c.length ; l++){
			this.paper.ctx.beginPath();
			// Move to the start of this contour
			this.paper.ctx.moveTo(c[l][0].x,c[l][0].y);
			// Join the dots
			for(i = 1; i < c[l].length ; i++) this.paper.ctx.lineTo(c[l][i].x,c[l][i].y);
			this.paper.ctx.closePath();
			this.paper.ctx.stroke();
		}
		
		return this;
>>>>>>> Refactoring
	}
	
	// We are going to keep the lens.js library independent of 
	// the DOM/<canvas> so we need a function that goes through
	// building an RGBA image and drawing it to the canvas.
	LensToy.prototype.drawAll = function(lens,canvas){
	
		this.drawComponent("lens");
		this.drawComponent("mag");
		this.drawComponent("image");
	
		return this;
	}
	
	// Draw a specific component of the Lens object
	LensToy.prototype.drawComponent = function(mode){
	
		lens = this.lens;
		canvas = this.paper;
	
		// Inputs are:
		//   mode - e.g. 'lens', 'mag' or 'image'
	
		if(!mode || typeof mode!=="string") return;
	
		// -------------------------
		// Create the lens mass distribution
		
		// Have we previously made this component layer?
		var previous = (canvas.clipboard[mode]) ? true : false;
	
		// Load in the previous version if we have it (this will save us setting the RGB)
		var imgData = (previous) ? canvas.clipboard[mode] : canvas.ctx.createImageData(lens.w, lens.h);
		var pos = 0;
		var c = [0, 0, 0];
	
		// The RGB colours
		if(mode == "lens") c = [60, 60, 60];
		else if(mode == "mag") c = [0, 120, 0];
		else if(mode == "image") c = [195, 215, 255];
	
		// We just want to draw sources		
		if(mode == "source"){
			canvas.ctx.fillStyle = "#FF9999";
			canvas.ctx.strokeStyle = "#FFFFFF";
			for(var i = 0 ; i < lens.source.length ; i++){
				// Add a circle+label to show where the source is
				var r = 5;
				canvas.ctx.beginPath();
				canvas.ctx.arc(lens.source[i].x-parseInt(r/2), lens.source[i].y-parseInt(r/2), r, 0 , 2 * Math.PI, false);
				canvas.ctx.strokeText("Source "+(i+1),lens.source[i].x+r, lens.source[i].y+r);
				canvas.ctx.fill();
				canvas.ctx.closePath();
			}
			return;
		}
	
		// Loop over the components
		for(var i = 0; i < lens.w*lens.h ; i++){
	
			// If we've not drawn this layer before we should set the RGB
			if(!previous){
				// Add to red channel
				imgData.data[pos+0] = c[0];
	
				// Add to green channel
				imgData.data[pos+1] = c[1];
	
				// Add to blue channel
				imgData.data[pos+2] = c[2];
			}
	
			// Alpha channel
			if(mode == "lens"){
				// MAGIC number 0.7 -> Math.round(255*0.7) = 179
				imgData.data[pos+3] = 179*Math.sqrt(lens.mag[i].kappa);
			}else if(mode == "mag"){
				// MAGIC number 0.01 -> Math.round(255*0.01) = 3
				imgData.data[pos+3] = 3/Math.abs(lens.mag[i].inverse);
			}else if(mode == "image"){
				// MAGIC number 0.1, trades off with blur steps... -> Math.round(255*0.1) = 26
				imgData.data[pos+3] = 26*lens.predictedimage[i];
			}else{
				imgData.data[pos+3] = 255;
			}
			pos += 4;
		}
	
		// Keep a copy of the image in a clipboard named <mode>
		canvas.copyToClipboard(mode,imgData);
	
		if(mode == "image"){
			// Blur the image
			imgData = canvas.blur(imgData, lens);
		}
	
		// Draw the image to the <canvas> in the DOM
		canvas.overlay(imgData);
		
		return this;
	}
	
	LensToy.prototype.setStatus = function(msg){
		if(document.getElementById('status')) document.getElementById('status').innerHTML = msg;
	}
	
	
	// We need to set up.
	LensToy.prototype.setup = function(){
	
		this.buttons = { crit: document.getElementById('criticalcurve') };
		var _obj = this;
		addEvent(this.buttons.crit,"click",function(e){
			_obj.showcrit = !_obj.showcrit;
			_obj.update();
		});
	
		return this;
	}
	
	// Return a model by name
	LensToy.prototype.getModel = function(name){
		if(typeof name==="string"){
			for(var i = 0; i < this.models.length; i++){
				if(this.models[i].name==name) return this.models[i];
			}
		}
		// No match so return the first model
		return this.models[0];
	}
	
	LensToy.prototype.init = function(inp,fnCallback){
	
		this.model = this.getModel(inp);
		
		if(typeof this.model.src==="string") this.loadImage(this.model.src);
	
		if(typeof this.model.components==="object"){
			this.lens.removeAll('lens');
			this.lens.removeAll('source');
			for(var i = 0; i < this.model.components.length ; i++){
				// Add all the lens mass and source brightness components (units=arcseconds):
				this.lens.add(this.model.components[i]);
			}
	
			// Calculate the deflection angle vector field, alpha(x,y):
			this.lens.calculateAlpha();
	
			// Now use this to calculate the lensed image:
			this.lens.calculateImage();

	
			// If we have the Conrec object available we can plot the critical 
			// curve, and an outline of the lensed image:
			
			this.contours = [];
			var lcontours = [];
			if(typeof Conrec==="function"){
				
				// Need to get our 1D array into the right form;
				// Return our internal 1D representation as a 2D array.
				var i, row, col;
				
				// Critical curve:
				var invmag = new Array(this.lens.h);
				for(row = 0 ; row < this.lens.h ; row++){
					invmag[row] = new Array(this.lens.w);
					for(col = 0 ; col < this.lens.w ; col++){
						i = row + col*this.lens.h;
						invmag[row][col] = this.lens.mag[i].inverse;
					}
				}
				var critcurve = this.getContours(invmag,[0.0]);
				this.contours = critcurve.contourList();
				//this.drawContours(this.contours, {color:'#77FF77'})
			}
		}
	
	
		this.paper.clear();
		// Take a copy of the blank <canvas>
		this.paper.copyToClipboard();
	
		// Reset mousemove events
		this.events['mousemove'] = "";
	
		// Bind the callback events
		var e = ["mousemove","mouseover","mouseout"];
		var ev = "";
		for(var i = 0; i < e.length; i++){

			// Zap any existing events
			this.events[e[i]] = "";
			this.paper.events[e[i]] = "";

			if(this.model.events[e[i]] && typeof this.model.events[e[i]]==="function") ev = this.model.events[e[i]];
			else ev = "";

			if(e[i] == "mousemove") this.paper.bind(e[i],{ev:ev,toy:this},function(e){ e.data.toy.update(e); });
			this.bind(e[i],ev);
		}
	
		if(typeof fnCallback=="function") fnCallback(this);
		this.trigger("init");
	
		return this;
	}
	
	LensToy.prototype.update = function(e){

		// Remove existing sources
		this.lens.removeAll('source');
	
		if(!e) e = { x : 1000, y: 1000 }
		// Set the lens source to the current cursor position, transforming pixel coords to angular coords:
		var coords = this.lens.pix2ang({x:e.x, y:e.y});
		this.lens.add({ plane: 'source', size:  1.25, x: coords.x, y: coords.y });
	
		// Paste original image
		this.paper.pasteFromClipboard();

		if(this.showcrit) this.drawContours(this.contours, {color:'#77FF77'});

		// Re-calculate the lensed image
		this.lens.calculateImage();
	
		// Draw the lens image to the canvas!
		this.drawComponent("image");

	}
	
	// Loads the image file. You can provide a callback or have
	// already assigned one with .bind('load',function(){ })
	LensToy.prototype.loadImage = function(source,fnCallback){
	
		var src = "";
	
		if(typeof source==="string") src = source;
	
		if(typeof src=="string" && src){
	
			this.image = null
	
			var _obj = this;
	
			this.img = new Image();
			this.img.onload = function(){
				_obj.update();
				// Call any callback functions
				if(typeof fnCallback=="function") fnCallback(_obj);
				_obj.trigger("loadimage");
			}
			this.img.src = src;
		}
	
		return this;
	}
	
		// Attach a handler to an event for the Canvas object in a style similar to that used by jQuery
	// .bind(eventType[,eventData],handler(eventObject));
	// .bind("resize",function(e){ console.log(e); });
	// .bind("resize",{me:this},function(e){ console.log(e.data.me); });
	LensToy.prototype.bind = function(ev,e,fn){
		if(typeof ev!="string") return this;
		if(typeof fn==="undefined"){
			fn = e;
			e = {};
		}else{
			e = {data:e}
		}
		if(typeof e!="object" || typeof fn!="function") return this;
		if(this.events[ev]) this.events[ev].push({e:e,fn:fn});
		else this.events[ev] = [{e:e,fn:fn}];
		return this;
	}
	// Trigger a defined event with arguments. This is for internal-use to be
	// sure to include the correct arguments for a particular event
	LensToy.prototype.trigger = function(ev,args){
		if(typeof ev != "string") return;
		if(typeof args != "object") args = {};
		var o = [];
		if(typeof this.events[ev]=="object"){
			for(var i = 0 ; i < this.events[ev].length ; i++){
				var e = G.extend(this.events[ev][i].e,args);
				if(typeof this.events[ev][i].fn == "function") o.push(this.events[ev][i].fn.call(this,e))
			}
		}
		if(o.length > 0) return o;
	}

	// Helpful functions
	
	// Cross-browser way to add an event
	if(typeof addEvent!="function"){
		function addEvent(oElement, strEvent, fncHandler){
			if(oElement.addEventListener) oElement.addEventListener(strEvent, fncHandler, false);
			else if(oElement.attachEvent) oElement.attachEvent("on" + strEvent, fncHandler);
		}
	}
	
	// Extra mathematical/helper functions that will be useful - inspired by http://alexyoung.github.com/ico/
	var G = {};
	G.sum = function(a) { var i, sum; for (i = 0, sum = 0; i < a.length; sum += a[i++]) {}; return sum; };
	if (typeof Array.prototype.max === 'undefined') G.max = function(a) { return Math.max.apply({}, a); };
	else G.max = function(a) { return a.max(); };
	if (typeof Array.prototype.min === 'undefined') G.min = function(a) { return Math.min.apply({}, a); };
	else G.min = function(a) { return a.min(); };
	G.mean = function(a) { return G.sum(a) / a.length; };
	G.stddev = function(a) { return Math.sqrt(G.variance(a)); };
	G.log10 = function(v) { return Math.log(v)/2.302585092994046; };
	G.variance = function(a) { var mean = G.mean(a), variance = 0; for (var i = 0; i < a.length; i++) variance += Math.pow(a[i] - mean, 2); return variance / (a.length - 1); };
	if (typeof Object.extend === 'undefined') {
		G.extend = function(destination, source) {
			for (var property in source) {
				if (source.hasOwnProperty(property)) destination[property] = source[property];
			}
			return destination;
		};
	} else G.extend = Object.extend;

})(typeof exports !== "undefined" ? exports : window);
