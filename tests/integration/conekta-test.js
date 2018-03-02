import { moduleFor, test } from 'ember-qunit';
import env from 'dummy/config/environment';
import ConektaMock from 'ember-conekta-service/utils/conekta-mock';
import sinon from 'sinon';
import cc from '../helpers/cc';

moduleFor('service:conekta', 'Integration | Conekta Service', {
  beforeEach() {
    window.Conekta = ConektaMock;

    this.conekta = this.subject({
      config: {
        mock: true,
        publicKey: env.conekta.publicKey
      }
    });
  }
});

test('it sets public key', function(assert) {
  let setPublicKey = sinon.stub(ConektaMock, 'setPublicKey');

  this.conekta.set('didConfigure', false);
  this.conekta.configure();

  assert.ok(setPublicKey.calledWith(env.conekta.publicKey));
  setPublicKey.restore();
});

test('card.createToken sets the token and returns a promise', async function(assert) {
  let res = await this.conekta.card.createToken(cc);
  assert.ok(res.id, 'correct token set');
});
