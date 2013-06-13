// Magic Plugin  //
;(function($){
	var isDebug=true;
	$.fn.log=function(str){
		// Debug //
		if(!isDebug) return;
		if(window.console)
			console.log(str)
		else
			$(this).html(str)
	}
	$.fn.mc_menu=function(options){
		var settings={
			obj:{
				container: "ul",
				item: "li"
			},
			defaultCSS: true,
			animate: "fadeIn",
			animateSpeed: 500
		}
		var set=$.extend(settings, options);
		return this.each(
			function(){
				initialize($(this), set);
			}
		);
		function initialize(that, set){
			var obj={
				container: that.find(set.obj.container),
				item: that.find(set.obj.item)			
			};
			obj.container.hide();
			obj.item.click(
				function(){
					if(!$(this).find("a").attr("href")) return
					location.href=$(this).find("a").attr("href");
				}
			);
			obj.item.hover(
				function(){						
					$(this).children(set.obj.container).fadeIn(set.animateSpeed);
				},
				function(){				
					$(this).children(set.obj.container).fadeOut(set.animateSpeed);
				}
			);
		}
	}
	$.fn.mc_lazy=function(options){
		var settings={
			event:"scroll",
			effect:"none",
			container:window,
			attribute:"data-original"
		}
		var set=$.extend(settings, options);
		return this.each(
			function(){
				initialize($(this), set);
			}
		);
		function initialize(that, set){
			var obj={
				img:that.find("img")
			},
			img=null,
			imgArr=[],
			scrollTop=null,
			wH=null, //Window Height
			cH=null; //Currient Height
			offset=null;
			if(obj.img.length > 0){
				for(var i=0; i < obj.img.length; i++){
					imgArr.push(obj.img[i]);
				}
			}
			scrollTop=$(document).scrollTop();
			wH=$(window).height();
			lazy();
			$(window).scroll(
				function(){
					scrollTop=$(document).scrollTop();
					lazy();
				}
			);
			function lazy(){
				if(imgArr.length > 0){
					for(var i=0; i < imgArr.length; i++){
						img=imgArr[i];
						offset=$(img).offset();
						cH=scrollTop+wH;
						if(offset != null){
							if(offset.top < scrollTop+wH){
								if($(img).attr("src") != $(img).attr(set.attribute)){
									$(img).attr("src", $(img).attr(set.attribute));
								} else{
									imgArr.remove(img);
								}
							}
						}
					}
				}
			}
			Array.prototype.indexOf=function(val){
				for(var i = 0; i < this.length; i++){
					if (this[i] == val) return i;
				}
				return -1;
			}
			Array.prototype.remove=function(val){
				var index=this.indexOf(val);
				if(index > -1){
					this.splice(index, 1);
				}			
			}
		}
	}
	$.fn.mc_scrollbar=function(options){
		// Scrollbar  //
		var settings={
			obj:{
				wrap: ".wrap",
				container: ".container",
				back: ".back",
				next: ".next",
				track: ".track",
				scrollbar: ".scrollbar"
			},
			axis: "auto",	
			defaultCSS: true,
			speed: 50,
			moveCoef: 0.1,
			autoPlay: false
		}
		var set=$.extend(settings, options);
		return this.each(
			function(){
				initialize($(this), set);
			}
		);
		function initialize(that, set){
			var obj={
				wrap: that.find(set.obj.wrap), 
				container: that.find(set.obj.container), 
				track: that.find(set.obj.track), 
				back: that.find(set.obj.back), 
				next: that.find(set.obj.next), 
				scrollbar: that.find(set.obj.scrollbar)
			},
			regex=/px/gi,
			isDragg=false,
			moveLength=null,			
			axis=null,
			oX=null, //Original X
			oY=null, //Original Y
			cX=null, //Current X
			cY=null; //Current Y
			if(set.defaultCSS){
				obj.scrollbar.css("position","absolute");
				obj.container.css("position","absolute");
				obj.wrap.css("position","relative");
				obj.wrap.css("overflow","hidden");				
				obj.track.css("position","relative");
			}
			if(set.axis == "auto"){
				if(obj.track.outerHeight(true) < obj.track.outerWidth(true)) axis="horizontal";
				else axis="vertical";
			}
			else axis=set.axis;
			switch(axis){
				case "horizontal":
				moveLength=(obj.track.outerWidth(true)-obj.scrollbar.outerWidth(true))*set.moveCoef;
				break;
				case "vertical":
				moveLength=(obj.track.outerHeight(true)-obj.scrollbar.outerHeight(true))*set.moveCoef;								
				break;	
			}
			obj.scrollbar.mousedown(
				function(evt){
					isDragg=true;
					cX=evt.clientX-this.offsetLeft;
					cY=evt.clientY-this.offsetTop;
					this.setCapture && this.setCapture();
					return false;
				}
			);
			$(document).mousemove(
				function(evt){
					if(isDragg){
						var evt=evt || window.event;
						move(evt.clientX-cX, evt.clientY-cY, 0)
						return false;
					}
				}
			);
			$(document).mouseup(
				function(evt){
					isDragg=false;
					evt.cancelBubble=true;
				}
			);
			obj.next.click(
				function(evt){
					oX=parseInt(obj.scrollbar.css("left").replace(regex, ""), 10) || 0;
					oY=parseInt(obj.scrollbar.css("top").replace(regex, ""), 10) || 0;
					move(oX+moveLength, oY+moveLength, set.speed)
				}
			);
			obj.back.click(
				function(evt){
					oX=parseInt(obj.scrollbar.css("left").replace(regex, ""), 10) || 0,
					oY=parseInt(obj.scrollbar.css("top").replace(regex, ""), 10) || 0;
					move(oX-moveLength, oY-moveLength, set.speed);
				}
			);
			obj.track.mousedown(
				function(evt){
					cX=evt.offsetX-obj.scrollbar.outerWidth(),
					cY=evt.offsetY-obj.scrollbar.outerHeight(),
					oX=parseInt(obj.scrollbar.css("left").replace(regex, ""), 10),
					oY=parseInt(obj.scrollbar.css("top").replace(regex, ""), 10);
					switch(axis){
						case "horizontal":
						if(cX > oX)	
							move(cX, cY);
						else
							move(cX+obj.scrollbar.outerWidth(true), cY);	
						break;
						case "vertical":
						if(cY > oY)	
							move(cX, cY);
						else
							move(cX, cY+obj.scrollbar.outerHeight(true));									
						break;	
					}
					return false;
				}
			);
			function move(x, y, speed){
				switch(axis){
					case "horizontal":
					var scrollMove=x,
					containerMove=0-(1/(obj.track.outerWidth()-obj.scrollbar.outerWidth())*x*(obj.container.width()-obj.wrap.width()));
					if(x+obj.scrollbar.width() >= obj.track.width())
						scrollMove=obj.track.width()-obj.scrollbar.width();
					containerMove=0-obj.container.width()+obj.wrap.width();
					if(x <= 0){
						scrollMove=0;
						containerMove=0;
					}
					obj.scrollbar.animate({"left": scrollMove+"px"}, speed);
					obj.container.animate({"left": containerMove+"px"}, speed);	
					break;
					case "vertical":
					var scrollMove=y,
					containerMove=0-(1/(obj.track.outerHeight()-obj.scrollbar.outerHeight())*y*(obj.container.height()-obj.wrap.height()));
					if(y+obj.scrollbar.height() > obj.track.height())
						scrollMove=obj.track.height()-obj.scrollbar.height();
					containerMove=0-obj.container.height()+obj.wrap.height();
					if(y < 0){
						scrollMove=0;
						containerMove=0;
					}
					obj.scrollbar.animate({"top": scrollMove+"px"}, speed);
					obj.container.animate({"top": containerMove+"px"}, speed);						
					break;	
				}
			}
		}
	}
	$.fn.mc_change=function(options){
		// Change //
		var settings={
			bind: "mouseenter",
			animate: "fade",
			type: "filename",
			name: "_hover",
			attribute: "src",
			size: "100%",		
			speed: 300,
			callback:function(){
				switch(set.attribute){
					case "src":
					var that=$(this),
					img=that.attr("src"),
					newImg=null;
					newImg=getPath(img, set.type, set.name);
					if(that.attr("dynsrc")) newImg=that.attr("dynsrc");
					switch(set.animate){
						case "fade":
						that.stop().animate({opacity: 0}, set.speed);
						that.parent().css("display", "inline-block");
						that.parent().css("background-image", "url("+newImg+")");
						that.parent().css("background-repeat", "no-repeat");
						break;
						case "opacity":
						that.stop().animate({opacity: 1}, set.speed);
						break;
						default:
						that.attr("src", newImg);
						break;
					}
					that.on("mouseleave",
						function(){		
							var that=$(this),
							handler=arguments.callee;
							that.unbind("mouseout", handler);
							switch(set.animate){
								case "fade":
								that.stop().animate({opacity: 1}, set.speed,
									function(){
										that.parent().css("background","none");
									}
								);
								break;
								case "opacity":
								that.stop().animate({opacity: 0.7}, set.speed);
								break;
								default:
								that.attr("src" , img);
								break;
							}
						}
					);
					break;
					case "css":
					that=$(this);
					var img=that.css("background-image");
					var newImg=$.fn.mc_btn.s1(img,set.type,set.name);
					that.css("background-image",newImg);
					$(this).on("mouseleave",
						function(){
							var that = $(this), handler = arguments.callee;
							that.unbind("mouseout", handler);
							that.css("background-image",img);
						}
					);
					break;
				};
			}
		};
		function getPath(obj, type, name){
			var objArr=obj.split('/'),
			objFilename=objArr[objArr.length-1],
			arr=objFilename.split('.'),
			objName=arr[0],
			objExt=arr[1],
			path=obj.split(objFilename , 1);
			switch(type){
				case "filename":
				return path+objName+name+'.'+objExt;
				break;
				case "folder":
				return path+name+'/'+objName+'.'+objExt;
				break;
			}
		};
		var set=$.extend(settings, options);
		return this.each(
			function(){
				if(set.animate == "opacity") $(this).css("opacity", "0.7");
				$(this).on(set.bind, set.callback);
			}
		);
	};
	$.fn.mc_marquee=function(options){
		// Marquee //
		var settings={
			obj:{
				wrap:".wrap", 
				container:"ul", 
				item:"li",
				caption:".caption",
				text: "article",
				back: ".back",
				next: ".next",
			},
			animate: "silde", //Option: silde, fade
			animateSpeed: 1000,
			width: "auto",
			height: "auto",
			autoPlay: true,
			timeSpeed: 500,
			itemPlay: 1,
			itemShow: "auto",
			seamlessMode: true,
			defaultCss: true,
			arrowsView: true,
			captionView: true,
			startFrom: "auto" //Option: top, bottom, left, right
		};
		var set=$.extend(settings, options);
		return this.each(
			function(){
				initialize($(this), set);
			}
		);
		function initialize(that, set){
			var obj={
				wrap:that.find(set.obj.wrap),
				container:that.find(set.obj.container),
				item:that.find(set.obj.item),
				caption:that.find(set.obj.caption),
				text:that.find(set.obj.text),
				back:that.find(set.obj.back),
				next:that.find(set.obj.next)
			},
			regex=/px/gi,
			isHover=false,
			axis=null,
			moveLength=null,
			mPos=null,
			index=null,
			html=null,
			timer=[],
			isComplete=[],
			containerLength=[],
			containerSpace=[],			
			playLength=[],
			itemLength=[],
			cPos=[];
			// Initialize //
			isComplete[that]=true;
			if(set.animate == "fade") set.seamlessMode=false;
			if(set.startFrom == "auto"){
				if(obj.container.height()/obj.item.height() > obj.container.width()/obj.item.width())
					set.startFrom="top" 
				else
					set.startFrom="right"					
			}
			// Set Arrow Axis //
			if((set.startFrom == "left") || (set.startFrom == "right")) axis="horizontal";
			else if((set.startFrom == "top") || (set.startFrom == "bottom"))  axis="vertical";
			// Problem Set //			
			if(!set.arrowsView) that.find(set.arrowsTag).css("display","none");
			if(!set.captionView) that.find(set.obj.caption).css("display","none");
			if(set.defaultCss){
				// container //
				obj.container.css("position","absolute");		
				obj.container.css("margin","0");		
				obj.container.css("padding","0");	
				// Wrap //
				obj.wrap.css("position","relative");						
				obj.wrap.css("overflow","hidden");
				obj.wrap.css("float","left");
			}
			// If Not Set Width Get Item Width //
			if(set.width == "auto"){
				obj.item.width(obj.item.outerWidth(true));
			} else
			obj.item.width(set.width);
			// If Not Set Height Get Item Height //
			if(set.height == "auto")
				obj.item.height(obj.item.outerHeight(true));
			else
				obj.item.height(set.height);
			if(set.itemShow=="auto"){
				if(axis == "horizontal")
					set.itemShow=obj.wrap.outerWidth(true)/obj.item.outerWidth(true);
				if(axis == "vertical")
					set.itemShow=obj.wrap.outerHeight(true)/obj.item.outerHeight(true);
				if(!set.itemShow)
					set.itemShow=5;
			}
			if(axis == "horizontal"){
				// If Not Set Wrap Width Get Wrap Width //
				if(!obj.wrap.width()) obj.wrap.width(obj.item.outerWidth(true)*set.itemShow);
				if(!obj.wrap.height()) obj.wrap.height(obj.container.outerHeight(true));
				playLength[that]=set.itemPlay*obj.item.outerWidth(true);
				itemLength[that]=obj.item.outerWidth(true);
				if(obj.container.width() <= (obj.item.outerWidth(true)*obj.item.length)) obj.container.width(obj.item.outerWidth(true)*obj.item.length);
				containerLength[that]=obj.container.width();
				containerSpace[that]=obj.container.outerWidth(true)-obj.container.width();
				cPos[that]=obj.container.css("left"); //Get Current Position
			}
			if(axis == "vertical"){
				// If Not Set Wrap Height Get Wrap Height //
				if(!obj.wrap.height()) obj.wrap.height(obj.item.outerHeight(true)*set.itemShow);	
				if(!obj.wrap.width()) obj.wrap.width(obj.container.outerWidth(true));
				playLength[that]=set.itemPlay*obj.item.outerHeight(true);
				itemLength[that]=obj.item.outerHeight(true);
				if(obj.container.height() <= (obj.item.outerHeight(true)*obj.item.length)) obj.container.height(obj.item.outerHeight(true)*obj.item.length);
				containerLength[that]=obj.container.height();
				containerSpace[that]=obj.container.outerHeight(true)-obj.container.height();
				cPos[that]=obj.container.css("top"); //Get Current Position
			}	
			if(set.seamlessMode){
				var number=Math.floor((set.itemShow*set.itemPlay)/obj.item.length);
				if(number <= 1) number=2;
				if(axis == "horizontal") obj.container.width(containerLength[that]*number*2);
				if(axis == "vertical") obj.container.height(containerLength[that]*number*2);
				html=obj.container.html();
				for(var i=0; i < number; i++){
					obj.container.append(html);
					obj.container.prepend(html);
				}
			}			
			obj.container.hover(
				function(){
					// Stop When Mouse Over //
					isHover=true;
					if(set.autoPlay == true) clearTimeout(timer[that]);
				}, function(){
					// Start When Mouse Out //
					isHover=false;
					if(set.autoPlay == true) timer[that]=setTimeout(move, set.timeSpeed);
				}
			);
			that.find(obj.back).click(
				function(evt){	
					exec(evt, playLength[that]);
					return false;
				}
			);
			that.find(obj.next).click(
				function(evt){	
					exec(evt, 0-playLength[that]);	
					return false;				
				}
			);
			function exec(evt, moveLength){
				if((!isComplete[that]) || (isHover)) return;
				isComplete[that]=false;
				if(set.autoPlay == true) clearTimeout(timer[that]);			
				if(axis == "horizontal"){
					cPos[that]=parseInt(obj.container.css("left").replace(regex, ""), 10); //Current Position
					mPos=cPos[that]+moveLength; //Move Position
					if(set.seamlessMode){
						// Seamless Mode //
						// Cross Border //
						if(mPos < (0-containerLength[that]*2)) obj.container.animate({left:cPos[that]+containerLength[that]+"px"}, 0);
						else if(cPos[that] > (0-containerLength[that])) obj.container.animate({left:cPos[that]-containerLength[that]+"px"}, 0);	
						cPos[that]=parseInt(obj.container.css("left").replace(regex, ""), 10); //Reset Current Position
						mPos=cPos[that]+moveLength; //Reset Move Position
					}
					else{
						if(mPos <= (0-containerLength[that])) mPos=0-containerSpace[that];
						if(cPos[that] > 0) mPos=0-containerLength[that]+moveLength;
					}
					switch(set.animate){
						case "silde":
						obj.container.animate({left:mPos+"px"}, set.animateSpeed, "linear", function(){
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
							isComplete[that]=true;	
								cPos[that]=parseInt(obj.container.css("left").replace(regex, ""), 10); //Reset Current Position
								index=Math.abs(cPos[that]/itemLength[that]); //Get Index for Caption
								if(set.seamlessMode){
									// Seamless Mode //
									index=index-obj.item.length;
									if(Math.abs(index) > obj.item.length-1) index=0;
								}
								else if(index < 0) index=0;
								obj.caption.html(obj.item.eq(index).find(obj.text).html()).fadeIn(set.animateSpeed);	
							});		
						break;
						case "fade":
						obj.container.fadeOut(set.animateSpeed).animate({left:mPos+"px"}, set.animateSpeed, function(){
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
							isComplete[that]=true;	
								cPos[that]=parseInt(obj.container.css("left").replace(regex, ""), 10); //Reset Current Position
								index=((0-cPos[that])/itemLength[that]); //Get Index for Caption
								if(set.seamlessMode){
									// Seamless Mode //
									index=index-obj.item.length;
									if(Math.abs(index) > obj.item.length-1) index=0;
								}
								else if(index < 0) index=0;
								obj.caption.html(obj.item.eq(index).find(obj.text).html()).fadeIn(set.animateSpeed);	
							}).fadeIn(set.animateSpeed);			
						break;
					}
				}
				else{
					cPos[that]=parseInt(obj.container.css("top").replace(regex, ""), 10); //Now Current Position
					mPos=(cPos[that]+moveLength); //Move Length
					if(set.seamlessMode){
						// Seamless Mode //
						if(mPos < (0-containerLength[that]*2)) obj.container.animate({top:cPos[that]+containerLength[that]+"px"}, 0);
						else if(cPos[that] > (0-containerLength[that])) obj.container.animate({top:cPos[that]-containerLength[that]+"px"}, 0);	
						cPos[that]=parseInt(obj.container.css("top").replace(regex, ""), 10); //Reset Current Position
						mPos=(cPos[that]+moveLength); //Reset Move Length
					}
					else{
						if(mPos <= (0-containerLength[that])) mPos=0-containerSpace[that];
						if(cPos[that] > 0) mPos=0-containerLength[that]+moveLength;	
					}
					switch(set.animate){
						case "silde":
						obj.container.animate({top:mPos+"px"}, set.animateSpeed, function(){
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
							isComplete[that]=true;	
								cPos[that]=parseInt(obj.container.css("top").replace(regex, ""), 10); //Reset Current Position
								index=Math.abs(cPos[that]/itemLength[that]); //Get Index for Caption;
								if(set.seamlessMode){
									// Seamless Mode //
									index=index-obj.item.length;
									if(Math.abs(index) > obj.item.length-1) index=0;
								}
								else if(index < 0) index=0;
								obj.caption.html(obj.item.eq(index).find(obj.text).html()).fadeIn(set.animateSpeed);	
							});		
						break;
						case "fade":
						obj.container.fadeOut(set.animateSpeed).animate({top:mPos+"px"}, set.animateSpeed, function(){
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
							isComplete[that]=true;	
								cPos[that]=parseInt(obj.container.css("top").replace(regex,""), 10); //Reset current Position;
								index=((0-cPos[that])/itemLength[that]); //Get Index for Caption;
								index=Math.abs(cPos[that]/itemLength[that]); //Get Index for Caption;
								if(set.seamlessMode){
									// Seamless Mode //											
									index=index-obj.item.length;
									if(Math.abs(index) > obj.item.length-1) index=0;
								}
								else if(index < 0) index=0;
								obj.caption.html(obj.item.eq(index).find(obj.text).html()).fadeIn(set.animateSpeed);		
							}).fadeIn(set.animateSpeed);			
						break;
					}
				}
			}	
			obj.caption.html(obj.item.eq(0).find(obj.text).html()).fadeIn(set.animateSpeed);	
			if(set.seamlessMode){
				if((set.startFrom=="left") || (set.startFrom=="right")) obj.container.css("left", parseInt(0-containerLength[that]-containerSpace[that]));
				else if((set.startFrom=="top") || (set.startFrom=="bottom")) obj.container.css("top", parseInt(0-containerLength[that]-containerSpace[that]));
			}
			else{
				if((set.startFrom=="left") || (set.startFrom=="right")) obj.container.css("left", 0-containerSpace[that]);
				else if((set.startFrom=="top") || (set.startFrom=="bottom")) obj.container.css("top", 0-containerSpace[that]);
			}
			function move() {
				switch(set.startFrom){
					case "right":
					that.find(".next").click();
					break;
					case "left":
					that.find(".back").click();
					break;
					case "top":
					that.find(".back").click();
					break;
					case "bottom":
					that.find(".next").click();
					break;
				}
			}
			// Open AutoPlay //
			if(set.autoPlay == true) timer[that]=setTimeout(move, set.timeSpeed)
		}
	};
})(jQuery);
$(document).ready(function() {	
	$("*[data-magic=btn]").mc_change();
	$("*[data-magic=menu]").mc_menu();
	$("*[data-magic=lazy]").mc_lazy();
	$("*[data-magic=scrollbar]").mc_scrollbar();
	$("*[data-magic=marquee]").mc_marquee();
});