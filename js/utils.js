var events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.events[eventName]) {
      for (var i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  trigger: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};

var pixelLoader = (function(){

  function loadIframe( iframeSrc ){
    var pixel_iframe = document.createElement('iframe');
  	pixel_iframe.setAttribute('width', '1');
  	pixel_iframe.setAttribute('height', '1');
  	pixel_iframe.setAttribute('frameborder', '0');
  	pixel_iframe.setAttribute('style', 'display: none;');
  	document.body.appendChild(pixel_iframe);
  	pixel_iframe.setAttribute('src', iframeSrc );
  }

  function loadScript( scriptSrc ){
    var head = document.getElementsByTagName('head')[0];
  	var js = document.createElement("script");
  	js.src = scriptSrc;
  	head.appendChild(js);
  }

  return {
    loadIframe  : loadIframe,
    loadScript  : loadScript
  }

})();

var refHandler = (function(){

  if( getURLVars()['ref'] != undefined ){
    var ref = getURLVars()['ref'].toLowerCase();
    $('.call-btn.mobile-element').attr('href' , 'tel:' + campaignPhoneByRef[ref] );
  }

  function getURLVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  return {
    getURLVars  : getURLVars
  }

})();

var formUtils = {

  formObj: {},

  initForm: function( $formElem ){
    $formElem.find('input , textarea').each(function(){
      $(this).removeClass('not-empty');
      $(this).on('change',function(){
        if($(this).val() != '') $(this).addClass('not-empty');
        if($(this).val() == '') $(this).removeClass('not-empty');
      });
    });
    $formElem.find('input[type="tel"]').keydown(function (e) {
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
      (e.keyCode == 65 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  },
  isPhone: function( str ){
    var reg = /^0([50|52|53|54|55|56|57|58|59|72|74|76|77]{2}|[2|3|4|8|9]{1})-{0,1}?[0-9]{7}$/;
    return reg.test(str);
  },
  isEmail: function( str ){
    debugger
  },
  trim: function(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  },
  isNumeric: function(str) {
    var reg = /^[-+]?\d*\.?\d*$/;
    return reg.test(str);
  },
  initFormType: function(){
    var curTimeURL = 'https://hooliganspro.co.il/cellcom/campaigns/handlers/getCurrentDateTime.ashx';
    $.ajax({
      type: "POST",
      url: curTimeURL,
      success: function (data) {
        var _dateTmp = data.split(',');
        var _date = [];
        for(var i = 0; i<_dateTmp.length; i++){
          _date[i] = parseInt(_dateTmp[i]);
        }
        var curDate = new Date(_date[0],_date[1] - 1,_date[2],_date[3],_date[4],_date[5]);
        if( refHandler.getURLVars()['year'] != undefined ){
          curDate.setYear(refHandler.getURLVars()['year']);
        }
        if( refHandler.getURLVars()['month'] != undefined ){
          curDate.setMonth(refHandler.getURLVars()['month']);
        }
        if( refHandler.getURLVars()['date'] != undefined ){
          curDate.setDate(refHandler.getURLVars()['date']);
        }
        if( refHandler.getURLVars()['hours'] != undefined ){
          curDate.setHours(refHandler.getURLVars()['hours']);
        }
        if( refHandler.getURLVars()['minutes'] != undefined ){
          curDate.setMinutes(refHandler.getURLVars()['minutes']);
        }

        console.log('curDate :: ' + curDate);
        events.trigger('formTypeInit', getFormType(curDate) );
      },
      error: function ( curDate ) { debugger }
    });

    function getFormType( curDate ){

      if( callFormTime.holidayExceptions.length > 0 ){
        for( var i=0; i<callFormTime.holidayExceptions.length; i++ ){
          var year = callFormTime.holidayExceptions[i].date.split('.')[2];
          var month = parseInt( callFormTime.holidayExceptions[i].date.split('.')[1] ) - 1;
          var date = callFormTime.holidayExceptions[i].date.split('.')[0];

          if( (curDate.getFullYear() == year) && (curDate.getMonth() == month) && (curDate.getDate() == date)){
            console.log('holiday exception');
            return getFormType( parseOpenHours( callFormTime.holidayExceptions[i] ) );
          }
        }
      }

      if( callFormTime.mediaExceptions.length > 0 && refHandler.getURLVars()['ref'] != undefined){
        for( var i=0; i<callFormTime.mediaExceptions.length; i++ ){
          var ref = refHandler.getURLVars()['ref'].toLowerCase();
          if( callFormTime.mediaExceptions[i].media == ref ){
            if(curDate.getDay() == 6 ){
              console.log('media exception saturday');
              return getFormType( parseOpenHours( callFormTime.mediaExceptions[i].saturday ) );
            }
            if(curDate.getDay() == 5 ){
              console.log('media exception friday');
              return getFormType( parseOpenHours( callFormTime.mediaExceptions[i].friday ) );
            }
            console.log('media exception weekday');
            return getFormType( parseOpenHours( callFormTime.mediaExceptions[i].weekday ) );
          }
        }
      }

      if(curDate.getDay() == 6 ){
        console.log('saturday');
        return getFormType( parseOpenHours( callFormTime.default.saturday ) );
      }
      if(curDate.getDay() == 5 ){
        console.log('friday');
        return getFormType( parseOpenHours( callFormTime.default.friday ) );
      }
      console.log('weekday');
      return getFormType( parseOpenHours( callFormTime.default.weekday ) );

      function parseOpenHours( timeObj ){
        return {
          openHour    : parseInt( timeObj.open.split(':')[0] ),
          openMins    : parseInt( timeObj.open.split(':')[1] ),
          closeHour   : parseInt( timeObj.close.split(':')[0] ),
          closeMins   : parseInt( timeObj.close.split(':')[1] )
        }
      }

      function getFormType( openHoursObj ){

        if( isNaN( openHoursObj.openHour ) && isNaN( openHoursObj.closeHour ) ){
          console.log('no work today');
          return 'lead';
        }

        if( (curDate.getHours() >= openHoursObj.openHour) && (curDate.getHours() <= openHoursObj.closeHour) ){
          if( curDate.getHours() == openHoursObj.openHour ){
            if( curDate.getMinutes() < openHoursObj.openMins ){
              console.log('lead minutes open hour');
              return 'lead';
            } else {
              console.log('callme minutes open hour');
              return 'callme';
            }
          }

          if( curDate.getHours() == openHoursObj.closeHour ){
            if( curDate.getMinutes() > openHoursObj.closeMins ){
              console.log('lead minutes close hour');
              return 'lead';
            } else {
              console.log('callme minutes close hour');
              return 'callme';
            }
          }
          console.log('callme hours');
          return 'callme';

        } else {
          console.log('lead hours');
          return 'lead';
        }

      }

    }
  }

};
