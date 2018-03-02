import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { get } from '@ember/object';

export default Controller.extend({
  conekta: inject(),

  init() {
    this._super(...arguments);

    let conekta = get(this, 'conekta');
    conekta.card.createToken();
  }
});

