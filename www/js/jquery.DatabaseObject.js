$.DatabaseObject = function(){
    var _bIntialized = false;
    var _bConnected = false;
    var _aErrorMessage = [];
    var dbConnection = null;
    
    var options = {
        _sDatabaseShortName : "app_name",
        _sVersion           : "1.0",
        _sDisplayName       : "DATABASE OF APP NAME",
        _iMaxSize           : 65536,
        _sHostName          : "http://bhsbrothers.com/Push/"
    };
    
    _connectDB = function(){
        _aErrorMessage = [];
        try {
            if(!window.openDatabase){
                _aErrorMessage.push("NEITHER BROWSER NOR SQL LITE PLUG IN SUPPORTS OPEN DATABASE");
                return;
            }
        } catch(e) {
            if (e === 2) {
                _aErrorMessage.push("INVALID DATABASE VERSION SELECTED. PLEASE CONTACT THE SOFTWARE DEVELOPING COMPANY");
            } else {
                _aErrorMessage.push("UNKNOWN ERROR STORING INFORMATION LOCALLY. REASON: "+e+".");
            }
            return; 
        }
        if(dbConnection === null){
            dbConnection = openDatabase(options._sDatabaseShortName, options._sVersion, options._sDisplayName, options._iMaxSize);
        }
        _bConnected = true;
        return;
    };
    
    _RunCreateQuery = function(sQuery, SuccessHandler, FailedHandler){
        _aResults = [];
        _aErrorMessage = [];
        if(!_bIntialized || !_bConnected){
            FailedHandler("DATABASE NOT INITIALIZED OR CONNECTED");
            return;
        }
        
        if(sQuery === undefined || $.trim(sQuery).length <= 0){
            FailedHandler("MISSING QUERY");
            return;
        }
        
        dbConnection.transaction(function(transaction){
            transaction.executeSql(sQuery,[],
                function(transaction,results){
                    SuccessHandler(true);
                },function(transaction,error){
                    FailedHandler(error.message);
                }
            );
        });
    };
    _RunDeleteQuery = function(sQuery, SuccessHandler, FailedHandler){
        _aResults = [];
        _aErrorMessage = [];
        if(!_bIntialized || !_bConnected){
            FailedHandler("DATABASE NOT INITIALIZED OR CONNECTED");
            return;
        }
        
        if(sQuery === undefined || $.trim(sQuery).length <= 0){
            FailedHandler("MISSING QUERY");
            return;
        }
        
        dbConnection.transaction(function(transaction){
            transaction.executeSql(sQuery,[],
                function(transaction,results){
                    SuccessHandler();
                },function(transaction,error){
                    FailedHandler(error.message);
                }
            );
        });
    };
    _RunSelectQuery = function(sQuery, SuccessHandler, FailedHandler){
        if(!_bIntialized || !_bConnected){
            FailedHandler("DATABASE NOT INITIALIZED OR CONNECTED");
            return;
        }
        
        if(sQuery === undefined || $.trim(sQuery).length <= 0){
            FailedHandler("MISSING QUERY");
            return;
        }
        
        dbConnection.transaction(function(transaction){
            transaction.executeSql(sQuery,[],
                function(transaction,results){
                    var rows = results.rows.length;
                    var aResults = [];
                    for(var i =0 ; i < rows; i++){
                        var rowData = results.rows.item(i);
                        aResults.push(rowData);
                    }
                    SuccessHandler(aResults);
                },function(transaction,error){
                    FailedHandler(error.message);
                }
            );
        });
    };
    
    _RunInsertQuery = function(sQuery,aInsertData ,SuccessHandler, FailedHandler){
        if(!_bIntialized || !_bConnected){
            FailedHandler("DATABASE NOT INITIALIZED OR CONNECTED");
            return;
        }
        
        if(sQuery === undefined || $.trim(sQuery).length <= 0){
            FailedHandler("MISSING QUERY");
            return;
        }
        
        dbConnection.transaction(function(transaction){
            transaction.executeSql(sQuery,aInsertData,
                function(transaction,resultSet){
                    SuccessHandler("SUCCESFULLY INSERTED");
                },function(transaction,error){
                    FailedHandler(error.message);
                }
            );
        });
    };
    
    _RunUpdateQuery = function(sQuery,aUpdateData ,SuccessHandler, FailedHandler){
        if(!_bIntialized || !_bConnected){
            FailedHandler("DATABASE NOT INITIALIZED OR CONNECTED");
            return;
        }
        
        if(sQuery === undefined || $.trim(sQuery).length <= 0){
            FailedHandler("MISSING QUERY");
            return;
        }
        
        dbConnection.transaction(function(transaction){
            transaction.executeSql(sQuery,aUpdateData,
                function(transaction,resultSet){
                    SuccessHandler("SUCCESFULLY UPDATED");
                },function(transaction,error){
                    FailedHandler(error.message);
                }
            );
        });
    };
    
    _init   = function(){
        _connectDB();
        _bIntialized = true;
    }();
    
    return {
        GetErrorMessage : function(){
            return _aErrorMessage;
        },
        IsDBConnected : function(){
            return _bConnected;
        },
        RunCreateQuery  : function(sQuery,SuccessTransactionHandler, FailedTransactionHandler){
            _RunCreateQuery(sQuery, SuccessTransactionHandler, FailedTransactionHandler);
        },
        RunSelectQuery  : function(sQuery,SuccessTransactionHandler, FailedTransactionHandler){
            _RunSelectQuery(sQuery, SuccessTransactionHandler, FailedTransactionHandler);
        },
        RunInsertQuery  : function(sQuery,aInsertData,SuccessTransactionHandler, FailedTransactionHandler){
            _RunInsertQuery(sQuery, aInsertData, SuccessTransactionHandler, FailedTransactionHandler);
        },
        RunUpdateQuery  : function(sQuery,aUpdateData,SuccessTransactionHandler, FailedTransactionHandler){
            _RunUpdateQuery(sQuery, aUpdateData, SuccessTransactionHandler, FailedTransactionHandler);
        },
        RunDeleteQuery  : function(sQuery,SuccessTransactionHandler, FailedTransactionHandler){
            _RunDeleteQuery(sQuery, SuccessTransactionHandler, FailedTransactionHandler);
        },
        GetHostName     : function(){
            return options._sHostName;
        }
    };
};