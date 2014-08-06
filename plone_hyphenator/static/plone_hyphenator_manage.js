+function($) {

var data = $('html').data(),
    module = data.plone_hyphenator = data.plone_hyphenator || {};

// controller for management ui
var manageController = {
  init: function(options) {
    var self = this;
    this.options = options;
    var el = this.el = $('#plone-hyphenator-overlay');
    el.overlay({
    });
    el.find('.close').click(function(evt) {
      self.close();
      return false;
    });
    el.find('.submit').click(function(evt) {
      self.save();
      return false;
    });
    el.find('select').change(function(evt) {
      self.selectLanguage($(this).val());
    });
    // Extend language options
    // - current language has Current label added.
    // - if current language is missing, add it. So the current lang is always editable.
    var lang = module.detectLanguage();
    var selected = el.find('option[value="' + lang + '"]');
    if (selected.length > 0) {
      selected.text(selected.text() + ' (Current)');
    } else {
      $('<option></option>')
        // use 2-letter lang code for language name, since we don't have the name here
        .text(lang.toUpperCase() + ' (Current)')
        .attr('value', lang)
        .appendTo(el.find('select'));
    }
    this.selectLanguage(lang);
  },
  open: function() {
    if (! this.options.wordListSaveUrl) {
      module.error('Hyphenation management does not work without a wordlist.');
    } else {
      // take the initial wordlist from the controller.
      this.setWordList(module.controller.options.wordList || []);
      this.el.find('.submit').removeAttr('disabled');
      this.el.overlay().load();
    }
  },
  close: function() {

    this.el.overlay().close();
  },
  selectLanguage: function(lang) {
    var self = this;
    if (this.lang === undefined) {
      // skip for the first time (undefined), because the controller has
      // already fetched the list and we do not want to double fetch.
      this.lang = lang;
    } else if (lang != this.lang) {
      this.lang = lang;
      this.el.find('select').val(lang);
      // fetch the list for the new language
      this.el.find('.submit').attr('disabled', 'disabled');
      this.el.find('textarea').attr('disabled', 'disabled');
      module.fetchWordList({
        wordListBaseUrl: this.options.wordListBaseUrl,
        lang: lang
      }).then(function(wordList) {
        self.el.find('.submit').removeAttr('disabled');
        self.el.find('textarea').removeAttr('disabled');
        // Update ourselves. Never update the hyphenation at this point.
        self.setWordList(wordList);
      });
    }
  },
  setWordList: function(wordList) {
    var txt = wordList.join('\n');
    this.el.find('textarea').val(txt);
  },
  save: function() {
    var self = this;
    this.el.find('.submit').attr('disabled', 'disabled');
    var url = this.options.wordListSaveUrl,
        txt = this.el.find('textarea').val(),
        lines = txt.split(/\n/),
        wordList = [];
    for (var i = 0; i < lines.length; i++) {
      // remove all whitespace, also from the middle of the word!
      var trimmed = lines[i].replace(/\s+/g,'');
      // make sure there is only 1 dash
      trimmed = trimmed.replace(/\-+/g,'-');
      if (trimmed) {
        wordList.push(trimmed);
      }
    }
    $.ajax({
      url: url,
      type: 'POST',
      data: {
        lang: this.lang,
        content: JSON.stringify(wordList)
      }
    }).done(function(data) {
      self.close();
      // update the current controller with the new word list
      // only if this is our current language.
      if (self.lang == module.detectLanguage()) {
        // XXX Actually, it won't update but reload the page,
        // as the upstream code does not support this elementary use case.
        module.controller.update({
          wordList: wordList,
        });
      }
    }).fail(function(jqXHR, textStatus) {
      alert('Saving corrections have failed. [' + textStatus + ']');
      self.close();
    });
  }
};


// export module
module.manageController = manageController;

$(function() {
  var config = JSON.parse($('meta[name="plone-hyphenator-config"]').attr('content'));
  manageController.init({
    wordListBaseUrl: config.wordlist_url,
    wordListSaveUrl: config.wordlist_save_url
  });
});

}(jQuery);
