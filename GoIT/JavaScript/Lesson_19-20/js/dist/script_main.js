jQuery(document).ready(function() {
	function close_accordion_section() {
		jQuery('.accordion .accordion-section-title').removeClass('active');
		jQuery('.accordion .accordion-section-content').slideUp(300).removeClass('open');
	}

	jQuery('.accordion-section-title').click(function(e) {
		// Grab current anchor value
		var currentAttrValue = jQuery(this).attr('href');

		if(jQuery(e.target).is('.active')) {
			close_accordion_section();
		}else {
			close_accordion_section();

			// Add active class to section title
			jQuery(this).addClass('active');
			// Open up the hidden content panel
			jQuery('.accordion ' + currentAttrValue).slideDown(300).addClass('open'); 
		}

		e.preventDefault();
	});
});;/*
 * jQuery FlexSlider v2.6.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  var focused = true;

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // depricating this idea, as devices are being released with both of these events
        eventType = "click touchend MSPointerUp keyup",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {};

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
        if ( isNaN( slider.currentSlide ) ) { slider.currentSlide = 0; }
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") { slider.vars.animation = "swing"; }
        slider.prop = (vertical) ? "top" : "marginLeft";
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        slider.ensureAnimationEnd = '';
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // CUSTOM DIRECTION NAV:
        if (slider.vars.customDirectionNav !== "") slider.customDirectionNav = $(slider.vars.customDirectionNav).length === 2 && $(slider.vars.customDirectionNav);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) { methods.controlNav.setup(); }

        // DIRECTIONNAV:
        if (slider.vars.directionNav) { methods.directionNav.setup(); }

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (keycode === 39) ? slider.getTarget('next') :
                           (keycode === 37) ? slider.getTarget('prev') : false;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) { methods.pausePlay.setup(); }

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) { methods.pauseInvisible.init(); }

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) { slider.pause(); }
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) { slider.play(); }
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) { methods.asNav.setup(); }

        // TOUCH
        if (touch && slider.vars.touch) { methods.touch(); }

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) { $(window).bind("resize orientationchange focus", methods.resize); }

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.on(eventType, function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture) {
                        e.currentTarget._gesture.addPointer(e.pointerId);
                      }
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);
              if ( undefined === slide.attr( 'data-thumb-alt' ) ) { slide.attr( 'data-thumb-alt', '' ); }
              altText = ( '' !== slide.attr( 'data-thumb-alt' ) ) ? altText = ' alt="' + slide.attr( 'data-thumb-alt' ) + '"' : '';
              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slide.attr( 'data-thumb' ) + '"' + altText + '/>' : '<a href="#">' + j + '</a>';
              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' !== captn && undefined !== captn ) { item += '<span class="' + namespace + 'caption">' + captn + '</span>'; }
              }
              slider.controlNavScaffold.append('<li>' + item + '</li>');
              j++;
            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a href="#">' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li class="' + namespace + 'nav-prev"><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li class="' + namespace + 'nav-next"><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

          // CUSTOM DIRECTION NAV:
          if (slider.customDirectionNav) {
            slider.directionNav = slider.customDirectionNav;
          // CONTROLSCONTAINER:
          } else if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a href="#"></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          onTouchStart,
          onTouchMove,
          onTouchEnd,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            onTouchStart = function(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;

                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            };

            onTouchMove = function(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : startX - localX;
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            };

            onTouchEnd = function(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            };

            el.addEventListener('touchstart', onTouchStart, false);
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) { slider.doMath(); }

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      uniqueID: function($clone) {
        // Append _clone to current level and children elements with id attributes
        $clone.filter( '[id]' ).add($clone.find( '[id]' )).each(function() {
          var $this = $(this);
          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
        });
        return $clone;
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var visProp = methods.pauseInvisible.getHiddenProp();
          if (visProp) {
            var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) {
                  clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                } else {
                  slider.pause(); //Or just pause
                }
              }
              else {
                if(slider.started) {
                  slider.play(); //Initiated before, just play
                } else {
                  if (slider.vars.initDelay > 0) {
                    setTimeout(slider.play, slider.vars.initDelay);
                  } else {
                    slider.play(); //Didn't init before: simply init or wait for it
                  }
                }
              }
            });
          }
        },
        isHidden: function() {
          var prop = methods.pauseInvisible.getHiddenProp();
          if (!prop) {
            return false;
          }
          return document[prop];
        },
        getHiddenProp: function() {
          var prefixes = ['webkit','moz','ms','o'];
          // if 'hidden' is natively supported just return it
          if ('hidden' in document) {
            return 'hidden';
          }
          // otherwise loop over all the known prefixes until we find one
          for ( var i = 0; i < prefixes.length; i++ ) {
              if ((prefixes[i] + 'Hidden') in document) {
                return prefixes[i] + 'Hidden';
              }
          }
          // otherwise it's not supported
          return null;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    };

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) { slider.pause(); }

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) { methods.sync("animate"); }

        // CONTROLNAV
        if (slider.vars.controlNav) { methods.controlNav.active(); }

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) { slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide'); }

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) { methods.directionNav.update(); }

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) { slider.pause(); }
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }

            // Unbind previous transitionEnd events and re-bind new transitionEnd event
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              clearTimeout(slider.ensureAnimationEnd);
              slider.wrapup(dimension);
            });

            // Insurance for the ever-so-fickle transitionEnd event
            clearTimeout(slider.ensureAnimationEnd);
            slider.ensureAnimationEnd = setTimeout(function() {
              slider.wrapup(dimension);
            }, slider.vars.animationSpeed + 100);

          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) { methods.smoothHeight(slider.vars.animationSpeed); }
      }
    };
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    };

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) { slider.flexAnimate(slider.getTarget("next")); }
    };
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) { methods.pausePlay.update("play"); }
      // SYNC:
      if (slider.syncExists) { methods.sync("pause"); }
    };
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) { clearInterval(slider.animatedSlides); }
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) { methods.pausePlay.update("pause"); }
      // SYNC:
      if (slider.syncExists) { methods.sync("play"); }
    };
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    };
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    };
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    };

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * -1) + "px";
          }());

      if (slider.transitions) {
        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
         slider.container.css("transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) { slider.container.css(slider.args); }

      slider.container.css('transform',target);
    };

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") { slider.container.find('.clone').remove(); }
          slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass('clone')).attr('aria-hidden', 'true'))
                          .prepend(methods.uniqueID(slider.slides.last().clone().addClass('clone')).attr('aria-hidden', 'true'));
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
            slider.newSlides.css({"width": slider.computedW, "marginRight" : slider.computedM, "float": "left", "display": "block"});
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            if (slider.vars.fadeFirstSlide == false) {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).css({"opacity": 1});
            } else {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
            }
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) { methods.smoothHeight(); }
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) { slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide"); }

      //FlexSlider: init() Callback
      slider.vars.init(slider);
    };

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.itemM = slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.itemM = slideMargin;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
      slider.computedM = slider.itemM;
    };

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) { methods.directionNav.update(); }

    };

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    };
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    };

    //FlexSlider: Initialize
    methods.init();
  };

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 900,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    fadeFirstSlide: true,           //Boolean: Fade in the first slide when animation type is "fade"
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,   		//{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    customDirectionNav: "",         //{NEW} jQuery Object/Selector: Custom prev / next button. Must be two jQuery elements. In order to make the events work they have to have the classes "prev" and "next" (plus namespace)
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function() {}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  };

  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) { options = {}; }

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) { options.start($this); }
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") { $slider.flexAnimate(options, true); }
      }
    }
  };
})(jQuery);
;/**
 * @license
 * lodash 4.6.1 (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash -o ./dist/lodash.js`
 */
