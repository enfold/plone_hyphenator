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
    var lang = module.detectLanguage();
    console.log('OPEN', lang);
    this.el.overlay().load();
  },
  close: function() {
    console.log('CLOSE');
    this.el.overlay().close();
  },
  save: function() {
    console.log('SAVE');
    this.close();
  }
};


// export module
module.manageController = manageController;

$(function() {
  manageController.init({
  });
});

}(jQuery);
