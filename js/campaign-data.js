var campaignPhoneByRef = {
  'google-gdn'          : '0529997665',
  'google-search'       : '0529997666',
  'google-apps'         : '0529997667',
  'google-remarketing'  : '0529997634',
  'facebook'            : '0529997631',
  'call-me'             : '0529997633',
  'ynet'                : '0529997503',
  'yoyo'                : '0529997530'
};

var callFormTime = {
  default       : {
    weekday     : {
      open      : '8:00',
      close     : '20:00'
    },
    friday      : {
      open      : '8:00',
      close     : '13:00'
    },
    saturday    : {
      open      : '',
      close     : ''
    }
  },
  holidayExceptions : [
    {
      date      : '10.11.2015',
      open      : '8:30',
      close     : '12:30'
    },
    {
      date      : '11.11.2015',
      open      : '',
      close     : ''
    }
  ],
  mediaExceptions : [
    {
      media       : 'yoyo',
      weekday     : {
        open      : '',
        close     : ''
      },
      friday      : {
        open      : '',
        close     : ''
      },
      saturday    : {
        open      : '',
        close     : ''
      }
    }
  ]
}
