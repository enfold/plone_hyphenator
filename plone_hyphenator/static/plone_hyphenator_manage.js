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
      // module.info('OPEN ' + this.lang);
      // take the initial wordlist from the controller.
      this.setWordList(module.controller.options.wordList);
      this.el.find('.submit').removeAttr('disabled');
      this.el.overlay().load();
    }
  },
  close: function() {
    // module.info('CLOSE');
    this.el.overlay().close();
  },
  selectLanguage: function(lang) {
    var self = this;
    if (lang != this.lang) {
      this.lang = lang;
      this.el.find('select').val(lang);
      // fetch the list for the new language
      this.el.find('.submit').attr('disabled', 'disabled');
      this.el.find('textarea').attr('disabled', 'disabled');
      module.fetchWordList({
        wordListBaseUrl: this.options.wordListBaseUrl,
        lang: lang
      }).then(function(wordList) {
        console.log('SELECTED', lang, wordList);
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
    // module.info('SAVE');
    this.el.find('.submit').attr('disabled', 'disabled');
    var url = this.options.wordListSaveUrl,
        txt = this.el.find('textarea').val(),
        lines = txt.split(/\n/),
        content = [];
    for (var i = 0; i < lines.length; i++) {
      // remove all whitespace, also from the middle of the word!
      var trimmed = lines[i].replace(/\s+/g,'');
      // make sure there is only 1 dash
      trimmed = trimmed.replace(/\-+/g,'-');
      if (trimmed) {
        content.push(trimmed);
      }
    }
    var jsonContent = JSON.stringify(content);
    // module.info('Saving wordlist for language "' + this.lang + '": ' + jsonContent);
    $.ajax({
      url: url,
      method: 'POST',
      data: {
        lang: this.lang,
        content: jsonContent
      }
    }).done(function(data) {
      self.close();
      // XXX XXX re-hyphenate everything, or reload?
    }).fail(function(jqXHR, textStatus) {
      alert('Saving corrections have failed. [' + textStatus + ']');
      self.close();
    });
    // Also save the wordlist locally.
    module.controller.options.wordList = content;
  }
};


// export module
module.manageController = manageController;

$(function() {
  manageController.init({
    wordListBaseUrl: $('meta[name="plone-hyphenator-wordlist-url"]').attr('content'),
    wordListSaveUrl: $('meta[name="plone-hyphenator-wordlist-save-url"]').attr('content')
  });
});

}(jQuery);
