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
  },
  open: function() {
    if (! this.options.wordlistSaveUrl) {
      module.error('Hyphenation management does not work without a wordlist.');
    } else {
      this.lang = this.lang || module.detectLanguage();
      // module.info('OPEN ' + this.lang);
      var txt = module.controller.options.wordlist.join('\n');
      this.el.find('textarea').val(txt);
      this.el.find('.submit').removeAttr('disabled');
      this.el.overlay().load();
    }
  },
  close: function() {
    // module.info('CLOSE');
    this.el.overlay().close();
  },
  save: function() {
    var self = this;
    // module.info('SAVE');
    this.el.find('.submit').attr('disabled', 'disabled');
    var url = this.options.wordlistSaveUrl,
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
    module.controller.options.wordlist = content;
  }
};


// export module
module.manageController = manageController;

$(function() {
  var wordlistSaveUrl = $('meta[name="plone-hyphenator-wordlist-save-url"]').attr('content');
  manageController.init({
    wordlistSaveUrl: wordlistSaveUrl
  });
});

}(jQuery);
