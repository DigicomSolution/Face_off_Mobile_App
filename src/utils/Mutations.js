import {gql} from 'apollo-boost';

export const LOGIN_MUTATION = gql`
  mutation loginViaOtp($loginViaOtpInput: LoginViaOtpInput!) {
    loginViaOtp(loginViaOtpInput: $loginViaOtpInput)
  }
`;

export const LOGIN_OTP_MUTATION = gql`
  mutation verifyOtp($verifyOtpInput: VerifyOtpInput!) {
    verifyOtp(verifyOtpInput: $verifyOtpInput) {
      token
      isRegistered
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation createUserProfile($createUserProfileInput: CreateUserProfileInput) {
    createUserProfile(createUserProfileInput: $createUserProfileInput) {
      id
      email
      first_name
      last_name
      profile_picture
      city
      state
      age
      dob
      points
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation editUserProfile($editUserProfileInput: EditUserProfileInput) {
    editUserProfile(editUserProfileInput: $editUserProfileInput) {
      id
      email
      first_name
      last_name
      profile_picture
      phone
      city
      state
      age
      dob
      points
    }
  }
`;

export const VOTE_MUTATION = gql`
  mutation vote($voteInput: VoteInput) {
    vote(voteInput: $voteInput)
  }
`;

export const REPORT_MUTATION = gql`
  mutation report($topic_id: Int) {
    report(topic_id: $topic_id)
  }
`;

export const FOLLOW_MUTATION = gql`
  mutation follow($followable_id: Int!) {
    follow(followable_id: $followable_id)
  }
`;

export const UNFOLLOW_MUTATION = gql`
  mutation unfollow($followable_id: Int!) {
    unfollow(followable_id: $followable_id)
  }
`;

export const WATCH_VIDEO_MUTATION = gql`
  mutation videoViews($videoViewsInput: VideoViewsInput!) {
    videoViews(videoViewsInput: $videoViewsInput)
  }
`;

export const CREATE_TOPIC = gql`
  mutation createTopic($createTopicInput: CreateTopicInput) {
    createTopic(createTopicInput: $createTopicInput) {
      claim
      category
      category_id
      video
      thumbnail
    }
  }
`;

export const AGAINST_MUTATION = gql`
  mutation againstVideo($againstVideoInput: AgainstVideoInput) {
    againstVideo(againstVideoInput: $againstVideoInput) {
      id
      topic_id
      against_user
      against_video
      against_video_thumbnail
    }
  }
`;

export const CREATE_FEEDBACK = gql`
  mutation feedback($rating: Int!, $message: String) {
    feedback(rating: $rating, message: $message) {
      user_id
      rating
      message
    }
  }
`;

// export const INVITE_FRIENDS = gql`
// mutation inviteFriends{
//     inviteFriends
//     {
//         points
//     }
// }`;

export const INVITE_FRIENDS = gql`
  mutation inviteFriends {
    inviteFriends
  }
`;

export const COMMENT_MUTATION = gql`
  mutation comment($commentInput: CommentInput) {
    comment(commentInput: $commentInput)
  }
`;

export const DELETE_YOUR_SIDE = gql`
  mutation deleteYourSide($topic_id: Int) {
    deleteYourSide(topic_id: $topic_id)
  }
`;

export const REPOST_TOPIC = gql`
  mutation repostTopic($topic_id: Int) {
    repostTopic(topic_id: $topic_id) {
      id
      claim
      category_id
      category
      video
      thumbnail
    }
  }
`;

export const RECAPTURE_VIDEO = gql`
  mutation updateArchiveVideo($topic_id: Int, $video: String) {
    updateArchiveVideo(topic_id: $topic_id, video: $video) {
      id
      claim
      category_id
      category
      video
      thumbnail
    }
  }
`;

export const BUY_POINTS = gql`
  mutation pointsPurchaseLog($pointsPurchaseInput: PointsPurchaseInput) {
    pointsPurchaseLog(pointsPurchaseInput: $pointsPurchaseInput) {
      transcation_id
      product_id
      transcation_date
      transcation_time
      points
    }
  }
`;

export const BLOCK_USER = gql`
  mutation blockUser($blocked_user: Int) {
    blockUser(blocked_user: $blocked_user)
  }
`;

export const UNBLOCK_USER = gql`
  mutation unblockUser($blocked_user: Int) {
    unblockUser(blocked_user: $blocked_user)
  }
`;
