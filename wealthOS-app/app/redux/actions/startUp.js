// Action Types
const START_UP = 'START_UP';

// Creators
const startUp = () => {
  return {
    type: START_UP,
    payload: {},
  };
};

export const types = {
  START_UP,
};

export const actions = {
  startUp,
};
