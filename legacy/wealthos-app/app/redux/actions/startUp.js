// Action Types
export const START_UP = 'START_UP';

// Creators
export const startUp = () => {
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
