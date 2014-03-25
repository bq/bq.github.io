//se pueden pasar parámetros a la url para que pagine. No necesario ahora
function addRepos($main_container){
	var repoType='';
	var uri="https://api.github.com/orgs/bq/repos";
	$.getJSON(uri,function(json){
		$.each(json,function(index,element){
			if (element.name!='bq.github.io') {
				buildRepo(element,$main_container);
			}else{
				thisRepo=element;
			};
		})
		buildThisRepo(thisRepo,$main_container);
	}).success(
		function(){
			$('.loader').hide()
		})

}

function buildRepo(item,$main_container){
	console.log(item)
	var $main_container=$('#main_container');
	var $a 			=	$('<a class="git_element-link" href="'+item.html_url+'">');
	/*$.each(repositories_classes,function(repoName,repoClass){
		console.log(repoName,repoClass)
		if (repoName==item.name) {repoType=repoClass;}else{repoType="";}
	})*/
	repoType=repositories_classes[item.name];
	console.log(repoType)
	var $article 	=	$('<article id="'+item.name+'" class="git_element icoFont '+repoType+'">')
	var $header 	=	$('<header>').append($('<h1>').text(item.name));
	$main_container.append($a.append($article.append($header)));
}
function buildThisRepo(item,$main_container){
	console.log(item)
	var $a 			=	$('<a class="git_element-link" href="'+item.html_url+'">');
	var $article 	=	$('<article id="'+item.name+'" class="git_element icoFont" data-thisRepo="true">')
	var $header 	=	$('<header>').append($('<h1>').text(item.name));
	$main_container.append($a.append($article.append($header)));
}

$(document).ready(function(){
	var $main_container=$('#main_container');
	url='config.json';
	$.getJSON(url,function(json){
		repositories_classes=json;
		console.log(json)
	})
	addRepos($main_container)

})