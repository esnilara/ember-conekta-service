import sinon from 'sinon';
import { module, test } from 'qunit';
import { initialize } from 'dummy/initializers/ember-conekta-service';
import env from 'dummy/config/environment';
import ConektaMock from 'ember-conekta-service/utils/conekta-mock';
import Application from '@ember/application';
import { run } from '@ember/runloop';
import Ember from 'ember';

const { Logger } = Ember;

let container, application;

module('Unit | Initializer | Conekta Service Initializer', {
  beforeEach() {
    run(() => {
      application = Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('it logs when LOG_CONEKTA_SERVICE is set in env config', function(assert) {
  env.LOG_CONEKTA_SERVICE = true;

  let info = sinon.stub(Logger, 'info');
  initialize(container, application);

  assert.ok(info.calledWith('ConektaService: initialize'));

  info.restore();
});

test('it turns on debugging when LOG_CONEKTA_SERVICE is set in env config', function(assert) {
  env.LOG_CONEKTA_SERVICE = true;
  env.conekta.debug = undefined;

  let info = sinon.stub(Logger, 'info');
  initialize(container, application);

  let conektaConfig = container.lookup('config:conekta');
  assert.ok(conektaConfig.debug);

  info.restore();
});

test('it uses conekta-mock when running in FastBoot', function(assert) {
  window.FastBoot = true;

  initialize(container, application);

  assert.equal(window.Conekta, ConektaMock);

  delete window.FastBoot;
});

test('it uses conekta-mock when mocking is turned on', function(assert) {
  env.conekta.mock = true;

  initialize(container, application);

  assert.equal(window.Conekta, ConektaMock);
});
