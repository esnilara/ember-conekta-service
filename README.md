ember-conekta-service
==============================================================================

`ember-conekta-service` wraps
[Conekta.js](https://developers.conekta.com/libraries/javascript) library and
makes it available through a service in your ember project. Features based in the
[ember-stripe-service](https://github.com/code-corps/ember-stripe-service/blob/master/README.md)
library.

Installation
------------------------------------------------------------------------------

```
ember install ember-conekta-service
```

Features
------------------------------------------------------------------------------

- sets conekta.js script in index.html (test, app)
- initializes conekta with public key
- injects service in controllers which provides promisified method for `Conekta.card.createToken`
- provides debugging logs for easy troubleshooting
- client side validations for card number, expiration dates, card brand and CVC
- lazy load conekta.js

Configuration
------------------------------------------------------------------------------

In order to use Conekta you must set your [public key](https://admin.conekta.com/settings/keys) in `config/environment.js`.

````javascript
ENV.conekta = {
  publicKey: 'meep_thisIsATestKey',
  language: 'en', // defaults 'es' if not added
  debug: false, // turn on debugging
  lazyLoad: false, // lazy load conekta
  mock: false // mock out conekta.js, good for offline testing
};
````

Lazy Loading
------------------------------------------------------------------------------
If `lazyLoad` is set to turn Conekta.js will not be loaded until you call the
`load()` function on the service. It's best to call this function in a route's
beforeModel hook.

```js
// subscription page route

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Route.extend({
  conekta: service(),

  beforeModel() {
    return get(this, 'conekta').load();
  }
});
```

Example of usage in a route
------------------------------------------------------------------------------
```js
// subscription page route

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';

export default Route.extend({
  conekta: service(),

  processCreditCard() {
    let customer = get(this, 'customer');

    // obtain access to the injected service
    let conektaService = get(this, 'conekta');

    // if for example you had the cc set in your route or component
    let card = get(this, 'creditCard');

    return conekta.card.createToken(card).then((token) => {
      // you get access to your newly created token here
      set(customer, 'conektaToken', token.id);
      return customer.save();
    }).then(() => {
      // do more stuff here
    }).catch((error) => {
      // do something with the error
    });
  }
});
```

Debugging
------------------------------------------------------------------------------

By setting `debug: true` in your application configuration you can enable some
debugging messages from the service.

````javascript
var ENV = {
  // some vars...
  conekta: {
    debug: true
  }
  // more config ...
}
````

Validations
------------------------------------------------------------------------------

Conekta has a few client-side validation helpers. See more information
[here](https://developers.conekta.com/libraries/javascript#validations)

* `validateNumber` - Checks that the format of the card number is correct.
* `validateExpirationDate` - Checks that the expiration date is a valid and future date.
* `validateCVC` - Checks that the security code is a valid whole number, 3 to 4 characters long.
* `getBrand` - Returns the type of the card as a string. The possible types are "visa", "mastercard", "amex", "unknown"

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-conekta-service`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
