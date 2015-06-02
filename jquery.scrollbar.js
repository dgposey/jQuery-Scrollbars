(function($){
	$.fn.scrollbar = function(userOptions){
		var settings = {
			regInterval: 50,				// the interval, in pixels, between scrolls when pressing an arrow key or clicking on the up/down buttons
			trackInterval: 200,				// the interval, in pixels, between scrolls when clicking on the track
			initialScrollDelay: 700,		// the delay, in milliseconds, between the first scroll and the second scroll when the mouse is down
			scrollDelay: 100,				// the delay, in milliseconds, between all subsequent scrolls when the mouse is down on up/down buttons
			trackScrollDelay: 100			// the delay, in milliseconds, between all subsequent scrolls when the mouse is down on the track
		}
		if(userOptions){
			$.extend(settings,userOptions);
		}
		
		this.each(function(){
			var cont = $(this);
			
			// set necessary css values on the container passed in by the user
			cont.css({"overflow": "hidden", "position": "relative"});
			// reconstruct the innards to include a movable div with the contents and a scrollbar with its elements
			cont.html("<div class='sb-inner'>" + cont.html() + "</div><div class='sb-scrollbar'><div class='sb-up'></div><div class='sb-toptrack'></div><div class='sb-thumb'></div><div class='sb-bottomtrack'></div><div class='sb-down'></div></div>").css({"position": "relative"});
			
			var sbInner = cont.children(".sb-inner");
			var sbBar = cont.children(".sb-scrollbar");
			
			// do some initial calculations
			var innerHeight, contHeight, trackHeight, heightRatio, thumbHeight, thumbDragInterval;
			function init(){
				//alert("init");
				console.log(sbInner.height());
				if(sbInner.height() > cont.height()){
					innerHeight = sbInner.height();
					contHeight = cont.height();
					trackHeight = sbBar.height() - cont.find(".sb-up").height() * 2;				// height of the track
					heightRatio = contHeight / innerHeight;											// ratio of container height to content height, used in calculating thumbHeight
					thumbHeight =  heightRatio * trackHeight;										// height of the thumb
					thumbDragInterval = (innerHeight - contHeight) / (trackHeight - thumbHeight);	// the interval, in pixels, between scrolls when dragging 1 pixel with the thumb
				}else{
					sbBar.width(0).hide();
				}
				
				// set the inner width
				var innerWidth = cont.width() - sbBar.width() - sbInner.padding().left - sbInner.padding().right - sbInner.margin().left - sbInner.margin().right - sbInner.border().left - sbInner.border().right;
				sbInner.width(innerWidth);
				
				// adjust track and thumb heights and positions based on current conditions (initial)
				adjustTracks();
			}
			
			
			
			init();
			
			
			
			var scrollEvent;			// the current timeout, used for clearTimeout()
			var sbclicked = false;		// whether there is currently a mousedown on any part of the scrollbar
			var current = null;			// the current object in the scrollbar that's being clicked on
			
			/********************
			*** handle events ***
			********************/
			
			// click (and hold) on down button
			cont.find(".sb-down").mousedown(function(e){
				if(!sbclicked){
					$(this).addClass("clicked");
					sbclicked = true;
					current = $(this);
					goDirection(-1, settings.regInterval);
					scrollEvent = setTimeout(goDown, settings.initialScrollDelay);
				}else{
					goDown();
				}
			});
			
			// click (and hold) on up button
			cont.find(".sb-up").mousedown(function(){
				if(!sbclicked){
					$(this).addClass("clicked");
					sbclicked = true;
					current = $(this);
					goDirection(1, settings.regInterval);
					scrollEvent = setTimeout(goUp, settings.initialScrollDelay);
				}else{
					goUp();
				}
			});
			
			// drag the thumb
			var trackMovement = false;
			var prevPos;
			cont.find(".sb-thumb").mousedown(function(e){
				$(this).addClass("clicked");
				trackMovement = true;
				prevPos = e.pageY;
				
				$(document).mousemove(function(e){
					if(trackMovement){
						var change = prevPos - e.pageY;
						var interval = thumbDragInterval * Math.abs(change);
						var dir = change / Math.abs(change);
						
						goDirection(dir, interval);
						
						prevPos = e.pageY;
					}
				});
				return false;
			});
			
			// click (and hold) on top track
			cont.find(".sb-toptrack").mousedown(function(){
				if(!sbclicked){
					$(this).addClass("clicked");
					sbclicked = true;
					current = $(this);
					goDirection(1, settings.trackInterval);
					scrollEvent = setTimeout(goUpBig, settings.initialScrollDelay);
				}else{
					goUpBig();
				}
			});
			
			// click (and hold) on bottom track
			cont.find(".sb-bottomtrack").mousedown(function(){
				if(!sbclicked){
					$(this).addClass("clicked");
					sbclicked = true;
					current = $(this);
					goDirection(-1, settings.trackInterval);
					scrollEvent = setTimeout(goDownBig, settings.initialScrollDelay);
				}else{
					goDownBig();
				}
			});
			
			// release any button, thumb, or track
			$(window).mouseup(function(){
				$(".sb-scrollbar").children().removeClass("clicked");
				clearTimeout(scrollEvent);
				sbclicked = false;
				trackMovement = false;
				current = null;
			});
			
			if(sbBar.isVisible()){
				// press (and hold) down or up arrow
				$(document).keydown(function(e){
					if(e.which == 40) {
						// down arrow
						e.preventDefault();
						goDirection(-1, settings.regInterval);
						scrollEvent = setTimeout(goDown, settings.initialScrollDelay);
					}else if(e.which == 38){
						// up arrow
						e.preventDefault();
						goDirection(1, settings.regInterval);
						scrollEvent = setTimeout(goUp, settings.initialScrollDelay);
					}else if(e.which == 34){
						// page down
						e.preventDefault();
						goDirection(-1, contHeight);
						scrollEvent = setTimeout(goPageDown, settings.initialScrollDelay);
					}else if(e.which == 33){
						// page up
						e.preventDefault();
						goDirection(1, contHeight);
						scrollEvent = setTimeout(goPageUp, settings.initialScrollDelay);
					}
				});
				
				// release a key
				$(document).keydown(function(e){
					clearTimeout(scrollEvent);
				});
				
				// scroll mousewheel (uses external library)
				cont.mousewheel(function(e, delta, deltaX, deltaY){
					if(delta < 0){
						// mousewheel is scrolling down
						goDirection(-1, settings.regInterval);
					}else{
						// mousewheel is scrolling up
						goDirection(1, settings.regInterval);
					}
				});
			}
			
			
			/*var left, right, top, bottom;
			$(document).mousemove(function(e){
				if(current != null){
					left = current.offset().left;
					right = left + current.width();
					top = current.offset().top;
					bottom = top + current.width();
					console.log(left);
					if(sbclicked){
						if(e.pageX < left || e.pageX > right || e.pageY < top || e.pageY > bottom){
							console.log("out of bounds!");
							clearTimeout(scrollEvent);
							trackMovement = false;
							sbclicked = false;
						}
					}else{
						if(e.pageX > left && e.pageX < right && e.pageY > top && e.pageY < bottom){
							console.log("resume scrolling");
							sbclicked = true;
							current.trigger("mousedown");
						}
					}
				}
			});*/
			
			/**************************************
			*** functions for going up and down ***
			**************************************/
			
			// Go down and repeat (recursive)
			function goDown(){
				goDirection(-1, settings.regInterval);
				scrollEvent = setTimeout(goDown, settings.scrollDelay);
			}
			
			// Go up and repeat (recursive)
			function goUp(){
				goDirection(1, settings.regInterval);
				scrollEvent = setTimeout(goUp, settings.scrollDelay);
			}
			
			// Go down and repeat (recursive) (big interval)
			function goDownBig(){
				goDirection(-1, settings.trackInterval);
				scrollEvent = setTimeout(goDownBig, settings.trackScrollDelay);
			}
			
			// Go up and repeat (recursive) (big interval)
			function goUpBig(){
				goDirection(1, settings.trackInterval);
				scrollEvent = setTimeout(goUpBig, settings.trackScrollDelay);
			}
			
			function goPageDown(){
				goDirection(-1, contHeight);
				scrollEvent = setTimeout(goPageDown, settings.scrollDelay);
			}
			
			function goPageUp(){
				goDirection(1, contHeight);
				scrollEvent = setTimeout(goPageUp, settings.scrollDelay);
			}
			
			// Go up (dir=1) or down (dir=-1) one time
			function goDirection(dir, interval){
				var vertPos = sbInner.position().top;
				var bottomPos = contHeight - innerHeight;
				
				var newVertPos = vertPos + interval * dir;
				if(newVertPos >= 0 && dir == 1){
					// we've reached the top and we're trying to go up
					clearTimeout(scrollEvent);
					sbInner.css("top", "0px");
					adjustTracks();
					return;
				}else if(newVertPos <= bottomPos && dir == -1){
					// we've reached the bottom and we're trying to go down
					clearTimeout(scrollEvent);
					sbInner.css("top", bottomPos + "px");
					adjustTracks();
					return;
				}
				
				sbInner.css("top", newVertPos + "px");
				adjustTracks();
			}
			
			function adjustTracks(){
				var vertPos = sbInner.position().top;
				var posRatio = (vertPos * -1) / (innerHeight - contHeight);
				
				var topTrackHeight = (trackHeight - thumbHeight) * posRatio;
				var bottomTrackHeight = (trackHeight - thumbHeight) * (1 - posRatio);
				
				cont.find(".sb-toptrack").css({"height": topTrackHeight + thumbHeight * 0.5 + "px", "top": cont.find(".sb-up").height() + "px"});
				cont.find(".sb-bottomtrack").css({"height": bottomTrackHeight + thumbHeight * 0.5 + "px", "top": cont.find(".sb-up").height() + topTrackHeight + thumbHeight * 0.5 + "px"});
				cont.find(".sb-thumb").css({"height": thumbHeight + "px", "top": cont.find(".sb-up").height() + topTrackHeight + "px"});
			}
			
			$.fn.adjust = function(){
				init();
			}
			
		});
		
		return this;
	}
})(jQuery)