jest.mock('esm', () => module => id => module.require(id))
