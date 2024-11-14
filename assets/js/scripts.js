// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// Accordion

(function() {
	var Accordion = function(element) {
		this.element = element;
		this.items = Util.getChildrenByClassName(this.element, 'js-accordion__item');
		this.version = this.element.getAttribute('data-version') ? '-'+this.element.getAttribute('data-version') : '';
		this.showClass = 'accordion'+this.version+'__item--is-open';
		this.animateHeight = (this.element.getAttribute('data-animation') == 'on');
		this.multiItems = !(this.element.getAttribute('data-multi-items') == 'off'); 
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init accordion
		this.initAccordion();
	};

	Accordion.prototype.initAccordion = function() {
		//set initial aria attributes
		for( var i = 0; i < this.items.length; i++) {
			var button = this.items[i].getElementsByTagName('button')[0],
				content = this.items[i].getElementsByClassName('js-accordion__panel')[0],
				isOpen = Util.hasClass(this.items[i], this.showClass) ? 'true' : 'false';
			Util.setAttributes(button, {'aria-expanded': isOpen, 'aria-controls': 'accordion-content-'+i, 'id': 'accordion-header-'+i});
			Util.addClass(button, 'js-accordion__trigger');
			Util.setAttributes(content, {'aria-labelledby': 'accordion-header-'+i, 'id': 'accordion-content-'+i});
		}

		//listen for Accordion events
		this.initAccordionEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Accordion.prototype.initAccordionEvents = function() {
		var self = this;

		this.element.addEventListener('click', function(event) {
			var trigger = event.target.closest('.js-accordion__trigger');
			//check index to make sure the click didn't happen inside a children accordion
			if( trigger && Util.getIndexInArray(self.items, trigger.parentElement) >= 0) self.triggerAccordion(trigger);
		});
	};

	Accordion.prototype.triggerAccordion = function(trigger) {
		var bool = (trigger.getAttribute('aria-expanded') === 'true');

		this.animateAccordion(trigger, bool, false);

		if(!bool && this.deepLinkOn) {
			history.replaceState(null, '', '#'+trigger.getAttribute('aria-controls'));
		}
	};

	Accordion.prototype.animateAccordion = function(trigger, bool, deepLink) {
		var self = this;
		var item = trigger.closest('.js-accordion__item'),
			content = item.getElementsByClassName('js-accordion__panel')[0],
			ariaValue = bool ? 'false' : 'true';

		if(!bool) Util.addClass(item, this.showClass);
		trigger.setAttribute('aria-expanded', ariaValue);
		self.resetContentVisibility(item, content, bool);

		if( !this.multiItems && !bool || deepLink) this.closeSiblings(item);
	};

	Accordion.prototype.resetContentVisibility = function(item, content, bool) {
		Util.toggleClass(item, this.showClass, !bool);
		content.removeAttribute("style");
		if(bool && !this.multiItems) { // accordion item has been closed -> check if there's one open to move inside viewport 
			this.moveContent();
		}
	};

	Accordion.prototype.closeSiblings = function(item) {
		//if only one accordion can be open -> search if there's another one open
		var index = Util.getIndexInArray(this.items, item);
		for( var i = 0; i < this.items.length; i++) {
			if(Util.hasClass(this.items[i], this.showClass) && i != index) {
				this.animateAccordion(this.items[i].getElementsByClassName('js-accordion__trigger')[0], true, false);
				return false;
			}
		}
	};

	Accordion.prototype.moveContent = function() { // make sure title of the accordion just opened is inside the viewport
		var openAccordion = this.element.getElementsByClassName(this.showClass);
		if(openAccordion.length == 0) return;
		var boundingRect = openAccordion[0].getBoundingClientRect();
		if(boundingRect.top < 0 || boundingRect.top > window.innerHeight) {
			var windowScrollTop = window.scrollY || document.documentElement.scrollTop;
			window.scrollTo(0, boundingRect.top + windowScrollTop);
		}
	};

	Accordion.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		if(!hash || hash == '') return;
		var trigger = this.element.querySelector('.js-accordion__trigger[aria-controls="'+hash+'"]');
		if(trigger && trigger.getAttribute('aria-expanded') !== 'true') {
			this.animateAccordion(trigger, false, true);
			setTimeout(function(){trigger.scrollIntoView(true);});
		}
	};

	window.Accordion = Accordion;
	
	//initialize the Accordion objects
	var accordions = document.getElementsByClassName('js-accordion');
	if( accordions.length > 0 ) {
		for( var i = 0; i < accordions.length; i++) {
			(function(i){new Accordion(accordions[i]);})(i);
		}
	}
}());

