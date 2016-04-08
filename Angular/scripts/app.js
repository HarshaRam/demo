/// <reference path="scripts/angular.min.js"/>

//Create the module
var myApp= angular.module('myApp',['angularUtils.directives.dirPagination']);


myApp.config(function($interpolateProvider,$httpProvider) {

  $interpolateProvider.startSymbol('%%');
  $interpolateProvider.endSymbol('%%');
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';


});

//Cretae the controller
/*var myController=function($scope){

  $scope.message = "AngularJS";
}
*/

//Create the controller and registering with the module all done in a single line
myApp.controller("myController", function($scope,$http,$timeout,$rootScope){
  
  

   $scope.updateSelection = function(position, jsonRequired) {
      angular.forEach(jsonRequired, function(data, index) {
        if (position != index) 
          data.checked = false;
      });
    }


    $scope.getChanged = function() {
     
    console.log("Changed value"+$scope.selectedStatusDropdown);
  }
   
   

    $scope.config = {
    itemsPerPage: 5,
    fillLastPage: true
  }


 

  $scope.jsonData = {};
  $scope.jsonRequired = [];
  var count = 0;

  (function tick() {
  $http.get("C://Users//DREAMZ//Desktop//UNNI_PROJECT//LaundryProject//sample1.json")
    .then(function(response)
    { 
      count++;
      $scope.jsonData = response.data; 
      //alert("JsonData"+$scope.jsonData);
      $scope.jsonRequired = $scope.jsonData.data;
        //alert("Data filtered: "+$scope.jsonRequired);
      //alert("JsonData"+$scope.jsonData);
      $scope.jsonData.count = count;
      //console.log("Data Count" + $scope.jsonData + "count: " +count);
      $timeout(tick, 100000);
    });

    })();



    $scope.selectAction = function(selectedItem,orderId) {
      
           $scope.itemSelected = selectedItem;
           $scope.orderId = orderId;
           //console.log("Name: "+$scope.itemSelected.name+" Id: "+$scope.itemSelected.id + " orderId: "+$scope.orderId);
                 };

        $scope.removeItem = function(index){
          $scope.jsonRequired.splice(index, 1);
        }

      $scope.storeData = function(index,jsonValue,len) {
        //alert("inside storedata");
        var url="http://www.bclean.in/admin/add_delivery_boy_to_order"; 
        $http.post(url,{order_id:$scope.orderId,delivery_boy_id:$scope.itemSelected.id}).success( function(response) {
                               $scope.responsedata = response;
                               console.log("Respponse: "+$scope.responsedata);
                            
                 });



        $scope.currentJson = jsonValue;
      console.log("Name: "+$scope.itemSelected.name+" Id: "+$scope.itemSelected.id + " orderId: "+$scope.orderId);
      console.log("len: "+len+" Index: "+index+" Json:"+$scope.currentJson);
      if ($scope.currentJson) {
        alert("$scope.currentJson");
        $scope.jsonRequired.splice(index+len ,1 ,this.currentJson); 
        $scope.removeItem(index, 1);
        }
      

  
};
    
}); 
// Define our filter
    myApp.filter('selectedStatus', function($filter,$rootScope) {
      
        return function(jsonRequired) {
        var i, len;
        //("Scope Objects" + status);
        // get customers that have been checked
        var checkedStatus = $filter('filter')(jsonRequired, {'order': true});
        
        /*if(checked){
          window.location.reload();
        }*/
        //alert("status"+checkedStatus);
        //console.log("Checked status: "+checkedStatus);
    
        // Add in a check to see if any customers were selected. If none, return 
            // them all without filters
            if(checkedStatus.length == 0) {
          return jsonRequired;
        }
    // get all the unique cities that come from these checked customers
    var statuses = {};
    len = checkedStatus.length;
    //alert("length" + len);
    for(i = 0, len; i < len; ++i) {
      // if this checked customers cities isn't already in the cities object 
      // add it
      if(!statuses.hasOwnProperty(checkedStatus[i].status)) {
        alert("Inside");
        $rootScope.statusChecked = checkedStatus[i].status;
        console.log("Checked status inside for: "+checkedStatus[i].status);
        statuses[checkedStatus[i].status] = true;
        console.log("Checked status inside for: "+statuses);
      }
    }
    // Now that we have the cities that come from the checked customers, we can
    //get all customers from those cities and return them
    var ret = [];
    for(i = 0, len = jsonRequired.length; i < len; ++i) {
      // If this customer's city exists in the cities object, add it to the 
      // return array
      if(statuses[jsonRequired[i].status]) {
        ret.push(jsonRequired[i]);
      } 
    }
        // we have our result!
    return ret;
  }
});

myApp.filter('unique', function() {
   return function(collection, keyname) {
      var output = [], 
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
   };
});
