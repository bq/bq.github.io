/* main.js */

var projectList = $('.projects-list');


function getGithubProjects() {

    var loader = $('.loader');

    $.ajax({
        type: "GET",
        url: 'https://api.github.com/orgs/bq/repos?callback=?',
        data: { type: "all", per_page: 500},
        dataType: 'json',
        success: function(resp) {

            if (resp.data.length > 0) {

                loader.remove();

                $.each(resp.data, function (i) {
                    setMarkupRepo(resp.data[i]);
                });

                handleMixItUp();
            }
            else {
                loader.remove();
                projectList.html('<p class="align-center">Repositories have failed loaded.</p>');
            }
        }
    });
}

function setMarkupRepo(data) {

    projectList.append(
        '<div class="project " data-language="' + (data['language'] ? data['language'] : 'other') + '">'
        +  '<a class="project__title" href="' + data['html_url'] + '">'
        +     '<em>' + data['name'] + '</em>'
        +  '</a>'
        +  '<p class="project__description">'
        +     (data['description'] ? data['description'] : '(No description)')
        +  '</p>'
        +   (data['homepage'] ? '<p class="project__homepage"><span class="octicon octicon-link-external"></span> <a href="' + data['homepage'] + '">' + data['homepage'] + '</a></p>' : '')
        +  '<p class="project__stats">'
        +    (data['language'] ? data['language'] : '')
        +    ' <span class="octicon octicon-star"></span> ' + data['stargazers_count']
        +    ' <span class="octicon octicon-git-branch"></span> ' + data['forks_count']
        +  '</p>'
        + '</div>'
    );
}


function handleMixItUp() {

    var inputText;
    var $matching = $();
    var $searcher = $(".searcher__input");

    projectList.mixItUp({
        selectors: {
            target: '.project'
        }
    });

    $('.filter').on('click', function(e) {
        e.preventDefault();
        $searcher.val('');
    })

    $('.searcher').on('submit', function(e) {
        e.preventDefault();
    });

    // Delay function
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $searcher.keyup(function(){

        // Delay function invoked to make sure user stopped typing
        delay(function(){

            inputText = $searcher.val().toLowerCase();

            // Check to see if input field is empty
            if ((inputText.length) > 0) {
                $('.project').each(function() {

                    // add item to be filtered out if input text matches items inside the title
                    if($(this).children('.project__title').children('em').text().toLowerCase().match(inputText)) {
                        $matching = $matching.add(this);
                    }
                    else {
                        // removes any previously matched item
                        $matching = $matching.not(this);
                    }
                });

                // set matching filters
                projectList.mixItUp('filter', $matching);
            }

            else {
                // resets the filter to show all item if input is empty
                projectList.mixItUp('filter', 'all');
            }
        }, 200 );
    });
}

// On document load ...
$(window).on('load', function() {
    getGithubProjects()
});
