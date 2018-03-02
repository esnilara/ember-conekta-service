export default {
  setPublicKey() {},
  setLanguage() {},

  card: {
    getBrand() {},
    validateNumber() {},
    validateExpirationDate() {},
    validateCVC() {}
  },

  Token: {
    create(card, cb) {
      cb({ id: 'mocked' });
    }
  }
};