;(function(){function n(n,t){return n.set(t[0],t[1]),n}function t(n,t){return n.add(t),n}function r(n,t,r){switch(r.length){case 0:return n.call(t);case 1:return n.call(t,r[0]);case 2:return n.call(t,r[0],r[1]);case 3:return n.call(t,r[0],r[1],r[2])}return n.apply(t,r)}function e(n,t,r,e){for(var u=-1,o=n.length;++u<o;){var i=n[u];t(e,i,r(i),n)}return e}function u(n,t){for(var r=-1,e=n.length;++r<e&&false!==t(n[r],r,n););return n}function o(n,t){for(var r=-1,e=n.length;++r<e;)if(!t(n[r],r,n))return false;
return true}function i(n,t){for(var r=-1,e=n.length,u=0,o=[];++r<e;){var i=n[r];t(i,r,n)&&(o[u++]=i)}return o}function f(n,t){return!!n.length&&-1<d(n,t,0)}function c(n,t,r){for(var e=-1,u=n.length;++e<u;)if(r(t,n[e]))return true;return false}function a(n,t){for(var r=-1,e=n.length,u=Array(e);++r<e;)u[r]=t(n[r],r,n);return u}function l(n,t){for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];return n}function s(n,t,r,e){var u=-1,o=n.length;for(e&&o&&(r=n[++u]);++u<o;)r=t(r,n[u],u,n);return r}function h(n,t,r,e){
var u=n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r}function p(n,t){for(var r=-1,e=n.length;++r<e;)if(t(n[r],r,n))return true;return false}function _(n,t,r){for(var e=-1,u=n.length;++e<u;){var o=n[e],i=t(o);if(null!=i&&(f===q?i===i:r(i,f)))var f=i,c=o}return c}function v(n,t,r,e){var u;return r(n,function(n,r,o){return t(n,r,o)?(u=e?r:n,false):void 0}),u}function g(n,t,r){for(var e=n.length,u=r?e:-1;r?u--:++u<e;)if(t(n[u],u,n))return u;return-1}function d(n,t,r){if(t!==t)return C(n,r);--r;for(var e=n.length;++r<e;)if(n[r]===t)return r;
return-1}function y(n,t,r,e){--r;for(var u=n.length;++r<u;)if(e(n[r],t))return r;return-1}function b(n,t,r,e,u){return u(n,function(n,u,o){r=e?(e=false,n):t(r,n,u,o)}),r}function x(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].c;return n}function j(n,t){for(var r,e=-1,u=n.length;++e<u;){var o=t(n[e]);o!==q&&(r=r===q?o:r+o)}return r}function m(n,t){for(var r=-1,e=Array(n);++r<n;)e[r]=t(r);return e}function w(n,t){return a(t,function(t){return[t,n[t]]})}function A(n){return function(t){return n(t)};
}function O(n,t){return a(t,function(t){return n[t]})}function k(n,t){for(var r=-1,e=n.length;++r<e&&-1<d(t,n[r],0););return r}function E(n,t){for(var r=n.length;r--&&-1<d(t,n[r],0););return r}function I(n){return n&&n.Object===Object?n:null}function S(n,t){if(n!==t){var r=null===n,e=n===q,u=n===n,o=null===t,i=t===q,f=t===t;if(n>t&&!o||!u||r&&!i&&f||e&&f)return 1;if(t>n&&!r||!f||o&&!e&&u||i&&u)return-1}return 0}function R(n){return zn[n]}function W(n){return Mn[n]}function B(n){return"\\"+Fn[n]}function C(n,t,r){
var e=n.length;for(t+=r?0:-1;r?t--:++t<e;){var u=n[t];if(u!==u)return t}return-1}function U(n){var t=false;if(null!=n&&typeof n.toString!="function")try{t=!!(n+"")}catch(r){}return t}function z(n,t){return n=typeof n=="number"||bn.test(n)?+n:-1,n>-1&&0==n%1&&(null==t?9007199254740991:t)>n}function M(n){for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r}function L(n){var t=-1,r=Array(n.size);return n.forEach(function(n,e){r[++t]=[e,n]}),r}function $(n,t){for(var r=-1,e=n.length,u=0,o=[];++r<e;){
var i=n[r];i!==t&&"__lodash_placeholder__"!==i||(n[r]="__lodash_placeholder__",o[u++]=r)}return o}function F(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=n}),r}function N(n){if(!n||!In.test(n))return n.length;for(var t=En.lastIndex=0;En.test(n);)t++;return t}function D(n){return Ln[n]}function Z(I){function bn(n){if(we(n)&&!qo(n)&&!(n instanceof On)){if(n instanceof An)return n;if(lu.call(n,"__wrapped__"))return Pr(n)}return new An(n)}function wn(){}function An(n,t){this.__wrapped__=n,
this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=q}function On(n){this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=false,this.__iteratees__=[],this.__takeCount__=4294967295,this.__views__=[]}function zn(){}function Mn(n){var t=-1,r=n?n.length:0;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Ln(n){var t=-1,r=n?n.length:0;for(this.__data__=new Mn;++t<r;)this.push(n[t])}function $n(n,t){var r=n.__data__;return $r(t)?(r=r.__data__,"__lodash_hash_undefined__"===(typeof t=="string"?r.string:r.hash)[t]):r.has(t);
}function Fn(n){var t=-1,r=n?n.length:0;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Zn(n,t){var r=Tn(n,t);return 0>r?false:(r==n.length-1?n.pop():Iu.call(n,r,1),true)}function qn(n,t){var r=Tn(n,t);return 0>r?q:n[r][1]}function Tn(n,t){for(var r=n.length;r--;)if(pe(n[r][0],t))return r;return-1}function Kn(n,t,r){var e=Tn(n,t);0>e?n.push([t,r]):n[e][1]=r}function Gn(n,t,r,e){return n===q||pe(n,cu[r])&&!lu.call(e,r)?t:n}function Yn(n,t,r){(r===q||pe(n[t],r))&&(typeof t!="number"||r!==q||t in n)||(n[t]=r);
}function Hn(n,t,r){var e=n[t];lu.call(n,t)&&pe(e,r)&&(r!==q||t in n)||(n[t]=r)}function Qn(n,t,r,e){return Qu(n,function(n,u,o){t(e,n,r(n),o)}),e}function Xn(n,t){return n&&tr(t,De(t),n)}function nt(n,t){for(var r=-1,e=null==n,u=t.length,o=Array(u);++r<u;)o[r]=e?q:$e(n,t[r]);return o}function tt(n){return de(n)?n:[]}function rt(n){return typeof n=="function"?n:Ye}function et(n){return qo(n)?n:qr(n)}function ut(n,t,r){return n===n&&(r!==q&&(n=n>r?r:n),t!==q&&(n=t>n?t:n)),n}function ot(n,t,r,e,o,i,f){
var c;if(e&&(c=i?e(n,o,i,f):e(n)),c!==q)return c;if(!me(n))return n;if(o=qo(n)){if(c=Br(n),!t)return nr(n,c)}else{var a=Rr(n),l="[object Function]"==a||"[object GeneratorFunction]"==a;if(Po(n))return Yt(n,t);if("[object Object]"==a||"[object Arguments]"==a||l&&!i){if(U(n))return i?n:{};if(c=Cr(l?{}:n),!t)return c=Xn(c,n),r?er(n,c):c}else{if(!Un[a])return i?n:{};c=Ur(n,a,t)}}return f||(f=new Fn),(i=f.get(n))?i:(f.set(n,c),(o?u:_t)(n,function(u,o){Hn(c,o,ot(u,t,r,e,o,n,f))}),r&&!o?er(n,c):c)}function it(n){
var t=De(n),r=t.length;return function(e){if(null==e)return!r;for(var u=r;u--;){var o=t[u],i=n[o],f=e[o];if(f===q&&!(o in Object(e))||!i(f))return false}return true}}function ft(n){return me(n)?Ou(n):{}}function ct(n,t,r){if(typeof n!="function")throw new iu("Expected a function");return Eu(function(){n.apply(q,r)},t)}function at(n,t,r,e){var u=-1,o=f,i=true,l=n.length,s=[],h=t.length;if(!l)return s;r&&(t=a(t,A(r))),e?(o=c,i=false):t.length>=200&&(o=$n,i=false,t=new Ln(t));n:for(;++u<l;){var p=n[u],_=r?r(p):p;if(i&&_===_){
for(var v=h;v--;)if(t[v]===_)continue n;s.push(p)}else o(t,_,e)||s.push(p)}return s}function lt(n,t){var r=true;return Qu(n,function(n,e,u){return r=!!t(n,e,u)}),r}function st(n,t){var r=[];return Qu(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function ht(n,t,r,e){e||(e=[]);for(var u=-1,o=n.length;++u<o;){var i=n[u];t>0&&de(i)&&(r||qo(i)||ve(i))?t>1?ht(i,t-1,r,e):l(e,i):r||(e[e.length]=i)}return e}function pt(n,t){null==n||no(n,t,Ze)}function _t(n,t){return n&&no(n,t,De)}function vt(n,t){return n&&to(n,t,De);
}function gt(n,t){return i(t,function(t){return be(n[t])})}function dt(n,t){t=Lr(t,n)?[t+""]:et(t);for(var r=0,e=t.length;null!=n&&e>r;)n=n[t[r++]];return r&&r==e?n:q}function yt(n,t){return lu.call(n,t)||typeof n=="object"&&t in n&&null===mu(n)}function bt(n,t){return t in Object(n)}function xt(n,t,r){for(var e=r?c:f,u=n[0].length,o=n.length,i=o,l=Array(o),s=1/0,h=[];i--;){var p=n[i];i&&t&&(p=a(p,A(t))),s=zu(p.length,s),l[i]=r||!t&&(120>u||120>p.length)?q:new Ln(i&&p)}var p=n[0],_=-1,v=l[0];n:for(;++_<u&&s>h.length;){
var g=p[_],d=t?t(g):g;if(v?!$n(v,d):!e(h,d,r)){for(i=o;--i;){var y=l[i];if(y?!$n(y,d):!e(n[i],d,r))continue n}v&&v.push(d),h.push(g)}}return h}function jt(n,t,r){var e={};return _t(n,function(n,u,o){t(e,r(n),u,o)}),e}function mt(n,t,e){return Lr(t,n)||(t=et(t),n=Zr(n,t),t=Vr(t)),t=null==n?n:n[t],null==t?q:r(t,n,e)}function wt(n,t,r,e,u){if(n===t)n=true;else if(null==n||null==t||!me(n)&&!we(t))n=n!==n&&t!==t;else n:{var o=qo(n),i=qo(t),f="[object Array]",c="[object Array]";o||(f=Rr(n),f="[object Arguments]"==f?"[object Object]":f),
i||(c=Rr(t),c="[object Arguments]"==c?"[object Object]":c);var a="[object Object]"==f&&!U(n),i="[object Object]"==c&&!U(t);if((c=f==c)&&!a)u||(u=new Fn),n=o||Re(n)?wr(n,t,wt,r,e,u):Ar(n,t,f,wt,r,e,u);else{if(!(2&e)&&(o=a&&lu.call(n,"__wrapped__"),f=i&&lu.call(t,"__wrapped__"),o||f)){u||(u=new Fn),n=wt(o?n.value():n,f?t.value():t,r,e,u);break n}if(c)t:if(u||(u=new Fn),o=2&e,f=De(n),i=f.length,c=De(t).length,i==c||o){for(a=i;a--;){var l=f[a];if(!(o?l in t:yt(t,l))){n=false;break t}}if(c=u.get(n))n=c==t;else{
c=true,u.set(n,t);for(var s=o;++a<i;){var l=f[a],h=n[l],p=t[l];if(r)var _=o?r(p,h,l,t,n,u):r(h,p,l,n,t,u);if(_===q?h!==p&&!wt(h,p,r,e,u):!_){c=false;break}s||(s="constructor"==l)}c&&!s&&(r=n.constructor,e=t.constructor,r!=e&&"constructor"in n&&"constructor"in t&&!(typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)&&(c=false)),u["delete"](n),n=c}}else n=false;else n=false}}return n}function At(n,t,r,e){var u=r.length,o=u,i=!e;if(null==n)return!o;for(n=Object(n);u--;){var f=r[u];if(i&&f[2]?f[1]!==n[f[0]]:!(f[0]in n))return false;
}for(;++u<o;){var f=r[u],c=f[0],a=n[c],l=f[1];if(i&&f[2]){if(a===q&&!(c in n))return false}else if(f=new Fn,c=e?e(a,l,c,n,t,f):q,c===q?!wt(l,a,e,3,f):!c)return false}return true}function Ot(n){var t=typeof n;return"function"==t?n:null==n?Ye:"object"==t?qo(n)?St(n[0],n[1]):It(n):nu(n)}function kt(n){n=null==n?n:Object(n);var t,r=[];for(t in n)r.push(t);return r}function Et(n,t){var r=-1,e=ge(n)?Array(n.length):[];return Qu(n,function(n,u,o){e[++r]=t(n,u,o)}),e}function It(n){var t=Er(n);if(1==t.length&&t[0][2]){
var r=t[0][0],e=t[0][1];return function(n){return null==n?false:n[r]===e&&(e!==q||r in Object(n))}}return function(r){return r===n||At(r,n,t)}}function St(n,t){return function(r){var e=$e(r,n);return e===q&&e===t?Ne(r,n):wt(t,e,q,3)}}function Rt(n,t,r,e,o){if(n!==t){var i=qo(t)||Re(t)?q:Ze(t);u(i||t,function(u,f){if(i&&(f=u,u=t[f]),me(u)){o||(o=new Fn);var c=f,a=o,l=n[c],s=t[c],h=a.get(s);if(h)Yn(n,c,h);else{var h=e?e(l,s,c+"",n,t,a):q,p=h===q;p&&(h=s,qo(s)||Re(s)?qo(l)?h=l:de(l)?h=nr(l):(p=false,h=ot(s,!e)):ke(s)||ve(s)?ve(l)?h=Me(l):!me(l)||r&&be(l)?(p=false,
h=ot(s,!e)):h=l:p=false),a.set(s,h),p&&Rt(h,s,r,e,a),a["delete"](s),Yn(n,c,h)}}else c=e?e(n[f],u,f+"",n,t,o):q,c===q&&(c=u),Yn(n,f,c)})}}function Wt(n,t,r){var e=-1;return t=a(t.length?t:Array(1),kr()),n=Et(n,function(n){return{a:a(t,function(t){return t(n)}),b:++e,c:n}}),x(n,function(n,t){var e;n:{e=-1;for(var u=n.a,o=t.a,i=u.length,f=r.length;++e<i;){var c=S(u[e],o[e]);if(c){e=f>e?c*("desc"==r[e]?-1:1):c;break n}}e=n.b-t.b}return e})}function Bt(n,t){return n=Object(n),s(t,function(t,r){return r in n&&(t[r]=n[r]),
t},{})}function Ct(n,t){var r={};return pt(n,function(n,e){t(n,e)&&(r[e]=n)}),r}function Ut(n){return function(t){return null==t?q:t[n]}}function zt(n){return function(t){return dt(t,n)}}function Mt(n,t,r,e){var u=e?y:d,o=-1,i=t.length,f=n;for(r&&(f=a(n,A(r)));++o<i;)for(var c=0,l=t[o],l=r?r(l):l;-1<(c=u(f,l,c,e));)f!==n&&Iu.call(f,c,1),Iu.call(n,c,1);return n}function Lt(n,t){for(var r=n?t.length:0,e=r-1;r--;){var u=t[r];if(e==r||u!=o){var o=u;if(z(u))Iu.call(n,u,1);else if(Lr(u,n))delete n[u];else{
var u=et(u),i=Zr(n,u);null!=i&&delete i[Vr(u)]}}}}function $t(n,t){return n+Ru(Lu()*(t-n+1))}function Ft(n,t,r,e){t=Lr(t,n)?[t+""]:et(t);for(var u=-1,o=t.length,i=o-1,f=n;null!=f&&++u<o;){var c=t[u];if(me(f)){var a=r;if(u!=i){var l=f[c],a=e?e(l,c,f):q;a===q&&(a=null==l?z(t[u+1])?[]:{}:l)}Hn(f,c,a)}f=f[c]}return n}function Nt(n,t,r){var e=-1,u=n.length;for(0>t&&(t=-t>u?0:u+t),r=r>u?u:r,0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,r=Array(u);++e<u;)r[e]=n[e+t];return r}function Dt(n,t){var r;return Qu(n,function(n,e,u){
return r=t(n,e,u),!r}),!!r}function Zt(n,t,r){var e=0,u=n?n.length:e;if(typeof t=="number"&&t===t&&2147483647>=u){for(;u>e;){var o=e+u>>>1,i=n[o];(r?t>=i:t>i)&&null!==i?e=o+1:u=o}return u}return qt(n,t,Ye,r)}function qt(n,t,r,e){t=r(t);for(var u=0,o=n?n.length:0,i=t!==t,f=null===t,c=t===q;o>u;){var a=Ru((u+o)/2),l=r(n[a]),s=l!==q,h=l===l;(i?h||e:f?h&&s&&(e||null!=l):c?h&&(e||s):null==l?0:e?t>=l:t>l)?u=a+1:o=a}return zu(o,4294967294)}function Pt(n,t){for(var r=0,e=n.length,u=n[0],o=t?t(u):u,i=o,f=1,c=[u];++r<e;)u=n[r],
o=t?t(u):u,pe(o,i)||(i=o,c[f++]=u);return c}function Tt(n,t,r){var e=-1,u=f,o=n.length,i=true,a=[],l=a;if(r)i=false,u=c;else if(o<200)l=t?[]:a;else{if(u=t?null:eo(n))return F(u);i=false,u=$n,l=new Ln}n:for(;++e<o;){var s=n[e],h=t?t(s):s;if(i&&h===h){for(var p=l.length;p--;)if(l[p]===h)continue n;t&&l.push(h),a.push(s)}else u(l,h,r)||(l!==a&&l.push(h),a.push(s))}return a}function Kt(n,t,r,e){for(var u=n.length,o=e?u:-1;(e?o--:++o<u)&&t(n[o],o,n););return r?Nt(n,e?0:o,e?o+1:u):Nt(n,e?o+1:0,e?u:o)}function Gt(n,t){
var r=n;return r instanceof On&&(r=r.value()),s(t,function(n,t){return t.func.apply(t.thisArg,l([n],t.args))},r)}function Vt(n,t,r){for(var e=-1,u=n.length;++e<u;)var o=o?l(at(o,n[e],t,r),at(n[e],o,t,r)):n[e];return o&&o.length?Tt(o,t,r):[]}function Jt(n,t,r){for(var e=-1,u=n.length,o=t.length,i={};++e<u;)r(i,n[e],o>e?t[e]:q);return i}function Yt(n,t){if(t)return n.slice();var r=new n.constructor(n.length);return n.copy(r),r}function Ht(n){var t=new n.constructor(n.byteLength);return new bu(t).set(new bu(n)),
t}function Qt(n,t,r,e){var u=-1,o=n.length,i=r.length,f=-1,c=t.length,a=Uu(o-i,0),l=Array(c+a);for(e=!e;++f<c;)l[f]=t[f];for(;++u<i;)(e||o>u)&&(l[r[u]]=n[u]);for(;a--;)l[f++]=n[u++];return l}function Xt(n,t,r,e){var u=-1,o=n.length,i=-1,f=r.length,c=-1,a=t.length,l=Uu(o-f,0),s=Array(l+a);for(e=!e;++u<l;)s[u]=n[u];for(l=u;++c<a;)s[l+c]=t[c];for(;++i<f;)(e||o>u)&&(s[l+r[i]]=n[u++]);return s}function nr(n,t){var r=-1,e=n.length;for(t||(t=Array(e));++r<e;)t[r]=n[r];return t}function tr(n,t,r){return rr(n,t,r);
}function rr(n,t,r,e){r||(r={});for(var u=-1,o=t.length;++u<o;){var i=t[u],f=e?e(r[i],n[i],i,r,n):n[i];Hn(r,i,f)}return r}function er(n,t){return tr(n,io(n),t)}function ur(n,t){return function(r,u){var o=qo(r)?e:Qn,i=t?t():{};return o(r,n,kr(u),i)}}function or(n){return he(function(t,r){var e=-1,u=r.length,o=u>1?r[u-1]:q,i=u>2?r[2]:q,o=typeof o=="function"?(u--,o):q;for(i&&Mr(r[0],r[1],i)&&(o=3>u?q:o,u=1),t=Object(t);++e<u;)(i=r[e])&&n(t,i,e,o);return t})}function ir(n,t){return function(r,e){if(null==r)return r;
if(!ge(r))return n(r,e);for(var u=r.length,o=t?u:-1,i=Object(r);(t?o--:++o<u)&&false!==e(i[o],o,i););return r}}function fr(n){return function(t,r,e){var u=-1,o=Object(t);e=e(t);for(var i=e.length;i--;){var f=e[n?i:++u];if(false===r(o[f],f,o))break}return t}}function cr(n,t,r){function e(){return(this&&this!==Vn&&this instanceof e?o:n).apply(u?r:this,arguments)}var u=1&t,o=sr(n);return e}function ar(n){return function(t){t=Le(t);var r=In.test(t)?t.match(En):q,e=r?r[0]:t.charAt(0);return t=r?r.slice(1).join(""):t.slice(1),
e[n]()+t}}function lr(n){return function(t){return s(Ve(Ke(t)),n,"")}}function sr(n){return function(){var t=arguments;switch(t.length){case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var r=ft(n.prototype),t=n.apply(r,t);return me(t)?t:r}}function hr(n,t,e){
function u(){for(var i=arguments.length,f=Array(i),c=i,a=Sr(u);c--;)f[c]=arguments[c];return c=3>i&&f[0]!==a&&f[i-1]!==a?[]:$(f,a),i-=c.length,e>i?xr(n,t,_r,u.placeholder,q,f,c,q,q,e-i):r(this&&this!==Vn&&this instanceof u?o:n,this,f)}var o=sr(n);return u}function pr(n){return he(function(t){t=ht(t,1);var r=t.length,e=r,u=An.prototype.thru;for(n&&t.reverse();e--;){var o=t[e];if(typeof o!="function")throw new iu("Expected a function");if(u&&!i&&"wrapper"==Or(o))var i=new An([],true)}for(e=i?e:r;++e<r;)var o=t[e],u=Or(o),f="wrapper"==u?uo(o):q,i=f&&Fr(f[0])&&424==f[1]&&!f[4].length&&1==f[9]?i[Or(f[0])].apply(i,f[3]):1==o.length&&Fr(o)?i[u]():i.thru(o);
return function(){var n=arguments,e=n[0];if(i&&1==n.length&&qo(e)&&e.length>=200)return i.plant(e).value();for(var u=0,n=r?t[u].apply(this,n):e;++u<r;)n=t[u].call(this,n);return n}})}function _r(n,t,r,e,u,o,i,f,c,a){function l(){for(var d=arguments.length,y=d,b=Array(d);y--;)b[y]=arguments[y];if(_){var x,j=Sr(l),y=b.length;for(x=0;y--;)b[y]===j&&x++}if(e&&(b=Qt(b,e,u,_)),o&&(b=Xt(b,o,i,_)),d-=x,_&&a>d)return j=$(b,j),xr(n,t,_r,l.placeholder,r,b,j,f,c,a-d);if(j=h?r:this,y=p?j[n]:n,d=b.length,f){x=b.length;
for(var m=zu(f.length,x),w=nr(b);m--;){var A=f[m];b[m]=z(A,x)?w[A]:q}}else v&&d>1&&b.reverse();return s&&d>c&&(b.length=c),this&&this!==Vn&&this instanceof l&&(y=g||sr(y)),y.apply(j,b)}var s=128&t,h=1&t,p=2&t,_=24&t,v=512&t,g=p?q:sr(n);return l}function vr(n,t){return function(r,e){return jt(r,n,t(e))}}function gr(n){return he(function(t){return t=a(ht(t,1),kr()),he(function(e){var u=this;return n(t,function(n){return r(n,u,e)})})})}function dr(n,t,r){return t=Ce(t),n=N(n),t&&t>n?(t-=n,r=r===q?" ":r+"",
n=Ge(r,Su(t/N(r))),In.test(r)?n.match(En).slice(0,t).join(""):n.slice(0,t)):""}function yr(n,t,e,u){function o(){for(var t=-1,c=arguments.length,a=-1,l=u.length,s=Array(l+c),h=this&&this!==Vn&&this instanceof o?f:n;++a<l;)s[a]=u[a];for(;c--;)s[a++]=arguments[++t];return r(h,i?e:this,s)}var i=1&t,f=sr(n);return o}function br(n){return function(t,r,e){e&&typeof e!="number"&&Mr(t,r,e)&&(r=e=q),t=ze(t),t=t===t?t:0,r===q?(r=t,t=0):r=ze(r)||0,e=e===q?r>t?1:-1:ze(e)||0;var u=-1;r=Uu(Su((r-t)/(e||1)),0);for(var o=Array(r);r--;)o[n?r:++u]=t,
t+=e;return o}}function xr(n,t,r,e,u,o,i,f,c,a){var l=8&t;f=f?nr(f):q;var s=l?i:q;i=l?q:i;var h=l?o:q;return o=l?q:o,t=(t|(l?32:64))&~(l?64:32),4&t||(t&=-4),t=[n,t,u,h,s,o,i,f,c,a],r=r.apply(q,t),Fr(n)&&fo(r,t),r.placeholder=e,r}function jr(n){var t=uu[n];return function(n,r){if(n=ze(n),r=Ce(r)){var e=(Le(n)+"e").split("e"),e=t(e[0]+"e"+(+e[1]+r)),e=(Le(e)+"e").split("e");return+(e[0]+"e"+(+e[1]-r))}return t(n)}}function mr(n,t,r,e,u,o,i,f){var c=2&t;if(!c&&typeof n!="function")throw new iu("Expected a function");
var a=e?e.length:0;if(a||(t&=-97,e=u=q),i=i===q?i:Uu(Ce(i),0),f=f===q?f:Ce(f),a-=u?u.length:0,64&t){var l=e,s=u;e=u=q}var h=c?q:uo(n);return o=[n,t,r,e,u,l,s,o,i,f],h&&(r=o[1],n=h[1],t=r|n,e=128==n&&8==r||128==n&&256==r&&h[8]>=o[7].length||384==n&&h[8]>=h[7].length&&8==r,131>t||e)&&(1&n&&(o[2]=h[2],t|=1&r?0:4),(r=h[3])&&(e=o[3],o[3]=e?Qt(e,r,h[4]):nr(r),o[4]=e?$(o[3],"__lodash_placeholder__"):nr(h[4])),(r=h[5])&&(e=o[5],o[5]=e?Xt(e,r,h[6]):nr(r),o[6]=e?$(o[5],"__lodash_placeholder__"):nr(h[6])),(r=h[7])&&(o[7]=nr(r)),
128&n&&(o[8]=null==o[8]?h[8]:zu(o[8],h[8])),null==o[9]&&(o[9]=h[9]),o[0]=h[0],o[1]=t),n=o[0],t=o[1],r=o[2],e=o[3],u=o[4],f=o[9]=null==o[9]?c?0:n.length:Uu(o[9]-a,0),!f&&24&t&&(t&=-25),(h?ro:fo)(t&&1!=t?8==t||16==t?hr(n,t,f):32!=t&&33!=t||u.length?_r.apply(q,o):yr(n,t,r,e):cr(n,t,r),o)}function wr(n,t,r,e,u,o){var i=-1,f=2&u,c=1&u,a=n.length,l=t.length;if(!(a==l||f&&l>a))return false;if(l=o.get(n))return l==t;for(l=true,o.set(n,t);++i<a;){var s=n[i],h=t[i];if(e)var _=f?e(h,s,i,t,n,o):e(s,h,i,n,t,o);if(_!==q){
if(_)continue;l=false;break}if(c){if(!p(t,function(n){return s===n||r(s,n,e,u,o)})){l=false;break}}else if(s!==h&&!r(s,h,e,u,o)){l=false;break}}return o["delete"](n),l}function Ar(n,t,r,e,u,o,i){switch(r){case"[object ArrayBuffer]":if(n.byteLength!=t.byteLength||!e(new bu(n),new bu(t)))break;return true;case"[object Boolean]":case"[object Date]":return+n==+t;case"[object Error]":return n.name==t.name&&n.message==t.message;case"[object Number]":return n!=+n?t!=+t:n==+t;case"[object RegExp]":case"[object String]":
return n==t+"";case"[object Map]":var f=L;case"[object Set]":if(f||(f=F),n.size!=t.size&&!(2&o))break;return(r=i.get(n))?r==t:wr(f(n),f(t),e,u,1|o,i.set(n,t));case"[object Symbol]":if(Yu)return Yu.call(n)==Yu.call(t)}return false}function Or(n){for(var t=n.name+"",r=Tu[t],e=lu.call(Tu,t)?r.length:0;e--;){var u=r[e],o=u.func;if(null==o||o==n)return u.name}return t}function kr(){var n=bn.iteratee||He,n=n===He?Ot:n;return arguments.length?n(arguments[0],arguments[1]):n}function Er(n){n=qe(n);for(var t=n.length;t--;){
var r=n[t][1];n[t][2]=r===r&&!me(r)}return n}function Ir(n,t){var r=n[t];return Ae(r)?r:q}function Sr(n){return(lu.call(bn,"placeholder")?bn:n).placeholder}function Rr(n){return pu.call(n)}function Wr(n,t,r){if(null==n)return false;var e=r(n,t);return e||Lr(t)||(t=et(t),n=Zr(n,t),null!=n&&(t=Vr(t),e=r(n,t))),r=n?n.length:q,e||!!r&&je(r)&&z(t,r)&&(qo(n)||Ie(n)||ve(n))}function Br(n){var t=n.length,r=n.constructor(t);return t&&"string"==typeof n[0]&&lu.call(n,"index")&&(r.index=n.index,r.input=n.input),
r}function Cr(n){return typeof n.constructor!="function"||Nr(n)?{}:ft(mu(n))}function Ur(r,e,u){var o=r.constructor;switch(e){case"[object ArrayBuffer]":return Ht(r);case"[object Boolean]":case"[object Date]":return new o(+r);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return e=u?Ht(r.buffer):r.buffer,
new r.constructor(e,r.byteOffset,r.length);case"[object Map]":return s(L(r),n,new r.constructor);case"[object Number]":case"[object String]":return new o(r);case"[object RegExp]":return e=new r.constructor(r.source,pn.exec(r)),e.lastIndex=r.lastIndex,e;case"[object Set]":return s(F(r),t,new r.constructor);case"[object Symbol]":return Yu?Object(Yu.call(r)):{}}}function zr(n){var t=n?n.length:q;return je(t)&&(qo(n)||Ie(n)||ve(n))?m(t,String):null}function Mr(n,t,r){if(!me(r))return false;var e=typeof t;
return("number"==e?ge(r)&&z(t,r.length):"string"==e&&t in r)?pe(r[t],n):false}function Lr(n,t){return typeof n=="number"?true:!qo(n)&&(en.test(n)||!rn.test(n)||null!=t&&n in Object(t))}function $r(n){var t=typeof n;return"number"==t||"boolean"==t||"string"==t&&"__proto__"!=n||null==n}function Fr(n){var t=Or(n),r=bn[t];return typeof r=="function"&&t in On.prototype?n===r?true:(t=uo(r),!!t&&n===t[0]):false}function Nr(n){var t=n&&n.constructor;return n===(typeof t=="function"&&t.prototype||cu)}function Dr(n,t,r,e,u,o){
return me(n)&&me(t)&&Rt(n,t,q,Dr,o.set(t,n)),n}function Zr(n,t){return 1==t.length?n:$e(n,Nt(t,0,-1))}function qr(n){var t=[];return Le(n).replace(un,function(n,r,e,u){t.push(e?u.replace(sn,"$1"):r||n)}),t}function Pr(n){if(n instanceof On)return n.clone();var t=new An(n.__wrapped__,n.__chain__);return t.__actions__=nr(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t}function Tr(n,t,r){var e=n?n.length:0;return e?(t=r||t===q?1:Ce(t),Nt(n,0>t?0:t,e)):[]}function Kr(n,t,r){var e=n?n.length:0;
return e?(t=r||t===q?1:Ce(t),t=e-t,Nt(n,0,0>t?0:t)):[]}function Gr(n){return n?n[0]:q}function Vr(n){var t=n?n.length:0;return t?n[t-1]:q}function Jr(n,t){return n&&n.length&&t&&t.length?Mt(n,t):n}function Yr(n){return n?$u.call(n):n}function Hr(n){if(!n||!n.length)return[];var t=0;return n=i(n,function(n){return de(n)?(t=Uu(n.length,t),true):void 0}),m(t,function(t){return a(n,Ut(t))})}function Qr(n,t){if(!n||!n.length)return[];var e=Hr(n);return null==t?e:a(e,function(n){return r(t,q,n)})}function Xr(n){
return n=bn(n),n.__chain__=true,n}function ne(n,t){return t(n)}function te(){return this}function re(n,t){return typeof t=="function"&&qo(n)?u(n,t):Qu(n,rt(t))}function ee(n,t){var r;if(typeof t=="function"&&qo(n)){for(r=n.length;r--&&false!==t(n[r],r,n););r=n}else r=Xu(n,rt(t));return r}function ue(n,t){return(qo(n)?a:Et)(n,kr(t,3))}function oe(n,t){var r=-1,e=Be(n),u=e.length,o=u-1;for(t=ut(Ce(t),0,u);++r<t;){var u=$t(r,o),i=e[u];e[u]=e[r],e[r]=i}return e.length=t,e}function ie(n,t,r){return t=r?q:t,
t=n&&null==t?n.length:t,mr(n,128,q,q,q,q,t)}function fe(n,t){var r;if(typeof t!="function")throw new iu("Expected a function");return n=Ce(n),function(){return 0<--n&&(r=t.apply(this,arguments)),1>=n&&(t=q),r}}function ce(n,t,r){return t=r?q:t,n=mr(n,8,q,q,q,q,q,t),n.placeholder=ce.placeholder,n}function ae(n,t,r){return t=r?q:t,n=mr(n,16,q,q,q,q,q,t),n.placeholder=ae.placeholder,n}function le(n,t,r){function e(){p&&xu(p),a&&xu(a),v=0,c=a=h=p=_=q}function u(t,r){r&&xu(r),a=p=_=q,t&&(v=Uo(),l=n.apply(h,c),
p||a||(c=h=q))}function o(){var n=t-(Uo()-s);0>=n||n>t?u(_,a):p=Eu(o,n)}function i(){u(y,p)}function f(){if(c=arguments,s=Uo(),h=this,_=y&&(p||!g),false===d)var r=g&&!p;else{v||a||g||(v=s);var e=d-(s-v),u=(0>=e||e>d)&&(g||a);u?(a&&(a=xu(a)),v=s,l=n.apply(h,c)):a||(a=Eu(i,e))}return u&&p?p=xu(p):p||t===d||(p=Eu(o,t)),r&&(u=true,l=n.apply(h,c)),!u||p||a||(c=h=q),l}var c,a,l,s,h,p,_,v=0,g=false,d=false,y=true;if(typeof n!="function")throw new iu("Expected a function");return t=ze(t)||0,me(r)&&(g=!!r.leading,d="maxWait"in r&&Uu(ze(r.maxWait)||0,t),
y="trailing"in r?!!r.trailing:y),f.cancel=e,f.flush=function(){return(p&&_||a&&y)&&(l=n.apply(h,c)),e(),l},f}function se(n,t){function r(){var e=arguments,u=t?t.apply(this,e):e[0],o=r.cache;return o.has(u)?o.get(u):(e=n.apply(this,e),r.cache=o.set(u,e),e)}if(typeof n!="function"||t&&typeof t!="function")throw new iu("Expected a function");return r.cache=new se.Cache,r}function he(n,t){if(typeof n!="function")throw new iu("Expected a function");return t=Uu(t===q?n.length-1:Ce(t),0),function(){for(var e=arguments,u=-1,o=Uu(e.length-t,0),i=Array(o);++u<o;)i[u]=e[t+u];
switch(t){case 0:return n.call(this,i);case 1:return n.call(this,e[0],i);case 2:return n.call(this,e[0],e[1],i)}for(o=Array(t+1),u=-1;++u<t;)o[u]=e[u];return o[t]=i,r(n,this,o)}}function pe(n,t){return n===t||n!==n&&t!==t}function _e(n,t){return n>t}function ve(n){return de(n)&&lu.call(n,"callee")&&(!ku.call(n,"callee")||"[object Arguments]"==pu.call(n))}function ge(n){return null!=n&&je(oo(n))&&!be(n)}function de(n){return we(n)&&ge(n)}function ye(n){return we(n)?"[object Error]"==pu.call(n)||typeof n.message=="string"&&typeof n.name=="string":false;
}function be(n){return n=me(n)?pu.call(n):"","[object Function]"==n||"[object GeneratorFunction]"==n}function xe(n){return typeof n=="number"&&n==Ce(n)}function je(n){return typeof n=="number"&&n>-1&&0==n%1&&9007199254740991>=n}function me(n){var t=typeof n;return!!n&&("object"==t||"function"==t)}function we(n){return!!n&&typeof n=="object"}function Ae(n){return null==n?false:be(n)?vu.test(au.call(n)):we(n)&&(U(n)?vu:dn).test(n)}function Oe(n){return typeof n=="number"||we(n)&&"[object Number]"==pu.call(n);
}function ke(n){return!we(n)||"[object Object]"!=pu.call(n)||U(n)?false:(n=mu(n),null===n?true:(n=n.constructor,typeof n=="function"&&n instanceof n&&au.call(n)==hu))}function Ee(n){return me(n)&&"[object RegExp]"==pu.call(n)}function Ie(n){return typeof n=="string"||!qo(n)&&we(n)&&"[object String]"==pu.call(n)}function Se(n){return typeof n=="symbol"||we(n)&&"[object Symbol]"==pu.call(n)}function Re(n){return we(n)&&je(n.length)&&!!Cn[pu.call(n)]}function We(n,t){return t>n}function Be(n){if(!n)return[];
if(ge(n))return Ie(n)?n.match(En):nr(n);if(Au&&n[Au])return M(n[Au]());var t=Rr(n);return("[object Map]"==t?L:"[object Set]"==t?F:Pe)(n)}function Ce(n){if(!n)return 0===n?n:0;if(n=ze(n),n===P||n===-P)return 1.7976931348623157e308*(0>n?-1:1);var t=n%1;return n===n?t?n-t:n:0}function Ue(n){return n?ut(Ce(n),0,4294967295):0}function ze(n){if(me(n)&&(n=be(n.valueOf)?n.valueOf():n,n=me(n)?n+"":n),typeof n!="string")return 0===n?n:+n;n=n.replace(cn,"");var t=gn.test(n);return t||yn.test(n)?Dn(n.slice(2),t?2:8):vn.test(n)?T:+n;
}function Me(n){return tr(n,Ze(n))}function Le(n){if(typeof n=="string")return n;if(null==n)return"";if(Se(n))return Hu?Hu.call(n):"";var t=n+"";return"0"==t&&1/n==-P?"-0":t}function $e(n,t,r){return n=null==n?q:dt(n,t),n===q?r:n}function Fe(n,t){return Wr(n,t,yt)}function Ne(n,t){return Wr(n,t,bt)}function De(n){var t=Nr(n);if(!t&&!ge(n))return Cu(Object(n));var r,e=zr(n),u=!!e,e=e||[],o=e.length;for(r in n)!yt(n,r)||u&&("length"==r||z(r,o))||t&&"constructor"==r||e.push(r);return e}function Ze(n){
for(var t=-1,r=Nr(n),e=kt(n),u=e.length,o=zr(n),i=!!o,o=o||[],f=o.length;++t<u;){var c=e[t];i&&("length"==c||z(c,f))||"constructor"==c&&(r||!lu.call(n,c))||o.push(c)}return o}function qe(n){return w(n,De(n))}function Pe(n){return n?O(n,De(n)):[]}function Te(n){return ai(Le(n).toLowerCase())}function Ke(n){return(n=Le(n))&&n.replace(xn,R).replace(kn,"")}function Ge(n,t){n=Le(n),t=Ce(t);var r="";if(!n||1>t||t>9007199254740991)return r;do t%2&&(r+=n),t=Ru(t/2),n+=n;while(t);return r}function Ve(n,t,r){
return n=Le(n),t=r?q:t,t===q&&(t=Wn.test(n)?Rn:Sn),n.match(t)||[]}function Je(n){return function(){return n}}function Ye(n){return n}function He(n){return Ot(typeof n=="function"?n:ot(n,true))}function Qe(n,t,r){var e=De(t),o=gt(t,e);null!=r||me(t)&&(o.length||!e.length)||(r=t,t=n,n=this,o=gt(t,De(t)));var i=me(r)&&"chain"in r?r.chain:true,f=be(n);return u(o,function(r){var e=t[r];n[r]=e,f&&(n.prototype[r]=function(){var t=this.__chain__;if(i||t){var r=n(this.__wrapped__);return(r.__actions__=nr(this.__actions__)).push({
func:e,args:arguments,thisArg:n}),r.__chain__=t,r}return e.apply(n,l([this.value()],arguments))})}),n}function Xe(){}function nu(n){return Lr(n)?Ut(n):zt(n)}function tu(n){return n&&n.length?j(n,Ye):0}I=I?Jn.defaults({},I,Jn.pick(Vn,Bn)):Vn;var ru=I.Date,eu=I.Error,uu=I.Math,ou=I.RegExp,iu=I.TypeError,fu=I.Array.prototype,cu=I.Object.prototype,au=I.Function.prototype.toString,lu=cu.hasOwnProperty,su=0,hu=au.call(Object),pu=cu.toString,_u=Vn._,vu=ou("^"+au.call(lu).replace(on,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),gu=Pn?I.Buffer:q,du=I.Reflect,yu=I.Symbol,bu=I.Uint8Array,xu=I.clearTimeout,ju=du?du.f:q,mu=Object.getPrototypeOf,wu=Object.getOwnPropertySymbols,Au=typeof(Au=yu&&yu.iterator)=="symbol"?Au:q,Ou=Object.create,ku=cu.propertyIsEnumerable,Eu=I.setTimeout,Iu=fu.splice,Su=uu.ceil,Ru=uu.floor,Wu=I.isFinite,Bu=fu.join,Cu=Object.keys,Uu=uu.max,zu=uu.min,Mu=I.parseInt,Lu=uu.random,$u=fu.reverse,Fu=Ir(I,"Map"),Nu=Ir(I,"Set"),Du=Ir(I,"WeakMap"),Zu=Ir(Object,"create"),qu=Du&&new Du,Pu=!ku.call({
valueOf:1},"valueOf"),Tu={},Ku=Fu?au.call(Fu):"",Gu=Nu?au.call(Nu):"",Vu=Du?au.call(Du):"",Ju=yu?yu.prototype:q,Yu=Ju?Ju.valueOf:q,Hu=Ju?Ju.toString:q;bn.templateSettings={escape:X,evaluate:nn,interpolate:tn,variable:"",imports:{_:bn}};var Qu=ir(_t),Xu=ir(vt,true),no=fr(),to=fr(true);ju&&!ku.call({valueOf:1},"valueOf")&&(kt=function(n){return M(ju(n))});var ro=qu?function(n,t){return qu.set(n,t),n}:Ye,eo=Nu&&2===new Nu([1,2]).size?function(n){return new Nu(n)}:Xe,uo=qu?function(n){return qu.get(n)}:Xe,oo=Ut("length"),io=wu||function(){
return[]};(Fu&&"[object Map]"!=Rr(new Fu)||Nu&&"[object Set]"!=Rr(new Nu)||Du&&"[object WeakMap]"!=Rr(new Du))&&(Rr=function(n){var t=pu.call(n);if(n="[object Object]"==t?n.constructor:null,n=typeof n=="function"?au.call(n):"")switch(n){case Ku:return"[object Map]";case Gu:return"[object Set]";case Vu:return"[object WeakMap]"}return t});var fo=function(){var n=0,t=0;return function(r,e){var u=Uo(),o=16-(u-t);if(t=u,o>0){if(150<=++n)return r}else n=0;return ro(r,e)}}(),co=he(function(n,t){qo(n)||(n=null==n?[]:[Object(n)]),
t=ht(t,1);for(var r=n,e=t,u=-1,o=r.length,i=-1,f=e.length,c=Array(o+f);++u<o;)c[u]=r[u];for(;++i<f;)c[u++]=e[i];return c}),ao=he(function(n,t){return de(n)?at(n,ht(t,1,true)):[]}),lo=he(function(n,t){var r=Vr(t);return de(r)&&(r=q),de(n)?at(n,ht(t,1,true),kr(r)):[]}),so=he(function(n,t){var r=Vr(t);return de(r)&&(r=q),de(n)?at(n,ht(t,1,true),q,r):[]}),ho=he(function(n){var t=a(n,tt);return t.length&&t[0]===n[0]?xt(t):[]}),po=he(function(n){var t=Vr(n),r=a(n,tt);return t===Vr(r)?t=q:r.pop(),r.length&&r[0]===n[0]?xt(r,kr(t)):[];
}),_o=he(function(n){var t=Vr(n),r=a(n,tt);return t===Vr(r)?t=q:r.pop(),r.length&&r[0]===n[0]?xt(r,q,t):[]}),vo=he(Jr),go=he(function(n,t){t=a(ht(t,1),String);var r=nt(n,t);return Lt(n,t.sort(S)),r}),yo=he(function(n){return Tt(ht(n,1,true))}),bo=he(function(n){var t=Vr(n);return de(t)&&(t=q),Tt(ht(n,1,true),kr(t))}),xo=he(function(n){var t=Vr(n);return de(t)&&(t=q),Tt(ht(n,1,true),q,t)}),jo=he(function(n,t){return de(n)?at(n,t):[]}),mo=he(function(n){return Vt(i(n,de))}),wo=he(function(n){var t=Vr(n);return de(t)&&(t=q),
Vt(i(n,de),kr(t))}),Ao=he(function(n){var t=Vr(n);return de(t)&&(t=q),Vt(i(n,de),q,t)}),Oo=he(Hr),ko=he(function(n){var t=n.length,t=t>1?n[t-1]:q,t=typeof t=="function"?(n.pop(),t):q;return Qr(n,t)}),Eo=he(function(n){function t(t){return nt(t,n)}n=ht(n,1);var r=n.length,e=r?n[0]:0,u=this.__wrapped__;return 1>=r&&!this.__actions__.length&&u instanceof On&&z(e)?(u=u.slice(e,+e+(r?1:0)),u.__actions__.push({func:ne,args:[t],thisArg:q}),new An(u,this.__chain__).thru(function(n){return r&&!n.length&&n.push(q),
n})):this.thru(t)}),Io=ur(function(n,t,r){lu.call(n,r)?++n[r]:n[r]=1}),So=ur(function(n,t,r){lu.call(n,r)?n[r].push(t):n[r]=[t]}),Ro=he(function(n,t,e){var u=-1,o=typeof t=="function",i=Lr(t),f=ge(n)?Array(n.length):[];return Qu(n,function(n){var c=o?t:i&&null!=n?n[t]:q;f[++u]=c?r(c,n,e):mt(n,t,e)}),f}),Wo=ur(function(n,t,r){n[r]=t}),Bo=ur(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]}),Co=he(function(n,t){if(null==n)return[];var r=t.length;return r>1&&Mr(n,t[0],t[1])?t=[]:r>2&&Mr(t[0],t[1],t[2])&&(t.length=1),
Wt(n,ht(t,1),[])}),Uo=ru.now,zo=he(function(n,t,r){var e=1;if(r.length)var u=$(r,Sr(zo)),e=32|e;return mr(n,e,t,r,u)}),Mo=he(function(n,t,r){var e=3;if(r.length)var u=$(r,Sr(Mo)),e=32|e;return mr(t,e,n,r,u)}),Lo=he(function(n,t){return ct(n,1,t)}),$o=he(function(n,t,r){return ct(n,ze(t)||0,r)}),Fo=he(function(n,t){t=a(ht(t,1),kr());var e=t.length;return he(function(u){for(var o=-1,i=zu(u.length,e);++o<i;)u[o]=t[o].call(this,u[o]);return r(n,this,u)})}),No=he(function(n,t){var r=$(t,Sr(No));return mr(n,32,q,t,r);
}),Do=he(function(n,t){var r=$(t,Sr(Do));return mr(n,64,q,t,r)}),Zo=he(function(n,t){return mr(n,256,q,q,q,ht(t,1))}),qo=Array.isArray,Po=gu?function(n){return n instanceof gu}:Je(false),To=or(function(n,t){if(Pu||Nr(t)||ge(t))tr(t,De(t),n);else for(var r in t)lu.call(t,r)&&Hn(n,r,t[r])}),Ko=or(function(n,t){if(Pu||Nr(t)||ge(t))tr(t,Ze(t),n);else for(var r in t)Hn(n,r,t[r])}),Go=or(function(n,t,r,e){rr(t,Ze(t),n,e)}),Vo=or(function(n,t,r,e){rr(t,De(t),n,e)}),Jo=he(function(n,t){return nt(n,ht(t,1))}),Yo=he(function(n){
return n.push(q,Gn),r(Go,q,n)}),Ho=he(function(n){return n.push(q,Dr),r(ri,q,n)}),Qo=vr(function(n,t,r){n[t]=r},Je(Ye)),Xo=vr(function(n,t,r){lu.call(n,t)?n[t].push(r):n[t]=[r]},kr),ni=he(mt),ti=or(function(n,t,r){Rt(n,t,r)}),ri=or(function(n,t,r,e){Rt(n,t,r,e)}),ei=he(function(n,t){return null==n?{}:(t=a(ht(t,1),String),Bt(n,at(Ze(n),t)))}),ui=he(function(n,t){return null==n?{}:Bt(n,ht(t,1))}),oi=lr(function(n,t,r){return t=t.toLowerCase(),n+(r?Te(t):t)}),ii=lr(function(n,t,r){return n+(r?"-":"")+t.toLowerCase();
}),fi=lr(function(n,t,r){return n+(r?" ":"")+t.toLowerCase()}),ci=ar("toLowerCase"),ai=ar("toUpperCase"),li=lr(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()}),si=lr(function(n,t,r){return n+(r?" ":"")+Te(t)}),hi=lr(function(n,t,r){return n+(r?" ":"")+t.toUpperCase()}),pi=he(function(n,t){try{return r(n,q,t)}catch(e){return ye(e)?e:new eu(e)}}),_i=he(function(n,t){return u(ht(t,1),function(t){n[t]=zo(n[t],n)}),n}),vi=pr(),gi=pr(true),di=he(function(n,t){return function(r){return mt(r,n,t)}}),yi=he(function(n,t){
return function(r){return mt(n,r,t)}}),bi=gr(a),xi=gr(o),ji=gr(p),mi=br(),wi=br(true),Ai=jr("ceil"),Oi=jr("floor"),ki=jr("round");return bn.prototype=wn.prototype,bn.prototype.constructor=bn,An.prototype=ft(wn.prototype),An.prototype.constructor=An,On.prototype=ft(wn.prototype),On.prototype.constructor=On,zn.prototype=Zu?Zu(null):cu,Mn.prototype.clear=function(){this.__data__={hash:new zn,map:Fu?new Fu:[],string:new zn}},Mn.prototype["delete"]=function(n){var t=this.__data__;return $r(n)?(t=typeof n=="string"?t.string:t.hash,
n=(Zu?t[n]!==q:lu.call(t,n))&&delete t[n]):n=Fu?t.map["delete"](n):Zn(t.map,n),n},Mn.prototype.get=function(n){var t=this.__data__;return $r(n)?(t=typeof n=="string"?t.string:t.hash,Zu?(n=t[n],n="__lodash_hash_undefined__"===n?q:n):n=lu.call(t,n)?t[n]:q):n=Fu?t.map.get(n):qn(t.map,n),n},Mn.prototype.has=function(n){var t=this.__data__;return $r(n)?(t=typeof n=="string"?t.string:t.hash,n=Zu?t[n]!==q:lu.call(t,n)):n=Fu?t.map.has(n):-1<Tn(t.map,n),n},Mn.prototype.set=function(n,t){var r=this.__data__;
return $r(n)?(typeof n=="string"?r.string:r.hash)[n]=Zu&&t===q?"__lodash_hash_undefined__":t:Fu?r.map.set(n,t):Kn(r.map,n,t),this},Ln.prototype.push=function(n){var t=this.__data__;$r(n)?(t=t.__data__,(typeof n=="string"?t.string:t.hash)[n]="__lodash_hash_undefined__"):t.set(n,"__lodash_hash_undefined__")},Fn.prototype.clear=function(){this.__data__={array:[],map:null}},Fn.prototype["delete"]=function(n){var t=this.__data__,r=t.array;return r?Zn(r,n):t.map["delete"](n)},Fn.prototype.get=function(n){
var t=this.__data__,r=t.array;return r?qn(r,n):t.map.get(n)},Fn.prototype.has=function(n){var t=this.__data__,r=t.array;return r?-1<Tn(r,n):t.map.has(n)},Fn.prototype.set=function(n,t){var r=this.__data__,e=r.array;return e&&(199>e.length?Kn(e,n,t):(r.array=null,r.map=new Mn(e))),(r=r.map)&&r.set(n,t),this},se.Cache=Mn,bn.after=function(n,t){if(typeof t!="function")throw new iu("Expected a function");return n=Ce(n),function(){return 1>--n?t.apply(this,arguments):void 0}},bn.ary=ie,bn.assign=To,bn.assignIn=Ko,
bn.assignInWith=Go,bn.assignWith=Vo,bn.at=Jo,bn.before=fe,bn.bind=zo,bn.bindAll=_i,bn.bindKey=Mo,bn.castArray=function(){if(!arguments.length)return[];var n=arguments[0];return qo(n)?n:[n]},bn.chain=Xr,bn.chunk=function(n,t){t=Uu(Ce(t),0);var r=n?n.length:0;if(!r||1>t)return[];for(var e=0,u=0,o=Array(Su(r/t));r>e;)o[u++]=Nt(n,e,e+=t);return o},bn.compact=function(n){for(var t=-1,r=n?n.length:0,e=0,u=[];++t<r;){var o=n[t];o&&(u[e++]=o)}return u},bn.concat=co,bn.cond=function(n){var t=n?n.length:0,e=kr();
return n=t?a(n,function(n){if("function"!=typeof n[1])throw new iu("Expected a function");return[e(n[0]),n[1]]}):[],he(function(e){for(var u=-1;++u<t;){var o=n[u];if(r(o[0],this,e))return r(o[1],this,e)}})},bn.conforms=function(n){return it(ot(n,true))},bn.constant=Je,bn.countBy=Io,bn.create=function(n,t){var r=ft(n);return t?Xn(r,t):r},bn.curry=ce,bn.curryRight=ae,bn.debounce=le,bn.defaults=Yo,bn.defaultsDeep=Ho,bn.defer=Lo,bn.delay=$o,bn.difference=ao,bn.differenceBy=lo,bn.differenceWith=so,bn.drop=Tr,
bn.dropRight=Kr,bn.dropRightWhile=function(n,t){return n&&n.length?Kt(n,kr(t,3),true,true):[]},bn.dropWhile=function(n,t){return n&&n.length?Kt(n,kr(t,3),true):[]},bn.fill=function(n,t,r,e){var u=n?n.length:0;if(!u)return[];for(r&&typeof r!="number"&&Mr(n,t,r)&&(r=0,e=u),u=n.length,r=Ce(r),0>r&&(r=-r>u?0:u+r),e=e===q||e>u?u:Ce(e),0>e&&(e+=u),e=r>e?0:Ue(e);e>r;)n[r++]=t;return n},bn.filter=function(n,t){return(qo(n)?i:st)(n,kr(t,3))},bn.flatMap=function(n,t){return ht(ue(n,t),1)},bn.flatten=function(n){
return n&&n.length?ht(n,1):[]},bn.flattenDeep=function(n){return n&&n.length?ht(n,P):[]},bn.flattenDepth=function(n,t){return n&&n.length?(t=t===q?1:Ce(t),ht(n,t)):[]},bn.flip=function(n){return mr(n,512)},bn.flow=vi,bn.flowRight=gi,bn.fromPairs=function(n){for(var t=-1,r=n?n.length:0,e={};++t<r;){var u=n[t];e[u[0]]=u[1]}return e},bn.functions=function(n){return null==n?[]:gt(n,De(n))},bn.functionsIn=function(n){return null==n?[]:gt(n,Ze(n))},bn.groupBy=So,bn.initial=function(n){return Kr(n,1)},bn.intersection=ho,
bn.intersectionBy=po,bn.intersectionWith=_o,bn.invert=Qo,bn.invertBy=Xo,bn.invokeMap=Ro,bn.iteratee=He,bn.keyBy=Wo,bn.keys=De,bn.keysIn=Ze,bn.map=ue,bn.mapKeys=function(n,t){var r={};return t=kr(t,3),_t(n,function(n,e,u){r[t(n,e,u)]=n}),r},bn.mapValues=function(n,t){var r={};return t=kr(t,3),_t(n,function(n,e,u){r[e]=t(n,e,u)}),r},bn.matches=function(n){return It(ot(n,true))},bn.matchesProperty=function(n,t){return St(n,ot(t,true))},bn.memoize=se,bn.merge=ti,bn.mergeWith=ri,bn.method=di,bn.methodOf=yi,
bn.mixin=Qe,bn.negate=function(n){if(typeof n!="function")throw new iu("Expected a function");return function(){return!n.apply(this,arguments)}},bn.nthArg=function(n){return n=Ce(n),function(){return arguments[n]}},bn.omit=ei,bn.omitBy=function(n,t){return t=kr(t),Ct(n,function(n,r){return!t(n,r)})},bn.once=function(n){return fe(2,n)},bn.orderBy=function(n,t,r,e){return null==n?[]:(qo(t)||(t=null==t?[]:[t]),r=e?q:r,qo(r)||(r=null==r?[]:[r]),Wt(n,t,r))},bn.over=bi,bn.overArgs=Fo,bn.overEvery=xi,bn.overSome=ji,
bn.partial=No,bn.partialRight=Do,bn.partition=Bo,bn.pick=ui,bn.pickBy=function(n,t){return null==n?{}:Ct(n,kr(t))},bn.property=nu,bn.propertyOf=function(n){return function(t){return null==n?q:dt(n,t)}},bn.pull=vo,bn.pullAll=Jr,bn.pullAllBy=function(n,t,r){return n&&n.length&&t&&t.length?Mt(n,t,kr(r)):n},bn.pullAllWith=function(n,t,r){return n&&n.length&&t&&t.length?Mt(n,t,q,r):n},bn.pullAt=go,bn.range=mi,bn.rangeRight=wi,bn.rearg=Zo,bn.reject=function(n,t){var r=qo(n)?i:st;return t=kr(t,3),r(n,function(n,r,e){
return!t(n,r,e)})},bn.remove=function(n,t){var r=[];if(!n||!n.length)return r;var e=-1,u=[],o=n.length;for(t=kr(t,3);++e<o;){var i=n[e];t(i,e,n)&&(r.push(i),u.push(e))}return Lt(n,u),r},bn.rest=he,bn.reverse=Yr,bn.sampleSize=oe,bn.set=function(n,t,r){return null==n?n:Ft(n,t,r)},bn.setWith=function(n,t,r,e){return e=typeof e=="function"?e:q,null==n?n:Ft(n,t,r,e)},bn.shuffle=function(n){return oe(n,4294967295)},bn.slice=function(n,t,r){var e=n?n.length:0;return e?(r&&typeof r!="number"&&Mr(n,t,r)?(t=0,
r=e):(t=null==t?0:Ce(t),r=r===q?e:Ce(r)),Nt(n,t,r)):[]},bn.sortBy=Co,bn.sortedUniq=function(n){return n&&n.length?Pt(n):[]},bn.sortedUniqBy=function(n,t){return n&&n.length?Pt(n,kr(t)):[]},bn.split=function(n,t,r){return Le(n).split(t,r)},bn.spread=function(n,t){if(typeof n!="function")throw new iu("Expected a function");return t=t===q?0:Uu(Ce(t),0),he(function(e){var u=e[t];return e=e.slice(0,t),u&&l(e,u),r(n,this,e)})},bn.tail=function(n){return Tr(n,1)},bn.take=function(n,t,r){return n&&n.length?(t=r||t===q?1:Ce(t),
Nt(n,0,0>t?0:t)):[]},bn.takeRight=function(n,t,r){var e=n?n.length:0;return e?(t=r||t===q?1:Ce(t),t=e-t,Nt(n,0>t?0:t,e)):[]},bn.takeRightWhile=function(n,t){return n&&n.length?Kt(n,kr(t,3),false,true):[]},bn.takeWhile=function(n,t){return n&&n.length?Kt(n,kr(t,3)):[]},bn.tap=function(n,t){return t(n),n},bn.throttle=function(n,t,r){var e=true,u=true;if(typeof n!="function")throw new iu("Expected a function");return me(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),le(n,t,{leading:e,maxWait:t,
trailing:u})},bn.thru=ne,bn.toArray=Be,bn.toPairs=qe,bn.toPairsIn=function(n){return w(n,Ze(n))},bn.toPath=function(n){return qo(n)?a(n,String):qr(n)},bn.toPlainObject=Me,bn.transform=function(n,t,r){var e=qo(n)||Re(n);if(t=kr(t,4),null==r)if(e||me(n)){var o=n.constructor;r=e?qo(n)?new o:[]:be(o)?ft(mu(n)):{}}else r={};return(e?u:_t)(n,function(n,e,u){return t(r,n,e,u)}),r},bn.unary=function(n){return ie(n,1)},bn.union=yo,bn.unionBy=bo,bn.unionWith=xo,bn.uniq=function(n){return n&&n.length?Tt(n):[];
},bn.uniqBy=function(n,t){return n&&n.length?Tt(n,kr(t)):[]},bn.uniqWith=function(n,t){return n&&n.length?Tt(n,q,t):[]},bn.unset=function(n,t){var r;if(null==n)r=true;else{r=n;var e=t,e=Lr(e,r)?[e+""]:et(e);r=Zr(r,e),e=Vr(e),r=null!=r&&Fe(r,e)?delete r[e]:true}return r},bn.unzip=Hr,bn.unzipWith=Qr,bn.update=function(n,t,r){return null==n?n:Ft(n,t,rt(r)(dt(n,t)),void 0)},bn.updateWith=function(n,t,r,e){return e=typeof e=="function"?e:q,null!=n&&(n=Ft(n,t,rt(r)(dt(n,t)),e)),n},bn.values=Pe,bn.valuesIn=function(n){
return null==n?[]:O(n,Ze(n))},bn.without=jo,bn.words=Ve,bn.wrap=function(n,t){return t=null==t?Ye:t,No(t,n)},bn.xor=mo,bn.xorBy=wo,bn.xorWith=Ao,bn.zip=Oo,bn.zipObject=function(n,t){return Jt(n||[],t||[],Hn)},bn.zipObjectDeep=function(n,t){return Jt(n||[],t||[],Ft)},bn.zipWith=ko,bn.extend=Ko,bn.extendWith=Go,Qe(bn,bn),bn.add=function(n,t){var r;return n===q&&t===q?0:(n!==q&&(r=n),t!==q&&(r=r===q?t:r+t),r)},bn.attempt=pi,bn.camelCase=oi,bn.capitalize=Te,bn.ceil=Ai,bn.clamp=function(n,t,r){return r===q&&(r=t,
t=q),r!==q&&(r=ze(r),r=r===r?r:0),t!==q&&(t=ze(t),t=t===t?t:0),ut(ze(n),t,r)},bn.clone=function(n){return ot(n,false,true)},bn.cloneDeep=function(n){return ot(n,true,true)},bn.cloneDeepWith=function(n,t){return ot(n,true,true,t)},bn.cloneWith=function(n,t){return ot(n,false,true,t)},bn.deburr=Ke,bn.endsWith=function(n,t,r){n=Le(n),t=typeof t=="string"?t:t+"";var e=n.length;return r=r===q?e:ut(Ce(r),0,e),r-=t.length,r>=0&&n.indexOf(t,r)==r},bn.eq=pe,bn.escape=function(n){return(n=Le(n))&&Q.test(n)?n.replace(Y,W):n},
bn.escapeRegExp=function(n){return(n=Le(n))&&fn.test(n)?n.replace(on,"\\$&"):n},bn.every=function(n,t,r){var e=qo(n)?o:lt;return r&&Mr(n,t,r)&&(t=q),e(n,kr(t,3))},bn.find=function(n,t){if(t=kr(t,3),qo(n)){var r=g(n,t);return r>-1?n[r]:q}return v(n,t,Qu)},bn.findIndex=function(n,t){return n&&n.length?g(n,kr(t,3)):-1},bn.findKey=function(n,t){return v(n,kr(t,3),_t,true)},bn.findLast=function(n,t){if(t=kr(t,3),qo(n)){var r=g(n,t,true);return r>-1?n[r]:q}return v(n,t,Xu)},bn.findLastIndex=function(n,t){return n&&n.length?g(n,kr(t,3),true):-1;
},bn.findLastKey=function(n,t){return v(n,kr(t,3),vt,true)},bn.floor=Oi,bn.forEach=re,bn.forEachRight=ee,bn.forIn=function(n,t){return null==n?n:no(n,rt(t),Ze)},bn.forInRight=function(n,t){return null==n?n:to(n,rt(t),Ze)},bn.forOwn=function(n,t){return n&&_t(n,rt(t))},bn.forOwnRight=function(n,t){return n&&vt(n,rt(t))},bn.get=$e,bn.gt=_e,bn.gte=function(n,t){return n>=t},bn.has=Fe,bn.hasIn=Ne,bn.head=Gr,bn.identity=Ye,bn.includes=function(n,t,r,e){return n=ge(n)?n:Pe(n),r=r&&!e?Ce(r):0,e=n.length,0>r&&(r=Uu(e+r,0)),
Ie(n)?e>=r&&-1<n.indexOf(t,r):!!e&&-1<d(n,t,r)},bn.indexOf=function(n,t,r){var e=n?n.length:0;return e?(r=Ce(r),0>r&&(r=Uu(e+r,0)),d(n,t,r)):-1},bn.inRange=function(n,t,r){return t=ze(t)||0,r===q?(r=t,t=0):r=ze(r)||0,n=ze(n),n>=zu(t,r)&&n<Uu(t,r)},bn.invoke=ni,bn.isArguments=ve,bn.isArray=qo,bn.isArrayBuffer=function(n){return we(n)&&"[object ArrayBuffer]"==pu.call(n)},bn.isArrayLike=ge,bn.isArrayLikeObject=de,bn.isBoolean=function(n){return true===n||false===n||we(n)&&"[object Boolean]"==pu.call(n)},bn.isBuffer=Po,
bn.isDate=function(n){return we(n)&&"[object Date]"==pu.call(n)},bn.isElement=function(n){return!!n&&1===n.nodeType&&we(n)&&!ke(n)},bn.isEmpty=function(n){if(ge(n)&&(qo(n)||Ie(n)||be(n.splice)||ve(n)))return!n.length;for(var t in n)if(lu.call(n,t))return false;return true},bn.isEqual=function(n,t){return wt(n,t)},bn.isEqualWith=function(n,t,r){var e=(r=typeof r=="function"?r:q)?r(n,t):q;return e===q?wt(n,t,r):!!e},bn.isError=ye,bn.isFinite=function(n){return typeof n=="number"&&Wu(n)},bn.isFunction=be,bn.isInteger=xe,
bn.isLength=je,bn.isMap=function(n){return we(n)&&"[object Map]"==Rr(n)},bn.isMatch=function(n,t){return n===t||At(n,t,Er(t))},bn.isMatchWith=function(n,t,r){return r=typeof r=="function"?r:q,At(n,t,Er(t),r)},bn.isNaN=function(n){return Oe(n)&&n!=+n},bn.isNative=Ae,bn.isNil=function(n){return null==n},bn.isNull=function(n){return null===n},bn.isNumber=Oe,bn.isObject=me,bn.isObjectLike=we,bn.isPlainObject=ke,bn.isRegExp=Ee,bn.isSafeInteger=function(n){return xe(n)&&n>=-9007199254740991&&9007199254740991>=n;
},bn.isSet=function(n){return we(n)&&"[object Set]"==Rr(n)},bn.isString=Ie,bn.isSymbol=Se,bn.isTypedArray=Re,bn.isUndefined=function(n){return n===q},bn.isWeakMap=function(n){return we(n)&&"[object WeakMap]"==Rr(n)},bn.isWeakSet=function(n){return we(n)&&"[object WeakSet]"==pu.call(n)},bn.join=function(n,t){return n?Bu.call(n,t):""},bn.kebabCase=ii,bn.last=Vr,bn.lastIndexOf=function(n,t,r){var e=n?n.length:0;if(!e)return-1;var u=e;if(r!==q&&(u=Ce(r),u=(0>u?Uu(e+u,0):zu(u,e-1))+1),t!==t)return C(n,u,true);
for(;u--;)if(n[u]===t)return u;return-1},bn.lowerCase=fi,bn.lowerFirst=ci,bn.lt=We,bn.lte=function(n,t){return t>=n},bn.max=function(n){return n&&n.length?_(n,Ye,_e):q},bn.maxBy=function(n,t){return n&&n.length?_(n,kr(t),_e):q},bn.mean=function(n){return tu(n)/(n?n.length:0)},bn.min=function(n){return n&&n.length?_(n,Ye,We):q},bn.minBy=function(n,t){return n&&n.length?_(n,kr(t),We):q},bn.noConflict=function(){return Vn._===this&&(Vn._=_u),this},bn.noop=Xe,bn.now=Uo,bn.pad=function(n,t,r){n=Le(n),
t=Ce(t);var e=N(n);return t&&t>e?(e=(t-e)/2,t=Ru(e),e=Su(e),dr("",t,r)+n+dr("",e,r)):n},bn.padEnd=function(n,t,r){return n=Le(n),n+dr(n,t,r)},bn.padStart=function(n,t,r){return n=Le(n),dr(n,t,r)+n},bn.parseInt=function(n,t,r){return r||null==t?t=0:t&&(t=+t),n=Le(n).replace(cn,""),Mu(n,t||(_n.test(n)?16:10))},bn.random=function(n,t,r){if(r&&typeof r!="boolean"&&Mr(n,t,r)&&(t=r=q),r===q&&(typeof t=="boolean"?(r=t,t=q):typeof n=="boolean"&&(r=n,n=q)),n===q&&t===q?(n=0,t=1):(n=ze(n)||0,t===q?(t=n,n=0):t=ze(t)||0),
n>t){var e=n;n=t,t=e}return r||n%1||t%1?(r=Lu(),zu(n+r*(t-n+Nn("1e-"+((r+"").length-1))),t)):$t(n,t)},bn.reduce=function(n,t,r){var e=qo(n)?s:b,u=3>arguments.length;return e(n,kr(t,4),r,u,Qu)},bn.reduceRight=function(n,t,r){var e=qo(n)?h:b,u=3>arguments.length;return e(n,kr(t,4),r,u,Xu)},bn.repeat=Ge,bn.replace=function(){var n=arguments,t=Le(n[0]);return 3>n.length?t:t.replace(n[1],n[2])},bn.result=function(n,t,r){if(Lr(t,n))e=null==n?q:n[t];else{t=et(t);var e=$e(n,t);n=Zr(n,t)}return e===q&&(e=r),
be(e)?e.call(n):e},bn.round=ki,bn.runInContext=Z,bn.sample=function(n){n=ge(n)?n:Pe(n);var t=n.length;return t>0?n[$t(0,t-1)]:q},bn.size=function(n){if(null==n)return 0;if(ge(n)){var t=n.length;return t&&Ie(n)?N(n):t}return De(n).length},bn.snakeCase=li,bn.some=function(n,t,r){var e=qo(n)?p:Dt;return r&&Mr(n,t,r)&&(t=q),e(n,kr(t,3))},bn.sortedIndex=function(n,t){return Zt(n,t)},bn.sortedIndexBy=function(n,t,r){return qt(n,t,kr(r))},bn.sortedIndexOf=function(n,t){var r=n?n.length:0;if(r){var e=Zt(n,t);
if(r>e&&pe(n[e],t))return e}return-1},bn.sortedLastIndex=function(n,t){return Zt(n,t,true)},bn.sortedLastIndexBy=function(n,t,r){return qt(n,t,kr(r),true)},bn.sortedLastIndexOf=function(n,t){if(n&&n.length){var r=Zt(n,t,true)-1;if(pe(n[r],t))return r}return-1},bn.startCase=si,bn.startsWith=function(n,t,r){return n=Le(n),r=ut(Ce(r),0,n.length),n.lastIndexOf(t,r)==r},bn.subtract=function(n,t){var r;return n===q&&t===q?0:(n!==q&&(r=n),t!==q&&(r=r===q?t:r-t),r)},bn.sum=tu,bn.sumBy=function(n,t){return n&&n.length?j(n,kr(t)):0;
},bn.template=function(n,t,r){var e=bn.templateSettings;r&&Mr(n,t,r)&&(t=q),n=Le(n),t=Go({},t,e,Gn),r=Go({},t.imports,e.imports,Gn);var u,o,i=De(r),f=O(r,i),c=0;r=t.interpolate||jn;var a="__p+='";r=ou((t.escape||jn).source+"|"+r.source+"|"+(r===tn?hn:jn).source+"|"+(t.evaluate||jn).source+"|$","g");var l="sourceURL"in t?"//# sourceURL="+t.sourceURL+"\n":"";if(n.replace(r,function(t,r,e,i,f,l){return e||(e=i),a+=n.slice(c,l).replace(mn,B),r&&(u=true,a+="'+__e("+r+")+'"),f&&(o=true,a+="';"+f+";\n__p+='"),
e&&(a+="'+((__t=("+e+"))==null?'':__t)+'"),c=l+t.length,t}),a+="';",(t=t.variable)||(a="with(obj){"+a+"}"),a=(o?a.replace(K,""):a).replace(G,"$1").replace(V,"$1;"),a="function("+(t||"obj")+"){"+(t?"":"obj||(obj={});")+"var __t,__p=''"+(u?",__e=_.escape":"")+(o?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+a+"return __p}",t=pi(function(){return Function(i,l+"return "+a).apply(q,f)}),t.source=a,ye(t))throw t;return t},bn.times=function(n,t){if(n=Ce(n),1>n||n>9007199254740991)return[];
var r=4294967295,e=zu(n,4294967295);for(t=rt(t),n-=4294967295,e=m(e,t);++r<n;)t(r);return e},bn.toInteger=Ce,bn.toLength=Ue,bn.toLower=function(n){return Le(n).toLowerCase()},bn.toNumber=ze,bn.toSafeInteger=function(n){return ut(Ce(n),-9007199254740991,9007199254740991)},bn.toString=Le,bn.toUpper=function(n){return Le(n).toUpperCase()},bn.trim=function(n,t,r){return(n=Le(n))?r||t===q?n.replace(cn,""):(t+="")?(n=n.match(En),t=t.match(En),n.slice(k(n,t),E(n,t)+1).join("")):n:n},bn.trimEnd=function(n,t,r){
return(n=Le(n))?r||t===q?n.replace(ln,""):(t+="")?(n=n.match(En),n.slice(0,E(n,t.match(En))+1).join("")):n:n},bn.trimStart=function(n,t,r){return(n=Le(n))?r||t===q?n.replace(an,""):(t+="")?(n=n.match(En),n.slice(k(n,t.match(En))).join("")):n:n},bn.truncate=function(n,t){var r=30,e="...";if(me(t))var u="separator"in t?t.separator:u,r="length"in t?Ce(t.length):r,e="omission"in t?Le(t.omission):e;n=Le(n);var o=n.length;if(In.test(n))var i=n.match(En),o=i.length;if(r>=o)return n;if(o=r-N(e),1>o)return e;
if(r=i?i.slice(0,o).join(""):n.slice(0,o),u===q)return r+e;if(i&&(o+=r.length-o),Ee(u)){if(n.slice(o).search(u)){var f=r;for(u.global||(u=ou(u.source,Le(pn.exec(u))+"g")),u.lastIndex=0;i=u.exec(f);)var c=i.index;r=r.slice(0,c===q?o:c)}}else n.indexOf(u,o)!=o&&(u=r.lastIndexOf(u),u>-1&&(r=r.slice(0,u)));return r+e},bn.unescape=function(n){return(n=Le(n))&&H.test(n)?n.replace(J,D):n},bn.uniqueId=function(n){var t=++su;return Le(n)+t},bn.upperCase=hi,bn.upperFirst=ai,bn.each=re,bn.eachRight=ee,bn.first=Gr,
Qe(bn,function(){var n={};return _t(bn,function(t,r){lu.call(bn.prototype,r)||(n[r]=t)}),n}(),{chain:false}),bn.VERSION="4.6.1",u("bind bindKey curry curryRight partial partialRight".split(" "),function(n){bn[n].placeholder=bn}),u(["drop","take"],function(n,t){On.prototype[n]=function(r){var e=this.__filtered__;if(e&&!t)return new On(this);r=r===q?1:Uu(Ce(r),0);var u=this.clone();return e?u.__takeCount__=zu(r,u.__takeCount__):u.__views__.push({size:zu(r,4294967295),type:n+(0>u.__dir__?"Right":"")}),
u},On.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse()}}),u(["filter","map","takeWhile"],function(n,t){var r=t+1,e=1==r||3==r;On.prototype[n]=function(n){var t=this.clone();return t.__iteratees__.push({iteratee:kr(n,3),type:r}),t.__filtered__=t.__filtered__||e,t}}),u(["head","last"],function(n,t){var r="take"+(t?"Right":"");On.prototype[n]=function(){return this[r](1).value()[0]}}),u(["initial","tail"],function(n,t){var r="drop"+(t?"":"Right");On.prototype[n]=function(){return this.__filtered__?new On(this):this[r](1);
}}),On.prototype.compact=function(){return this.filter(Ye)},On.prototype.find=function(n){return this.filter(n).head()},On.prototype.findLast=function(n){return this.reverse().find(n)},On.prototype.invokeMap=he(function(n,t){return typeof n=="function"?new On(this):this.map(function(r){return mt(r,n,t)})}),On.prototype.reject=function(n){return n=kr(n,3),this.filter(function(t){return!n(t)})},On.prototype.slice=function(n,t){n=Ce(n);var r=this;return r.__filtered__&&(n>0||0>t)?new On(r):(0>n?r=r.takeRight(-n):n&&(r=r.drop(n)),
t!==q&&(t=Ce(t),r=0>t?r.dropRight(-t):r.take(t-n)),r)},On.prototype.takeRightWhile=function(n){return this.reverse().takeWhile(n).reverse()},On.prototype.toArray=function(){return this.take(4294967295)},_t(On.prototype,function(n,t){var r=/^(?:filter|find|map|reject)|While$/.test(t),e=/^(?:head|last)$/.test(t),u=bn[e?"take"+("last"==t?"Right":""):t],o=e||/^find/.test(t);u&&(bn.prototype[t]=function(){function t(n){return n=u.apply(bn,l([n],f)),e&&h?n[0]:n}var i=this.__wrapped__,f=e?[1]:arguments,c=i instanceof On,a=f[0],s=c||qo(i);
s&&r&&typeof a=="function"&&1!=a.length&&(c=s=false);var h=this.__chain__,p=!!this.__actions__.length,a=o&&!h,c=c&&!p;return!o&&s?(i=c?i:new On(this),i=n.apply(i,f),i.__actions__.push({func:ne,args:[t],thisArg:q}),new An(i,h)):a&&c?n.apply(this,f):(i=this.thru(t),a?e?i.value()[0]:i.value():i)})}),u("pop push shift sort splice unshift".split(" "),function(n){var t=fu[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|shift)$/.test(n);bn.prototype[n]=function(){var n=arguments;return e&&!this.__chain__?t.apply(this.value(),n):this[r](function(r){
return t.apply(r,n)})}}),_t(On.prototype,function(n,t){var r=bn[t];if(r){var e=r.name+"";(Tu[e]||(Tu[e]=[])).push({name:t,func:r})}}),Tu[_r(q,2).name]=[{name:"wrapper",func:q}],On.prototype.clone=function(){var n=new On(this.__wrapped__);return n.__actions__=nr(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=nr(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=nr(this.__views__),n},On.prototype.reverse=function(){if(this.__filtered__){var n=new On(this);
n.__dir__=-1,n.__filtered__=true}else n=this.clone(),n.__dir__*=-1;return n},On.prototype.value=function(){var n,t=this.__wrapped__.value(),r=this.__dir__,e=qo(t),u=0>r,o=e?t.length:0;n=o;for(var i=this.__views__,f=0,c=-1,a=i.length;++c<a;){var l=i[c],s=l.size;switch(l.type){case"drop":f+=s;break;case"dropRight":n-=s;break;case"take":n=zu(n,f+s);break;case"takeRight":f=Uu(f,n-s)}}if(n={start:f,end:n},i=n.start,f=n.end,n=f-i,u=u?f:i-1,i=this.__iteratees__,f=i.length,c=0,a=zu(n,this.__takeCount__),!e||200>o||o==n&&a==n)return Gt(t,this.__actions__);
e=[];n:for(;n--&&a>c;){for(u+=r,o=-1,l=t[u];++o<f;){var h=i[o],s=h.type,h=(0,h.iteratee)(l);if(2==s)l=h;else if(!h){if(1==s)continue n;break n}}e[c++]=l}return e},bn.prototype.at=Eo,bn.prototype.chain=function(){return Xr(this)},bn.prototype.commit=function(){return new An(this.value(),this.__chain__)},bn.prototype.flatMap=function(n){return this.map(n).flatten()},bn.prototype.next=function(){this.__values__===q&&(this.__values__=Be(this.value()));var n=this.__index__>=this.__values__.length,t=n?q:this.__values__[this.__index__++];
return{done:n,value:t}},bn.prototype.plant=function(n){for(var t,r=this;r instanceof wn;){var e=Pr(r);e.__index__=0,e.__values__=q,t?u.__wrapped__=e:t=e;var u=e,r=r.__wrapped__}return u.__wrapped__=n,t},bn.prototype.reverse=function(){var n=this.__wrapped__;return n instanceof On?(this.__actions__.length&&(n=new On(this)),n=n.reverse(),n.__actions__.push({func:ne,args:[Yr],thisArg:q}),new An(n,this.__chain__)):this.thru(Yr)},bn.prototype.toJSON=bn.prototype.valueOf=bn.prototype.value=function(){return Gt(this.__wrapped__,this.__actions__);
},Au&&(bn.prototype[Au]=te),bn}var q,P=1/0,T=NaN,K=/\b__p\+='';/g,G=/\b(__p\+=)''\+/g,V=/(__e\(.*?\)|\b__t\))\+'';/g,J=/&(?:amp|lt|gt|quot|#39|#96);/g,Y=/[&<>"'`]/g,H=RegExp(J.source),Q=RegExp(Y.source),X=/<%-([\s\S]+?)%>/g,nn=/<%([\s\S]+?)%>/g,tn=/<%=([\s\S]+?)%>/g,rn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,en=/^\w*$/,un=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g,on=/[\\^$.*+?()[\]{}|]/g,fn=RegExp(on.source),cn=/^\s+|\s+$/g,an=/^\s+/,ln=/\s+$/,sn=/\\(\\)?/g,hn=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,pn=/\w*$/,_n=/^0x/i,vn=/^[-+]0x[0-9a-f]+$/i,gn=/^0b[01]+$/i,dn=/^\[object .+?Constructor\]$/,yn=/^0o[0-7]+$/i,bn=/^(?:0|[1-9]\d*)$/,xn=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,jn=/($^)/,mn=/['\n\r\u2028\u2029\\]/g,wn="[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?)*",An="(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])"+wn,On="(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]?|[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])",kn=RegExp("[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]","g"),En=RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|"+On+wn,"g"),In=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),Sn=/[a-zA-Z0-9]+/g,Rn=RegExp(["[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2018\\u2019\\u201c\\u201d \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2018\\u2019\\u201c\\u201d \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2018\\u2019\\u201c\\u201d \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2018\\u2019\\u201c\\u201d \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2018\\u2019\\u201c\\u201d \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+|[A-Z\\xc0-\\xd6\\xd8-\\xde]+|\\d+",An].join("|"),"g"),Wn=/[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Bn="Array Buffer Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Math Object Reflect RegExp Set String Symbol TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap _ clearTimeout isFinite parseInt setTimeout".split(" "),Cn={};
Cn["[object Float32Array]"]=Cn["[object Float64Array]"]=Cn["[object Int8Array]"]=Cn["[object Int16Array]"]=Cn["[object Int32Array]"]=Cn["[object Uint8Array]"]=Cn["[object Uint8ClampedArray]"]=Cn["[object Uint16Array]"]=Cn["[object Uint32Array]"]=true,Cn["[object Arguments]"]=Cn["[object Array]"]=Cn["[object ArrayBuffer]"]=Cn["[object Boolean]"]=Cn["[object Date]"]=Cn["[object Error]"]=Cn["[object Function]"]=Cn["[object Map]"]=Cn["[object Number]"]=Cn["[object Object]"]=Cn["[object RegExp]"]=Cn["[object Set]"]=Cn["[object String]"]=Cn["[object WeakMap]"]=false;
var Un={};Un["[object Arguments]"]=Un["[object Array]"]=Un["[object ArrayBuffer]"]=Un["[object Boolean]"]=Un["[object Date]"]=Un["[object Float32Array]"]=Un["[object Float64Array]"]=Un["[object Int8Array]"]=Un["[object Int16Array]"]=Un["[object Int32Array]"]=Un["[object Map]"]=Un["[object Number]"]=Un["[object Object]"]=Un["[object RegExp]"]=Un["[object Set]"]=Un["[object String]"]=Un["[object Symbol]"]=Un["[object Uint8Array]"]=Un["[object Uint8ClampedArray]"]=Un["[object Uint16Array]"]=Un["[object Uint32Array]"]=true,
Un["[object Error]"]=Un["[object Function]"]=Un["[object WeakMap]"]=false;var zn={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O",
"\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae","\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss"},Mn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},Ln={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#96;":"`"},$n={"function":true,object:true},Fn={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"
},Nn=parseFloat,Dn=parseInt,Zn=$n[typeof exports]&&exports&&!exports.nodeType?exports:q,qn=$n[typeof module]&&module&&!module.nodeType?module:q,Pn=qn&&qn.exports===Zn?Zn:q,Tn=I($n[typeof self]&&self),Kn=I($n[typeof window]&&window),Gn=I($n[typeof this]&&this),Vn=I(Zn&&qn&&typeof global=="object"&&global)||Kn!==(Gn&&Gn.window)&&Kn||Tn||Gn||Function("return this")(),Jn=Z();(Kn||Tn||{})._=Jn,typeof define=="function"&&typeof define.amd=="object"&&define.amd? define(function(){return Jn}):Zn&&qn?(Pn&&((qn.exports=Jn)._=Jn),
Zn._=Jn):Vn._=Jn}).call(this);;var profiles = [
  {
    "guid": "701b29c3-b35d-4cf1-a5f6-8b12b29a5081",
    "index": 0,
    "favoriteFruit": "banana",
    "latitude": 58.161524999999997,
    "company": "INDEXIA",
    "email": "moorehensley@indexia.com",
    "picture": "http://placehold.it/32x32",
    "registered": "2015-07-03T08:30:59 -03:00",
    "eyeColor": "blue",
    "phone": "+1 (848) 556-2344",
    "address": "268 Debevoise Street, Fidelis, North Carolina, 3606",
    "friends": [
      {
        "id": 0,
        "name": "Sharron Pace"
      }
    ],
    "isActive": false,
    "about": "Velit laborum aliquip voluptate incididunt dolore qui proident velit adipisicing. Pariatur sint fugiat aute eiusmod aute aliquip dolor culpa enim quis. Ea elit ad duis cillum et aliquip. Elit aliquip enim ut quis tempor. Veniam irure minim esse proident culpa Lorem duis veniam dolor anim quis laboris id laboris. Enim minim eiusmod labore do consectetur voluptate pariatur cillum fugiat dolore magna incididunt. Qui eiusmod Lorem qui irure consequat.\r\n",
    "balance": "$2,811.93",
    "name": "Moore Hensley",
    "skills": [
      "ea",
      "ipsum",
      "Lorem"
    ],
    "gender": "male",
    "age": 37,
    "greeting": "Hello, Moore Hensley! You have 5 unread messages.",
    "longitude": -10.931599,
    "_id": "56bdc339702f16daa316d2eb"
  },
  {
    "guid": "7a3cbd18-57a1-4534-8e12-1caad921bda1",
    "index": 1,
    "favoriteFruit": "banana",
    "latitude": 14.810798999999999,
    "company": "TUBESYS",
    "email": "sharlenebush@tubesys.com",
    "picture": "http://placehold.it/32x32",
    "registered": "2014-03-22T11:03:44 -02:00",
    "eyeColor": "blue",
    "phone": "+1 (855) 582-2464",
    "address": "848 Hicks Street, Chestnut, Palau, 5667",
    "friends": [
      {
        "id": 0,
        "name": "Briana Decker"
      },
      {
        "id": 1,
        "name": "Sharron Pace"
      }
    ],
    "isActive": true,
    "about": "Consectetur velit officia eiusmod esse labore sint anim nostrud elit nulla dolore dolor. In aute ad incididunt pariatur cupidatat do deserunt irure. Exercitation cillum enim incididunt amet Lorem ut Lorem nulla.\r\n",
    "balance": "$3,821.77",
    "name": "Sharlene Bush",
    "skills": [
      "tempor",
      "mollit",
      "velit",
      "commodo",
      "veniam",
      "cupidatat",
      "laborum"
    ],
    "gender": "female",
    "age": 34,
    "greeting": "Hello, Sharlene Bush! You have 2 unread messages.",
    "longitude": 65.625151000000002,
    "_id": "56bdc33986e3357811d1a81e"
  },
  {
    "guid": "88beb2f3-e4c2-49f3-a0a0-ecf957a95af3",
    "index": 2,
    "favoriteFruit": "apple",
    "latitude": 73.588680999999994,
    "company": "XINWARE",
    "email": "rossvazquez@xinware.com",
    "picture": "http://placehold.it/32x32",
    "registered": "2014-06-14T03:11:08 -03:00",
    "eyeColor": "green",
    "phone": "+1 (814) 593-3825",
    "address": "680 Pooles Lane, Sattley, Maine, 3025",
    "friends": [
      {
        "id": 0,
        "name": "Marilyn Mcintosh"
      },
      {
        "id": 1,
        "name": "Padilla Garrison"
      },
      {
        "id": 2,
        "name": "Naomi Buckner"
      }
    ],
    "isActive": false,
    "about": "Ut dolor nostrud enim ullamco sit reprehenderit nisi commodo eiusmod amet esse ea. Lorem amet duis in culpa do laboris deserunt esse culpa irure est. Lorem tempor officia amet amet magna ea pariatur. Occaecat qui minim commodo quis excepteur eiusmod in minim deserunt occaecat dolor. Ipsum dolore elit pariatur exercitation anim.\r\n",
    "balance": "$3,793.59",
    "name": "Ross Vazquez",
    "skills": [
      "nulla",
      "anim",
      "proident",
      "ipsum",
      "ad",
      "consectetur",
      "elit"
    ],
    "gender": "male",
    "age": 24,
    "greeting": "Hello, Ross Vazquez! You have 9 unread messages.",
    "longitude": 139.45094800000001,
    "_id": "56bdc3397558ab111683cfd6"
  },
  {
    "guid": "249b6175-5c30-44c6-b154-f120923736f5",
    "index": 3,
    "favoriteFruit": "banana",
    "latitude": -76.562336000000002,
    "company": "OMATOM",
    "email": "elmahead@omatom.com",
    "picture": "http://placehold.it/32x32",
    "registered": "2014-01-15T06:51:52 -02:00",
    "eyeColor": "green",
    "phone": "+1 (909) 547-2687",
    "address": "956 Roebling Street, Fairforest, Virgin Islands, 2586",
    "friends": [
      {
        "id": 0,
        "name": "Goldie Gentry"
      },
      {
        "id": 1,
        "name": "Aisha Tran"
      }
    ],
    "isActive": true,
    "about": "Anim mollit tempor ullamco adipisicing ipsum labore incididunt occaecat aliquip sint et enim. Ad nulla labore commodo proident aute. Nisi elit aute labore magna fugiat aliqua. Voluptate cupidatat duis est laboris. Quis ut amet nulla sit esse commodo commodo fugiat dolor tempor enim velit. In pariatur ex labore ea tempor proident proident. Sint excepteur excepteur dolor tempor nostrud nisi proident cupidatat excepteur laborum incididunt culpa aliqua.\r\n",
    "balance": "$2,278.75",
    "name": "Elma Head",
    "skills": [
      "adipisicing",
      "irure",
      "sit",
      "quis",
      "velit"
    ],
    "gender": "female",
    "age": 21,
    "greeting": "Hello, Elma Head! You have 8 unread messages.",
    "longitude": -131.352147,
    "_id": "56bdc3395273667c0f89b902"
  },
  {
    "guid": "334f8cb3-eb04-45e6-abf4-4935dd439b70",
    "index": 4,
    "favoriteFruit": "banana",
    "latitude": 19.039227,
    "company": "NURALI",
    "email": "careybarr@nurali.com",
    "picture": "http://placehold.it/32x32",
    "registered": "2015-04-03T01:25:56 -03:00",
    "eyeColor": "blue",
    "phone": "+1 (956) 512-2693",
    "address": "500 Harbor Court, Wilmington, District Of Columbia, 4946",
    "friends": [
      {
        "id": 0,
        "name": "Jordan Sampson"
      },
      {
        "id": 1,
        "name": "Eddie Strong"
      }
    ],
    "isActive": true,
    "about": "Deserunt anim esse duis labore enim ex ullamco. Commodo enim fugiat dolore qui aliquip. Est voluptate sit fugiat est. Duis eu exercitation amet cillum esse aliquip quis culpa mollit commodo anim.\r\n",
    "balance": "$3,951.17",
    "name": "Carey Barr",
    "skills": [
      "ex",
      "culpa",
      "nostrud",
      "et"
    ],
    "gender": "male",
    "age": 27,
    "greeting": "Hello, Carey Barr! You have 4 unread messages.",
    "longitude": -100.85060199999999,
    "_id": "56bdc3398f16bb4615b26c69"
  },
  {
    "guid": "150b00fb-dd82-427d-9faf-2879ea87c695",
    "index": 5,
    "favoriteFruit": "apple",
    "latitude": -33.762830999999998,
    "company": "FURNIGEER",
    "email": "blackburndotson@furnigeer.com",
    "picture": "http://placehold.it/32x32",
    "registered": "2014-12-19T02:55:31 -02:00",
    "eyeColor": "brown",
    "phone": "+1 (876) 411-2433",
    "address": "219 Bijou Avenue, Finzel, Wisconsin, 9092",
    "friends": [
      {
        "id": 0,
        "name": "Jacklyn Lucas"
      },
      {
        "id": 1,
        "name": "Linda Chapman"
      }
    ],
    "isActive": false,
    "about": "Qui consequat exercitation incididunt elit non est est ea amet. Ad veniam eiusmod nostrud esse occaecat nulla dolor velit deserunt. Aliquip ex minim amet id id ullamco fugiat. Non exercitation duis fugiat consectetur amet cupidatat veniam id sint enim Lorem amet sit aute. Voluptate minim dolor exercitation id incididunt ullamco proident sit. Velit ut id eu dolore laboris consectetur aute consequat tempor. Sunt aliquip proident officia magna veniam voluptate.\r\n",
    "balance": "$1,498.77",
    "name": "Blackburn Dotson",
    "skills": [
      "non",
      "do",
      "non",
      "amet",
      "ipsum"
    ],
    "gender": "male",
    "age": 38,
    "greeting": "Hello, Blackburn Dotson! You have 6 unread messages.",
    "longitude": 32.616394999999997,
    "_id": "56bdc33939066929c893b269"
  },
  {
    "guid": "e1bf46ab-7168-491e-925e-f01e21394812",
    "index": 6,
    "favoriteFruit": "strawberry",
    "latitude": 15.419051,
    "company": "KOG",
    "email": "shereeanthony@kog.com",
    "picture": "http://placehold.it/32x32",
    "registered": "2015-02-25T01:02:55 -02:00",
    "eyeColor": "brown",
    "phone": "+1 (979) 504-2554",
    "address": "702 Highland Avenue, Caberfae, Minnesota, 5570",
    "friends": [
      {
        "id": 0,
        "name": "Goldie Gentry"
      },
      {
        "id": 1,
        "name": "Briana Decker"
      }
    ],
    "isActive": true,
    "about": "Cillum fugiat officia exercitation nulla quis consequat eu irure ut magna irure. Mollit laborum nulla in laboris officia sit. Nisi cupidatat velit ad deserunt commodo minim minim ullamco adipisicing qui dolore adipisicing esse.\r\n",
    "balance": "$2,764.03",
    "name": "Sheree Anthony",
    "skills": [
      "Lorem",
      "veniam",
      "excepteur",
      "culpa"
    ],
    "gender": "female",
    "age": 39,
    "greeting": "Hello, Sheree Anthony! You have 5 unread messages.",
    "longitude": 37.385548,
    "_id": "56bdc3396fdbaec5ee4ca929"
  }
]

$(function() {
	$('.flexslider').flexslider({
		animation: "slide"
	});
    
    // LoDash (different methods)
	var uniqSkillsList = _.sortBy(_.uniq(_.flatten(_.map(profiles, 'skills'))), _.toLower);

	var rangeByFrienfsQ = _.sortBy(profiles, 'friends');
	rangeByFrienfsQ = _.map(rangeByFrienfsQ, 'name');

	var uniqFriendsList = _
		.chain(profiles)
		.map('friends')
		.flatten()
		.map('name')
		.uniq()
		.value();

	console.log('uniqSkillsList', uniqSkillsList);
	console.log('rangeByFrienfsQ', rangeByFrienfsQ);
	console.log('uniqFriendsList', uniqFriendsList);
});

