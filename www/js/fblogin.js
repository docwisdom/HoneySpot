FB.login(function(response) {
	if(response.authResponse) {
      var accessToken = response.authResponse.accessToken;
      Scrumptious.stackmobLogin(response.authResponse.userID, accessToken);
    }
});


 
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
 
