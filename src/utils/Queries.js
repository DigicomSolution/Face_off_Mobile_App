import {gql} from 'apollo-boost';

export const GET_USER_INFO = gql`
  query getUserProfile {
    getUserProfile {
      id
      first_name
      last_name
      email
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

export const FEEDS_AOI = gql`
  query votingFeeds(
    $page: Int
    $pageSize: Int
    $claim: String
    $isCategory: Boolean
    $sorting_id: Int
    $type: Int!
    $topic_id: Int
  ) {
    votingFeeds(
      page: $page
      pageSize: $pageSize
      claim: $claim
      isCategory: $isCategory
      sorting_id: $sorting_id
      type: $type
      topic_id: $topic_id
    ) {
      id
      username
      profile_picture
      user_id
      isFollow
      video
      claim
      category
      category_id
      against_user
      against_profile_picture
      against_username
      against_video
      start_time
      end_time
      totalComments
      totalVotes
      thumbnail
      against_video_thumbnail
      totalFavourVotes
      totalAgainstVotes
      voting_type
      voting_type_flag
      active
      views
      timeLeft
      created_at
      userIsResponder
    }
  }
`;

export const ARCHIVES_AOI = gql`
  query archivesList(
    $page: Int
    $pageSize: Int
    $category_id: Int
    $claim: String
    $type: Int!
  ) {
    archivesList(
      page: $page
      pageSize: $pageSize
      claim: $claim
      category_id: $category_id
      type: $type
    ) {
      id
      username
      profile_picture
      user_id
      isFollow
      video
      claim
      category
      category_id
      against_user
      against_username
      against_profile_picture
      against_video
      start_time
      end_time
      totalComments
      totalVotes
      thumbnail
      against_video_thumbnail
      totalFavourVotes
      totalAgainstVotes
      voting_type
      voting_type_flag
      active
      views
      timeLeft
      created_at
    }
  }
`;

export const VOTING_FEEDS_SORTING = gql`
  query feedSorting($isCategory: Boolean!, $sorting_id: Int!) {
    feedSorting(isCategory: $isCategory, sorting_id: $sorting_id) {
      id
      username
      profile_picture
      user_id
      isFollow
      video
      claim
      category
      category_id
      against_user
      against_username
      against_video
      start_time
      end_time
      totalComments
      totalVotes
      thumbnail
      against_video_thumbnail
      totalFavourVotes
      totalAgainstVotes
      voting_type
      voting_type_flag
      active
      views
      timeLeft
      created_at
    }
  }
`;

export const VOTING_FEEDS = gql`
  query votingFeeds {
    votingFeeds {
      id
      username
      profile_picture
      user_id
      isFollow
      video
      claim
      category
      category_id
      against_user
      against_username
      against_video
      start_time
      end_time
      totalComments
      totalVotes
      thumbnail
      against_video_thumbnail
      totalFavourVotes
      totalAgainstVotes
      voting_type
      voting_type_flag
      active
      views
      timeLeft
      created_at
    }
  }
`;

export const ARCHIVE_FEEDS = gql`
  query archivesList {
    archivesList {
      id
      username
      profile_picture
      user_id
      isFollow
      video
      claim
      category
      category_id
      against_user
      against_username
      against_video
      start_time
      end_time
      totalComments
      totalVotes
      thumbnail
      against_video_thumbnail
      totalFavourVotes
      totalAgainstVotes
      voting_type
      voting_type_flag
      active
      views
      timeLeft
      created_at
    }
  }
`;

export const FILTERED_ARCHIVE = gql`
  query archivesListByCategoryFilter($category_id: Int) {
    archivesListByCategoryFilter(category_id: $category_id) {
      id
      username
      profile_picture
      user_id
      isFollow
      video
      claim
      category
      category_id
      against_user
      against_username
      against_video
      start_time
      end_time
      totalComments
      totalVotes
      thumbnail
      against_video_thumbnail
      totalFavourVotes
      totalAgainstVotes
      voting_type
      voting_type_flag
      active
      views
      timeLeft
      created_at
    }
  }
`;

export const GET_CATEGORY = gql`
  query categoryList {
    categoryList {
      id
      name
    }
  }
`;

export const GET_USER_LIST = gql`
  query usersList {
    usersList {
      id
      first_name
      last_name
      profile_picture
    }
  }
`;

export const FOLLOWERS_LIST = gql`
  query followerList {
    followerList {
      userDetails {
        id
        first_name
        last_name
        profile_picture
      }
    }
  }
`;

export const FOLLOWING_LIST = gql`
  query followingList {
    followingList {
      userDetails {
        id
        first_name
        last_name
        profile_picture
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query notificationList {
    notificationList {
      user_id
      first_name
      last_name
      profile_picture
      message
      topic_id
      claim
    }
  }
`;

export const FOLLOWER_COUNT = gql`
  query followerCount {
    followerCount {
      follower
    }
  }
`;

export const FOLLOWING_COUNT = gql`
  query followingCount {
    followingCount {
      following
    }
  }
`;

export const COMMENT_LIST = gql`
  query commentList($topic_id: Int) {
    commentList(topic_id: $topic_id) {
      id
      comment
      commenter
      first_name
      last_name
      created_at
    }
  }
`;

export const USER_PROFILE = gql`
  query getUserProfileById($user_id: Int) {
    getUserProfileById(user_id: $user_id) {
      id
      first_name
      last_name
      email
      phone
      profile_picture
      city
      state
      age
      dob
      points
      isFollow
      feedsList {
        id
        username
        profile_picture
        user_id
        isFollow
        video
        claim
        category
        category_id
        against_user
        against_username
        against_video
        start_time
        end_time
        totalComments
        totalVotes
        thumbnail
        against_video_thumbnail
        totalFavourVotes
        totalAgainstVotes
        voting_type
        voting_type_flag
        active
        views
        timeLeft
        created_at
      }
    }
  }
`;

export const SEARCH_TOPIC = gql`
  query searchTopic($claim: String) {
    searchTopic(claim: $claim) {
      id
      username
      profile_picture
      user_id
      isFollow
      video
      claim
      category
      category_id
      against_user
      against_username
      against_video
      start_time
      end_time
      totalComments
      totalVotes
      thumbnail
      against_video_thumbnail
      totalFavourVotes
      totalAgainstVotes
      voting_type
      voting_type_flag
      active
      views
      timeLeft
      created_at
    }
  }
`;

export const PURCHASE_LOGS = gql`
  query getPurchaseLog {
    getPurchaseLog {
      transcation_id
      product_id
      transcation_date
      transcation_time
      points
    }
  }
`;

export const GET_BLOCKED_LIST = gql`
  query blockList {
    blockList {
      id
      first_name
      last_name
      profile_picture
    }
  }
`;
