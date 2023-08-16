import * as actionTypes from '../ActionTypes';
import _ from 'lodash';
const initialState = {
  voting_feeds: [],
};
export const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.Voting_Feeds: {
      return {
        ...state,
        voting_feeds: action.payload.data,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};
