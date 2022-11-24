(function($) {
	"use strict";
	
	//Active Class
	$(".app-sidebar a").each(function() {
		var pageUrl = window.location.href.split(/[?#]/)[0];
		if (this.href == pageUrl) {
			$(this).addClass("active");
			$(this).parent().parent().parent().addClass("active"); // add active to li of the current link
			$(this).parent().parent().prev().addClass("active"); // add active class to an anchor
			$(this).parent().parent().prev().click(); // click the item to make it drop
		}
	});
	
	//Color Skins
	$("a[data-theme]").click(function() {
		$("head link#theme").attr("href", $(this).data("theme"));
		$(this).toggleClass('active').siblings().removeClass('active');
	});
	$("a[data-effect]").click(function() {
		$("head link#effect").attr("href", $(this).data("effect"));
		$(this).toggleClass('active').siblings().removeClass('active');
	});
	
	$(window).on("scroll", function(e){
		
		// ______________Headerfixed
		if ($(window).scrollTop() >= 66) {
			$('header').addClass('fixed-header');
		}
		else {
			$('.header').removeClass('fixed-header');
		}
		
		//  BACK TO TOP BUTTON
		if ($(this).scrollTop() > 0) {
			$('#back-to-top').fadeIn('slow');
		} else {
			$('#back-to-top').fadeOut('slow');
		}
    });
	
	//Cover images
	$( ".cover-image").each(function() {
		  var attr = $(this).attr('data-image-src');
		
		  if (typeof attr !== typeof undefined && attr !== false) {
			  $(this).css('background', 'url('+attr+') center center');
		  }
	});
	
	//Cover image2
	$( ".cover-image2").each(function() {
		  var attr = $(this).attr('data-image-src');
		
		  if (typeof attr !== typeof undefined && attr !== false) {
			  $(this).css('background', 'url('+attr+') center center');
		  }
	});
	
	//p-scroll
	const ps = new PerfectScrollbar('.sidebar-right', {
	  useBothWheelAxes:true,
	  suppressScrollX:true,
	});
	

	//PAGE LOADING
	$(window).on("load", function(e) {
		$("#spinner").fadeOut("slow");
	})
	
	// Tooltip
	$("[data-toggle='tooltip']").tooltip();

	// Popover
	$('[data-toggle="popover"]').popover({
		container: 'body'
	});
	
	if ($('#ms-menu-trigger')[0]) {
		$('body').on('click', '#ms-menu-trigger', function() {
			$('.ms-menu').toggleClass('toggled'); 
		});
	}
	
	$(document).on("click", "#back-to-top", function(e) {
		$("html, body").animate({
			scrollTop: 0
		}, 600);
		return false;
	});

	
	//FullScreen
	$(document).on("click","#fullscreen-button", function toggleFullScreen() {
		if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
			if (document.documentElement.requestFullScreen) {
			  document.documentElement.requestFullScreen();
			} else if (document.documentElement.mozRequestFullScreen) {
			  document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullScreen) {
			  document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (document.documentElement.msRequestFullscreen) {
			  document.documentElement.msRequestFullscreen();
			}
		} else {
			if (document.cancelFullScreen) {
			  document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
			  document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
			  document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
			  document.msExitFullscreen();
			}
		}
	})
	
	
	//GlobalSearch
	$(document).on("click", "[data-toggle='search']", function(e) {
		var body = $("body");

		if(body.hasClass('search-gone')) {
			body.addClass('search-gone');
			body.removeClass('search-show');
		}else{
			body.removeClass('search-gone');
			body.addClass('search-show');
		}
	});
	var toggleSidebar = function() {
		var w = $(window);
		if(w.outerWidth() <= 1024) {
			$("body").addClass("sidebar-gone");
			$(document).off("click", "body").on("click", "body", function(e) {
				if($(e.target).hasClass('sidebar-show') || $(e.target).hasClass('search-show')) {
					$("body").removeClass("sidebar-show");
					$("body").addClass("sidebar-gone");
					$("body").removeClass("search-show");
				}
			});
		}else{
			$("body").removeClass("sidebar-gone");
		}
	}
	toggleSidebar();
	$(window).resize(toggleSidebar);
		
	//CollapseableLeftMenu
	$("[data-collapse]").each(function() {
		var me = $(this),
				target = me.data('collapse');

		me.click(function() {
			$(target).collapse('toggle');
			$(target).on('shown.bs.collapse', function() {
				me.html('<i class="ion ion-minus"></i>');
			});
			$(target).on('hidden.bs.collapse', function() {
				me.html('<i class="ion ion-plus"></i>');
			});
			return false;
		});
	});
	
	//Alerts
	$(".alert-dismissible").each(function() {
		var me = $(this);

		me.find('.close').on("click", function(e) {
			me.alert('close');
		});
	});
	
	//star rating
	var ratingOptions = {
		selectors: {
			starsSelector: '.rating-stars',
			starSelector: '.rating-star',
			starActiveClass: 'is--active',
			starHoverClass: 'is--hover',
			starNoHoverClass: 'is--no-hover',
			targetFormElementSelector: '.rating-value'
		}
	};
	$(".rating-stars").ratingStars(ratingOptions);
	
	//Showmore
	$(function(e) {
		$('#container').showmore({
			closedHeight: 200,
			buttonTextMore: 'Show more',
			buttonTextLess: 'Close',
			buttonCssClass: 'showmore-button',
			animationSpeed: 0.5
		});
	});
	
	//Popup-chat
	$("#addClass").on("click", function (e) {
		$('#qnimate').addClass('popup-box-on');
	});

	$("#removeClass").on("click", function (e) {
		$('#qnimate').removeClass('popup-box-on');
	});
	
	/*-- Theme mode ---*/
	$('#myonoffswitch1').click(function () {    
		if (this.checked) {
			$('body').addClass('light-mode');
			$('body').removeClass('dark-mode');
			localStorage.setItem("light-mode", "True");
		}
		else {
			$('body').removeClass('light-mode');
			localStorage.setItem("light-mode", "false");
		}
	});
	$('#myonoffswitch2').click(function () {    
		if (this.checked) {
			$('body').addClass('dark-mode');
			$('body').removeClass('light-mode');
			localStorage.setItem("dark-mode", "True");
		}
		else {
			$('body').removeClass('dark-mode');
			localStorage.setItem("dark-mode", "false");
		}
	});
	
	/*-- Horizonatal Versions---*/
	$('#myonoffswitch3').click(function () {    
		if (this.checked) {
			$('body').addClass('default');
			$('body').removeClass('sticky-header');
			$('body').removeClass('sticky-boxed');
			$('body').removeClass('boxed');
			localStorage.setItem("default", "True");
		}
		else {
			$('body').removeClass('default');
			localStorage.setItem("default", "false");
		}
	});
	$('#myonoffswitch4').click(function () {    
		if (this.checked) {
			$('body').addClass('boxed');
			$('body').removeClass('sticky-header');
			$('body').removeClass('sticky-boxed');
			$('body').removeClass('default');
			localStorage.setItem("boxed", "True");
		}
		else {
			$('body').removeClass('boxed');
			localStorage.setItem("boxed", "false");
		}
	});
	$('#myonoffswitch5').click(function () {    
		if (this.checked) {
			$('body').addClass('sticky-header');
			$('body').removeClass('boxed');
			$('body').removeClass('default');
			$('body').removeClass('sticky-boxed');
			localStorage.setItem("sticky-header", "True");
		}
		else {
			$('body').removeClass('sticky-header');
			localStorage.setItem("sticky-header", "false");
		}
	});
	$('#myonoffswitch6').click(function () {    
		if (this.checked) {
			$('body').addClass('sticky-boxed');
			$('body').removeClass('sticky-header');
			$('body').removeClass('boxed');
			$('body').removeClass('default');
			localStorage.setItem("sticky-boxed", "True");
		}
		else {
			$('body').removeClass('sticky-boxed');
			localStorage.setItem("sticky-boxed", "false");
		}
	});
	
	/*-- Leftmenu Versions---*/
	$('#myonoffswitch7').click(function () {    
		if (this.checked) {
			$('body').addClass('default-left-menu');
			$('body').removeClass('left-menu-boxed');
			$('body').removeClass('dark-left-menu');
			$('body').removeClass('dark-left-menu-boxed');
			localStorage.setItem("default-left-menu", "True");
		}
		else {
			$('body').removeClass('default-left-menu');
			localStorage.setItem("default-left-menu", "false");
		}
	});
	$('#myonoffswitch8').click(function () {    
		if (this.checked) {
			$('body').addClass('left-menu-boxed');
			$('body').removeClass('default-left-menu');
			$('body').removeClass('dark-left-menu');
			$('body').removeClass('dark-left-menu-boxed');
			localStorage.setItem("left-menu-boxed", "True");
		}
		else {
			$('body').removeClass('left-menu-boxed');
			localStorage.setItem("left-menu-boxed", "false");
		}
	});
	$('#myonoffswitch9').click(function () {    
		if (this.checked) {
			$('body').addClass('dark-left-menu');
			$('body').removeClass('default-left-menu');
			$('body').removeClass('left-menu-boxed');
			$('body').removeClass('dark-left-menu-boxed');
			localStorage.setItem("dark-left-menu", "True");
		}
		else {
			$('body').removeClass('dark-left-menu');
			localStorage.setItem("dark-left-menu", "false");
		}
	});
	$('#myonoffswitch10').click(function () {    
		if (this.checked) {
			$('body').addClass('dark-left-menu-boxed');
			$('body').removeClass('dark-left-menu');
			$('body').removeClass('default-left-menu');
			$('body').removeClass('left-menu-boxed');
			localStorage.setItem("dark-left-menu-boxed", "True");
		}
		else {
			$('body').removeClass('dark-left-menu-boxed');
			localStorage.setItem("dark-left-menu-boxed", "false");
		}
	});
	
	
})(jQuery);

