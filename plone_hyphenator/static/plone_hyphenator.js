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
  var html = $('html');
  var lang = html[0].lang;
  if (! lang) {
    // is there a 'lang' attribute?
    // let's make sure there is one...
    var langAttr = html.attr('lang') || html.attr('xml:lang');
    if (! langAttr) {
      // set a fallback language, otherwise Hyphenator will blow up
      // this case helps with admin pages or any page which have no language set.
      // (Alternately, we could handle this case as 'no language, no hyphenation',
      // but the current implementation which provides the fallback, is the simplest.)
      html.attr('lang', 'en');
    }
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
    // detect language. {{LANG}} will be replaced by the current language.
    var wordListUrl = o.wordListBaseUrl.replace(/{{LANG}}/g, o.lang.toLowerCase());
    // info('wordListUrl: ' + wordListUrl);
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
    $.extend(this.options, options);
    // Do not act if this language is disabled.
    if (this.options.enabled) {
      // Reconfig and re-run does not seem to work. Reload.
      window.location.reload();
    }
  },
  config: function() {
    var options = this.options;
    // Do not act if this language is disabled.
    if (options.enabled) {
      Hyphenator.config({
        // INVISIBLE SEPARATOR
        hyphenchar: String.fromCharCode(173),
        // ZERO WIDTH SPACE
        urlhyphenchar: '\u200b',
        minwordlength : 4,
        // Specify a fallback language in any case
        defaultlanguage: detectLanguage(),
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
        // Note that Hyphenator does not allow _deleting_ the existing list and always appends to it.
        // which is why we cannot update this on the fly.
        var lang = detectLanguage();
        Hyphenator.addExceptions(lang, exceptions.join(', '));
      }
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
  var config = JSON.parse($('meta[name="plone-hyphenator-config"]').attr('content'));
  var lang = detectLanguage();
  fetchWordList({
    wordListBaseUrl: config.wordlist_url,
    lang: lang
  }).then(function(wordList) {
    controller.init({
      hyphenatorSelector: config.selector,
      wordList: wordList,
      enabled: !(config.disable_all_languages || config.disable_languages.indexOf(lang) != -1)
    });
  });
});

}(jQuery);
