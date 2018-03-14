
if(angular && angular.module)
{

    function getFileUrl(ele) {
        var url;
        if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
            url = ele.value;
        } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox 
            url = window.URL.createObjectURL(ele.files.item(0));
        } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome 
            url = window.URL.createObjectURL(ele.files.item(0));
        }
        return url;
    }
    function preImg(fileEle, imgEle) {
        var url = getFileUrl(fileEle);
        var imgPre = imgEle;
        imgPre.src = url;
    }
	var qui;
	try{
		qui=angular.module("qui")
	}catch(e)
	{
		qui=angular.module("qui",[]);
	}
	qui.directive('qimgpreview',['$templateRequest','$compile',function($templateRequest,$compile) {
	    return {
		        restrict: 'EA',
		        // priority: 100,
		        require: '?ngModel',
		        scope: {
		            ngModel:'=',
		            ngName:'=',
		            ngOption:'=',
		        },
		        link: function(scope, element, attrs,controller) {

		        	function createFile()
		        	{

		        	}
		        	var imageBase="/images/";
		        	var imgEle=$('<img width="100%"  height="100%" >');
		        	var fileEle=$('<input type="file" >').attr("name",scope.ngName).hide();//multiple
		        	fileEle.on("change",function(e){
		        		if(scope.ngOption!=null && scope.ngOption.local )
		        		{
		        				preImg(fileEle.get(0),imgEle.get(0));
				        		scope.ngModel=fileEle.val();
				        		controller.$setViewValue(scope.ngModel);
						   		controller.$render();
		        		}
		        		else if(e.target.files[0])
		        		{
		        			var formdata=new FormData(); 
							formdata.append("upfile" ,e.target.files[0]);
							formdata.append("action","uploadimage");
							 $.ajax({
					           type : 'post',
					           url :serviceApiUrl+'/article/editor/action',
					           data : formdata,
					           cache : false,
					           processData : false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
					           contentType : false, // 不设置Content-type请求头
					           success : function(data){
					           		//var finalurl=serviceApiUrl+data.url.substring(data.url.indexOf("/images/"));
					           		var finalurl=data.url.substring(8);
					           		scope.ngModel=finalurl;
		        					controller.$setViewValue(scope.ngModel);
			   						controller.$render();
			   						imgEle.get(0).src=imageBase+finalurl;
					           },
					           error : function(error){
					           		console.log(error);
					           }
					        });
		        		}
		        	}).on("click",function(event){
		        		event.stopPropagation();
		        	});
		        	function clearInputFile(f){  
					    if(f.value){  
					        try{  
					            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...  
					        }catch(err){  
					        }  
					        if(f.value){ //for IE5 ~ IE10  
					            var form = document.createElement('form'), ref = f.nextSibling, p = f.parentNode;  
					            form.appendChild(f);  
					            form.reset();  
					            p.insertBefore(f,ref);  
					        }  
					    }  
					}  
		        	scope.$watch("ngModel",function(newval,oldval){
		        		imgEle.attr("src",imageBase+newval);
		        		clearInputFile(fileEle.get(0));
		        	});
		        	element.append(fileEle).append(imgEle);
		        	element.click(function(){
		        		fileEle.trigger("click");
		        	});
		        }
		    };
		}]
	);

	
}




