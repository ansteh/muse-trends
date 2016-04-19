(function(document, jQuery){
  var request = function(url){
    return new Promise(function(resolve, reject) {
      jQuery.getJSON(url)
      .then(function(response){ resolve(response); })
      .fail(function(err){ reject(err); });
    });
  };

  var Muse = (function(){
    var domain = 'https://api.datamuse.com';

    function url(path){
      return domain+encodeURI(path);
    };

    function sugUrl(query){
      return url('/sug?s='+query);
    };

    return {
      suggest: function(query){
        return request(sugUrl(query));
      }
    };
  }());

  function test(){
    Muse.suggest('rawand')
    .then(function(suggestions){
      console.log(suggestions);
    })
    .catch(function(err){
      console.log(err);
    });
  };
  //test();

  var source = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    //prefetch: '../data/films/post_1960.json',
    identify: function(obj) { console.log(obj); return obj.word; },
    remote: {
      url: 'https://api.datamuse.com/sug?s=%QUERY',
      wildcard: '%QUERY'
    }
  });

  jQuery(document).ready(function(){
    jQuery('#suggestion .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 2
    }, {
      name: 'muse-suggesions',
      display: 'value',
      source: source,
      limit: 9,
      templates: {
        empty: [
          '<div class="empty-message">',
            'unable to find any Best Picture winners that match the current query',
          '</div>'
        ].join('\n'),
        suggestion: Handlebars.compile('<div>{{word}} <span style="float: right;">{{score}}</span></div>')
      }
    });

    var trandsAnchor = jQuery('#trends');
    var render = function(query){
      trandsAnchor.html('<iframe src="/trends?query='+encodeURIComponent(query)+'" style="width: 800px; height: 330px; border: 0;"></iframe>');
    };

    jQuery('#suggestion .typeahead').bind('typeahead:select', function(ev, suggestion) {
      //console.log('Selection: ', suggestion);
      render(suggestion.word);
    });
  });


}(document, jQuery));
