var canScroll = false;

$(document).ready(function() {

	// Loader init
	var splitHeaderHome = new SplitText(".section-main h1", {type: "words"});
	var splitTextHome = new SplitText(".section-main p", {type: "lines"});
	var splitTextBike = new SplitText(".bike-details p", {type: "lines"});
	var splitTextAbout = new SplitText(".about-text p", {type: "lines"});

	var loaderTl = new TimelineMax();
	loaderTl.set(".loader", {
		autoAlpha: 1
	}).staggerTo(".logo-first .letter-wrapper", 1, {
		autoAlpha: 0.1,
	}, 0.1).set("body", {
		backgroundColor: "#000"
	}).set(".logo-second", {
		className: "+=logo-second-active"
	}, 0.01).to(".logo-first", 0.1, {
		autoAlpha: 0
	}, 3).set(".logo-second", {
		className: "+=logo-second-active-dobule"
	}).set(".loader", {
		className: "+=loader-hide"
	}, 3.2).to(".bg", 1, {
		autoAlpha: 1
	}, 4).to(".logo", 0.6, {
		autoAlpha: 1,
		y: "0%"
	}, 4.8).set(".menubar", {
		className: "+=visible",
		onComplete: function() {
			$(".menubar").addClass("no-delay");
		}
	}, 5.2).staggerTo(".header .icon-search, .header .icon-request", 0.5, {
		autoAlpha: 1
	}, 0.1, 5.5).staggerTo(".menu .line", 0.5, {
		scale: 1
	}, 0.05, 5.5).to(".scroll", 0.5, {
		autoAlpha: 1
	}, 5.5).staggerTo(".section-main .social-media li", 1, {
		autoAlpha: 1
	}, 0.1, 5.6).set(".section-main img", {
		className: "+=visible"
	}, 5.7).staggerTo(".section-main h1 div", 1, {
		autoAlpha: 1
	}, 0.1, 7.2).staggerTo(".section-main p div", 2, {
		autoAlpha: 1
	}, 0.3, 7.9).to(".section-main a", 1, {
		autoAlpha: 1,
		onComplete: function() {
			canScroll = true;
			$(".section-main").addClass("section-loaded");
		}
	}, 8.8);

	// Menubar click
	$(".menubar").click(function(e) {
		e.preventDefault();

		$(".menu").toggleClass("menu-active");

		if($(this).hasClass("active")) {
			var menubarTlHide = new TimelineMax();
			menubarTlHide.staggerTo(".menu li .text", 0.3, {
				x: "150%"
			}, -0.075).set(".menu-wrapper", {
				className: "-=active"
			}, 0.35);

			$(this).toggleClass("active");
		} else {
			var menubarTlShow = new TimelineMax();
			menubarTlShow.set(".menu-wrapper", {
				className: "+=active"
			}).staggerTo(".menu li .text", 0.3, {
				x: "0%"
			}, 0.075, 0.1);

			$(this).toggleClass("active");
		}
	});

	// Bike sliders max number of items
	$(".bike-nav-end").text($(".bike-sliders li").length);

	// Menu button click
	$(".menu li a").click(function(e) {
		e.preventDefault();

		if($(window).width() > 992) {
			if(!$(this).parent().hasClass("active")) {
				var itemIndex = $(this).parent().index(),
					newActiveSection = $(".section").eq(itemIndex);

				changeActiveMenu(itemIndex);

				if(newActiveSection.hasClass("section-loaded")) {
					switchSlides($(".section-active"), newActiveSection);
					setTimeout(function() {
						canScroll = true;
					}, 1800);
				} else {
					loadSection(newActiveSection.attr("id"));
				}
			}
		} else {
			var elementID = $(this).attr("href"),
				itemIndex2 = $(this).parent().index();

			$("html, body").animate({
				scrollTop: $(elementID).offset().top
			}, 700);

			if(itemIndex2 == 0) {
				$(".header").removeClass("header-active");
			} else {
				$(".header").addClass("header-active");
			}

			$(".menubar").trigger("click");

			changeActiveMenu(itemIndex2);
		}
	});

	// Bike slider init for first item active
	$('.bike-sliders .active .bike-slider').slick({
		dots: true,
		arrows: false,
		speed: 200,
		fade: true,
		cssEase: 'linear',
		swipeToSlide: true,
		slidesToScroll: 1,
		touchThreshold: 100
	});

	// Bike nav item click
	$(".bike-nav-item").click(function(e) {
		e.preventDefault();

		var activeSlide = $(".bike-sliders .active"),
			changeSlideTl = new TimelineMax();

		if($(window).width() < 992) {
			$("html, body").animate({
				scrollTop: $("#bikes").offset().top - 80
			}, 700);
		}

		if($(this).hasClass("bike-nav-left")) {
			var newActivePrevSlide = null;

			if(activeSlide.prev('li').length) {
				newActivePrevSlide = activeSlide.prev();
			} else {
				newActivePrevSlide = $(".bike-sliders li").last();
			}

			$(".bike-nav-start").text(newActivePrevSlide.index() + 1);

			var changePrevSlide = new TimelineMax();

			activeSlide.removeClass("active");
			newActivePrevSlide.addClass("active");

			changePrevSlide.to(activeSlide, 0.5, {
				autoAlpha: 0,
				onComplete: function() {
					activeSlide.find('.bike-slider').slick('unslick');
					activeSlide.find(".bike-slider").removeAttr("style");
					activeSlide.find(".slick-dots li").removeAttr("style");
					activeSlide.hide();
				}
			}).to(newActivePrevSlide, 0.5, {
				display: "block",
				autoAlpha: 1,
				onComplete: function() {
					activeSlide.removeClass("active");
					newActivePrevSlide.addClass("active");
					newActivePrevSlide.show();

					var bikeSlider = newActivePrevSlide.find('.bike-slider');

					bikeSlider.on('init', function(event) {
						var bikeSliderLoaded = new TimelineMax();

						bikeSliderLoaded.to(".bike-sliders .active .bike-slider", 1, {
							autoAlpha: 1
						}).staggerTo(".bike-sliders .active .slick-dots li", 0.75, {
							autoAlpha: 1
						}, 0.1, 0.25);
					});

					bikeSlider.slick({
						dots: true,
						arrows: false,
						speed: 200,
						fade: true,
						cssEase: 'linear'
					});
				}
			}, 0.25);
		} else {
			var newActiveNextSlide = null;

			if(activeSlide.next('li').length) {
				newActiveNextSlide = activeSlide.next();
			} else {
				newActiveNextSlide = $(".bike-sliders li").first();
			}

			$(".bike-nav-start").text(newActiveNextSlide.index() + 1);

			var changeNextSlide = new TimelineMax();

			activeSlide.removeClass("active");
			newActiveNextSlide.addClass("active");

			changeNextSlide.to(activeSlide, 0.5, {
				autoAlpha: 0,
				onComplete: function() {
					activeSlide.find('.bike-slider').slick('unslick');
					activeSlide.find(".bike-slider").removeAttr("style");
					activeSlide.find(".slick-dots li").removeAttr("style");
					activeSlide.hide();
				}
			}).to(newActiveNextSlide, 0.5, {
				display: "block",
				autoAlpha: 1,
				onComplete: function() {
					activeSlide.removeClass("active");
					newActiveNextSlide.addClass("active");

					var bikeSlider = newActiveNextSlide.find('.bike-slider');

					bikeSlider.on('init', function(event) {
						var bikeSliderLoaded = new TimelineMax();
						newActiveNextSlide.show();

						bikeSliderLoaded.to(".bike-sliders .active .bike-slider", 1, {
							autoAlpha: 1
						}).staggerTo(".bike-sliders .active .slick-dots li", 0.75, {
							autoAlpha: 1
						}, 0.1, 0.25);
					});

					bikeSlider.slick({
						dots: true,
						arrows: false,
						speed: 200,
						fade: true,
						cssEase: 'linear'
					});
				}
			}, 0.25);
		}
	});

	// More button click for detail show
	$(".more").click(function(e) {
		e.preventDefault();
		var activeBikeSlider = $(".bike-sliders li.active").index();
		$(".details-list li.active").removeClass("active");
		$(".details-list li").eq(activeBikeSlider).addClass("active");
		$("#specification .details-wrapper").mCustomScrollbar();
		//$(".detials-section").addClass("active");
		$("#specification").addClass("active");
		canScroll = false;
	});

	// Detail close button
	$(".details-close").click(function(e) {
		e.preventDefault();

		$(".detials-section.active").removeClass("active");
		canScroll = true;
	});

	$(".terms").click(function(e) {
		e.preventDefault();
		var activeBikeSlider = $(".bike-sliders li.active").index();
		$(".details-list li.active").removeClass("active");
		$(".details-list li").eq(activeBikeSlider).addClass("active");
		$("#terms .details-wrapper").mCustomScrollbar();

		$("#terms").addClass("active");
		canScroll = false;
	});

	$(".legal").click(function(e) {
		e.preventDefault();
		var activeBikeSlider = $(".bike-sliders li.active").index();
		$(".details-list li.active").removeClass("active");
		$(".details-list li").eq(activeBikeSlider).addClass("active");
		$("#legal .details-wrapper").mCustomScrollbar();

		$("#legal").addClass("active");
		canScroll = false;
	});

	// Appoint request button click

	// Appoint header close button click

	// Calendar init
	if($(".calendar").length > 0) {
		$('.calendar').pignoseCalendar({
			init: function(context) {
				$(".day").val($(".pignose-calendar-unit-active").attr("data-date"));
				$(".daytime-day").text($(".pignose-calendar-unit-active").attr("data-date"));
				$(".daytime-time").text($(".time input").val());
			},
			select: function(date, context) {
				$('.day').val(date[0]._i);
				$(".daytime-day").text(date[0]._i);
			}
		});

		$(".time input").on("keyup", function() {
			$(".daytime-time").text($(this).val());
		});
	}

	$(".scroll").click(function(e) {
		e.preventDefault();

		if(canScroll) {
			canScroll = false;

			var sectionActiveDown = $(".section-active"),
				sectionActiveNext = sectionActiveDown.next();

			if(sectionActiveNext.hasClass("section")) {
				changeActiveMenu(sectionActiveNext.index());

				if(sectionActiveNext.hasClass("section-loaded")) {
					switchSlides(sectionActiveDown, sectionActiveNext);
					setTimeout(function() {
						canScroll = true;
					}, 1800);
				} else {
					var nextSectionID = sectionActiveNext.attr("id");
					loadSection(nextSectionID);
				}
			}
		}
	});
});

