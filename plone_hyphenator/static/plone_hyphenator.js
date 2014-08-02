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

function detectLanguage() {
  var lang = $('html')[0].lang;
  if (! lang) {
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
    lang = $('html')[0].lang;
  }
  return lang;
}

function fetchWordList(o) {
  var deferred = $.Deferred();
  if (o.wordListBaseUrl) {
    // detect language. If xxxx.json was given, the url will be xxxxx_en.json, xxxx_de.json.
    var split = splitName(o.wordListBaseUrl),
        wordListUrl = split.base + '_' + o.lang.toLowerCase() + split.ext;
    $.ajax({
      url: wordListUrl,
      // always parse json response. Regardless of mime type which may be set incorrectly.
      dataType: 'json'
    }).done(function(data) {
      deferred.resolve(data);
    }).fail(function(jqXHR, textStatus) {
      error('Wordlist file could not be read, wordlist ignored [' + textStatus + ']');
      // no wordlist
      deferred.resolve([]);
    });
  } else {
    // no wordlist
    deferred.resolve([]);
  }
  return deferred;
}

var controller = {
  hyphenateOptions: {
  },
  init: function(options) {
    this.options = options;
    this.config();
    Hyphenator.run();
  },
  update: function(options) {
    info('UPDATE!', options);
    $.extend(this.options, options);
    this.config();
    Hyphenator.run();
  },
  detectLanguage: function() {
    this.lang = detectLanguage();
    return this.lang;
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
    if (options.wordList) {
      for (var i=0; i < options.wordList.length; i++) {
        var val = options.wordList[i];
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

// export module
var data = $('html').data(),
    module = data.plone_hyphenator = data.plone_hyphenator || {};
module.controller = controller;
module.detectLanguage = detectLanguage;
module.fetchWordList = fetchWordList;
module.info = info;
module.error = error;


$(function() {
  fetchWordList({
    wordListBaseUrl: $('meta[name="plone-hyphenator-wordlist-url"]').attr('content'),
    lang: detectLanguage()
  }).then(function(wordList) {
    controller.init({
      hyphenatorSelector: $('meta[name="plone-hyphenator-selector"]').attr('content'),
      wordList: wordList
    });
  });
});

}(jQuery);
