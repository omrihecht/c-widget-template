var docObj = {},
		deviceObj = {},
		campaignObj = {
			id									: 28,
			callmeParam					: 30,
			ref									: ( refHandler.getURLVars()['ref'] == undefined ) ? '' : refHandler.getURLVars()['ref']
		};

$(document).ready(function (e) {
	var md = new MobileDetect(window.navigator.userAgent);
	if(md.tablet() != null){
		deviceObj.tablet = true;
		$('html').addClass('ipad-device');
	}
	if(md.phone() != null){

		deviceObj.mobile = true;

		$('html').addClass('mobile-device');

        $('html').addClass(md.os());
		deviceObj.os = md.os();
	}

	head.ready(function () {

		if(head.browser.name == 'chrome'){
			deviceObj.chrome = true;
		}

		if(head.browser.name == 'ie'){
			deviceObj.ie = true;
		}

		if( window.navigator.userAgent.indexOf("Edge") > -1 ){
			deviceObj.ie = true;
		}

		if(head.browser.name == 'ie' && head.browser.version < 10){
			deviceObj.oldIe = true;
			if (!window.console) {window.console = {};}
			if (!console.log) {console.log = function() {};}
		}

		docObj.docW = window.innerWidth;
		docObj.docH = window.innerHeight;

		$( window ).resize(onPageResize);
		onPageResize();
	});
});

$(window).load(function(){

});

function onPageResize(){
	docObj.docW = window.innerWidth;
	docObj.docH = window.innerHeight;
}