// Wheel
window.addEventListener("wheel", function(e) {
	if($(window).width() < 992) {
		if(e.deltaY > 0) {
			$(".header").addClass("header-active");
		} else {
			$(".header").removeClass("header-active");
		}
	}

	if(canScroll && $(window).width() > 992) {
		if (e.deltaY > 0) {

			var sectionActiveDown = $(".section-active"),
				sectionActiveNext = sectionActiveDown.next();

			if(sectionActiveNext.hasClass("section")) {
				changeActiveMenu(sectionActiveNext.index());

				if(sectionActiveNext.hasClass("section-loaded")) {
					switchSlides(sectionActiveDown, sectionActiveNext);
					setTimeout(function() {
						canScroll = true;
					}, 1800);
				} else {
					var nextSectionID = sectionActiveNext.attr("id");
					loadSection(nextSectionID);
				}
			}
		} else {
			var sectionActiveUp = $(".section-active"),
				sectionActivePrev = sectionActiveUp.prev();

			if(sectionActivePrev.hasClass("section")) {
				changeActiveMenu(sectionActivePrev.index());

				if(sectionActivePrev.hasClass("section-loaded")) {
					switchSlides(sectionActiveUp, sectionActivePrev);
					setTimeout(function() {
						canScroll = true;
					}, 1800);
				} else {
					var prevSectionID = sectionActivePrev.attr("id");
					loadSection(prevSectionID);
				}
			}
		}
	}
});

