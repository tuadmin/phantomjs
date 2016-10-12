/**
 * @version 1
 * @author tuadmin
 */
/*//for use in module

function $promise(obj_parent){
	var thens  =[];
	var catchs =[];
    var finallys=[];
    this._ = obj_parent?obj_parent:this;
	this.then=function(then_callback,fail_callback){
		if(then_callback){
            thens.push(then_callback);
        }
        return fail_callback?this.catch(fail_callback):this;
	};
	this.catch=function(_callback){
		if(_callback){
            catchs.push(_callback);
        }
        return this;
	};
	this.finally=function(_callback){
		if(_callback){
            finallys.push(_callback);
        }
        return this;
	};
	
	this.resolve=function(data){
        while(thens.length){
            thens.shift()(data);
        }
        catchs=[];
        while(finallys.length){
            finallys.shift()(data);
        }
    };
	this.reject=function(data){
        while(catchs.length){
            catchs.shift()(data);
        }
        thens=[];
        while(finallys.length){
            finallys.shift()(data);
        }
    }
};
*/

exports.create=function(_callback_check,timeOutMillis,check_calllback_in_seconds){
    var checkLoop = check_calllback_in_seconds?check_calllback_in_seconds:250  ,
        maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        my_promise= new $promise(this),
        limit = new Date().getTime() + maxtimeOutMillis,
        end_ok=false,
        finish=false,
        condition = false,
        current_timeout=null;
    function end(){
        if(timeout_control){clearTimeout(timeout_control);}
        if(current_timeout){clearTimeout(current_timeout);}
        if(end_ok){//se termino por las buenas
                        
        }else{//se termino por que vencio el tiempo
            my_promise.reject('Timeout ' + timeOutMillis);
        }
    };
    current_timeout=function(){
        condition = (typeof(_callback_check) === "string" ? eval(_callback_check) : _callback_check( limit-new Date().getTime() ) );
        if(condition){
            my_promise.resolve(condition);
            end_ok=true;
            finish=true;
            end();
        }else if(finish==false ){
            timeout_control= setTimeout(current_timeout,checkLoop);
        }
    };
    current_timeout();//iniamos la primera comprobacion
    timeout_control= setTimeout(function(){
            end();
    },maxtimeOutMillis);
    return my_promise;
};
/*example use*/
/*
var timeout    = 5000;//micro seconds
    time_check = 1000;//micro seconds
var waitfor = new require('waitfor').create(function(seconds_restant ){ console.log("restant " +seconds_restant); },timeout,time_check);
waitfor.then(function(){
    console.log("only show if (check_function) return true");
});
waitfor.catch(function(error_messsage){
            console.log(error_messsage);
        })
        .finally(function(){
            console.log("this message is ever show");
        });
*/
