var formHandler = (function(){

  var formObj = {};

  var $callMe = $('.form-holder.callme');
  var $formCallme = $('.callme-form');
  var $lead = $('.form-holder.lead');
  var $formLead = $('.lead-form');
  var $sendBtn = $('.send-btn');
  var $callBtn = $('.call-btn');

  events.on('formTypeInit', setForm);
  formUtils.initFormType();

  function setForm( formType ){
    $('body').addClass(formType);
    formObj.formType = formType;

    formObj.holder = $('.form-holder.' + formType);
    formObj.form = $('.' + formType + '-form');

    formObj.holder.addClass('open');
    formUtils.initForm( formObj.form );
    $sendBtn.on('click', onSendBtnClick);

    $callBtn.on('click', onCallBtnClick);
  }

  function onSendBtnClick( e ){
    e.preventDefault();

    if( formObj.formType == 'callme' ){
      if(callmeValid()){

        formObj.holder.addClass('loading');

        var phoneNumber = $(formObj.form).find('#phone-prfx').val() + $(formObj.form).find('#phone').val();
        $.post('https://hooliganspro.co.il/cellcom/campaigns/handlers/Send2Callme.ashx',
        {
          u       : campaignObj.callmeParam,
          number  : phoneNumber,
          site    : campaignObj.ref
        },
        function( response ) {
          if(response == 1){
            //ga('send', 'pageview', '/vps/campaign/iphone7/call_Desktop');
            //pixelLoader.loadIframe('callme-ggl.html');
            //pixelLoader.loadIframe('callme-flood.html');
            formObj.holder.find('.thanks').html('תודה שיצרת איתנו קשר!<br>השיחה מתבצעת כעת.');
          } else {
            formObj.holder.find('.thanks').html('אין אפשרות לחייג למספר,<br>אנא פנו למוקד *321.');
          }
          setTimeout(function(){
            formObj.holder.removeClass('loading');
            formObj.holder.addClass('thanks');
            setTimeout(function(){
              formObj.holder.removeClass('thanks');
              resetForm();
            },5000);
          },100);
        });
      }
    }// callme

    if( formObj.formType == 'lead' ){
      if(leadValid()){
        formObj.holder.addClass('loading');

        var phoneNumber = $(formObj.form).find('#phone-prfx').val() + $(formObj.form).find('#phone').val();
        $.post('https://hooliganspro.co.il/cellcom/campaigns/Handlers/SetLead.ashx',
        {
          campaignId  : campaignObj.id,
  				phone       : phoneNumber,
  				fullName    : $(formObj.form).find('#name').val(),
  				site        : campaignObj.ref
        },
        function( response ) {
          if(response == 1){
            if( deviceObj.mobile ){
              //ga('send', 'pageview', '/vps/campaign/iphone7/form_Mobile');
              //pixelLoader.loadIframe('lead-mobile-ggl.html');
            }else{
              //ga('send', 'pageview', '/vps/campaign/iphone7/form_Desktop');
              //pixelLoader.loadIframe('lead-desktop-ggl.html');
            }
            //pixelLoader.loadIframe('lead-flood.html');
            formObj.holder.find('.thanks').html('תודה,<br> מספרך נקלט');
          } else {
            $('.thanks').html('יש בעייה במערכת,<br> אנא נסו שוב מאוחר יותר');
          }
          setTimeout(function(){
            formObj.holder.removeClass('loading');
            formObj.holder.addClass('thanks');
            setTimeout(function(){
              formObj.holder.removeClass('thanks');
              resetForm();
            },5000);
          },800);
        });
      }
    }// lead

  }

  function callmeValid(){
    $(formObj.form).find('.error').text('');
    $(formObj.form).find('input, select').removeClass('required');

    if( $(formObj.form).find('#phone').val() == '' ){
      $(formObj.form).find('#phone').addClass('required');
      $(formObj.form).find('.error').text('יש להזין טלפון');
      return false;
    } else {
      if( $(formObj.form).find('#phone').val().charAt(0) == '0' ){
  			$(formObj.form).find('.error').text('מספר הטלפון אינו תקין');
  			$(formObj.form).find('#phone').addClass('required').focus();
  			return false;
  		}
      var phoneNumber = $(formObj.form).find('#phone-prfx').val() + $(formObj.form).find('#phone').val();
      if( !formUtils.isPhone(phoneNumber) ){
  			$(formObj.form).find('.error').text('מספר הטלפון אינו תקין');
  			$(formObj.form).find('#phone').addClass('required').focus();
  			return false;
  		}
    }
    return true;
  }

  function leadValid(){
    $(formObj.form).find('.error').text('');
  	$(formObj.form).find('input, select').removeClass('required');

  	if( $(formObj.form).find('#name').val() == '' ){
  		$(formObj.form).find('#name').addClass('required').focus();;
  		$(formObj.form).find('.error').text('יש להזין שם מלא');
  		return false;
  	}

  	if( $(formObj.form).find('#phone').val() == '' ){
  		$(formObj.form).find('.error').text('יש להזין טלפון');
  		$(formObj.form).find('#phone').addClass('required').focus();
  		return false;
  	} else {
  		if( $(formObj.form).find('#phone').val().charAt(0) == '0' ){
  			$(formObj.form).find('.error').text('מספר הטלפון אינו תקין');
  			$(formObj.form).find('#phone').addClass('required').focus();
  			return false;
  		}
      var phoneNumber = $(formObj.form).find('#phone-prfx').val() + $(formObj.form).find('#phone').val();
      if( !formUtils.isPhone(phoneNumber) ){
  			$(formObj.form).find('.error').text('מספר הטלפון אינו תקין');
  			$(formObj.form).find('#phone').addClass('required').focus();
  			return false;
  		}
  	}

  	return true;
  }

  function resetForm(){
    $(formObj.form).find('input').val('');
    $(formObj.form).find('select').each(function(){
      $(this).val( $(this).find('option:first').val() )
    })
    formUtils.initForm( formObj.form );
  }

  function onCallBtnClick(){
    //ga('send', 'pageview', '/vps/campaign/iphone7/call_Mobile');
    //pixelLoader.loadIframe('c2c-ggl.html');
    //pixelLoader.loadIframe('c2c-flood.html');
  }

  return{
    //resetForm : resetForm
  }

})();
