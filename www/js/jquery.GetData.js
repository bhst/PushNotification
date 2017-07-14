$.GetData = function(){
    var options = {
        _sURLToSetDefaultDate : "UpdateInfo/UpdateDefaultDate.php"
    };
    
    _DefaultDateSet = function(results, callback_function){
        if(results["Success"]){
            callback_function(true, "SET");
        }else{
            callback_function(false,results["Message"]);
        }
    };
    return {
        URLToSetDefaultDate : function(){
            return options._sURLToSetDefaultDate;
        },
        
        SetDefaultDate: function(url, data, callback_function){
            var oAjaxJSON = $.AjaxJSON();
            oAjaxJSON.LoadJSONContents(url, data, callback_function, _DefaultDateSet);
        }
        
    };
};