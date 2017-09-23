const getKeyBinding = require('../getKeyBinding');

it('should return nothing', () => {
  expect(getKeyBinding()).toEqual(undefined);
});