function loadBikesSection() {
	canScroll = false;

	var tlBikes = new TimelineMax();
	tlBikes.to(".section-active", 0.5, {
		autoAlpha: 0
	}).set(".section-active", {
		className: "-=section-active"
	}).set(".section-bikes", {
		className: "+=section-active"
	}).to(".bike-sliders .active .bike-slider", 2.5, {
		autoAlpha: 1
	}, 1).staggerTo(".bike-info h2, .bike-info h4, .bike-info p", 1, {
		autoAlpha: 1,
		y: "0%"
	}, 0.25, 1).staggerTo(".bike-sliders .active .slick-dots li", 0.75, {
		autoAlpha: 1
	}, 0.1, 1.25).staggerTo(".bike-details p div", 1, {
		autoAlpha: 1
	}, 0.1, 1.8).to(".bike-details a", 1, {
		autoAlpha: 1
	}, 2.1).staggerTo(".bike-nav-item", 1, {
		visibility: "visible"
	}, 0.1, 2.2).staggerTo(".bike-nav > div", 1, {
		autoAlpha: 1
	}, 0.1, 2.3).set(".bike-details", {
		className: "+=bike-details-visible",
		onComplete: function() {
			canScroll = true;
			$(".section-active").addClass("section-loaded");
		}
	}, 2.4);
}

