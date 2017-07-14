$.LoginObject = function(){
    var _bCanPerformTransactions = false;
    var _bAlreadyLoggedIn = false;
    
    var parent;
    
    var options = {
        _sTableName : "login1",
        _sValidateLoginURL : "Validate/ValidateLogin.php",
        _sSaveDeviceIDURL  : "SaveInfo/SaveDeviceIDForNotificationForUser.php",
        _sLogoutURL : "Logout.php"
    };
    
    var _aTableInformation = {
        ID           : "id",
        SessionID    : "l_session_id",
        UserID       : "l_user_id",
        UserName     : "l_user_name",
        SelectedDate : "l_selected_date"
    };
    
    var _aLoginInformation = {
        SessionID   : null,
        UserID      : null,
        UserName    : null,
        SelectedDate: null
    };
    
    _TableNotCreated = function(error){
        _bCanPerformTransactions = false;
        _CheckUserAlreadyLoggedIn();
    };
    
    _TableCreated = function(bCreated){
        _bCanPerformTransactions = bCreated;
        _CheckUserAlreadyLoggedIn();
    };
    
    _CreateLoginTable = function(){
        var sCreateTableQuery =   "CREATE TABLE IF NOT EXISTS `"+options._sTableName+"` (`"+_aTableInformation.ID+"` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `"+_aTableInformation.SessionID+"` VARCHAR(32) NOT NULL, `"+_aTableInformation.UserID+"` INTEGER NOT NULL UNIQUE, `"+_aTableInformation.UserName+"` VARCHAR(100) NULL , `"+_aTableInformation.SelectedDate+"` DATE); ";
        parent.RunCreateQuery(sCreateTableQuery, _TableCreated, _TableNotCreated);
    };
    
    _UserLoggedIn = function(aResult){
        var iNoOfRows = aResult.length;
        if(iNoOfRows <= 0){
            _bAlreadyLoggedIn = false;
        }else{
            var row = aResult[0];
            _aLoginInformation.SessionID = row[_aTableInformation.SessionID];
            _aLoginInformation.UserID = row[_aTableInformation.UserID];
            _aLoginInformation.UserName = row[_aTableInformation.UserName];
            _aLoginInformation.SelectedDate = row[_aTableInformation.SelectedDate];
            _bAlreadyLoggedIn = true;
            _UpdateDeviceIDForNotification();
        }
        app.receivedEvent();
    };
    
    _UserNotLoggedIn = function(error){
        _bAlreadyLoggedIn = false;
        app.receivedEvent();
    };
    
    _CheckUserAlreadyLoggedIn = function(){
        if(!_bCanPerformTransactions){
            _bAlreadyLoggedIn = false;
            return;
        }
        var logged_in_query = "SELECT * FROM `"+options._sTableName+"` ;";
        parent.RunSelectQuery(logged_in_query, _UserLoggedIn, _UserNotLoggedIn);
    };
    
    _GetValidateURL = function(){
        return parent.GetHostName()+options._sValidateLoginURL;
    };
    
    _GetLogoutURL = function(){
        return parent.GetHostName()+options._sLogoutURL;
    };
    
    _LoggedOut = function(results, callback_function){
        if(results["Success"]){
            localStorage.removeItem("KeepSignedIn");
            var delete_user_details = "DELETE FROM `"+options._sTableName+"` ;";
            parent.RunDeleteQuery(delete_user_details,function(){
                callback_function(true);
            }, function(error){
                callback_function(false);
            });
        }else{
            callback_function(false);
        }
    };
    
    _LoggedIn = function(results,callback_function){
        if(results["Success"]){
            if(results["Keep_Sign"]){
                localStorage.setItem("KeepSignedIn","signed_in");
            }
            _aLoginInformation.SessionID = results["Session_ID"];
            _aLoginInformation.UserID = results["User_ID"];
            _aLoginInformation.SelectedDate = results["SelectedDate"];
            
            var store_user_details = "INSERT INTO `"+options._sTableName+"` (`"+_aTableInformation.SessionID+"`,`"+_aTableInformation.UserID+"`,`"+_aTableInformation.UserName+"`,`"+_aTableInformation.SelectedDate+"`) VALUES (?,?,?,?) ;";
            var store_data = [results["Session_ID"],results["User_ID"], results["Name"], results["SelectedDate"]];
            parent.RunInsertQuery(store_user_details, store_data,function(success_msg){
                callback_function(true, "LOGGED IN");
            },function(error_msg){
                results["Success"] = false;
                results["Message"] = error_msg;
                callback_function(false, error_msg);
            });
        }else{
            callback_function(false, results["Message"]);
        }
    };
    
    _UpdateDefaultDate = function(data){
        var update_query = "UPDATE `"+options._sTableName+"` SET `"+_aTableInformation.SelectedDate+"` = ? WHERE `"+_aTableInformation.UserID+"` = ? AND `"+_aTableInformation.SessionID+"` = ? ;";
        var update_data = [data["DATE_SELECTED"],data["USER_ID"], data["SESSION_ID"]];
        parent.RunUpdateQuery(update_query, update_data, function(){}, function(){});
    };
    
    _UpdateDeviceIDForNotification = function(){
        var url = parent.GetHostName() + options._sSaveDeviceIDURL;
        var oAjaxJSON = $.AjaxJSON();
        var data = {
            user_id     : _aLoginInformation.UserID,
            session_id  : _aLoginInformation.SessionID,
            from        : 'ADMIN_APPLICATION',
            device_id   : localStorage.getItem("registrationId")
        };
        oAjaxJSON.LoadJSONContents(url, data, function(){});
    };
    
    _init   = function(){
        parent = $.DatabaseObject();
        _CreateLoginTable();
    }();
    
    return $.extend({}, parent, {
        GetUserID       : function(){
            return _aLoginInformation.UserID;
        },
        
        GetSessionID    : function(){
            return _aLoginInformation.SessionID;
        },
        
        GetUsername     : function(){
            return _aLoginInformation.UserName;
        },
        
        GetSelectedDate : function(){
            return _aLoginInformation.SelectedDate;
        },
        
        CheckUserLoggedIn       : function(){
            return _bAlreadyLoggedIn;
        },
        
        UpdateDefaultDate   : function(data){
            _UpdateDefaultDate(data);
        },
        
        ValidateLogin   : function(data, callback_function){
            var url = _GetValidateURL();
            var oAjaxJSON = $.AjaxJSON();
            oAjaxJSON.LoadJSONContents(url, data,callback_function, _LoggedIn);
            return false;
        },
        
        LogUserOut : function(data, callback_function){
            var url = _GetLogoutURL();
            var oAjaxJSON = $.AjaxJSON();
            oAjaxJSON.LoadJSONContents(url, data, callback_function, _LoggedOut);
            return false;
        }
    });
};