// Vertical-timeline
(function() {
	var VTimeline = function(element) {
    this.element = element;
    this.sections = this.element.getElementsByClassName('js-v-timeline__section');
    this.animate = this.element.getAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on' ? true : false;
    this.animationClass = 'v-timeline__section--animate';
    this.animationDelta = '-150px';
    initVTimeline(this);
  };

  function initVTimeline(element) {
    if(!element.animate) return;
    for(var i = 0; i < element.sections.length; i++) {
      var observer = new IntersectionObserver(vTimelineCallback.bind(element, i),
      {rootMargin: "0px 0px "+element.animationDelta+" 0px"});
		  observer.observe(element.sections[i]);
    }
  };

  function vTimelineCallback(index, entries, observer) {
    if(entries[0].isIntersecting) {
      Util.addClass(this.sections[index], this.animationClass);
      observer.unobserve(this.sections[index]);
    } 
  };

  //initialize the VTimeline objects
  var timelines = document.querySelectorAll('.js-v-timeline'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
    reducedMotion = Util.osHasReducedMotion();
	if( timelines.length > 0) {
		for( var i = 0; i < timelines.length; i++) {
      if(intersectionObserverSupported && !reducedMotion) (function(i){new VTimeline(timelines[i]);})(i);
      else timelines[i].removeAttribute('data-animation');
		}
	}
}());

// points-of-interest

(function() {
  function initPoi(element) {
    element.addEventListener('click', function(event){
      var poiItem = event.target.closest('.js-poi__item');
      if(poiItem) Util.addClass(poiItem, 'poi__item--visited');
    });
  };

  var poi = document.getElementsByClassName('js-poi');
  for(var i = 0; i < poi.length; i++) {
    (function(i){initPoi(poi[i]);})(i);
  }
}());

// Sticky-sharebar
(function() {
  var StickyShareBar = function(element) {
    this.element = element;
    this.contentTarget = document.getElementsByClassName('js-sticky-sharebar-target');
    this.contentTargetOut = document.getElementsByClassName('js-sticky-sharebar-target-out');
    this.showClass = 'sticky-sharebar--on-target';
    this.threshold = '50%'; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
    initShareBar(this);
    initTargetOut(this);
  };

  function initShareBar(shareBar) {
    if(shareBar.contentTarget.length < 1) {
      shareBar.showSharebar = true;
      Util.addClass(shareBar.element, shareBar.showClass);
      return;
    }
    if(intersectionObserverSupported) {
      shareBar.showSharebar = false;
      initObserver(shareBar); // update anchor appearance on scroll
    } else {
      Util.addClass(shareBar.element, shareBar.showClass);
    }
  };

  function initObserver(shareBar) { // target of Sharebar
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        shareBar.showSharebar = entries[0].isIntersecting;
        toggleSharebar(shareBar);
      }, 
      {rootMargin: "0px 0px -"+shareBar.threshold+" 0px"}
    );
    observer.observe(shareBar.contentTarget[0]);
  };

  function initTargetOut(shareBar) { // target out of Sharebar
    shareBar.hideSharebar = false;
    if(shareBar.contentTargetOut.length < 1) {
      return;
    }
    var observer = new IntersectionObserver(
      function(entries, observer) { 
        shareBar.hideSharebar = entries[0].isIntersecting;
        toggleSharebar(shareBar);
      }
    );
    observer.observe(shareBar.contentTargetOut[0]);
  };

  function toggleSharebar(shareBar) {
    Util.toggleClass(shareBar.element, shareBar.showClass, shareBar.showSharebar && !shareBar.hideSharebar);
  };

  //initialize the StickyShareBar objects
  var stickyShareBar = document.getElementsByClassName('js-sticky-sharebar'),
    intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
  
	if( stickyShareBar.length > 0 ) {
		for( var i = 0; i < stickyShareBar.length; i++) {
			(function(i){ new StickyShareBar(stickyShareBar[i]); })(i);
    }
	}

// Back-to-top
(function() {
	var backTop = document.getElementsByClassName('js-back-to-top')[0];
	if( backTop ) {
	  var dataElement = backTop.getAttribute('data-element');
	  var scrollElement = dataElement ? document.querySelector(dataElement) : window;
	  var scrollOffsetInit = parseInt(backTop.getAttribute('data-offset-in')) || parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
		scrollOffsetOutInit = parseInt(backTop.getAttribute('data-offset-out')) || 0, 
		scrollOffset = 0,
		scrollOffsetOut = 0,
		scrolling = false;
  
	  // check if target-in/target-out have been set
	  var targetIn = backTop.getAttribute('data-target-in') ? document.querySelector(backTop.getAttribute('data-target-in')) : false,
		targetOut = backTop.getAttribute('data-target-out') ? document.querySelector(backTop.getAttribute('data-target-out')) : false;
  
	  updateOffsets();
	  
	  //detect click on back-to-top link
	  backTop.addEventListener('click', function(event) {
		event.preventDefault();
		if(!window.requestAnimationFrame) {
		  scrollElement.scrollTo(0, 0);
		} else {
		  dataElement ? scrollElement.scrollTo({top: 0, behavior: 'smooth'}) : window.scrollTo({top: 0, behavior: 'smooth'});
		} 
		//move the focus to the #top-element - don't break keyboard navigation
		moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
	  });
	  
	  //listen to the window scroll and update back-to-top visibility
	  checkBackToTop();
	  if (scrollOffset > 0 || scrollOffsetOut > 0) {
		scrollElement.addEventListener("scroll", function(event) {
		  if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){checkBackToTop();}, 250) : window.requestAnimationFrame(checkBackToTop);
		  }
		});
	  }
  
	  function checkBackToTop() {
		updateOffsets();
		var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
		if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
		var condition =  windowTop >= scrollOffset;
		if(scrollOffsetOut > 0) {
		  condition = (windowTop >= scrollOffset) && (window.innerHeight + windowTop < scrollOffsetOut);
		}
		backTop.classList.toggle('back-to-top--is-visible', condition);
		scrolling = false;
	  }
  
	  function updateOffsets() {
		scrollOffset = getOffset(targetIn, scrollOffsetInit, true);
		scrollOffsetOut = getOffset(targetOut, scrollOffsetOutInit);
	  }
  
	  function getOffset(target, startOffset, bool) {
		var offset = 0;
		if(target) {
		  var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
		  if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
		  var boundingClientRect = target.getBoundingClientRect();
		  offset = bool ? boundingClientRect.bottom : boundingClientRect.top;
		  offset = offset + windowTop;
		}
		if(startOffset && startOffset) {
		  offset = offset + parseInt(startOffset);
		}
		return offset;
	  }
  
	  function moveFocus(element) {
		if( !element ) element = document.getElementsByTagName("body")[0];
		element.focus();
		if (document.activeElement !== element) {
		  element.setAttribute('tabindex','-1');
		  element.focus();
		}
	  };
	}
  }());


  
