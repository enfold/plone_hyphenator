+function($) {

var data = $('html').data(),
    module = data.plone_hyphenator = data.plone_hyphenator || {};

// controller for management ui
var manageController = {
  init: function(options) {
    this.options = options;
  },
  open: function() {
    var lang = module.detectLanguage();
    console.log('OPEN', lang);
  },
  close: function() {
    console.log('CLOSE');
  }
};

// export module
module.manageController = manageController;

$(function() {

  manageController.init({
  });

});

}(jQuery);
