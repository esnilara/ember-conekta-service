'use strict';

module.exports = {
  name: 'ember-conekta-service',

  contentFor: function(type, config) {
    let conektaConfig = config.conekta || {};

    let lazyLoad = conektaConfig.lazyLoad;
    let mock = conektaConfig.mock;

    if (type === 'body' && !lazyLoad && !mock) {
      return '<script type="text/javascript" src="https://cdn.conekta.io/js/latest/conekta.js"></script>';
    }
  },

  isDevelopingAddon() {
    return false;
  }
};
