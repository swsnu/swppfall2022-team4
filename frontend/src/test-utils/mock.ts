import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { RootState } from 'index';
import { groupSlice } from 'store/slices/group';
import { postSlice } from 'store/slices/post';
import { tagSlice } from 'store/slices/tag';
import { userSlice } from 'store/slices/user';
import { workoutLogSlice } from 'store/slices/workout';
import { chatSlice } from 'store/slices/chat';
import { notificationSlice } from 'store/slices/notification';

export const initialState: PreloadedState<RootState> = {
  user: {
    user: null,
    error: null,

    profile: null,

    loading: false,
    editProfile: false,
    deleteProfile: false,
    profileError: null,
  },
  notification: {
    notificationList: [],
  },
  post: {
    main: null,

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
    filterTag: [],
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
    groupCerts: {
      all_certs: [],
      error: null,
    },
  },
  tag: {
    tagList: null,
    popularTags: null,
    tagSearch: null,
    tagCreate: null,
    tagClassCreate: null,
    error: null,
  },
  chat: {
    socket: null,
    where: '/',

    create: {
      id: null,
      error: null,
    },

    chatroomList: [],
    messageList: [],
    error: null,
  },
  workout_log: {
    error: null,
    fitelementDelete: 0,
    workout_log: {
      id: 0,
      type: 'log',
      workout_type: '데드리프트',
      period: null,
      category: '등운동',
      weight: null,
      rep: null,
      set: null,
      time: 20,
      date: null,
    },
    routine: [
      {
        id: 0,
        name: 'test_routine',
        fitelements: [],
      },
      {
        id: 1,
        name: 'test_routine2',
        fitelements: [
          {
            data: {
              id: 0,
              type: 'log',
              workout_type: '데드리프트',
              period: null,
              category: '등운동',
              weight: null,
              rep: null,
              set: null,
              time: 20,
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
      images: null,
    },
    daily_fit_elements: [
      {
        data: {
          id: 0,
          type: 'log',
          workout_type: '데드리프트',
          period: null,
          category: '등운동',
          weight: null,
          rep: null,
          set: null,
          time: 10,
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
    calendar_info: [
      {
        year: 2022,
        month: 10,
        date: 1,
        workouts: [],
        calories: 0,
      },
      {
        year: 2022,
        month: 10,
        date: 2,
        workouts: [],
        calories: 0,
      },
    ],
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
      calories: 0,
      category: '',
    },
    fitelement_types: [
      {
        id: 0,
        class_name: '등운동',
        class_type: '데드리프트',
        color: '#FFFFFF',
        tags: [
          {
            id: '0',
            name: '데드리프트',
            color: '#FFFFFF',
          },
        ],
      },
    ],
    imageSuccess: '',
    memoSuccess: '',
    create_routine_id: null,
    deleteImageSuccess: '',
    indexSuccess: [],
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
      notification: notificationSlice.reducer,
    },
    preloadedState,
  });
};