// pre-header
(function() {
	var preHeader = document.getElementsByClassName('js-pre-header');
	if(preHeader.length > 0) {
		for(var i = 0; i < preHeader.length; i++) {
			(function(i){ addPreHeaderEvent(preHeader[i]);})(i);
		}

		function addPreHeaderEvent(element) {
			var close = element.getElementsByClassName('js-pre-header__close-btn')[0];
			if(close) {
				close.addEventListener('click', function(event) {
					event.preventDefault();
					element.classList.add('pre-header--is-hidden');
				});
			}
		}
	}
}());


// RXD live market stats
async function fetchData() {
  try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/radiant?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false');
      const data = await response.json();

      const currentPrice = data.market_data.current_price.usd;
      const marketCap = data.market_data.market_cap.usd;
      const totalVolume = data.market_data.total_volume.usd;

      document.getElementById('current-price').innerText = `$${currentPrice}`;
      document.getElementById('market-cap').innerText = `$${marketCap.toLocaleString()}`;
      document.getElementById('total-volume').innerText = `$${totalVolume.toLocaleString()}`;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

// Fetch data on page load
fetchData();

// Refresh data every 5 minutes
setInterval(fetchData, 300000);

// end RXD live market stats


if(!Util) function Util () {};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.addClass = function(el, className) {
  var classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
  if(bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

Util.hasClass = function(el, className) {
  return el.classList.contains(className);
};

Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};


// Tech Content Tabs
(function() {
	var Tab = function(element) {
		this.element = element;
		this.tabList = this.element.getElementsByClassName('js-tabs__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-tabs__panels')[0];
		this.panels = Util.getChildrenByClassName(this.panelsList, 'js-tabs__panel');
		this.hideClass = this.element.getAttribute('data-hide-panel-class') ? this.element.getAttribute('data-hide-panel-class') : 'is-hidden';
		this.customShowClass = this.element.getAttribute('data-show-panel-class') ? this.element.getAttribute('data-show-panel-class') : false;
		this.layout = this.element.getAttribute('data-tabs-layout') ? this.element.getAttribute('data-tabs-layout') : 'horizontal';
		// deep linking options
		this.deepLinkOn = this.element.getAttribute('data-deep-link') == 'on';
		// init tabs
		this.initTab();
	};

	Tab.prototype.initTab = function() {
		//set initial aria attributes
		this.tabList.setAttribute('role', 'tablist');
		Util.addClass(this.element, 'tabs--no-interaction');

		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == 0),
				panelId = this.panels[i].getAttribute('id');
			this.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(this.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(this.triggers[i], 'js-tabs__trigger'); 
			Util.setAttributes(this.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
			Util.toggleClass(this.panels[i], this.hideClass, !bool)
			
			if(bool && this.customShowClass) Util.addClass(this.panels[i], this.customShowClass);

			if(!bool) this.triggers[i].setAttribute('tabindex', '-1'); 
		}

		//listen for Tab events
		this.initTabEvents();

		// check deep linking option
		this.initDeepLink();
	};

	Tab.prototype.initTabEvents = function() {
		var self = this;
		//click on a new tab -> select content
		this.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-tabs__trigger') ) self.triggerTab(event.target.closest('.js-tabs__trigger'), event);
		});
		//arrow keys to navigate through tabs 
		this.tabList.addEventListener('keydown', function(event) {
			;
			if( !event.target.closest('.js-tabs__trigger') ) return;
			if( tabNavigateNext(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('next');
			} else if( tabNavigatePrev(event, self.layout) ) {
				event.preventDefault();
				self.selectNewTab('prev');
			}
		});
	};

	Tab.prototype.selectNewTab = function(direction) {
		var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
			index = Util.getIndexInArray(this.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = this.listItems.length - 1;
		if(index >= this.listItems.length) index = 0;	
		this.triggerTab(this.triggers[index]);
		this.triggers[index].focus();
	};

	Tab.prototype.triggerTab = function(tabTrigger, event) {
		var self = this;
		event && event.preventDefault();	
		var index = Util.getIndexInArray(this.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(this.triggers[index].getAttribute('aria-selected') == 'true') return;
		
		Util.removeClass(this.element, 'tabs--no-interaction');
		
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == index);
			Util.toggleClass(this.panels[i], this.hideClass, !bool);
			if(this.customShowClass) Util.toggleClass(this.panels[i], this.customShowClass, bool);
			this.triggers[i].setAttribute('aria-selected', bool);
			bool ? this.triggers[i].setAttribute('tabindex', '0') : this.triggers[i].setAttribute('tabindex', '-1');
		}

		// update url if deepLink is on
		if(this.deepLinkOn) {
			history.replaceState(null, '', '#'+tabTrigger.getAttribute('aria-controls'));
		}
	};

	Tab.prototype.initDeepLink = function() {
		if(!this.deepLinkOn) return;
		var hash = window.location.hash.substr(1);
		var self = this;
		if(!hash || hash == '') return;
		for(var i = 0; i < this.panels.length; i++) {
			if(this.panels[i].getAttribute('id') == hash) {
				this.triggerTab(this.triggers[i], false);
				setTimeout(function(){self.panels[i].scrollIntoView(true);});
				break;
			}
		};
	};

	function tabNavigateNext(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 39 || event.key && event.key == 'ArrowRight')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 40 || event.key && event.key == 'ArrowDown')) {return true;}
		else {return false;}
	};

	function tabNavigatePrev(event, layout) {
		if(layout == 'horizontal' && (event.keyCode && event.keyCode == 37 || event.key && event.key == 'ArrowLeft')) {return true;}
		else if(layout == 'vertical' && (event.keyCode && event.keyCode == 38 || event.key && event.key == 'ArrowUp')) {return true;}
		else {return false;}
	};

	window.Tab = Tab;
	
	//initialize the Tab objects
	var tabs = document.getElementsByClassName('js-tabs');
	if( tabs.length > 0 ) {
		for( var i = 0; i < tabs.length; i++) {
			(function(i){new Tab(tabs[i]);})(i);
		}
	}
}());
// end Tech Content Tabs


