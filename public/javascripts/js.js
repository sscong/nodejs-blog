$(function(){
	$('.nav a').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	});
})
