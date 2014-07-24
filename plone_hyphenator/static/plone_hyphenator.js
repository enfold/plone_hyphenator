+function($) {

// get a query param from the request
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var controller = {
  hyphenateOptions: {
  },
  init: function(options) {
    this.options = options;
    this.config();
    Hyphenator.run();
  },
  config: function() {
    var options = this.options;
    Hyphenator.config({
      // INVISIBLE SEPARATOR
      hyphenchar: String.fromCharCode(173),
      // ZERO WIDTH SPACE
      urlhyphenchar: '\u200b',
      minwordlength : 4,
      selectorfunction: function () {
        return $(options.hyphenatorSelector).get();
      }
    });
    // add exception wordlist
    var exceptions = [];
    for (var i=0; i < options.wordlist.length; i++) {
      var val = options.wordlist[i];
      // Surprisingly, capitals do matter, (??) so
      // we add both lowercase and capitalized version.
      exceptions.push(val.toLowerCase());
      exceptions.push(val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
    }
    // XXX German language only
    // (wordlist will be ignored to all other languages)
    Hyphenator.addExceptions('de', exceptions.join(', '));
  }
};

$(function() {
  var hyphenatorSelector = $('meta[name="plone-hyphenator-selector"]').attr('content');
  var wordlistUrl = $('meta[name="plone-hyphenator-wordlist-url"]').attr('content');
  $.ajax({
    url: wordlistUrl
  }).then(function(data) {
    var wordlist;
    try {
      wordlist = JSON.parse(data);
    } catch (exc) {
      console.log('JSON parse error, wordlist ignored -' + wordlist);
      wordlist = '';
    }
    controller.init({
      hyphenatorSelector: hyphenatorSelector,
      wordlist: wordlist
    });
  });


});

}(jQuery);