// Modal - Article
! function () {
	var e = function (e) {
		this.element = e, this.triggers = document.querySelectorAll('[aria-controls="' + this.element.getAttribute("id") + '"]'), this.firstFocusable = null, this.lastFocusable = null, this.moveFocusEl = null, this.modalFocus = this.element.getAttribute("data-modal-first-focus") ? this.element.querySelector(this.element.getAttribute("data-modal-first-focus")) : null, this.selectedTrigger = null, this.preventScrollEl = this.getPreventScrollEl(), this.showClass = "modal--is-visible", this.initModal()
	};
  
	function s(e) {
		return e.offsetWidth || e.offsetHeight || e.getClientRects().length
	}
	e.prototype.getPreventScrollEl = function () {
		var e = !1,
			t = this.element.getAttribute("data-modal-prevent-scroll");
		return t && (e = document.querySelector(t)), e
	}, e.prototype.initModal = function () {
		var t = this;
		if (this.triggers)
			for (var e = 0; e < this.triggers.length; e++) this.triggers[e].addEventListener("click", function (e) {
				e.preventDefault(), t.element.classList.contains(t.showClass) ? t.closeModal() : (t.selectedTrigger = e.currentTarget, t.showModal(), t.initModalEvents())
			});
		this.element.addEventListener("openModal", function (e) {
			e.detail && (t.selectedTrigger = e.detail), t.showModal(), t.initModalEvents()
		}), this.element.addEventListener("closeModal", function (e) {
			e.detail && (t.selectedTrigger = e.detail), t.closeModal()
		}), this.element.classList.contains(this.showClass) && this.initModalEvents()
	}, e.prototype.showModal = function () {
		var s = this;
		this.element.classList.add(this.showClass), this.getFocusableElements(), this.moveFocusEl && (this.moveFocusEl.focus(), this.element.addEventListener("transitionend", function e(t) {
			s.moveFocusEl.focus(), s.element.removeEventListener("transitionend", e)
		})), this.emitModalEvents("modalIsOpen"), this.preventScrollEl && (this.preventScrollEl.style.overflow = "hidden")
	}, e.prototype.closeModal = function () {
		this.element.classList.contains(this.showClass) && (this.element.classList.remove(this.showClass), this.firstFocusable = null, this.lastFocusable = null, this.moveFocusEl = null, this.selectedTrigger && this.selectedTrigger.focus(), this.cancelModalEvents(), this.emitModalEvents("modalIsClose"), this.preventScrollEl && (this.preventScrollEl.style.overflow = ""))
	}, e.prototype.initModalEvents = function () {
		this.element.addEventListener("keydown", this), this.element.addEventListener("click", this)
	}, e.prototype.cancelModalEvents = function () {
		this.element.removeEventListener("keydown", this), this.element.removeEventListener("click", this)
	}, e.prototype.handleEvent = function (e) {
		switch (e.type) {
			case "click":
				this.initClick(e);
			case "keydown":
				this.initKeyDown(e)
		}
	}, e.prototype.initKeyDown = function (e) {
		e.keyCode && 9 == e.keyCode || e.key && "Tab" == e.key ? this.trapFocus(e) : (e.keyCode && 13 == e.keyCode || e.key && "Enter" == e.key) && e.target.closest(".js-modal__close") && (e.preventDefault(), this.closeModal())
	}, e.prototype.initClick = function (e) {
		(e.target.closest(".js-modal__close") || e.target.classList.contains("js-modal")) && (e.preventDefault(), this.closeModal())
	}, e.prototype.trapFocus = function (e) {
		this.firstFocusable == document.activeElement && e.shiftKey && (e.preventDefault(), this.lastFocusable.focus()), this.lastFocusable != document.activeElement || e.shiftKey || (e.preventDefault(), this.firstFocusable.focus())
	}, e.prototype.getFocusableElements = function () {
		var e = this.element.querySelectorAll(i);
		this.getFirstVisible(e), this.getLastVisible(e), this.getFirstFocusable()
	}, e.prototype.getFirstVisible = function (e) {
		for (var t = 0; t < e.length; t++)
			if (s(e[t])) {
				this.firstFocusable = e[t];
				break
			}
	}, e.prototype.getLastVisible = function (e) {
		for (var t = e.length - 1; 0 <= t; t--)
			if (s(e[t])) {
				this.lastFocusable = e[t];
				break
			}
	}, e.prototype.getFirstFocusable = function () {
		if (this.modalFocus && Element.prototype.matches)
			if (this.modalFocus.matches(i)) this.moveFocusEl = this.modalFocus;
			else {
				this.moveFocusEl = !1;
				for (var e = this.modalFocus.querySelectorAll(i), t = 0; t < e.length; t++)
					if (s(e[t])) {
						this.moveFocusEl = e[t];
						break
					} this.moveFocusEl || (this.moveFocusEl = this.firstFocusable)
			}
		else this.moveFocusEl = this.firstFocusable
	}, e.prototype.emitModalEvents = function (e) {
		var t = new CustomEvent(e, {
			detail: this.selectedTrigger
		});
		this.element.dispatchEvent(t)
	}, window.Modal = e;
	var t, o = document.getElementsByClassName("js-modal"),
		i = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if (0 < o.length) {
		for (var l = [], n = 0; n < o.length; n++) t = n, l.push(new e(o[t]));
		window.addEventListener("keydown", function (e) {
			if (e.keyCode && 27 == e.keyCode || e.key && "escape" == e.key.toLowerCase())
				for (var t = 0; t < l.length; t++) l[t].closeModal()
		})
	}
  }();


