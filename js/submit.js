//initial angularjs module
var submitFormApp = angular.module('submitFormApp',[]);
submitFormApp.controller('submitFormController',["$http", "$httpParamSerializer", "$interval", function($http, $httpParamSerializer, $interval){
	var self = this;
	
	self.submitType = 1;  //Default type: Perfect Retouching
	self.retouching_photoTitle = "";
	self.retouching_directZoneUrl = "";
	self.expressLayer_title = "";
	self.expressLayer_directZoneUrl = "";
	self.creator = "";
	self.description = "";
	self.email = "";
	self.hearAbout = 7;
	self.hearAboutOtherText = "";
	self.submitAgreement = false;
	self.directZoneId = 0;	
	self.beforeFileData = null;
	self.afterFileData = null;
	self.isMobileDesign = false;
	
	$interval(function(){
		if (angular.element('#retouching_pc').is(':visible')){
			self.isMobileDesign = false;
		}else{
			self.isMobileDesign = true;
		}
	}, 100);
	
	self.submit = function(submitForm){
		if (submitForm.$valid){
			var submitObject = {};
			submitObject.nEventID = eventId;
			submitObject.szLang = langId;
			submitObject.szTitle = (self.submitType == 1) ? self.retouching_photoTitle : self.expressLayer_title;
			submitObject.category = self.submitType;
			submitObject.szName = self.creator;
			submitObject.szDesc = self.description;
			submitObject.szEmail = self.email;
			
			if (self.submitType == 1){
				submitObject.szFile = self.beforeFileData;
				submitObject.szFile2 = self.afterFileData;
			}			
			
			if (self.submitType == 1 && !self.isMobileDesign){
				submitObject.DZURL = self.retouching_directZoneUrl;
			}else if (self.submitType == 2){
				submitObject.DZURL = self.expressLayer_directZoneUrl;
			}
			
			submitObject.szText1 = self.hearAbout;
			if (self.hearAbout == 7){
				submitObject.szText2 = self.hearAboutOtherText;
			}
			
			//show immediately after user submit form to show fake good performance
			$('#submitSuccessModal').modal('show');
			$http({
				   method: 'POST',
				   url: 'ajax/submitDB.jsp',
				   dataType: 'text',
				   data: getFormDataFormObject(submitObject),
				   transformRequest: angular.identity,
				   headers: {'Content-Type': undefined}
			}).then(function successCallback(response) {				
				//$('#submitSuccessModal').modal('show');
				if (response.data.indexOf("Submit Error") >= 0){
					$('#submitSuccessModal').modal('hide');
					$('#submitErrorModal').modal('show');
				}
				/*
				else if (response.data.indexOf("Submit Success") >= 0){
					$('#submitSuccessModal').modal('show');
				}
				*/
				
			  }, function errorCallback(response) {
				  console.log(response.data);
				  $('#submitSuccessModal').modal('hide');
				  $('#submitErrorModal').modal('show');
			  });
			  
		}else{
			//Set invalid input to dirty status.
			for (var errorIndex in submitForm.$error){
				for (var errorInputIndex in submitForm.$error[errorIndex]){
					submitForm.$error[errorIndex][errorInputIndex].$setDirty();
				}
			}
			//Scroll to first invalid item
			var firstInvalid = $("#submitForm").find(".ng-invalid").first();
			$("html,body").scrollTop(firstInvalid.offset().top - $("#main_nav").height() - 5);
			
			console.log("Form Not OK");
		}
	}
	
	function getFormDataFormObject(object) {
        var formData = new FormData();
        Object.getOwnPropertyNames(object).forEach(function (value, index, array) {
            formData.append(value, object[value]);
        });
        return formData;
    }
	
	self.encode = function(str){
		return encodeURI(str);
	}
}]);
//This directive is not used
submitFormApp.directive('retouchingUrlValidator', function() {
	  var retouchingUrl_regex = /http:\/\/directorzone\.cyberlink\.com\/photo\/(\d+).*/i;
	
	  return {
	    require: '?ngModel',
	    scope:{
	    	ngModel: "=ngModel",
	    	directZoneId: "=directZoneId"
	    },
	    link: function(scope, elm, attrs, ctrl) {
	    	scope.$watch('ngModel', function(newValue, oldValue) {
	    		if (retouchingUrl_regex.test(scope.ngModel)){
	    			ctrl.$setValidity("retouchingUrl", true);
	    			scope.directZoneId = retouchingUrl_regex.exec(scope.ngModel)[1];
	    		}else{
	    			ctrl.$setValidity("retouchingUrl", false);
	    		}
	    	},true);	    	
	    }
	  };
});


