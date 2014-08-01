+function($) {

// simple log functions that only log one parameter.
function info(txt) {
  var c = window.console;
  if (c && c.log) {
    c.log(txt);
  }
}

function error(txt) {
  var c = window.console;
  if (c && c.error) {
    c.error(txt);
  }
}

// get a query param from the request
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// split a file name to base + ext parts
function splitName(name) {
  var dotPos = name.lastIndexOf('.'),
    base = name,
    ext = '';
  if (dotPos != -1) {
    base = name.substring(0, dotPos);
    ext = name.substring(dotPos);
  }
  return {
    base: base,
    ext: ext
  };
}

var controller = {
  hyphenateOptions: {
  },
  init: function(options) {
    this.options = options;
    this.config();
    Hyphenator.run();
  },
  detectLanguage: function() {
    // Dry run, just to detect languages.
    // Normally, one would call the corresponding function, but Hyphenator
    // hides these in a closure. So we run the whole shebang but with a
    // zero selection list to make it snappy.
    Hyphenator.config({
      selectorfunction: function () {
        return [];
      }
    });
    // After the hyphenator has detected the current language,
    // it sets it as 'lang' attribute on the html. We will
    // need to use this to fetch our exception list for that language.
    var lang = $('html')[0].lang;
    // info('LANG: ' + lang);
    this.lang = lang;
    return lang;
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
    if (options.wordlist) {
      for (var i=0; i < options.wordlist.length; i++) {
        var val = options.wordlist[i];
        // Surprisingly, capitals do matter, (??) so
        // we add both lowercase and capitalized version.
        exceptions.push(val.toLowerCase());
        exceptions.push(val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
      }
      // add wordlist for current language
      Hyphenator.addExceptions(this.lang, exceptions.join(', '));
    }
  }
};


$(function() {
  var hyphenatorSelector = $('meta[name="plone-hyphenator-selector"]').attr('content');
  var wordlistBaseUrl = $('meta[name="plone-hyphenator-wordlist-url"]').attr('content');
  if (wordlistBaseUrl) {
    // detect language. If xxxx.json was given, the url will be xxxxx_en.json, xxxx_de.json.
    var lang = controller.detectLanguage();
    var split = splitName(wordlistBaseUrl);
    var wordlistUrl = split.base + '_' + lang.toLowerCase() + split.ext;
    $.ajax({
      url: wordlistUrl
    }).done(function(data) {
      var wordlist;
      try {
        wordlist = JSON.parse(data);
      } catch (exc) {
        error('JSON parse error, wordlist ignored - ' + wordlist);
        wordlist = '';
      }
      controller.init({
        hyphenatorSelector: hyphenatorSelector,
        wordlist: wordlist
      });
    }).fail(function(jqXHR, textStatus) {
      error('Wordlist file could not be read, wordlist ignored [' + textStatus + ']');
      // no wordlist
      controller.init({
        hyphenatorSelector: hyphenatorSelector,
      });
    });
  } else {
    // no wordlist
    controller.init({
      hyphenatorSelector: hyphenatorSelector,
    });
  }

});

}(jQuery);