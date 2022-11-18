import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { RootState } from 'index';
import { groupSlice } from 'store/slices/group';
import { postSlice } from 'store/slices/post';
import { tagSlice } from 'store/slices/tag';
import { userSlice } from 'store/slices/user';
import { workoutLogSlice } from 'store/slices/workout';
import { chatSlice } from 'store/slices/chat';

export const initialState: PreloadedState<RootState> = {
  user: {
    user: null,
    error: null,

    profile: null,
    profileContent: {
      post: null,
      comment: null,
      scrap: null,
    },
    loading: false,
    editProfile: false,
    deleteProfile: false,
    profileError: null,

    notice: [],
  },
  post: {
    postList: {
      posts: null,
      pageNum: null,
      pageSize: null,
      pageTotal: null,
      error: null,
    },
    postDetail: {
      post: null,
      error: null,
    },
    postComment: {
      comments: null,
      error: null,
      commentFunc: false,
    },
    postCreate: {
      status: false,
      post_id: null,
    },
    recentComments: {
      comments: null,
    },
    postEdit: false,
    postDelete: false,
    postFunc: false,
    postSearch: '',
  },
  group: {
    groupList: {
      groups: null,
      error: null,
    },
    groupCreate: {
      group_id: null,
      error: null,
    },
    groupDetail: {
      group: null,
      error: null,
    },
    groupDelete: false,
    groupMemberStatus: {
      member_status: null,
      error: null,
    },
    groupAction: {
      status: false,
      error: null,
    },
    groupMembers: {
      members: [],
      error: null,
    },
  },
  tag: {
    tagList: null,
    tagSearch: null,
    tagCreate: null,
    error: null,
  },
  chat: {
    socket: null,
    where: null,

    create: {
      id: null,
      error: null,
    },

    chatroomList: [],
    messageList: [],
    error: null,
  },
  workout_log: {
    workout_log: {
      type: null,
      workout_type: null,
      period: null,
      category: null,
      weight: null,
      rep: null,
      set: null,
      time: null,
      date: null,
    },
    routine: [
      {
        name: 'test_routine',
        fitelements: [],
      },
      {
        name: 'test_routine2',
        fitelements: [
          {
            data: {
              type: 'log',
              workout_type: 'type',
              period: null,
              category: null,
              weight: null,
              rep: null,
              set: null,
              time: null,
              date: null,
            },
          },
        ],
      },
    ],
    daily_log: {
      isDailyLog: true,
      date: null,
      memo: null,
      fit_element: null,
      calories: 0,
    },
    daily_fit_elements: [
      {
        data: {
          type: 'log',
          workout_type: 'type',
          period: null,
          category: null,
          weight: null,
          rep: null,
          set: null,
          time: null,
          date: null,
        },
      },
    ],
    workoutCreate: {
      status: false,
      workout_id: null,
    },
    dailyLogCreate: {
      status: false,
      dailylog_date: null,
    },
    calendar_info: [],
    selected_routine: {
      name: 'test_routine2',
      fitelements: [],
    },
    add_fit_elements: {
      fitelements: [],
      status: false,
    },
    fitelement_type: {
      name: '',
      korean_name: '',
      calories: 0,
      category: ''

    },
    fitelement_types: []
  },
};

export const getMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      user: userSlice.reducer,
      post: postSlice.reducer,
      workout_log: workoutLogSlice.reducer,
      group: groupSlice.reducer,
      tag: tagSlice.reducer,
      chat: chatSlice.reducer,
    },
    preloadedState,
  });
};
