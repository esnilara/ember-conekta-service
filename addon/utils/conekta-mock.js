export default {
  setPublicKey() {},

  card: {
    getBrand() {},
    validateNumber() {},
    validateExpirationDate() {},
    validateCVC() {}
  },

  Token: {
    create(card, cb) {
      cb('ok', { id: 'mocked' });
    }
  }
};
