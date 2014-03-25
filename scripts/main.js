//se pueden pasar parámetros a la url para que pagine. No necesario ahora
function addRepos($repository_list){
	var repoType='';
	var uri="https://api.github.com/orgs/bq/repos";
	$.getJSON(uri,function(json){
		$.each(json,function(index,element){
			if (typeof unwanted_repositories[element.name] == "undefined") {
				buildRepo(element,$repository_list);
			};
		})
	}).success(
		function(){
			$('.loader').hide()
		})

}

function buildRepo(item,$repository_list){
	console.log(item)
	var $repository_list=$('#repository_list');
	var $a 			=	$('<a class="git_element-link" href="'+item.html_url+'">');
	repoType=repositories_classes[item.name];
	var $article 	=	$('<article id="'+item.name+'" class="git_element icoFont '+repoType+'">')
	var $header 	=	$('<header>').append($('<h1>').text(item.name));
	$repository_list.append($a.append($article.append($header)));
}

$(document).ready(function(){
	var $repository_list=$('#repository_list');
	url='config.json';
	$.getJSON(url,function(json){
		console.log(json)
		repositories_classes=json.repositories_clases;
		unwanted_repositories=json.unwanted_repositories;
	})
	addRepos($repository_list)
})