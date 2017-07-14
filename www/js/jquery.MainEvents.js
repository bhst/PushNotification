// SINCE WE ARE USING JQUERY MOBILE -- 
// WE WILL BE INITIATING LOGIN OBJECT, GET DATA OBJECT IN PAGE BEFORE CREATE EVENT
// ON PAGE CHANGE EVENT WE WILL BE DOING ALL THE MAGICS

var oLoginObject = null;
var oGetData = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function(callback_function) {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.setupPush();
        StatusBar.overlaysWebView(false);
    },
    
    receivedEvent : function(){
        DeviceLoaded();
    },
    
    setupPush: function() {
        var push = PushNotification.init({
            "android": {
                "senderID": "313019223139"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        
        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);
            
            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }
        });

        push.on('error', function(e) {
            //console.log("push error = " + e.message);
            alert(e.message.toString().toUpperCase());
            localStorage.removeItem("registrationId");
        });

        push.on('notification', function(data) {
            //console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    }
};
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).on('pagecreate',function(){
    oLoginObject = $.LoginObject();
    oGetData = $.GetData();
    
    app.initialize();
});



