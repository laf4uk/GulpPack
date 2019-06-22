$(function() {
	
	$('#my-menu').mmenu({
		extensions: [ 'widescreen', 'theme-black', 'effect-menu-slide', 'pagedim-black', 'position-back', 'position-right' ],
		navbar: {
			title: 'menu'
		},
		offCanvas: {

		}
	});

	var hamburgerIsActive = $('#my-menu').data('mmenu');
	hamburgerIsActive.bind('open:finish', function() {
		$('.hamburger').addClass('is-active');
	})
	.bind('close:finish', function() {
		$('.hamburger').removeClass('is-active');
	});

	var exitBut = $('#my-menu').data('mmenu');
	$('#exit').click(function(evnt) {
		evnt.preventDefault();
		exitBut.close();
	});

});