function loadAboutSection() {
	canScroll = false;

	var tlBikes = new TimelineMax();
	tlBikes.to(".section-active", 0.5, {
		autoAlpha: 0
	}).set(".section-active", {
		className: "-=section-active"
	}).set(".section-about", {
		className: "+=section-active"
	}).to(".bg", 0.5, {
		autoAlpha: 0
	}).to(".shadow", 0.5, {
		autoAlpha: 1
	}, 1).staggerTo(".section-about svg path", 1, {
		autoAlpha: 0.1
	}, 0.1, 1.25).set(".about-img", {
		className: "+=about-img-visible "
	}, 2.2).staggerTo(".section-about h2, .section-about h4, .section-about p > div, .section-about a", 1.5, {
		autoAlpha: 1,
		onComplete: function() {
			canScroll = true;
			$(".section-active").addClass("section-loaded");
		}
	}, 0.225, 2.75);
}

function loadContactSection() {
	canScroll = false;

	var tlContact = new TimelineMax();
	tlContact.to(".section-active", 0.5, {
		autoAlpha: 0
	}).set(".section-active", {
		className: "-=section-active"
	}).set(".section-contact", {
		className: "+=section-active"
	}).staggerTo(".contact-text-inner h3, .contact-text-inner p, .contact-text-inner ul", 1, {
		autoAlpha: 1,
		y: 0
	}, 0.2).set(".contact-info .line", {
		className: "+=line-active"
	}, 2.1).staggerTo(".contact-info .text, .contact-info .page-link, .contact-info .contact-times li", 1, {
		autoAlpha: 1,
		onComplete: function() {
			canScroll = true;
			$(".section-active").addClass("section-loaded");
		}
	}, 0.1, 2.3);
}

function switchSlides(oldActive, newActive) {
	canScroll = false;

	var tlContact = new TimelineMax();

	tlContact.to(oldActive, 0.5, {
		autoAlpha: 0
	}).set(oldActive, {
		className: "-=section-active"
	}).set(newActive, {
		className: "+=section-active"
	}).to(newActive, 0.5, {
		autoAlpha: 1,
		onComplete: function() {
			// canScroll = true;
			// if(!newActive.hasClass("section-bikes") && !newActive.hasClass("section-main")) {
			// 	canScroll = true;
			// }
		}
	}, 0.5);

	if(newActive.hasClass("section-bikes") || newActive.hasClass("section-main")) {
		tlContact.to($(".bg"), 0.5, {
			autoAlpha: 1,
			onComplete: function() {
				//canScroll = true;
			}
		}, 0.25);
	} else {
		tlContact.to($(".bg"), 0.5, {
			autoAlpha: 0,
			onComplete: function() {
				//canScroll = true;
			}
		}, 0.25);
	}
}

function loadSection(sectionID) {
	switch(sectionID) {
		case "bikes":
			loadBikesSection();
			break;
		case "about":
			loadAboutSection();
			break;
		case "contact":
			loadContactSection();
	}
}

function changeActiveMenu(newIndex) {
	$(".menu .active").removeClass("active");
	$(".menu li").eq(newIndex).addClass("active");
}