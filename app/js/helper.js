////seperate file for all global functions

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
function toString(obj){
	console.log(JSON.stringify(obj));
}
function isArray(obj){
  return (obj instanceof Array);
  // if (!Array.isArray) {
  //     Array.isArray = function(obj) {
  //       if(Object.prototype.toString.call(obj) == '[object Array]'){return true}
  //       else{return false}
  //     }
  // }else{
  //   return (Array.isArray(obj))
  // }

}
