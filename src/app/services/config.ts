export const ConfigData = {
  //DEFINE YOUR URL
  'rootUrl': 'https://deconews.decouikit.com/wp-json/wp/v2/',

  // DEFAULT VALUE IS FALSE, SHOW ALL YOUR CATEGORIES
  'enableExcludeFromMenu': false,

  // enableExcludeFromMenu SET TO true TO ENABLE excudeFromMenu
  //if want to exclude from menu your category set value FALSE
  //all category enter with lower case
  'excludeFromMenu': {
    'travel': true,
    'architecture': true,
    'current events': true,
  },

  'oneSignal': {
    "appID":"94ca9005-8bfe-1234-5678-d9b74be573f4",
    "googleProjectId": "123456789012"
  },

  //ADS
  'bannerAds': {
    'enable': true,
    'config': {
      'id':'',
      'isTesting': true,
      'autoShow': true
    }
  },
  'interstitialAds': {
    'showAdsAfterXPosts': 10,
    'enable': true,
    'config': {
      'id':'',
      'isTesting': true,
      'autoShow': true
    }
  }
 }
