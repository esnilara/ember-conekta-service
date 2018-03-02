/* global Conekta */
import loadScript from 'ember-conekta-service/utils/load-script';
import RSVP from 'rsvp';
import Ember from 'ember';
import Service from '@ember/service';
import { get, set } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { registerWaiter } from '@ember/test';
import { debug } from '@ember/debug';
import { isEqual, typeOf } from '@ember/utils';

const { Logger } = Ember;

export default Service.extend({
  didConfigure: false,
  config: null,
  runCount: 0,
  lazyLoad: readOnly('config.lazyLoad'),
  language: readOnly('config.language'),
  mock: readOnly('config.mock'),
  publicKey: readOnly('config.publicKey'),
  debuggingEnabled: readOnly('config.debug'),

  init() {
    this._super(...arguments);

    let lazyLoad = get(this, 'lazyLoad');
    let mock = get(this, 'mock');

    if (Ember.testing)  {
      this._waiter = () => {
        return get(this, 'runCount') === 0;
      };

      registerWaiter(this._waiter);
    }

    if (!lazyLoad || mock) {
      this.configure();
    }
  },

  load() {
    let lazyLoad = get(this, 'lazyLoad');
    let mock = get(this, 'mock');

    let loadJs = lazyLoad && !mock ?
      loadScript('https://cdn.conekta.io/js/latest/conekta.js') :
      RSVP.resolve();

    return loadJs.then(() => {
      this.configure();
    });
  },

  configure() {
    let didConfigure = get(this, 'didConfigure');

    if (!didConfigure) {
      let publicKey = get(this, 'publicKey');
      let language = get(this, 'language') || 'es';

      Conekta.setPublicKey(publicKey);
      Conekta.setLanguage(language);

      this.card = {
        createToken: this._createCardToken.bind(this)
      };

      this._checkForAndAddCardFn('getBrand', Conekta.card.getBrand);
      this._checkForAndAddCardFn('validateNumber', Conekta.card.validateNumber);
      this._checkForAndAddCardFn('validateExpirationDate', Conekta.card.validateExpirationDate);
      this._checkForAndAddCardFn('validateCVC', Conekta.card.validateCVC);

      set(this, 'didConfigure', true);
    }
  },

  debug(...args) {
    let debuggingEnabled = get(this, 'debuggingEnabled');

    if (debuggingEnabled) {
      args[0] = `ConektaService: ${args[0]}`;
      Logger.info.apply(null, args);
    }
  },

  _createCardToken(card) {
    debug('card.createToken:', card);

    this.incrementProperty('runCount');

    return this._conektaPromise((resolve, reject) => {
      this.decrementProperty('runCount');
      return Conekta.Token.create(card, resolve, reject);
    });
  },

  _conektaPromise(callback) {
    return this.load().then(() => {
      return new RSVP.Promise((resolve, reject) => {
        callback(resolve, reject);
      });
    });
  },

  _checkForAndAddCardFn(name, fn) {
    if (isEqual(typeOf(Conekta.card[name]), 'function')) {
      this.card[name] = fn;
    } else {
      this.card[name] = () => {};
      Logger.error(`ember-conekta-service: ${name} on Conekta.card is no longer available`);
    }
  }
});
