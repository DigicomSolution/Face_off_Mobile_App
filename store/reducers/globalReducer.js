import * as actionTypes from '../ActionTypes';
const initialState = {
  loading: false,
};

export const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.Loading_Disable: {
      return {
        ...state,
        loading: false,
      };
    }
    case actionTypes.Loading_Enable: {
      return {
        ...state,
        loading: true,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};
