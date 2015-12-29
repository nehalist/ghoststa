$(function() {
  // Ghosthunter configuration
  $('#search-field').ghostHunter({
    results: '#search-results',
    before: function() {
      $('#search-results-container').modal('show');
      $('#search-term').html($('#search-field').val());
    },
    onComplete: function() {
      $('#loading-spinner').hide();
    },
    result_template: "<p><h3><a href='{{link}}'>{{title}}</a> <small>{{pubDate}}</small></h3><small>{{description}}</small></p><hr>",
    info_template: "<div class='text-right'><small>{{amount}} posts found</small></div>"
  });
  $('#search-results-container').on('hidden.bs.modal', function() {
    $('#loading-spinner').show();
    $('#search-field').focus();
  });


  // Helper function to get url segments
  function getSegment(segment) {
    var segments = (window.location.pathname).split('/').filter(Boolean);
    return segments[segment];
  }

  // Highlight current tags
  if(getSegment(0) === 'tag') {
    var tag = getSegment(1);
    $('nav.tags a').each(function() {
      var slug = $(this).data('slug');
      if(typeof tag != "undefined") {
        if(slug == tag) {
          $(this).addClass('selected');
        }
      }
    });
  } else {
    $('nav.tags a[data-slug="all"]').addClass('selected');
  }

  // Same for current author
  if(getSegment(0) === 'author') {
    var author = getSegment(1);
    $('nav.authors a').each(function() {
      var slug = $(this).data('slug');
      if(typeof author != "undefined") {
        if(slug == author) {
          $(this).addClass('selected');
        }
      }
    });
  }

  // Highlight current link in navigation
  // Since it seems like the `{{current}}` is bugged.
  // Or I'm just too stupid for it.
  if(typeof getSegment(0) != 'undefined' && getSegment(0) !== 'page') {
    $('a[data-nav-slug=' + getSegment(0) + ']').addClass('current-item');
  } else {
    $('a[data-nav-slug!=""][data-nav-slug]').first().addClass('current-item');
  }


  // Smooth scrolling
  // by http://css-tricks.com/snippets/jquery/smooth-scrolling/
  $('a[data-scroll="true"]').click(function() {
    if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if(target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top - 70
        }, 1000);
        return false;
      }
    }
  });
});
