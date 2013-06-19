﻿// Magic Plugin  //
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
	$.fn.mg_fixed=function(options){
		var settings={
			wrap: "window",
			animate: "slide",
			start:{
				top: "0",		
				left: "0",						
				target: null,
			},
			end:{
				top: "99999",		
				left: "99999",						
				target: ".marquee",
			},
			animateSpeed: 50
		}
		var set=$.extend(settings, options);
		return this.each(
			function(){
				initialize($(this), set);
			}
		);
		function initialize(that, set){
			var regex=/px/gi,
			isComplete=[],
			start={
				top:null,
				left:null
			},
			end={
				top:null,
				left:null
			},
			top=parseInt(that.css("top").replace(regex, ""), 10),
			left=parseInt(that.css("left").replace(regex, ""), 10);
			

			if(set.start.target){
				start.top=set.start.target.offsetTop;
				start.left=set.start.target.offsetLeft;
			}
			else{
				start.top=set.start.top;
				start.left=set.start.left;				
			}
			exec(that);
			if(set.wrap == "window"){
				$(window).scroll(
					function(){
						isComplete[that]=true;
						exec(that);
					}
				);
			}
			else{
				$(set.wrap).scroll(
					function(){
						isComplete[that]=true;
						exec(that, set.wrap);
					}
				);
			}
			function exec(that, target){
				if(!target) target=$(document);
				if(!isComplete[that]) return;
				isComplete[that]=false;
				if(set.end.target){
		 			end.top=$(set.end.target)[0].offsetTop;
					end.left=$(set.end.target)[0].offsetLeft;
				}
				else{
					end.top=set.end.top;
					end.left=set.end.left;				
				}
				switch(set.animate){
					case "slide":
					if((target.scrollTop() > start.top) && (target.scrollTop()+top+that.outerHeight(true) < end.top)) that.animate({"top": target.scrollTop()+top+"px"}, set.animateSpeed,
						function(){
							isComplete[that]=true;
						}
					);
					if((target.scrollLeft() > start.left) && (target.scrollLeft()+left+that.outerWidth(true) < end.left)) that.animate({"left": target.scrollLeft()+left+"px"}, set.animateSpeed,
						function(){
							isComplete[that]=true;
						}
					);
					break;
				}
				
			}
		}
	}
	$.fn.mg_image=function(options){
		var settings={
			obj:{
				container: "ul"
			},
			animate: "fade",
			mode: "lazy",
			attr: "data-magic.src",
			animateSpeed: 500
		}
		var set=$.extend(settings, options);
		return this.each(
			function(){
				initialize($(this), set);
			}
		);
		function initialize(that, set){
			var ready=false;
			exec(that);
			if(set.mode == "lazy"){
				$(window).scroll(
					function(){
						exec(that);
					}
				);
			}
			function exec(that){
				if(set.mode == "lazy"){
					if(that.offset().top < parseInt($(document).scrollTop()+$(window).height(), 10)){
						execThis(that);
					}
				}	
				else{
					execThis(that);
				}
				function execThis(that){
					if(ready==true) return;
					that.ready(
						function(){
							that.fadeOut(set.animateSpeed/2,
								function(){
									that.attr("src", that.attr(set.attr));
									that.fadeIn(set.animateSpeed/2);
									ready=true;
								}
							);
						}
					);
				}
			}
		}
	}
	$.fn.mg_view=function(options){
		var settings={
			obj:{
				wrap: ".wrap",
				container: ".container",
				item: "a",				
				currentClass: "current"
			},
			defaultCSS: true,
			animate: "fade",
			autoPlay: true,
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
				wrap: that.find(set.obj.wrap),	
				container: that.find(set.obj.container),
				item: that.find(set.obj.item),
				link: that.find("a")							
			};
			obj.wrap.hide();
			obj.link.click(
				function(){	
					if($(this).attr("href").match(/\#/) == null) return
					obj.item.removeClass(set.obj.currentClass);	
					$(this).addClass(set.obj.currentClass);
					var href=$(this).attr("href");
					obj.container.fadeOut(set.animateSpeed/2,
						function(){
							obj.container.html($(href).html())
							obj.container.fadeIn(set.animateSpeed/2);
						}
					);
				}
			);
		}
	}
	$.fn.mg_menu=function(options){
		var settings={
			obj:{
				container: "ul",
				item: "li"
			},
			defaultCSS: true,
			animate: "fade",
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
			obj.item.hover(
				function(){						
					$(this).children(set.obj.container).fadeIn(set.animateSpeed);
					$(this).children(set.obj.container).children(set.obj.item).click(
						function(){
							if(!$(this).children("a").attr("href")) return
							location.href=$(this).children("a").attr("href");
						}
					);
				},
				function(){				
					$(this).children(set.obj.container).fadeOut(set.animateSpeed);
				}
			);
		}
	}
	$.fn.mg_scrollbar=function(options){
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
	$.fn.mg_change=function(options){
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
					newImg=null,
					html=null;
					newImg=getPath(img, set.type, set.name);
					if(that.attr("dynsrc")) newImg=that.attr("dynsrc");
					switch(set.animate){
						case "fade":
						html=that.html();
						that.html("<span>"+html+"</span>");
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
					var newImg=$.fn.mg_btn.s1(img,set.type,set.name);
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
	$.fn.mg_slideshow=function(options){
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
				page:{
					wrap: ".page",
					item: "a",
					currentClass: "current",
					autoGeneration: true,
					showIndex: true
				}	
			},
			animate: "slide", //Option: slide, fade
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
				container:that.find(set.obj.wrap).find(set.obj.container),
				item:that.find(set.obj.wrap).find(set.obj.container).find(set.obj.item),
				caption:that.find(set.obj.caption),
				page:{
					wrap:that.find(set.obj.page.wrap),
					item:that.find(set.obj.page.wrap).find(set.obj.page.item),
					currentClass:that.find(set.obj.page.wrap).find(set.obj.page.currentClass)				
				},
				text:that.find(set.obj.text),
				back:that.find(set.obj.back),
				next:that.find(set.obj.next)
			},
			regex=/px/gi,
			isHover=false,
			axis=null,
			moveLength=null,
			mPos=null,
			index=0,
			html=null,
			timer=[],
			isComplete=[],
			containerLength=[],
			containerSpace=[],			
			playLength=[],
			itemLength=[],
			href=null,
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
				// Container //
				obj.container.css("position", "absolute");		
				obj.container.css("margin", "0");		
				obj.container.css("padding", "0");	
				// Wrap //
				obj.wrap.css("position", "relative");						
				obj.wrap.css("overflow", "hidden");
				obj.wrap.css("float", "left");
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
				var html=null;
				for(var i=0; i < number; i++){
					html=obj.container.html();
					obj.container.html(html+html);
				}
			}
			if(set.obj.page.autoGeneration){
				// 自動產生分頁 //
				var html="", script=null;
				for(var i=1; i <= obj.item.length; i++){
					if(set.obj.page.item == "a"){
						script="href='#";
					}
					else script="class='";
					if(set.obj.page.showIndex)
						html+="<"+set.obj.page.item+" "+script+i+"'>"+i+"</"+set.obj.page.item+">";
					else 
						html+="<"+set.obj.page.item+" "+script+i+"'></"+set.obj.page.item+">";
				}
				obj.page.wrap.html(html);
				obj.page.item=that.find(set.obj.page.wrap).find(set.obj.page.item);
			}
			obj.container.hover(
				function(){
					// Stop When Mouse Over //
					isHover=true;
					if(set.autoPlay == true) clearTimeout(timer[that]);
				}, function(){
					// Start When Mouse Out //
					isHover=false;
					if(set.autoPlay == true) timer[that]=setTimeout(function(){move()}, set.timeSpeed);
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
			that.find(obj.page.item).click(
				function(evt){
					href=$(this).attr("href").match(/\d/gi);
					exec(evt, playLength[that]*((index+1)-href));	
					return false;				
				}
			);
			function exec(evt, moveLength){
				if((!isComplete[that]) || (isHover)) return;
				isComplete[that]=false;
				if(obj.page.wrap)
					obj.page.item.removeClass(set.obj.page.currentClass);
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
						case "slide":
						obj.container.animate({left:mPos+"px"}, set.animateSpeed, "linear", function(){
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(function(){move()}, set.timeSpeed);
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
						obj.container.fadeOut(set.animateSpeed/2).animate({left:mPos+"px"}, set.animateSpeed, function(){
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(function(){move()}, set.timeSpeed);
							isComplete[that]=true;	
								cPos[that]=parseInt(obj.container.css("left").replace(regex, ""), 10); //Reset Current Position
								index=((0-cPos[that])/itemLength[that]); //Get Index for Caption
								if(set.seamlessMode){
									// Seamless Mode //
									index=index-obj.item.length;
									if(Math.abs(index) > obj.item.length-1) index=0;
								}
								else if(index < 0) index=0;
								obj.caption.html(obj.item.eq(index).find(obj.text).html()).fadeIn(set.animateSpeed/2);
							}).fadeIn(set.animateSpeed/2);
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
						case "slide":
						obj.container.animate({top:mPos+"px"}, set.animateSpeed, function(){
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(function(){move()}, set.timeSpeed);
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
							if((!isHover) && (set.autoPlay == true)) timer[that]=setTimeout(function(){move()}, set.timeSpeed);
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
			if(obj.page.wrap)
				obj.page.item.eq(index).addClass(set.obj.page.currentClass);
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
			if(set.autoPlay == true) timer[that]=setTimeout(function(){move()}, set.timeSpeed)
		}
	};
})(jQuery);
$(document).ready(function() {

	$("*[data-magic=fixed]").mg_fixed();	
	$("*[data-magic=view]").mg_view();	
	$("*[data-magic-src]").mg_image();	
	$("*[data-magic=btn]").mg_change();
	$("*[data-magic=menu]").mg_menu();
	$("*[data-magic=scrollbar]").mg_scrollbar();
	$("*[data-magic=marquee]").mg_slideshow();
	$("*[data-magic=banner]").mg_slideshow({animate:"fade",timeSpeed:"2000"});
});
