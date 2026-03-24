/*
	Stellar by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$main = $('#main');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		var $nav = $('#nav');

		if ($nav.length > 0) {

			// Shrink effect.
				$main
					.scrollex({
						mode: 'top',
						enter: function() {
							$nav.addClass('alt');
						},
						leave: function() {
							$nav.removeClass('alt');
						},
					});

			// Links.
				var $nav_a = $nav.find('a');

				$nav_a
					.scrolly({
						speed: 300,
						offset: function() { return $nav.height(); }
					})
					.on('click', function() {

						var $this = $(this);

						// External link? Bail.
							if ($this.attr('href').charAt(0) != '#')
								return;

						// Deactivate all links.
							$nav_a
								.removeClass('active')
								.removeClass('active-locked');

						// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
							$this
								.addClass('active')
								.addClass('active-locked');

					})
					.each(function() {

						var	$this = $(this),
							id = $this.attr('href'),
							$section = $(id);

						// No section for this link? Bail.
							if ($section.length < 1)
								return;

						// Scrollex.
							$section.scrollex({
								mode: 'middle',
								initialize: function() {

									// Deactivate section.
										if (browser.canUse('transition'))
											$section.addClass('inactive');

								},
								enter: function() {

									// Activate section.
										$section.removeClass('inactive');

									// No locked links? Deactivate all links and activate this section's one.
										if ($nav_a.filter('.active-locked').length == 0) {

											$nav_a.removeClass('active');
											$this.addClass('active');

										}

									// Otherwise, if this section's link is the one that's locked, unlock it.
										else if ($this.hasClass('active-locked'))
											$this.removeClass('active-locked');

								}
							});

					});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 300,
			offset: function() {
				var stickyNav = document.querySelector('.site-sticky-nav');
				return stickyNav ? stickyNav.offsetHeight + 24 : 24;
			}
		});

	// Sticky nav active section state.
		(function() {

			var stickyNav = document.querySelector('.site-sticky-nav');
			var navLinks = Array.from(document.querySelectorAll('.site-sticky-nav .hero-jumpnav a[href^="#"]'));

			if (!stickyNav || navLinks.length === 0)
				return;

			var sections = navLinks
				.map(function(link) {
					var id = link.getAttribute('href');
					var section = id ? document.querySelector(id) : null;

					if (!section)
						return null;

					return {
						id: id,
						link: link,
						section: section
					};
				})
				.filter(Boolean);

			if (sections.length === 0)
				return;

			var activeId = null;
			var pendingId = null;
			var activeLinkTimeout = null;
			var scrollLockUntil = 0;

			var setActiveLink = function(id) {
				activeId = id;
				navLinks.forEach(function(link) {
					link.classList.toggle('is-active', link.getAttribute('href') === id);
				});
			};

			var getCurrentSectionId = function() {
				var marker = window.scrollY + stickyNav.offsetHeight + 28;
				var currentId = sections[0].id;

				sections.forEach(function(item) {
					if (item.section.offsetTop <= marker)
						currentId = item.id;
				});

				return currentId;
			};

			var scheduleActiveLinkUpdate = function() {
				if (Date.now() < scrollLockUntil)
					return;

				var nextId = getCurrentSectionId();

				if (nextId === activeId) {
					pendingId = null;
					if (activeLinkTimeout) {
						window.clearTimeout(activeLinkTimeout);
						activeLinkTimeout = null;
					}
					return;
				}

				if (pendingId === nextId && activeLinkTimeout)
					return;

				pendingId = nextId;

				if (activeLinkTimeout)
					window.clearTimeout(activeLinkTimeout);

				activeLinkTimeout = window.setTimeout(function() {
					setActiveLink(nextId);
					pendingId = null;
					activeLinkTimeout = null;
				}, 120);
			};

			navLinks.forEach(function(link) {
				link.addEventListener('click', function() {
					var targetHash = link.getAttribute('href');

					if (activeLinkTimeout) {
						window.clearTimeout(activeLinkTimeout);
						activeLinkTimeout = null;
					}

					if (targetHash && targetHash.charAt(0) === '#') {
						if (window.history && window.history.replaceState)
							window.history.replaceState(null, document.title, targetHash);
						else
							window.location.hash = targetHash;
					}

					scrollLockUntil = Date.now() + 450;
					pendingId = null;
					setActiveLink(targetHash);
					window.setTimeout(scheduleActiveLinkUpdate, 470);
				});
			});

			window.addEventListener('scroll', scheduleActiveLinkUpdate, { passive: true });
			window.addEventListener('resize', scheduleActiveLinkUpdate);
			window.addEventListener('load', scheduleActiveLinkUpdate);
			setActiveLink(getCurrentSectionId());

		})();

})(jQuery);
