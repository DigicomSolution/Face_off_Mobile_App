import * as actionTypes from '../ActionTypes';

export const votingFeeds = (data, dispatch) => {
  console.log('votingFeeds', data);
  dispatch({
    type: actionTypes.Loading_Enable,
  });
  dispatch({
    type: actionTypes.Voting_Feeds,
    payload: data,
  });
  dispatch({
    type: actionTypes.Loading_Disable,
  });
};
