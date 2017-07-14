$.AjaxJSON = function(){
    return {
        LoadJSONContents : function(url ,data, callback_function, Handler, aPassOnOptions){
            if(aPassOnOptions === undefined || aPassOnOptions === null){
                aPassOnOptions = {};
            }
            url = $.trim(url);
            $.ajax({
                url : url,
                type: "post",
                data: data,
                success: function(data){
                    var msg = $.parseJSON(data);
                    if(!(Handler === undefined || Handler === null)){
                        Handler(msg,callback_function, aPassOnOptions);
                    }else{
                        callback_function(msg, aPassOnOptions);
                    }
                },
                error:function(){
                    var msg = {
                        Success     : false, 
                        Message     : "UNABLE TO PROCESS YOUR REQUEST AT THIS TIME. PLEASE TRY AGAIN LATER."
                    };
                    if(!(Handler === undefined || Handler === null)){
                        Handler(msg,callback_function,aPassOnOptions);
                    }else{
                        callback_function(msg,aPassOnOptions);
                    }
                    return false;
                }
            });
            return false;
        }
    };
};