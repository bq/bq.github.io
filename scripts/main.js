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

function shorten(text, maxLength) {
    var ret = text;
    if (ret.length > maxLength) {
        ret = ret.substr(0,maxLength-3) + "...";
    }
    return ret;
}

function buildRepo(item,$repository_list){
	//console.log(item)
	var hasDescription='';
	if (item.description) {
		hasDescription=' has_description';
		var description=item.description;
		charLimit=100;
		if (window.innerWidth>766 && window.innerWidth<950) {
			charLimit=56;
		}else if(window.innerWidth>=950 && window.innerWidth<990){
			charLimit=70;
		}else if(window.innerWidth>=990 && window.innerWidth<1200){
			charLimit=50;
		}else if(window.innerWidth>=1200){
			charLimit=58;
		};
		description=shorten(description,charLimit);
		var $description=	$('<p class="description">').text(description);
	};
	var $a 			=	$('<a class="git_element-link" href="'+item.html_url+'">');
	repoType=repositories_classes[item.name];
	var $article 	=	$('<article id="'+item.name+'" class="git_element icoFont '+repoType+hasDescription+'">');
	var $header 	=	$('<header>').append($('<h1>').text(item.name));
	$repository_list.append($a.append($article.append($header,$description)));
}

$(document).ready(function(){
	var $repository_list=$('#repository_list');
	url='config.json';
	$.getJSON(url,function(json){
		repositories_classes=json.repositories_clases;
		unwanted_repositories=json.unwanted_repositories;
	})
	addRepos($repository_list)
})