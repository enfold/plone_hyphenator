+function($) {

var hyphenatorSelector = $('meta[name="plone-hyphenator-selector"]').attr('content');

console.log('hyphenatorSelector:', hyphenatorSelector);

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
  init: function() {
    this.config();
    Hyphenator.run();
  },
  config: function() {
    Hyphenator.config({
      // INVISIBLE SEPARATOR
      hyphenchar: String.fromCharCode(173),
      // ZERO WIDTH SPACE
      urlhyphenchar: '\u200b',
      minwordlength : 4,
      selectorfunction: function () {
        return $(hyphenatorSelector).get();
      }
    });
    var exceptions = [];
    /*
    // Let's split it to rows, filtering out blanks
    _.each($('[name="corrections"]').val().split(/\r?\n/), function(val) {
      if (/^\s*$/.test(val)) {
        return;
      }
      // Surprisingly, capitals do matter, (??) so
      // we add both lowercase and capitalized version.
      exceptions.push(val.toLowerCase());
      exceptions.push(val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
    });
    Hyphenator.addExceptions('de', exceptions.join(', '));
    */
  }
};

$(function() {
  controller.init();
});

}(jQuery);
