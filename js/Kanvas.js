
function OverrideCanvas(CanvasClass, ContextClass){
	
	if(!ContextClass.override){
		// - Alternate Colors
		ContextClass.prototype.setFillRGB = function (rr,gg,bb){
			this.fillStyle = 'rgb('+Math.round(rr||0)+','+Math.round(gg||0)+','+Math.round(bb||0)+')';
		}
		ContextClass.prototype.setStrokeRGB = function (rr,gg,bb){
			this.strokeStyle = 'rgb('+Math.round(rr||0)+','+Math.round(gg||0)+','+Math.round(bb||0)+')';
		}
		ContextClass.prototype.setFillRGBA = function (rr,gg,bb,aa){
			this.fillStyle = 'rgba('	+Math.round(rr||0)+','
										+Math.round(gg||0)+','
										+Math.round(bb||0)+','
										+(Math.round((aa*1000)||1000)/1000)+')';
		}
		ContextClass.prototype.setStrokeRGBA = function (rr,gg,bb,aa){
			this.strokeStyle = 'rgba('	+Math.round(rr||0)+','
										+Math.round(gg||0)+','
										+Math.round(bb||0)+','
										+(Math.round((aa*1000)||1000)/1000)+')';
		}

		
		// - Easier Circles
		ContextClass.prototype.fillArc = function (xx,yy,rr,start,stop,cw) {
			this.basicArc(xx,yy,rr,start,stop,cw,true);
		}
		ContextClass.prototype.strokeArc = function (xx,yy,rr,start,stop,cw) {
			this.basicArc(xx,yy,rr,start,stop,cw,false);
		}
		ContextClass.prototype.basicArc = function (xx,yy,rr,start,stop,cw,fill) {
			this.beginPath();
			this.arc(xx,yy,rr,start||0,stop||Math.PI*2,cw||true);
			this.closePath();
			if(fill)this.fill();
			else this.stroke();
		}
		
		// - Text Handling
		ContextClass.prototype.mlFunction = function(text, x, y, w, h, hAlign, vAlign, lineheight, fn) {
			text = text.replace(/[\n]/g, " \n ");
			text = text.replace(/\r/g, "");
			var words = text.split(/[ ]+/);
			if(words && words.length == 1){
				words = [text];
			}
			if(words && words.length == 0){
				words = [" "];
			}
			var sp = this.measureText(' ').width;
			var lines = [];
			var actualline = 0;
			var actualsize = 0;
			var wo;
			lines[actualline] = {};
			lines[actualline].Words = [];
			i = 0;
			while (i < words.length) {
				var word = words[i];
				if (word == "\n") {
					lines[actualline].EndParagraph = true;
					actualline++;
					actualsize = 0;
					lines[actualline] = {};
					lines[actualline].Words = [];
					i++;
				} else {
					wo = {};
					wo.l = this.measureText(word).width;
					if (actualsize === 0) {
						
						
						wo.word = word;
						lines[actualline].Words.push(wo);
						actualsize = wo.l;
						i++;
					} else {
						if (actualsize + sp + wo.l > w) {
							lines[actualline].EndParagraph = false;
							actualline++;
							actualsize = 0;
							lines[actualline] = {};
							lines[actualline].Words = [];
						} else {
							wo.word = word;
							lines[actualline].Words.push(wo);
							actualsize += sp + wo.l;
							i++;
						}
					}
				}
			}
			//if (actualsize === 0) lines[actualline].pop();
			lines[actualline].EndParagraph = true;

			var totalH = lineheight * lines.length;
			while (totalH > h) {
				lines.pop();
				totalH = lineheight * lines.length;
			}

			var yy;
			if (vAlign == "bottom") {
				yy = y + h - totalH + lineheight;
			} else if (vAlign == "center") {
				yy = y + h / 2 - totalH / 2 + lineheight;
			} else {
				yy = y + lineheight;
			}

			var oldTextAlign = this.textAlign;
			this.textAlign = "left";
			
			for (var li in lines) {
				var totallen = 0;
				var xx, usp;
				for (wo in lines[li].Words) totallen += lines[li].Words[wo].l;
				if (hAlign == "center") {
					usp = sp;
					xx = x + w / 2 - (totallen + sp * (lines[li].Words.length - 1)) / 2;
				} else if ((hAlign == "justify") && (!lines[li].EndParagraph)) {
					xx = x;
					usp = (w - totallen) / (lines[li].Words.length - 1);
				} else if (hAlign == "right") {
					xx = x + w - (totallen + sp * (lines[li].Words.length - 1));
					usp = sp;
				} else { // left
					xx = x;
					usp = sp;
				}
				for (wo in lines[li].Words) {
					if (fn == "fillText") {
						this.fillText(lines[li].Words[wo].word, Math.round(xx), Math.round(yy));
					} else if (fn == "strokeText") {
						this.strokeText(lines[li].Words[wo].word, xx, yy);
					}
					xx += lines[li].Words[wo].l + usp;
				}
				yy += lineheight;
			}
			this.textAlign = oldTextAlign;
			return (((lines.length<1000000000000000000)?(lines.length):(1)) * lineheight);
		};
		ContextClass.prototype.mlFillText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
			return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "fillText");
		};
		ContextClass.prototype.mlStrokeText = function (text, x, y, w, h, vAlign, hAlign, lineheight) {
			return this.mlFunction(text, x, y, w, h, hAlign, vAlign, lineheight, "strokeText");
		};
		ContextClass.prototype.fillTextSpacing = function (text, x, y, letterSpacing, dontRender) {
	        if (!text || typeof text !== 'string' || text.length === 0) {
	            return;
	        }
	        
	        if (typeof letterSpacing === 'undefined') {
	            letterSpacing = 0;
	        }
	        
	        // letterSpacing of 0 means normal letter-spacing
	        this.save();
			
	        var characters = String.prototype.split.call(text, '');
	        var index = 0;
	        var current;
	        var currentPosition = x;
	        var align = 1;
			var centerOffSet = 0;

				
	        if (this.textAlign === 'center') {
				this.textAlign = 'left';
				centerOffSet = 10;
				for(var ii in characters) {
					centerOffSet += (this.measureText(characters[ii]).width + letterSpacing);
				}
				this.translate(-centerOffSet/2,0);
			}else if (this.textAlign === 'right') {
				characters = characters.reverse();
				align = -1;
			}
				
			while (index < text.length) {
				current = characters[index++];
				if(!dontRender) this.fillText(current, currentPosition, y);
				currentPosition += (align * (this.measureText(current).width + letterSpacing));
			}
			
			this.restore();

			return currentPosition;
		}

		ContextClass.override = true;
	}

	if(!CanvasClass.override){
	
		// - Grabs a 2d context and remembers it, returning it from then on out without requesting new contexts
		CanvasClass.prototype.context = function(){
			this.CTX = this.CTX || this.getContext('2d');
			return this.CTX;
		},
		
		// - Kanvas
		CanvasClass.prototype.setStage = function(stage){ //Sets a Kanvas object as the 'stage' of this canvas
			//Remove the current stage
			if(this.stage){
				this.stage.canvas 		= null;
				this.stage.context 		= null;
				this.stage.isStage		= null;
				this.stage.__stage		= null;
			}
			
			this.stage = stage;
			
			if(this.stage){
				this.stage.canvas 		= this;
				this.stage.context 		= this.context();
				this.stage.isStage		= true;
				this.stage.__stage		= this.stage;
				
				// this.stage.__matchCanvasDimension(true);
				// this.stage.__tryStartMouseTrack();
			}
		}
	}
}

