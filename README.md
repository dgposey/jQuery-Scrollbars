jQuery-Scrollbars
=================

A jQuery plugin for adding custom scrollbars to a div

* Scrollbars, a jQuery plugin for adding custom scrollbars to a div.
* Version: 0.1
* Plugin URI: https://github.com/dgposey/jQuery-Scrollbars
* Author: David Posey
* Author URI: http://www.davidgposey.com
* License: GPL

===================
Usage
===================
-------------------
Included files
-------------------
Include the following CSS file in your HTML file:
scrollbars.css

Include the following Javascript files, in this order, in your HTML file:
* jquery-x.x.x.min.js			[jQuery; replace x.x.x with the current version number]
* jquery.mousewheel.js		[a plugin that handles mousewheel movements]
* jquery.sizes.js				[a plugin that provides support for sizing of elements]
* jquery.scrollbar.js			[this plugin]

-------------------
.scrollbar()
-------------------
Apply the scrollbar() method to the div or divs you want to have scrollbars.

Example Usage:
```
$("#mydiv").scrollbar();
```

-------------------
.adjust()
-------------------
If you need to dynamically adjust the content in your div (ie using AJAX), please note that your content is inside the div with a class sb-inner, inside your content div.  Update the content in .sb-inner, then call the adjust() method on your div.

Known bug: This may not work properly at this time.

Example Usage:
```
$("#mydiv .sb-inner").append("<p>Lorem Ipsum</p>").parent().adjust();
```

===================
Settings
===================
The scrollbar() method can optionally be passed a single JSON object with any of the following settings:

* regInterval
  * integer
  * default: 50
  * the interval, in pixels, between scrolls when pressing an arrow key or clicking on the up/down buttons
* trackInterval
  * integer
  * default: 200
  * the interval, in pixels, between scrolls when clicking on the track
* initialScrollDelay
  * integer
  * default: 700
  * the delay, in milliseconds, between the first scroll and the second scroll when the mouse is down
* scrollDelay
  * integer
  * default: 100
  * the delay, in milliseconds, between all subsequent scrolls when the mouse is down on up/down buttons
* trackScrollDelay
  * integer
  * default: 100
  * the delay, in milliseconds, between all subsequent scrolls when the mouse is down on the track

-------------------
Example Usage
-------------------
```
var settings = {
	regInterval: 65
	trackInterval: 350
	initialScrollDelay: 1000
	scrollDelay: 80
	trackScrollDelay: 175
}
$("#t-rex").scrollbar(settings);
```

===================
Styling
===================
The scrollbar is designed to be highly customizable using CSS.  You can customize any and every piece of the scrollbar, such as colors, borders, sizes, rounded corners, and visibility, including on hover and click states.

* `.sb-inner`: The new container for all of your content.
* `.sb-scrollbar`: The container for all of the pieces of the scrollbar.
* `.sb-up`, `.sb-down`: The up and down buttons.  Feel free to set your own background images.
* `.sb-up.clicked`, `.sb-down.clicked`: The mousedown states of the up and down buttons.
* `.sb-thumb`: The thumb (the piece you click and drag)
* `.sb-thumb.clicked`: The mousedown state of the thumb.
* `.sb-toptrack`, `.sb-bottomtrack`: The top and bottom tracks (the track is the area in which the thumb slides, and you are able to style the top and bottom pieces differently or the same).
* `.sb-toptrack.clicked`, `.sb-bottomtrack.clicked`: The mousedown states of the top and bottom tracks