// start Navigation
! function () {
    var t = document.getElementsByClassName("js-anim-menu-btn");
    if (0 < t.length) {
        for (var i = 0; i < t.length; i++) ! function (e) {
            var n;
            (n = t[i]).addEventListener("click", function (e) {
                e.preventDefault();
                var t = !n.classList.contains("anim-menu-btn--state-b");
                n.classList.toggle("anim-menu-btn--state-b", t);
                var e = new CustomEvent("anim-menu-btn-clicked", {
                    detail: t
                });
                n.dispatchEvent(e)
            })
        }()
    }
}(),
function () {
    var a = document.getElementsByClassName("js-f-header");
    if (0 < a.length) {
        var n = a[0].getElementsByClassName("js-anim-menu-btn")[0],
            i = function () {
                for (var e = a[0].getElementsByClassName("f-header__nav")[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'), t = !1, n = 0; n < e.length; n++)
                    if (e[n].offsetWidth || e[n].offsetHeight || e[n].getClientRects().length) {
                        t = e[n];
                        break
                    } return t
            }(),
            r = !1;
        s(),
            function () {
                for (var e = a[0].getElementsByClassName("js-f-header__dropdown-control"), t = 0; t < e.length; t++) {
                    var n = "f-header-dropdown-" + t,
                        i = e[t].nextElementSibling;
                    i.hasAttribute("id") ? n = i.getAttribute("id") : i.setAttribute("id", n), e[t].setAttribute("aria-controls", n)
                }
            }(), n.addEventListener("anim-menu-btn-clicked", function (e) {
                var t;
                t = e.detail, document.getElementsByClassName("f-header__nav")[0].classList.toggle("f-header__nav--is-visible", t), a[0].classList.toggle("f-header--expanded", t), n.setAttribute("aria-expanded", t), t ? i.focus() : r && (r.focus(), r = !1)
            }), window.addEventListener("keyup", function (e) {
                (e.keyCode && 27 == e.keyCode || e.key && "escape" == e.key.toLowerCase()) && "true" == n.getAttribute("aria-expanded") && t(n) && (r = n).click(), (e.keyCode && 9 == e.keyCode || e.key && "tab" == e.key.toLowerCase()) && "true" == n.getAttribute("aria-expanded") && t(n) && !document.activeElement.closest(".js-f-header") && n.click()
            }), a[0].addEventListener("click", function (e) {
                var t = e.target.closest(".js-f-header__dropdown-control");
                t && (t.getAttribute("aria-expanded") ? t.removeAttribute("aria-expanded") : t.setAttribute("aria-expanded", "true"))
            }), a[0].addEventListener("mouseout", function (e) {
                var t = e.target.closest(".js-f-header__dropdown-control");
                t && "mobile" != d() && t.removeAttribute("aria-expanded")
            }), a[0].addEventListener("focusin", function (e) {
                var t = e.target.closest(".js-f-header__dropdown-control");
                if (!e.target.closest(".f-header__dropdown") && !(t && t.hasAttribute("aria-expanded") || "mobile" == d())) {
                    var n = a[0].querySelector('.js-f-header__dropdown-control[aria-expanded="true"]');
                    n && n.removeAttribute("aria-expanded")
                }
            });
        var e = !1;

        function t(e) {
            return e.offsetWidth || e.offsetHeight || e.getClientRects().length
        }

        function o() {
            !t(n) && a[0].classList.contains("f-header--expanded") && n.click(), s()
        }

        function s() {
            document.documentElement.style.setProperty("--f-header-offset", a[0].getBoundingClientRect().top + "px")
        }

        function d() {
            return getComputedStyle(a[0], ":before").getPropertyValue("content").replace(/\'|"/g, "")
        }
        window.addEventListener("resize", function () {
            clearTimeout(e), e = setTimeout(o, 500)
        })
    }
}(),
function () {
    var n = document.getElementsByClassName("js-hide-nav");
    if (0 < n.length && window.requestAnimationFrame) {
        var i = Array.prototype.filter.call(n, function (e) {
                return e.classList.contains("js-hide-nav--main")
            }),
            t = Array.prototype.filter.call(n, function (e) {
                return e.classList.contains("js-hide-nav--sub")
            }),
            a = !1,
            r = window.scrollY,
            o = window.scrollY,
            s = 150,
            d = 0,
            l = !1;
        0 < i.length && i[0].classList.contains("hide-nav--fixed") && (l = !0);
        var c = function () {
                var e = n[0].getAttribute("data-mobile-trigger");
                if (!e) return !1;
                if (0 == e.indexOf("#")) {
                    var t = document.getElementById(e.replace("#", ""));
                    if (t) return t
                } else {
                    var t = n[0].getElementsByClassName(e);
                    if (0 < t.length) return t[0]
                }
                return !1
            }(),
            e = function () {
                if (i.length < 1) return !1;
                var e = document.createElement("div");
                e.setAttribute("aria-hidden", "true"), i[0].parentElement.insertBefore(e, i[0]);
                var t = i[0].previousElementSibling;
                return t.style.opacity = "0", t
            }(),
            u = 0,
            f = n[0].getAttribute("data-nav-target-class"),
            m = [];

        function g() {
            d = i[0].offsetHeight
        }

        function v() {
            t.length < 1 || i.length < 1 || (t[0].style.top = d - 1 + "px")
        }

        function h() {
            !l || i.length < 1 || (i[0].style.marginBottom = "-" + d + "px")
        }

        function b() {
            if (10 < (o = window.scrollY) - r && s < o ? function () {
                    if (0 < t.length && t[0].getBoundingClientRect().top > d) return;
                    if (c && "true" == c.getAttribute("aria-expanded")) return;
                    !(0 < i.length) || f && function () {
                        for (var e = !1, t = 0; t < m.length; t++)
                            if (i[0].classList.contains(m[t].trim())) {
                                e = !0;
                                break
                            } return e
                    }() || (y(i[0], "-100%"), i[0].addEventListener("transitionend", w));
                    0 < t.length && y(t[0], "-" + d + "px")
                }() : 10 < r - o || 0 < r - o && o < s ? p() : 0 < r - o && 0 < t.length && 0 < t[0].getBoundingClientRect().top && y(t[0], "0%"), l) {
                var e = window.scrollY || window.pageYOffset;
                i[0].classList.toggle("hide-nav--has-bg", d + u < e)
            }
            r = o, a = !1
        }

        function p() {
            0 < i.length && (y(i[0], "0%"), i[0].classList.remove("hide-nav--off-canvas"), i[0].removeEventListener("transitionend", w)), 0 < t.length && y(t[0], "0%")
        }

        function w() {
            i[0].removeEventListener("transitionend", w), i[0].classList.add("hide-nav--off-canvas")
        }

        function y(e, t) {
            e.style.transform = "translateY(" + t + ")"
        }

        function E() {
            e && (u = e.getBoundingClientRect().top + window.scrollY)
        }
        f && (m = f.split(" ")), E(), 0 < u && (s += u), g(), v(), h(), b(), window.addEventListener("scroll", function (e) {
            a || (a = !0, window.requestAnimationFrame(b))
        }), window.addEventListener("resize", function (e) {
            a || (a = !0, window.requestAnimationFrame(function () {
                0 < d && (E(), g(), v(), h()), p(), a = !1
            }))
        })
    } else {
        if ((i = document.getElementsByClassName("js-hide-nav--main")).length < 1) return;
        i[0].classList.contains("hide-nav--fixed") && i[0].classList.add("hide-nav--has-bg")
    }
}();
// end Navigation


}());