$(function() {
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

  var href = window.location.href.replace(/\/$/, "");
  if(href.indexOf('/tag/') > -1) {
    var tag  = href.substr(href.lastIndexOf('/') + 1);
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
});
