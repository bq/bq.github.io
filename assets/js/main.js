/* main.js */

var projectList = $('.projects-list');


function getGithubProjects(organizations) {

    var loader = $('.loader');
    var projectsAvailable = false;

    var ajaxRequests = organizations.map(function (org){
      return $.ajax({
        type: "GET",
        url: 'https://api.github.com/orgs/' + org.name + '/repos?callback=?',
        data: { type: "all", per_page: 500},
        dataType: 'json',
      });
    });

    $.when
      .apply(this, ajaxRequests)
      .done(function() {
        $.each(arguments, function(index, resp){

          if(resp[0]){
            resp = resp[0];
          }

          if (resp.data.length > 0) {
              projectsAvailable = true;
              $.each(resp.data, function (i) {
                  setMarkupRepo(resp.data[i], organizations[index].icon);
              });

          } else {

            if (index == arguments.length - 1 && $('.projects-list .project').length == 0) {
              projectList.html('<p class="align-center">Could not show any repository</p>');
            }

          }
      });

      loader.remove();

      if(projectsAvailable) {
        handleMixItUp();
      }

    }).fail(function() {

        loader.remove();
        projectList.html('<p class="align-center">Repositories have failed loaded.</p>');

    });
}

function setMarkupRepo(data, icon) {
    projectList.append(
        '<div class="project" data-star="' + data['stargazers_count']+ '" data-language="' + (data['language'] ? data['language'] : 'other') + '">'
        +  '<a class="project__title" href="' + data['html_url'] + '">'
        +     (icon ? '<img  class="project__icon" alt="' + data['owner']['login'] + 'icon" src="' + data['owner']['avatar_url'] +  '" title="' + data['owner']['login'] +'" />' : '')
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
    var languageList = ['JavaScript', 'CSS', 'C++', 'C', 'Java', 'Ruby'];

    projectList.mixItUp({
        selectors: {
            target: '.project'
        },
        load: {
            sort: 'star:desc'
        },
        callbacks: {
            onMixFail: function(state){
                if(state.activeFilter == 'none') {
                    $('.project').each(function() {
                        if( $.inArray($(this).attr('data-language'), languageList) == -1 ){
                            $matching = $matching.add(this);
                        }
                    });
                    projectList.mixItUp('filter', $matching);
                    $('.custom').addClass('active');
                } else {

                    if ($('.no-match').length < 1) {
                        projectList.prepend('<p class="no-match">There are no results that match your search</p>');
                    }
                    $('.no-match').addClass('hidden-match');
                }
            },
            onMixStart: function(){
                $('.no-match').removeClass('hidden-match');
            }
        }
    });

    $('.filter').on('click', function(e) {
        e.preventDefault();
        $searcher.val('');
    });

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
    getGithubProjects([
      {
        name: 'bqlabs',
        icon: true
      },
      {
        name: 'bq',
        icon: false
      }
    ]);
});
