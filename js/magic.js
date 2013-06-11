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
	$.fn.mc_change=function(settings){
		// Change //
		var defaultSettings={
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
		var set=$.extend(defaultSettings, settings);
		return this.each(function(){
			if(set.animate == "opacity") $(this).css("opacity", "0.7");
			$(this).on(set.bind, set.callback);}
		);
	};
	$.fn.mc_marquee=function(settings){
		// Marquee //
		var defaultSettings={
			animate: "silde", //Option: silde, fade
			wrapTag: ".wrap",
			contentTag: "ul",
			itemTag: "li",
			textTag: "article",
			arrowsTag: ".arrows",
			captionTag: ".caption",
			width: "auto",
			height: "auto",
			timeSpeed: 500,
			autoPlay: true,
			itemPlay: 1,
			itemShow: 5,
			seamlessMode: true,
			defaultCss: true,
			arrowsView: true,
			captionView: true,
			startFrom: "right", //Option: top, bottom, left, right
			animateSpeed: 1000
		};
		var set=$.extend(defaultSettings, settings);
		return this.each(function(){
			exec($(this), set);
		});
		function exec(that, set){
			$(".log").log("Marquee Exec");
			var wrapTag=that.find(set.wrapTag), 
			contentTag=wrapTag.find(set.contentTag), 
			itemTag=contentTag.find(set.itemTag), 
			captionTag=that.find(set.captionTag), 
			regex=/px/gi,
			isHover=false,
			axis=null,
			moveLength=null,
			movePos=null,
			index=null,
			html=null,
			timer=[],
			isComplete=[],
			contentLength=[],
			contentSpace=[],			
			playLength=[],
			itemLength=[],
			currentPos=[];
			// Initialize //
			isComplete[that]=true;
			if(set.animate == "fade") set.seamlessMode=false;
			// Set Arrow Axis //
			if((set.startFrom == "left") || (set.startFrom == "right")) axis="horizontal";
			else if((set.startFrom == "top") || (set.startFrom == "bottom"))  axis="vertical";
			// Problem Set //			
			if(!set.arrowsView) that.find(set.arrowsTag).css("display","none");
			if(!set.captionView) that.find(set.captionTag).css("display","none");
			if(set.defaultCss){
				// Content //
				contentTag.css("position","absolute");		
				contentTag.css("margin","0");		
				contentTag.css("padding","0");	
				// Wrap //
				wrapTag.css("position","relative");						
				wrapTag.css("overflow","hidden");
				wrapTag.css("float","left");
				itemTag.css("float","left");
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
			if(!set.itemShow){
				if(axis == "horizontal")
					set.itemShow=wrapTag.outerWidth(true)/itemTag.outerWidth(true);
				if(axis == "vertical")
					set.itemShow=wrapTag.outerHeight(true)/itemTag.outerHeight(true);
			}
			if(axis == "horizontal"){
				// If Not Set Wrap Width Get Wrap Width //
				if(!wrapTag.width()) wrapTag.width(itemTag.outerWidth(true)*set.itemShow);
				if(!wrapTag.height()) wrapTag.height(contentTag.outerHeight(true));
				playLength[that]=set.itemPlay*itemTag.outerWidth(true);
				itemLength[that]=itemTag.outerWidth(true);
				if(contentTag.width() <= (itemTag.outerWidth(true)*itemTag.length)) contentTag.width(itemTag.outerWidth(true)*itemTag.length);
				contentLength[that]=contentTag.width();
				contentSpace[that]=contentTag.outerWidth(true)-contentTag.width();
				currentPos[that]=contentTag.css("left"); //Get Current Position
			}
			if(axis == "vertical"){
				// If Not Set Wrap Height Get Wrap Height //
				if(!wrapTag.height()) wrapTag.height(itemTag.outerHeight(true)*set.itemShow);	
				if(!wrapTag.width()) wrapTag.width(contentTag.outerWidth(true));
				playLength[that]=set.itemPlay*itemTag.outerHeight(true);
				itemLength[that]=itemTag.outerHeight(true);
				if(contentTag.height() <= (itemTag.outerHeight(true)*itemTag.length)) contentTag.height(itemTag.outerHeight(true)*itemTag.length);
				contentLength[that]=contentTag.height();
				contentSpace[that]=contentTag.outerHeight(true)-contentTag.height();
				currentPos[that]=contentTag.css("top"); //Get Current Position
			}
			$(".log").log("Wrap Width: "+wrapTag.width());
			$(".log").log("Wrap Height: "+wrapTag.height());
			$(".log").log("Content Width: "+contentTag.width());
			$(".log").log("Content Height: "+contentTag.height());
			$(".log").log("Content outerWidth: "+contentTag.outerWidth());
			$(".log").log("Content outerHeight: "+contentTag.outerHeight());	
			if(set.seamlessMode){
				var number=Math.floor((set.itemShow*set.itemPlay)/itemTag.length);
				if(number <= 1) number=2;	
				$(".log").log("number: "+number);
				if(axis == "horizontal") contentTag.width(contentLength[that]*number*2);
				if(axis == "vertical") contentTag.height(contentLength[that]*number*2);
				html=contentTag.html();
				for(var i=0; i < number; i++){
					contentTag.append(html);
					contentTag.prepend(html);
				}
			}			
			contentTag.hover(function(){
				// Stop When Mouse Over //
				isHover=true;
				if(set.autoPlay == true) clearTimeout(timer[that]);
			}, function(){
				// Start When Mouse Out //
				isHover=false;
				if(set.autoPlay == true) timer[that]=setTimeout(move, set.timeSpeed);
			});
			that.find(set.arrowsTag).delegate("a", "click", function(event){				 
				if((!isComplete[that]) || (isHover)) return;
				isComplete[that]=false;
				if(set.autoPlay == true) clearTimeout(timer[that]);
				switch(event.target.className){
					case "next":
						moveLength=0-playLength[that];
					break;
					case "prev":
						moveLength=playLength[that];
					break;
				}					
				if(axis == "horizontal"){
					currentPos[that]=parseInt(contentTag.css("left").replace(regex, ""), 10); //Current Position
					movePos=currentPos[that]+moveLength; //Move Position
					if(set.seamlessMode){
						// Seamless Mode //
						// Cross Border //
						if(movePos < (0-contentLength[that]*2)) contentTag.animate({left:currentPos[that]+contentLength[that]+"px"}, 0);
						else if(currentPos[that] > (0-contentLength[that])) contentTag.animate({left:currentPos[that]-contentLength[that]+"px"}, 0);	
						currentPos[that]=parseInt(contentTag.css("left").replace(regex, ""), 10); //Reset Current Position
						movePos=currentPos[that]+moveLength; //Reset Move Position
					}
					else{
						if(movePos <= (0-contentLength[that])) movePos=0-contentSpace[that];
						if(currentPos[that] > 0) movePos=0-contentLength[that]+moveLength;
					}
					switch(set.animate){
						case "silde":
							contentTag.animate({left:movePos+"px"}, set.animateSpeed, "linear", function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								currentPos[that]=parseInt(contentTag.css("left").replace(regex, ""), 10); //Reset Current Position
								index=Math.abs(currentPos[that]/itemLength[that]); //Get Index for Caption
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
							contentTag.fadeOut(set.animateSpeed).animate({left:movePos+"px"}, set.animateSpeed, function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								currentPos[that]=parseInt(contentTag.css("left").replace(regex, ""), 10); //Reset Current Position
								index=((0-currentPos[that])/itemLength[that]); //Get Index for Caption
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
					currentPos[that]=parseInt(contentTag.css("top").replace(regex, ""), 10); //Now Current Position
					movePos=(currentPos[that]+moveLength); //Move Length
					if(set.seamlessMode){
						// Seamless Mode //
						if(movePos < (0-contentLength[that]*2)) contentTag.animate({top:currentPos[that]+contentLength[that]+"px"}, 0);
						else if(currentPos[that] > (0-contentLength[that])) contentTag.animate({top:currentPos[that]-contentLength[that]+"px"}, 0);	
						currentPos[that]=parseInt(contentTag.css("top").replace(regex, ""), 10); //Reset Current Position
						movePos=(currentPos[that]+moveLength); //Reset Move Length
					}
					else{
						if(movePos <= (0-contentLength[that])) movePos=0-contentSpace[that];
						if(currentPos[that] > 0) movePos=0-contentLength[that]+moveLength;	
					}
					switch(set.animate){
						case "silde":
							contentTag.animate({top:movePos+"px"}, set.animateSpeed, function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								currentPos[that]=parseInt(contentTag.css("top").replace(regex, ""), 10); //Reset Current Position
								index=Math.abs(currentPos[that]/itemLength[that]); //Get Index for Caption;
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
							contentTag.fadeOut(set.animateSpeed).animate({top:movePos+"px"}, set.animateSpeed, function(){
								if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(move, set.timeSpeed);
								isComplete[that]=true;	
								currentPos[that]=parseInt(contentTag.css("top").replace(regex,""), 10); //Reset currentPos;
								index=((0-currentPos[that])/itemLength[that]); //Get Index for Caption;
								index=Math.abs(currentPos[that]/itemLength[that]); //Get Index for Caption;
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
				$(".log").log("Current Position: "+movePos);	
			});
			captionTag.html(itemTag.eq(0).find(set.textTag).html()).fadeIn(set.animateSpeed);	
			if(set.seamlessMode){
				if((set.startFrom=="left") || (set.startFrom=="right")) contentTag.css("left", parseInt(0-contentLength[that]-contentSpace[that]));
				else if((set.startFrom=="top") || (set.startFrom=="bottom")) contentTag.css("top", parseInt(0-contentLength[that]-contentSpace[that]));
				$(".log").log("Start Position: "+parseInt(0-contentLength[that]-contentSpace[that]));
			}
			else{
				if((set.startFrom=="left") || (set.startFrom=="right")) contentTag.css("left", 0-contentSpace[that]);
				else if((set.startFrom=="top") || (set.startFrom=="bottom")) contentTag.css("top", 0-contentSpace[that]);
			}
			function move() {
				switch(set.startFrom){
					case "right":
						that.find(".next").click();
					break;
					case "left":
						that.find(".prev").click();
					break;
					case "top":
						that.find(".prev").click();
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
	$(".mc_btn").mc_change();
	$(".mc_marquee_x").mc_marquee();
	$(".mc_marquee_y").mc_marquee({startFrom:"top"});
});