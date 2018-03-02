import ConektaMock from 'ember-conekta-service/utils/conekta-mock';
import config from '../config/environment';
import Ember from 'ember';

const { Logger } = Ember;

export function initialize(...args) {
  const application = args[1] || args[0];

  let conektaConfig = config.conekta || {};

  conektaConfig.debug = conektaConfig.debug || config.LOG_CONEKTA_SERVICE;

  application.register('config:conekta', conektaConfig, { instantiate: false });
  application.inject('service:conekta', 'config', 'config:conekta');

  if (conektaConfig.debug) {
    Logger.info('ConektaService: initialize');
  }

  if (!conektaConfig.publicKey) {
    throw new Error("ConektaService: Missing Conekta key, please set `ENV.conekta.publicKey` in config.environment.js")
  }

  if (typeof FastBoot !== 'undefined' || conektaConfig.mock) {
    window.Conekta = ConektaMock;
  }
}

export default {
  name: 'ember-conekta-service',
  initialize
}
