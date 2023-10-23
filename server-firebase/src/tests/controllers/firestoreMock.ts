// This file is used to mock the firestore database for testing purposes
// and allows us to assert on database calls

const mockedGet = jest.fn();
const mockedSet = jest.fn();
const mockedUpdate = jest.fn();
const mockedDelete = jest.fn();
const mockedDoc = jest.fn(() => ({
  get: mockedGet,
  set: mockedSet,
  update: mockedUpdate,
  delete: mockedDelete,
}));
const mockedWhere = jest.fn(() => ({
  get: mockedGet,
}));

const db: any = {
  doc: mockedDoc,
  where: mockedWhere,
  // Add more functions as needed
};

export { db, mockedGet, mockedSet, mockedUpdate, mockedDelete, mockedWhere, mockedDoc };
