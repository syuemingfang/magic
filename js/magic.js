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
	};
	$.fn.mc_demo=function(options){
		var settings={
			obj:{
				back: ".back",
				next: ".next",
				track: ".track",
				scrollbar: ".scrollbar",
				wrap: ".wrap",
				container: ".container"	
			},
			axis: "auto",	
			defaultCSS: true,
			speed: 50,
			moveCoef: 0.1,
			autoPlay: false
		};
		var set=$.extend(settings, options);
		return this.each(
			function(){
				exec($(this), set);
			}
		);
		function exec(that, set){


		}
	};
	$.fn.mc_lazy=function(options){
		var settings={
            event:"scroll",
            effect:"none",
            container:window,
            attribute:"data-original"
		};
		var set=$.extend(settings, options);
		return this.each(
			function(){
				exec($(this), set);
			}
		);
		function exec(that, set){
			var obj={
				img:that.find("img")
			},
			imgArr=[],
			scrollTop=null,
			wH=null, //Window Height
			offset=null,
			cH=null; //Currient Height
			if(obj.img.length > 0){
				for(var i=0;i <obj.img.length; i++){
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
				if(imgArr.length>0){
					for(var i=0;i<imgArr.length;i++){
						tmp = imgArr[i];
						offset=$(tmp).offset();
						cH=scrollTop+wH;
						if(offset!=null){
							if(offset.top < scrollTop+wH){
								if($(tmp).attr("src") != $(tmp).attr(set.attribute)){
									$(tmp).attr("src", $(tmp).attr(set.attribute));
								}else{
									imgArr.remove(tmp);
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
	};	
	$.fn.mc_scrollbar=function(options){
		// ScrollBar  //
		var settings={
			obj:{
				back: ".back",
				next: ".next",
				track: ".track",
				scrollbar: ".scrollbar",
				wrap: ".wrap",
				container: ".container"	
			},
			axis: "auto",	
			defaultCSS: true,
			speed: 50,
			moveCoef: 0.1,
			autoPlay: false
		};
		var set=$.extend(settings, options);
		return this.each(
			function(){
				exec($(this), set);
			}
		);
		function exec(that, set){
			$(".log").log("Marquee Exec");
			var obj={
				wrap:that.find(set.obj.wrap), 
				container:that.find(set.obj.container), 
				track:that.find(set.obj.track), 
				back:that.find(set.obj.back), 
				next:that.find(set.obj.next), 
				scrollbar:that.find(set.obj.scrollbar)
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
				if(obj.track.outerHeight(true) < obj.track.outerWidth(true)) set.axis="horizontal";
				else set.axis="vertical";
			}
			switch(set.axis){
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
					switch(set.axis){
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
				switch(set.axis){
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
	};
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
						$(".log").log("New Image: "+newImg);
						if(that.find("img").attr("dynsrc")) newImg=that.attr("dynsrc");
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
							console.log(newImg);
							that.attr("src", newImg);
						break;
						}
						that.on("mouseleave", function(){		
							var that=$(this),
							handler=arguments.callee;
							that.unbind("mouseout", handler);
							switch(set.animate){
							case "fade":
								that.stop().animate({opacity: 1}, set.speed, function(){
									that.parent().css("background","none");
								})
							break;
							case "opacity":
								that.stop().animate({opacity: 0.7}, set.speed);
							break;
							default:
								that.attr("src" , img);
							break;
							}
						});
					break;
					case "css":
						that=$(this);
						var img=that.css("background-image");
						var newImg=$.fn.mc_btn.s1(img,set.type,set.name);
						that.css("background-image",newImg);
						$(this).on("mouseleave",function(){
							var that = $(this), handler = arguments.callee;
   							that.unbind("mouseout", handler);
							that.css("background-image",img);
						});
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
			animate: "silde", //Option: silde, fade
			wrapTag: ".wrap",
			containerTag: "ul",
			itemTag: "li",
			textTag: "article",
			backTag: ".back",
			nextTag: ".next",
			captionTag: ".caption",
			width: "auto",
			height: "auto",
			timeSpeed: 500,
			autoPlay: true,
			itemPlay: 1,
			itemShow: "auto",
			seamlessMode: true,
			defaultCss: true,
			arrowsView: true,
			captionView: true,
			startFrom: "auto", //Option: top, bottom, left, right
			animateSpeed: 1000
		};
		var set=$.extend(settings, options);
		return this.each(
			function(){
				exec($(this), set);
			}
		);
		function exec(that, set){
			$(".log").log("Marquee Exec");
			var wrapTag=that.find(set.wrapTag), 
			containerTag=wrapTag.find(set.containerTag), 
			itemTag=containerTag.find(set.itemTag), 
			captionTag=that.find(set.captionTag), 
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
				$(".log").log("container Height:"+containerTag.height());
				$(".log").log("Item Height:"+itemTag.height());
				$(".log").log("container Width:"+containerTag.width());
				$(".log").log("Item Width:"+itemTag.width());
				if(containerTag.height()/itemTag.height() > containerTag.width()/itemTag.width())
					set.startFrom="top" 
				else
					set.startFrom="right"					
			}
			$(".log").log("startFrom:"+set.startFrom);
			// Set Arrow Axis //
			if((set.startFrom == "left") || (set.startFrom == "right")) axis="horizontal";
			else if((set.startFrom == "top") || (set.startFrom == "bottom"))  axis="vertical";
			// Problem Set //			
			if(!set.arrowsView) that.find(set.arrowsTag).css("display","none");
			if(!set.captionView) that.find(set.captionTag).css("display","none");
			if(set.defaultCss){
				// container //
				containerTag.css("position","absolute");		
				containerTag.css("margin","0");		
				containerTag.css("padding","0");	
				// Wrap //
				wrapTag.css("position","relative");						
				wrapTag.css("overflow","hidden");
				wrapTag.css("float","left");
			}
			// If Not Set Width Get Item Width //
			if(set.width == "auto"){
				itemTag.width(itemTag.outerWidth(true));
			} else
				itemTag.width(set.width);
			// If Not Set Height Get Item Height //
			if(set.height == "auto")
				itemTag.height(itemTag.outerHeight(true));
			else
				itemTag.height(set.height);
			if(set.itemShow=="auto"){
				if(axis == "horizontal")
					set.itemShow=wrapTag.outerWidth(true)/itemTag.outerWidth(true);
				if(axis == "vertical")
					set.itemShow=wrapTag.outerHeight(true)/itemTag.outerHeight(true);
				if(!set.itemShow)
					set.itemShow=5;
			}
			$(".log").log("Item Show: "+set.itemShow);
			if(axis == "horizontal"){
				// If Not Set Wrap Width Get Wrap Width //
				if(!wrapTag.width()) wrapTag.width(itemTag.outerWidth(true)*set.itemShow);
				if(!wrapTag.height()) wrapTag.height(containerTag.outerHeight(true));
				playLength[that]=set.itemPlay*itemTag.outerWidth(true);
				itemLength[that]=itemTag.outerWidth(true);
				if(containerTag.width() <= (itemTag.outerWidth(true)*itemTag.length)) containerTag.width(itemTag.outerWidth(true)*itemTag.length);
				containerLength[that]=containerTag.width();
				containerSpace[that]=containerTag.outerWidth(true)-containerTag.width();
				cPos[that]=containerTag.css("left"); //Get Current Position
			}
			if(axis == "vertical"){
				// If Not Set Wrap Height Get Wrap Height //
				if(!wrapTag.height()) wrapTag.height(itemTag.outerHeight(true)*set.itemShow);	
				if(!wrapTag.width()) wrapTag.width(containerTag.outerWidth(true));
				playLength[that]=set.itemPlay*itemTag.outerHeight(true);
				itemLength[that]=itemTag.outerHeight(true);
				if(containerTag.height() <= (itemTag.outerHeight(true)*itemTag.length)) containerTag.height(itemTag.outerHeight(true)*itemTag.length);
				containerLength[that]=containerTag.height();
				containerSpace[that]=containerTag.outerHeight(true)-containerTag.height();
				cPos[that]=containerTag.css("top"); //Get Current Position
			}
			$(".log").log("Wrap Width: "+wrapTag.width());
			$(".log").log("Wrap Height: "+wrapTag.height());
			$(".log").log("container Width: "+containerTag.width());
			$(".log").log("container Height: "+containerTag.height());
			$(".log").log("container outerWidth: "+containerTag.outerWidth());
			$(".log").log("container outerHeight: "+containerTag.outerHeight());	
			if(set.seamlessMode){
				var number=Math.floor((set.itemShow*set.itemPlay)/itemTag.length);
				if(number <= 1) number=2;	
				$(".log").log("number: "+number);
				if(axis == "horizontal") containerTag.width(containerLength[that]*number*2);
				if(axis == "vertical") containerTag.height(containerLength[that]*number*2);
				html=containerTag.html();
				for(var i=0; i < number; i++){
					containerTag.append(html);
					containerTag.prepend(html);
				}
			}			
			containerTag.hover(function(){
				// Stop When Mouse Over //
				isHover=true;
				if(set.autoPlay == true) clearTimeout(timer[that]);
			}, function(){
				// Start When Mouse Out //
				isHover=false;
				if(set.autoPlay == true) timer[that]=setTimeout(move, set.timeSpeed);
			});

			that.find(set.backTag).click(
				function(evt){	
					go(evt, playLength[that]);
				}
			);
			that.find(set.nextTag).click(
				function(evt){	
					go(evt, 0-playLength[that]);					
				}
			);


			function go(evt, moveLength){
				if((!isComplete[that]) || (isHover)) return;
				isComplete[that]=false;
				if(set.autoPlay == true) clearTimeout(timer[that]);			
				if(axis == "horizontal"){
					cPos[that]=parseInt(containerTag.css("left").replace(regex, ""), 10); //Current Position
					mPos=cPos[that]+moveLength; //Move Position
					if(set.seamlessMode){
						// Seamless Mode //
						// Cross Border //
						if(mPos < (0-containerLength[that]*2)) containerTag.animate({left:cPos[that]+containerLength[that]+"px"}, 0);
						else if(cPos[that] > (0-containerLength[that])) containerTag.animate({left:cPos[that]-containerLength[that]+"px"}, 0);	
						cPos[that]=parseInt(containerTag.css("left").replace(regex, ""), 10); //Reset Current Position
						mPos=cPos[that]+moveLength; //Reset Move Position
					}
					else{
						if(mPos <= (0-containerLength[that])) mPos=0-containerSpace[that];
						if(cPos[that] > 0) mPos=0-containerLength[that]+moveLength;
					}
					switch(set.animate){
						case "silde":
							containerTag.animate({left:mPos+"px"}, set.animateSpeed, "linear", function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								cPos[that]=parseInt(containerTag.css("left").replace(regex, ""), 10); //Reset Current Position
								index=Math.abs(cPos[that]/itemLength[that]); //Get Index for Caption
								if(set.seamlessMode){
									// Seamless Mode //
									index=index-itemTag.length;
									if(Math.abs(index) > itemTag.length-1) index=0;
								}
								else if(index < 0) index=0;
								captionTag.html(itemTag.eq(index).find(set.textTag).html()).fadeIn(set.animateSpeed);	
							});		
						break;
						case "fade":
							containerTag.fadeOut(set.animateSpeed).animate({left:mPos+"px"}, set.animateSpeed, function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								cPos[that]=parseInt(containerTag.css("left").replace(regex, ""), 10); //Reset Current Position
								index=((0-cPos[that])/itemLength[that]); //Get Index for Caption
								if(set.seamlessMode){
									// Seamless Mode //
									index=index-itemTag.length;
									if(Math.abs(index) > itemTag.length-1) index=0;
								}
								else if(index < 0) index=0;
								captionTag.html(itemTag.eq(index).find(set.textTag).html()).fadeIn(set.animateSpeed);	
							}).fadeIn(set.animateSpeed);			
						break;
					}
				}
				else{
					cPos[that]=parseInt(containerTag.css("top").replace(regex, ""), 10); //Now Current Position
					mPos=(cPos[that]+moveLength); //Move Length
					if(set.seamlessMode){
						// Seamless Mode //
						if(mPos < (0-containerLength[that]*2)) containerTag.animate({top:cPos[that]+containerLength[that]+"px"}, 0);
						else if(cPos[that] > (0-containerLength[that])) containerTag.animate({top:cPos[that]-containerLength[that]+"px"}, 0);	
						cPos[that]=parseInt(containerTag.css("top").replace(regex, ""), 10); //Reset Current Position
						mPos=(cPos[that]+moveLength); //Reset Move Length
					}
					else{
						if(mPos <= (0-containerLength[that])) mPos=0-containerSpace[that];
						if(cPos[that] > 0) mPos=0-containerLength[that]+moveLength;	
					}
					switch(set.animate){
						case "silde":
							containerTag.animate({top:mPos+"px"}, set.animateSpeed, function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								cPos[that]=parseInt(containerTag.css("top").replace(regex, ""), 10); //Reset Current Position
								index=Math.abs(cPos[that]/itemLength[that]); //Get Index for Caption;
								if(set.seamlessMode){
									// Seamless Mode //
									index=index-itemTag.length;
									if(Math.abs(index) > itemTag.length-1) index=0;
								}
								else if(index < 0) index=0;
								captionTag.html(itemTag.eq(index).find(set.textTag).html()).fadeIn(set.animateSpeed);	
							});		
						break;
						case "fade":
							containerTag.fadeOut(set.animateSpeed).animate({top:mPos+"px"}, set.animateSpeed, function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								cPos[that]=parseInt(containerTag.css("top").replace(regex,""), 10); //Reset current Position;
								index=((0-cPos[that])/itemLength[that]); //Get Index for Caption;
								index=Math.abs(cPos[that]/itemLength[that]); //Get Index for Caption;
								if(set.seamlessMode){
									// Seamless Mode //											
									index=index-itemTag.length;
									if(Math.abs(index) > itemTag.length-1) index=0;
								}
								else if(index < 0) index=0;
								captionTag.html(itemTag.eq(index).find(set.textTag).html()).fadeIn(set.animateSpeed);		
							}).fadeIn(set.animateSpeed);			
						break;
					}
				}
				$(".log").log("Current Position: "+mPos);
			}	
			captionTag.html(itemTag.eq(0).find(set.textTag).html()).fadeIn(set.animateSpeed);	
			if(set.seamlessMode){
				if((set.startFrom=="left") || (set.startFrom=="right")) containerTag.css("left", parseInt(0-containerLength[that]-containerSpace[that]));
				else if((set.startFrom=="top") || (set.startFrom=="bottom")) containerTag.css("top", parseInt(0-containerLength[that]-containerSpace[that]));
				$(".log").log("Start Position: "+parseInt(0-containerLength[that]-containerSpace[that]));
			}
			else{
				if((set.startFrom=="left") || (set.startFrom=="right")) containerTag.css("left", 0-containerSpace[that]);
				else if((set.startFrom=="top") || (set.startFrom=="bottom")) containerTag.css("top", 0-containerSpace[that]);
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
	$("*[data-magic=lazy]").mc_lazy();
	$("*[data-magic=scrollbar]").mc_scrollbar();
	$("*[data-magic=marquee]").mc_marquee();
});