/*
 * Javascript Lens Toy
 * 2012-3 Stuart Lowe http://lcogt.net/ and Phil Marshall (University of Oxford)
 * Requires lens.js
 *
 * Licensed under the MPL http://www.mozilla.org/MPL/MPL-1.1.txt
 *
 */
// Enclose the Javascript
(function(exports) {
	exports.LensToy = LensToy;

	// First we will create the basic function
	function LensToy(input){
	
        // Set some variables based on the inputs:
		this.id = (input && typeof input.id=="string") ? input.id : "lenstoy";
		this.pixscale = (input && typeof input.pixscale=="number") ? input.pixscale : 1.0;
        
		// Set up the canvas for drawing the model image etc:
		this.paper = new Canvas({ 'id': this.id });
        // Get the canvas width and height:
		this.width = this.paper.width;
		this.height = this.paper.height;
        
        // Let's define some events
        this.events = {load:"",loadimage:"",click:"",mousemove:"",mouseout:"",mouseover:"",init:""};
		this.img = { complete: false };
		this.showcrit = false;

	
		// Create an instance of a lens:
		// Example:
        // this.lens = new Lens({ 'width': this.width, 'height': this.height, 'pixscale':0.25});
		// CFHTLS_field:
		// this.lens = new Lens({ 'width': this.width, 'height': this.height, 'pixscale':0.186});
		// CFHTLS_group:
		// this.lens = new Lens({ 'width': this.width, 'height': this.height, 'pixscale':0.186/2.0});
		// CFHTLS_galaxy:
		this.lens = new Lens({ 'width': this.width, 'height': this.height, 'pixscale': this.pixscale});

		// Setup our buttons etc
		this.setup();
	
        // The possible lens models!
        // NB. It would be good to be able to define the PSFwidth here, and pass it down to the 
        // canvas routines so that the PSF blurring is well-emulated.
 
		this.models = new Array();
		this.models.push({
			name: 'Example',
			src: "SL2SJ140156+554446_irg_100x100.png",
            PSFwidth: 0.8,
			components: [
				{plane: "lens", theta_e:  2.0, x:  0.0, y:  -1.0},
				{plane: "lens", theta_e:  0.8, x: -1.3, y:   5.5},
				{plane: "lens", theta_e:  0.8, x:  7.5, y:  -7.4},
				{plane: "lens", theta_e:  0.8, x:  3.5, y: -10.4},
				{plane: "source", size:  1.25, x: 1000.0, y:  1000.0}
			],
			events: {
				mousemove: function(e){
					var msg = "";
					// Useful when setting up a model:
                    // var t = this.lens.pix2ang({x:e.x, y:e.y});
                    // var msg = "Cursor position = "+(t.x.toFixed(1))+","+(t.y.toFixed(1))+":   ";
					var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
					if(k < 0.4) msg = msg+"Out here the image of the source is only being weakly lensed";
					if(k >= 0.4 && k < 0.7) msg = msg+"The space around that massive yellow galaxy is being warped, distorting the image of the source";
					if(k >= 0.7) msg = msg+"The source is right behind the lens now - and is being multiply-imaged";
					this.setStatus(msg);
				}
			}
		});
		this.models.push({
			name: 'SW_field',
			src: "SW_field_440x440.png",
            PSFwidth: 0.8,
			components: [
				{plane: "lens", theta_e: 2.3, x:   8.2, y: -11.3},
				{plane: "lens", theta_e: 0.7, x:   7.1, y:  -9.9},
				{plane: "lens", theta_e: 1.0, x:  17.3, y:   8.2},
				{plane: "lens", theta_e: 0.7, x:  13.7, y:  14.4},
				{plane: "lens", theta_e: 0.7, x:  12.9, y:  14.0},
				{plane: "lens", theta_e: 0.7, x:  17.1, y:  24.6},
				{plane: "lens", theta_e: 0.7, x: -15.8, y:   1.9},
				{plane: "lens", theta_e: 1.0, x: -23.4, y:  10.8},
				{plane: "lens", theta_e: 1.0, x: -19.9, y:  18.0},
				{plane: "lens", theta_e: 0.7, x:   7.6, y: -30.5},
				{plane: "lens", theta_e: 1.0, x:   2.4, y: -35.2},
				{plane: "lens", theta_e: 1.0, x:  13.7, y: -34.6},
				{plane: "lens", theta_e: 1.0, x: -27.2, y: -37.8},
				{plane: "source", size:  0.7, x: 1000.0, y:  1000.0}
			],
			events: {
				mousemove: function(e){
					var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
					var msg = "";
					if(k < 0.4) msg = "Out here the image of the source is only being weakly lensed";
					if(k >= 0.4 && k < 0.7) msg = "The space around those massive yellow galaxies is being warped, distorting the image of the source";
					if(k >= 0.7) msg = "The source is right behind the lens now - and is being multiply-imaged";
					var t = this.lens.pix2ang({x:e.x, y:e.y});
                    msg = msg+". Cursor position = "+(t.x.toFixed(1))+","+(t.y.toFixed(1));
					this.setStatus(msg);
				}
			}
		});
		this.models.push({
			name: 'CFHTLS_field',
			src: "CFHTLS_field_440x440.png",
            PSFwidth: 0.8,
			components: [
				{plane: "lens", theta_e: 1.3, x: -28.3, y: -17.3},
				{plane: "lens", theta_e: 1.3, x:   3.5, y:  35.5},
				{plane: "lens", theta_e: 3.0, x:   4.1, y:  17.9},
				{plane: "lens", theta_e: 1.3, x:  14.9, y:  26.4},
				{plane: "lens", theta_e: 1.0, x:  -1.7, y:  12.1},
				{plane: "lens", theta_e: 1.0, x: -15.1, y:  12.3},
				{plane: "lens", theta_e: 1.3, x: -13.9, y: -35.5},
				{plane: "lens", theta_e: 1.0, x:  24.9, y: -25.1},
				{plane: "source", size:  0.7, x: 1000.0, y:  1000.0}
			],
			events: {
				mousemove: function(e){
					var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
					var msg = "";
					if(k < 0.4) msg = "Out here the image of the source is only being weakly lensed";
					if(k >= 0.4 && k < 0.7) msg = "The space around those massive yellow galaxies is being warped, distorting the image of the source";
					if(k >= 0.7) msg = "The source is right behind the lens now - and is being multiply-imaged";
					var t = this.lens.pix2ang({x:e.x, y:e.y});
                    msg = msg+". Cursor position = "+(t.x.toFixed(1))+","+(t.y.toFixed(1));
					this.setStatus(msg);
				}
			}
		});
		this.models.push({
			name: 'CFHTLS_group',
			src: "CFHTLS_group_220x220.png",
            PSFwidth: 0.8,
			components: [
				{plane: "lens", theta_e: 3.0, x:   0.4, y:  -0.5},
				{plane: "lens", theta_e: 1.3, x: -18.8, y:  -6.2},
				{plane: "lens", theta_e: 1.3, x:  -0.5, y:  17.1},
				{plane: "lens", theta_e: 1.3, x:  11.1, y:   8.0},
				{plane: "lens", theta_e: 1.0, x:  -5.5, y:  -6.4},
                {plane: "source", size:  0.7, x: 1000.0, y:  1000.0}
			],
			events: {
				mousemove: function(e){
					var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
					var msg = "";
					if(k < 0.4) msg = "Out here the image of the source is only being weakly lensed";
					if(k >= 0.4 && k < 0.7) msg = "The space around those massive yellow galaxies is being warped, distorting the image of the source";
					if(k >= 0.7) msg = "The source is right behind the lens now - and is being multiply-imaged";
					var t = this.lens.pix2ang({x:e.x, y:e.y});
                    msg = msg+". Cursor position = "+(t.x.toFixed(1))+","+(t.y.toFixed(1));
					this.setStatus(msg);
				}
			}
		});
		this.models.push({
			name: 'CFHTLS_galaxy',
			src: "CFHTLS_galaxy_110x110.png",
            PSFwidth: 0.8,
			components: [
				{plane: "lens", theta_e: 1.3, x: -0.3, y:   0.6},
				{plane: "lens", theta_e: 0.1, x:  7.4, y:   0.1},
				{plane: "source", size:  0.7, x: 1000.0, y:  1000.0}
			],
			events: {
				mousemove: function(e){
					var k = this.lens.mag[this.lens.xy2i(e.x,e.y)].kappa;
					var msg = "";
					if(k < 0.4) msg = "Out here the image of the source is only being weakly lensed";
					if(k >= 0.4 && k < 0.7) msg = "The space around this massive yellow galaxy is being warped, distorting the image of the source";
					if(k >= 0.7) msg = "The source is right behind the lens now - and is being multiply-imaged";
					var t = this.lens.pix2ang({x:e.x, y:e.y});
                    msg = msg+". Cursor position = "+(t.x.toFixed(1))+","+(t.y.toFixed(1));
					this.setStatus(msg);
				}
			}
		});
	
	
		this.init();
	
	}
	
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
		// else if(mode == "image") c = [195, 215, 255];
		// Better color for CFHTLS examples:
        else if(mode == "image") c = [115, 185, 255];
	
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
				// MAGIC number 0.1, trades off with blur steps... -> Math.round(255*0.2) ~ 50
				// imgData.data[pos+3] = 50*lens.predictedimage[i];
				// Without blurring:
                imgData.data[pos+3] = 165*lens.predictedimage[i];
			}else{
				imgData.data[pos+3] = 255;
			}
			pos += 4;
		}
	
		// Keep a copy of the image in a clipboard named <mode>
		canvas.copyToClipboard(mode,imgData);
	
		if(mode == "image"){
			// Blur the image? Try without!
			// imgData = canvas.blur(imgData, lens.w, lens.h);
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
		if(this.buttons.crit){
			addEvent(this.buttons.crit,"click",function(e){
				_obj.showcrit = !_obj.showcrit;
				_obj.update();
			});
		}
		addEvent(this.paper.canvas,"mousemove",function(e){
			var c = _obj.paper.getCursor(e);
			_obj.trigger("mousemove",{x:c.x,y:c.y})
		});
		addEvent(this.paper.canvas,"mouseout",function(e){
			_obj.trigger("mouseout")
		});
		addEvent(this.paper.canvas,"mouseover",function(e){
			_obj.trigger("mouseover")
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

			if(this.model.events[e[i]] && typeof this.model.events[e[i]]==="function") ev = this.model.events[e[i]];
			else ev = "";

			if(typeof ev==="function"){
				// Zap any existing events
				this.events[e[i]] = "";
				this.paper.events[e[i]] = "";

				if(e[i] == "mousemove") this.paper.bind(e[i],{ev:ev,toy:this},function(e){ e.data.toy.update(e); });
				this.bind(e[i],ev);
			}
		}
	
		if(typeof fnCallback=="function") fnCallback(this);
		this.trigger("init");
	
		return this;
	}
	
	LensToy.prototype.update = function(e){

		// Get the size of the existing source
		var src = this.lens.source[0];

		// Remove existing sources
		this.lens.removeAll('source');
	
		if(!e) e = { x : 1000, y: 1000 }
		// Set the lens source to the current cursor position, transforming pixel coords to angular coords:
		var coords = this.lens.pix2ang({x:e.x, y:e.y});

		// Update the source x,y positions
		src.x = coords.x;
		src.y = coords.y;
		
		// Add the source back
        this.lens.add(src);

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
			if(!oElement) { console.log(oElement); return; }
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