submitFormApp.directive('urlValidator', ["$http", "$httpParamSerializer", function($http, $httpParamSerializer) {
	  return {
	    require: '?ngModel',
	    scope:{
	    	ngModel: "=ngModel",
	    	ngRequired: "=ngRequired",
	    	submitType: "=submitType",
	    	directZoneId: "=directZoneId",
	    	bindTitle: "=bindTitle"
	    },
	    link: function(scope, elm, attrs, ctrl) {
	    	var url_regex;
	    	
	    	scope.$watch('ngRequired', function(newValue, oldValue) {
	    		ctrl.$setValidity("urlValidation", true);
    			ctrl.$setValidity("photoFind", true);
    			
	    		if (scope.ngRequired){
	    			if (scope.submitType == 1){
	    				url_regex = /http:\/\/directorzone\.cyberlink\.com\/photo\/(\d+)(\?.*)?$/;
		    		}else if (scope.submitType == 2){
	    				url_regex = /http:\/\/directorzone\.cyberlink\.com\/detail\/(\d+)(\?.*)?$/;
		    		}
	    			
	    			if (url_regex){
	    				checkDirectorZoneInfo();
		    		}	
	    			
	    		}
	    	},true);
	    	
	    	scope.$watch('ngModel', function(newValue, oldValue) {
	    		ctrl.$setValidity("urlValidation", true);
    			ctrl.$setValidity("photoFind", true);
    			
	    		if (scope.ngRequired && url_regex){
	    			checkDirectorZoneInfo();
	    		}	    		
	    	},true);
	    	
	    	function checkDirectorZoneInfo(){
	    		if (url_regex.test(scope.ngModel)){
	    			ctrl.$setValidity("urlValidation", true);
	    			scope.directZoneId = url_regex.exec(scope.ngModel)[1];
	    			$http({
	    				   method: 'POST',
	    				   url: 'ajax/queryDirectZoneInfo.jsp',
	    				   data: $httpParamSerializer({
	    					   id: scope.directZoneId,
	    					   category: scope.submitType}),
	    				   headers: {
	    				       'Content-Type': 'application/x-www-form-urlencoded'
	    				   }
	    			}).then(function successCallback(response) {	
	    				if (response.data.status == -1 || response.data.status == 0){
	    					ctrl.$setValidity("photoFind", false);
	    				}else if ((scope.submitType == 1 && response.data.content.type.indexOf("Photo") >= 0 && response.data.status == 2) || (scope.submitType == 2 && response.data.content.type == "EXT" && response.data.status == 1)){	    			   
	    					ctrl.$setValidity("photoFind", true);
	    					scope.bindTitle = response.data.content.title;
	    				}else{
	    					ctrl.$setValidity("photoFind", false);
	    				}
	    			  }, function errorCallback(response) {
	    				  console.log("error");
	    			  });
	    		}else{
	    			ctrl.$setValidity("urlValidation", false);
	    		}
	    	}
	    }
	  };
}]);

submitFormApp.directive("fileUploader", ["$parse", function ($parse) {
    return {
        restrict: "A",
        require: 'ngModel',
        scope: {
        	ngModel: "=ngModel",
        	ngRequired: "=ngRequired",
        	noSameFileName: "=noSameFileName"
        },
        link: function (scope, elm, attrs, ctrl) {
            elm.bind("change", function () {
                scope.$apply(function () {
                	ctrl.$setDirty(true);
                	checkFile();
                });
            });
            
            scope.$watch('ngRequired', function(newValue, oldValue) {
	    		if (newValue){
	    			checkFile();
	    		}else{
	    			ctrl.$setValidity("fileValidation", true);
	    		}
	    	},true);
            
            function checkFile(){
            	ctrl.$setValidity("fileValidation", true);
            	ctrl.$setValidity("noSameNameValidation", true);
            	
            	if (elm[0].files.length > 0) {   console.log(elm[0].files.size);          		
                    //write file data to model
                	scope.ngModel = elm[0].files[0];
                	ctrl.$setValidity("fileValidation", true);

                	if (scope.noSameFileName && elm[0].files[0].name === scope.noSameFileName.name){
                		ctrl.$setValidity("noSameNameValidation", false);
                	}else{
                		ctrl.$setValidity("noSameNameValidation", true);
                	}
                	
                	if (elm[0].files[0].size > 20*1024*1024){
                		ctrl.$setValidity("fileSize", false);
            		}else{
            			ctrl.$setValidity("fileSize", true);
            		}
                	
                }else{
                	scope.ngModel = null;
                	if (scope.ngRequired){
                		ctrl.$setValidity("fileValidation", false);
                	}else{
                		ctrl.$setValidity("fileValidation", true);
                	}
                }
            }
        }
    }
}]);