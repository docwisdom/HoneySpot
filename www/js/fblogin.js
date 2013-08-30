  // Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '172523219600825 ', // App ID
      channelUrl : '//APP.HONEYSPOTAPP.COM/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    // Additional init code here

  };

  // Load the SDK asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));



 
stackmobLogin : function(id, accessToken) {
  var user = new StackMob.User({
    username : id
  });
  user.loginWithFacebookAutoCreate(accessToken, true, {
    success : function() {
      Scrumptious.initView();
    },
    error : function(model, response) {
      alert('Oops! Trouble logging in with Facebook.');
    }
  });
},
 
