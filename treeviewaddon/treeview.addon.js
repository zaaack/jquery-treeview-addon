/**
 *@author Z
 *2013-10-25 20:56
 *E-mail:464631487@qq.com
 */
;(function($) {

	$.extend($.fn, {
		treeview_addon:function(options){
			var defaults = {
				jsonArray : null,
					/*in the jsonArray,the key of json will become the a tag's href or the value of the input tag, 
						and the value is also a json data made by three key-value, "checked"(bool,the state of checkbox or radio)
						 , "text"(string,the display text of the tree's leaves) and "children"(jsonArray,the children of this 
						 branch).
					eg.	 [
							{
								"1":{
									"checked":true,
									"text":"Item1",
									"children":
										[
											{
												"2":{
														"checked":true,
														"text":"Item2",
														"children":[]
													}
											}
										]
									}
							}
						 ]
					*/
				inputType:false,/*you can choose checkbox,radio. if you don't want input support, you can write false*/
				inputName:false,
				leavesTag:"span",/*just like the treeview support, you can use a or span, */
				aHref:"",/* if leavesTag=="a", this is the href of the "a", else it is useless*/
				partCheckedImageSrc:"./treeviewaddon/partChecked.jpg",
				
				
				
				/*properties below belong to jquery.treeview
				you can find demos in http://jquery.bassistance.de/treeview/demo/
				*/
				
				control: null,
				animated: "fast",
				collapsed: true,
				unique: true,
				persist: "cookie",
				toggle: function() {}
			};
			var options = $.extend(defaults,options);
			var $this=$(this);
			if(options.jsonArray!=null){
				$this.html(getTreeHtml(options.jsonArray));
			}
			$this.treeview({
				animated: options.animated,
				persist: options.persist,
				collapsed: options.collapsed,
				unique: options.unique,
				toggle: options.toggle
			})
			
			if(options.inputType=="checkbox"){
				var inputs=$this.find("li input:"+options.inputType);
				inputs.click(function(e){
					updateCheckBoxStates($(this));
				}).each(function(index, element) {
					updateCheckBoxParentsStates(inputs.eq(index));
				});
			}
			
			
			function getTreeHtml(jsonArray){
				var treeHtml="";
				
				function recurseTreeHtml(jsonArray){
					
					for(var i =0;i<jsonArray.length;i++){
						treeHtml+="<li>";
						var value,treeItem;
						for(var ind in jsonArray[i])
						{
							value=ind;
							treeItem=jsonArray[i][ind];
						}
						if(options.inputType){
							treeHtml+="<input type=\""+options.inputType+"\"";
							if(options.inputName){
								treeHtml+=" name=\""+options.inputName+"\"";
								treeHtml+=" value=\""+value+"\"";
								if(treeItem.checked){
									treeHtml+=" checked=\"checked\"";
								}
							}
							treeHtml+=" />";
						}
						
						treeHtml+="<"+options.leavesTag+" "+
							((options.leavesTag=="a")?
								"href=\""+options.aHref+"\""
								:"")
							+">"+treeItem.text+"</"+options.leavesTag+">";
						
						if(treeItem.children.length>0){
							treeHtml+="<ul>"
							recurseTreeHtml(treeItem.children);
							treeHtml+="</ul>";
						}
						
						treeHtml+="</li>"
					}		
				};
				
				recurseTreeHtml(jsonArray);
				return treeHtml;
			}
			
			function updateCheckBoxStates($this)
			{
				if($this.attr("checked")=="checked"||$this.attr("checked")==true)
				{
					//update lower chechbox's states
					$this.nextAll("ul").find("input:"+options.inputType).attr("checked",true)
						.css("display","inline").next("img").remove();
					//update upper chechbox's states
					updateCheckBoxParentsStates($this);
				}else{
					//update lower chechbox's states
					$this.nextAll("ul").find("input:"+options.inputType).attr("checked",false)
						.next("img").css("display","inline").remove();
					//update upper chechbox's states
					updateCheckBoxParentsStates($this);
				}
			}
			
			
			//update the states of the upper checkbox 
			function updateCheckBoxParentsStates($this)
			{
				var parents = findCheckBoxParents($this);
				for(i in parents){
					var parent=parents[i];
					var children=parent.nextAll("ul").find("input:"+options.inputType);
					var allChecked=true;
					var allNotChecked=true;
					children.each(function(ind){
						if(children.eq(ind).attr("checked")=="checked"||children.eq(ind).attr("checked")==true){
							allNotChecked=false;
						}else{
							allChecked=false;
						}
					});
					if(allChecked){
						parent.attr("checked",true);

						if(parent.next().is("img")){
							parent.css("display","inline").next("img").remove();
						}
					}else if(allNotChecked){
						parent.attr("checked",false);
						if(parent.next().is("img")){
							parent.css("display","inline").next("img").remove();
						}
					}else{
						parent.attr("checked",false);
						if(!parent.next().is("img")){
							parent.css("display","none").after("<img src='"+options.partCheckedImageSrc+"' class='partChecked' />");
							parent.next("img").click(function(){
								var partCheckedBox=$(this).prev("input:checkbox");
								partCheckedBox.click();
								if(partCheckedBox.attr("checked")=="checked"||partCheckedBox.attr("checked")==true){
									partCheckedBox.css("display","inline").next("img").remove();
								}else{
									partCheckedBox.css("display","none").after("<img src='"+options.partCheckedImageSrc+"' class='partChecked' />");
								}
								updateCheckBoxStates(partCheckedBox);
							});
						}
						//css("background","url(./images/partChecked.jpg)");
					}
					/*if(childrenAllChecked(parent)){
						parent.attr("checked",true);
					}else if(childrenAllNotChecked(parent)){
						parent.attr("checked",false).css();
					}*/
				}
						
			}
			
			//find the upper checkbox
			function findCheckBoxParents(c)
			{
				var checkBoxParents=new Array();
				function pushCheckBoxParent(cc)
				{
					//alert(cc.parent().parent().html());
					var checkBoxParent=cc.parent().parent().prevAll("input:"+options.inputType);
					if(checkBoxParent.length>0){
						checkBoxParents.push(checkBoxParent);
						pushCheckBoxParent(checkBoxParent);
					}
				}
				
				pushCheckBoxParent(c);
				return checkBoxParents;
				
			}
			
		}
	});
	
})(jQuery);