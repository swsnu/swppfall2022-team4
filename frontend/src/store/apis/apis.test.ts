import client from './client';
import * as userAPI from './user';
import * as chatAPI from './chat';
import * as notificationAPI from './notification';
import * as postAPI from './post';
import * as commentAPI from './comment';
import * as tagAPI from './tag';
import * as infoAPI from './information';
import * as groupAPI from './group';
import * as workoutAPI from './workout';

beforeEach(() => {
  client.get = jest.fn().mockImplementation(url => Promise.resolve({ data: url }));
  client.post = jest.fn().mockImplementation(url => Promise.resolve({ data: url }));
  client.put = jest.fn().mockImplementation(url => Promise.resolve({ data: url }));
  client.delete = jest.fn().mockImplementation(url => Promise.resolve({ data: url }));
});
afterAll(() => jest.restoreAllMocks());

const testUsername = '11111111';
const testPassword = '11111111';
const testTag: tagAPI.TagVisual = {
  id: '1',
  name: 'workout',
  color: '#ffffff',
};
const testTag2: tagAPI.TagVisual = {
  id: '2',
  name: 'what!',
  color: '#000000',
};
// User dummy.
const signupRequest = {
  username: testUsername,
  password: testPassword,
  nickname: 'abcd',
  gender: 'male',
  height: 160.5,
  weight: 88.8,
  age: 36,
};
const loginRequest = {
  username: testUsername,
  password: testPassword,
};
const editProfileRequest = {
  username: testUsername,
  data: { oldPassword: testPassword, newPassword: '22222222' },
};

// Post dummy.
const getPostsRequest: postAPI.getPostsRequestType = {
  pageNum: 1,
  pageSize: 15,
  tags: [],
};
const searchPostsRequest: postAPI.getPostsRequestType = {
  pageNum: 1,
  pageSize: 15,
  searchKeyword: 'test',
  tags: [],
};
const filterPostsRequest: postAPI.getPostsRequestType = {
  pageNum: 1,
  pageSize: 15,
  searchKeyword: 'test',
  tags: [testTag, testTag2],
};
const createPostRequest: postAPI.createPostRequestType = {
  title: 'title',
  content: 'content',
  author_name: testUsername,
  tags: [testTag],
  images: [],
  prime_tag: undefined,
};
const editPostRequest: postAPI.editPostRequestType = {
  post_id: '1',
  title: 'title',
  content: 'content',
  tags: [testTag],
  images: ['hi.jpeg'],
  prime_tag: undefined,
};
const postFuncRequest: postAPI.postFuncRequestType = {
  post_id: '1',
  func_type: 'like',
};
const postIdentifyingRequest: postAPI.postIdentifyingType = {
  post_id: '1',
};

// Comment dummy.
const createCommentRequest: commentAPI.createCommentRequestType = {
  post_id: '1',
  content: 'content',
  author_name: testUsername,
  parent_comment: '1',
};
const commentIdentifyingRequest: commentAPI.commentIdentifyingRequestType = {
  comment_id: '1',
};
const editCommentRequest: commentAPI.editCommentRequestType = {
  comment_id: '1',
  content: 'edit',
};
const commentFuncRequest: commentAPI.commentFuncRequestType = {
  comment_id: '1',
  func_type: 'like',
};

// Tag dummy.
const createTagClassRequest: tagAPI.createTagClassRequestType = {
  name: 'class',
  color: '#ffffff',
};
const createTagRequest: tagAPI.createTagRequestType = {
  name: 'class',
  classId: 1,
};
const searchTagRequest: tagAPI.searchTagRequestType = {
  class_name: 'class',
  tag_name: '1',
};

//Group dummy.
const fitelement1: groupAPI.Fitelement = {
  type: 'goal',
  workout_type: 'test',
  category: ' test',
  weight: 10,
  rep: 10,
  set: 10,
  time: 10,
};

const postGroupRequest: groupAPI.postGroupRequestType = {
  group_name: 'post_group',
  number: 7,
  start_date: '2019-01-01',
  end_date: '2019-12-31',
  description: 'test',
  free: true,
  group_leader: testUsername,
  goal: [fitelement1],
};

// Workout dummy.
const getFitElementRequest: workoutAPI.getFitElementRequestType = {
  fitelement_id: 0,
};

const getFitElementsRequest: workoutAPI.getFitElementsRequestType = {
  fitelements: [0],
};

const getSpecificRoutineFitElementsRequest: workoutAPI.getSpecificRoutineFitElementsRequestType = {
  fitelements: [0],
};

const getDailyLogRequest: workoutAPI.getDailyLogRequestType = {
  year: 2022,
  month: 10,
  specific_date: 1,
  username: 'user',
  data: {
    username: 'user',
  },
};

const createworkoutLogRequest: workoutAPI.createWorkoutLogRequestType = {
  username: 'user',
  type: 'test',
  workout_type: 'test',
  period: 0,
  category: 'category',
  weight: 0,
  rep: 0,
  set: 0,
  time: 0,
  date: '2022-10-01'
};

const createDailyLogRequest: workoutAPI.createDailyLogRequestType = {
  username: 'user',
  date: '2022-10-01',
  memo: 'memo',
  fitelements: [],
  year: 2022,
  month: 10,
  specific_date: 1,
};

const editMemoRequest: workoutAPI.editMemoRequestType = {
  username: 'user',
  memo: 'memo',
  year: 2022,
  month: 10,
  specific_date: 1,
};

const getCalendarInfoRequest: workoutAPI.getCalendarInfoRequestType = {
  username: 'user',
  year: 2022,
  month: 10,
};

const getRoutineRequest: workoutAPI.getRoutineRequestType = {
  username: 'user',
};

const getSpecificRoutineRequest: workoutAPI.getSpecificRoutineRequestType = {
  username: 'user',
  routine_id: 0,
};

const addFitElementsRequest: workoutAPI.addFitElementsRequestType = {
  username: 'user',
  fitelements: [1],
  year: 2022,
  month: 10,
  specific_date: 1,
};

const createRoutineWithFitElementsRequest: workoutAPI.createRoutineWithFitElementsRequestType = {
  username: 'user',
  fitelements: [],
};

describe('API TEST', () => {
  describe('User', () => {
    test('token', async () => {
      const result = await userAPI.token();
      expect(result).toBe(`/api/user/token/`);
    });
    test('signup', async () => {
      const result = await userAPI.signup(signupRequest);
      expect(result).toBe(`/api/user/signup/`);
    });
    test('socialSignup', async () => {
      const result = await userAPI.socialSignup(signupRequest);
      expect(result).toBe(`/api/user/signup/social/validate/`);
    });
    test('login', async () => {
      const result = await userAPI.login(loginRequest);
      expect(result).toBe(`/api/user/login/`);
    });
    test('check', async () => {
      const result = await userAPI.check();
      expect(result).toBe(`/api/user/check/`);
    });
    test('logout', async () => {
      const result = await userAPI.logout();
      expect(result).toBe(`/api/user/logout/`);
    });
    test('getProfile', async () => {
      const result = await userAPI.getProfile(testUsername);
      expect(result).toBe(`/api/user/profile/11111111/`);
    });
    test('editProfile', async () => {
      const result = await userAPI.editProfile(editProfileRequest);
      expect(result).toBe(`/api/user/profile/11111111/`);
    });
    test('signout', async () => {
      const result = await userAPI.signout(testUsername);
      expect(result).toBe(`/api/user/profile/11111111/`);
    });
    test('follow', async () => {
      const result = await userAPI.follow(testUsername);
      expect(result).toBe(`/api/user/follow/11111111/`);
    });
  });
  describe('Chat', () => {
    test('getChatroomList', async () => {
      const result = await chatAPI.getChatroomList();
      expect(result).toBe(`/api/chat/`);
    });
    test('readChatroom', async () => {
      const result = await chatAPI.readChatroom('1234');
      expect(result).toBe(`/api/chat/read/1234/`);
    });
    test('createChatroom', async () => {
      const result = await chatAPI.createChatroom({ username: 'target' });
      expect(result).toBe(`/api/chat/`);
    });
    test('getMessageList', async () => {
      const result = await chatAPI.getMessageList('1234');
      expect(result).toBe(`/api/chat/1234/`);
    });
    test('getGroupMessageList', async () => {
      const result = await chatAPI.getGroupMessageList('1234');
      expect(result).toBe(`/api/chat/group/1234/`);
    });
  });
  describe('Notification', () => {
    test('getNotificationList', async () => {
      const result = await notificationAPI.getNotificationList();
      expect(result).toBe(`/api/notification/`);
    });
    test('deleteAllNotification', async () => {
      const result = await notificationAPI.deleteAllNotification();
      expect(result).toBe(`/api/notification/`);
    });
    test('deleteNotification', async () => {
      const result = await notificationAPI.deleteNotification(1234);
      expect(result).toBe(`/api/notification/1234/`);
    });
  });
  describe('Post', () => {
    test('getPosts', async () => {
      const result = await postAPI.getPosts(getPostsRequest);
      expect(result).toBe(`/api/post/?page=1&pageSize=15`);
    });
    test('searchPosts', async () => {
      const result = await postAPI.getPosts(searchPostsRequest);
      expect(result).toBe(`/api/post/?page=1&pageSize=15&search=test`);
    });
    test('filterPosts', async () => {
      const result = await postAPI.getPosts(filterPostsRequest);
      expect(result).toBe(`/api/post/?page=1&pageSize=15&search=test&tag=1&tag=2`);
    });
    test('createPost', async () => {
      const result = await postAPI.createPost(createPostRequest);
      expect(result).toBe(`/api/post/`);
    });
    test('editPost', async () => {
      const result = await postAPI.editPost(editPostRequest);
      expect(result).toBe(`/api/post/${editPostRequest.post_id}/`);
    });
    test('updatePostDetail', async () => {
      const result = await postAPI.updatePostDetail(postIdentifyingRequest);
      expect(result).toBe(`/api/post/${postIdentifyingRequest.post_id}/`);
    });
    test('deletePost', async () => {
      const result = await postAPI.deletePost(postIdentifyingRequest);
      expect(result).toBe(`/api/post/${postIdentifyingRequest.post_id}/`);
    });
    test('postFunc', async () => {
      const result = await postAPI.postFunc(postFuncRequest);
      expect(result).toBe(`/api/post/${postFuncRequest.post_id}/func/`);
    });
  });
  describe('Comment', () => {
    test('getPostComment', async () => {
      const result = await commentAPI.getPostComment(postIdentifyingRequest);
      expect(result).toBe(`/api/post/${postIdentifyingRequest.post_id}/comment/`);
    });
    test('createComment', async () => {
      const result = await commentAPI.createComment(createCommentRequest);
      expect(result).toBe(`/api/comment/`);
    });
    test('deleteComment', async () => {
      const result = await commentAPI.deleteComment(commentIdentifyingRequest);
      expect(result).toBe(`/api/comment/${commentIdentifyingRequest.comment_id}/`);
    });
    test('editComment', async () => {
      const result = await commentAPI.editComment(editCommentRequest);
      expect(result).toBe(`/api/comment/${editCommentRequest.comment_id}/`);
    });
    test('commentFunc', async () => {
      const result = await commentAPI.commentFunc(commentFuncRequest);
      expect(result).toBe(`/api/comment/${commentFuncRequest.comment_id}/func/`);
    });
    test('getRecentCommentPosts', async () => {
      const result = await commentAPI.getRecentComments();
      expect(result).toBe(`/api/comment/recent/`);
    });
  });
  describe('Tag', () => {
    test('getTags', async () => {
      const result = await tagAPI.getTags();
      expect(result).toBe(`/api/tag/`);
    });
    test('createTagClass', async () => {
      const result = await tagAPI.createTagClass(createTagClassRequest);
      expect(result).toBe(`/api/tag/class/`);
    });
    test('createTag', async () => {
      const result = await tagAPI.createTag(createTagRequest);
      expect(result).toBe(`/api/tag/`);
    });
    test('searchTag', async () => {
      const result = await tagAPI.searchTag(searchTagRequest);
      expect(result).toBe(`/api/tag/search/?tag=${searchTagRequest.tag_name}`);
    });
  });
  describe('Information', () => {
    test('getInformation', async () => {
      const result = await infoAPI.getInformation({ information_name: 'Deadlift' });
      expect(result).toBe(`/api/information/Deadlift/`);
    });
  });
  describe('Workout', () => {
    test('getFitElement', async () => {
      const result = await workoutAPI.getFitElement(getFitElementRequest);
      expect(result).toBe(`/api/fitelement/${getFitElementRequest.fitelement_id}/`);
    });
    test('getDailyLog', async () => {
      const result = await workoutAPI.getDailyLog(getDailyLogRequest);
      expect(result).toBe(
        `/api/fitelement/dailylog/${getDailyLogRequest.year}/${getDailyLogRequest.month}/${getDailyLogRequest.specific_date}/?&username=${getDailyLogRequest.username}`,
      );
    });
    test('getFitElements', async () => {
      const result = await workoutAPI.getFitElements(getFitElementsRequest);
      expect(result).toStrictEqual([{ data: '/api/fitelement/0/' }]);
    });
    test('createWorkoutLog', async () => {
      const result = await workoutAPI.createWorkoutLog(createworkoutLogRequest);
      expect(result).toBe(`/api/fitelement/`);
    });
    test('createDailyLog', async () => {
      const result = await workoutAPI.createDailyLog(createDailyLogRequest);
      expect(result).toBe(
        `/api/fitelement/dailylog/${createDailyLogRequest.year}/${createDailyLogRequest.month}/${createDailyLogRequest.specific_date}/?&username=${createDailyLogRequest.username}`,
      );
    });
    test('editMemo', async () => {
      const result = await workoutAPI.editMemo(editMemoRequest);
      expect(result).toBe(
        `/api/fitelement/dailylog/${editMemoRequest.year}/${editMemoRequest.month}/${editMemoRequest.specific_date}/?&username=${editMemoRequest.username}`,
      );
    });
    test('getCalendarInfo', async () => {
      const result = await workoutAPI.getCalendarInfo(getCalendarInfoRequest);
      expect(result).toBe(
        `/api/fitelement/${getCalendarInfoRequest.year}/${getCalendarInfoRequest.month}/?&username=${getCalendarInfoRequest.username}`,
      );
    });
    test('getRoutine', async () => {
      const result = await workoutAPI.getRoutine(getRoutineRequest);
      expect(result).toBe(`/api/fitelement/routine/?&username=${getRoutineRequest.username}`);
    });
    test('addFitElements', async () => {
      const result = await workoutAPI.addFitElements(addFitElementsRequest);
      expect(result).toBe(
        `/api/fitelement/dailylog/${addFitElementsRequest.year}/${addFitElementsRequest.month}/${addFitElementsRequest.specific_date}/?&username=${addFitElementsRequest.username}`,
      );
    });
    test('craeteRoutineWithFitElements', async () => {
      const result = await workoutAPI.createRoutineWithFitElements(createRoutineWithFitElementsRequest);
      expect(result).toBe(`/api/fitelement/routine/?&username=${createRoutineWithFitElementsRequest.username}`);
    });
    test('getSpecificRoutine', async () => {
      const result = await workoutAPI.getSpecificRoutine(getSpecificRoutineRequest);
      expect(result).toBe(
        `/api/fitelement/routine/${getSpecificRoutineRequest.routine_id}/?&username=${getSpecificRoutineRequest.username}`,
      );
    });
    test('getSpecificRoutineFitElements', async () => {
      const result = await workoutAPI.getSpecificRoutineFitElements(getSpecificRoutineFitElementsRequest);
      expect(result).toStrictEqual([{ data: '/api/fitelement/0/' }]);
    });
  });
});

describe('Group API TEST', () => {
  describe('Group', () => {
    it('group list', async () => {
      const res = await groupAPI.getGroups();
      expect(res).toBe(`/api/group/`);
    });
    it('post group', async () => {
      const res = await groupAPI.postGroup(postGroupRequest);
      expect(res).toBe(`/api/group/`);
    });
    it('get group detail', async () => {
      const res = await groupAPI.getGroupDetail('1');
      expect(res).toBe(`/api/group/1/`);
    });
    it('delete group', async () => {
      const res = await groupAPI.deleteGroup('1');
      expect(res).toBe(`/api/group/1/`);
    });
  });
  describe('Group Member', () => {
    it('check member status', async () => {
      const res = await groupAPI.checkGroupMember('1');
      expect(res).toBe(`/api/group/1/mem_check/`);
    });
    it('get members', async () => {
      const res = await groupAPI.getGroupMembers('1');
      expect(res).toBe(`/api/group/1/member/`);
    });
    it('joinGroup', async () => {
      const res = await groupAPI.joinGroup('1');
      expect(res).toBe(`/api/group/1/member/`);
    });
    it('exitGroup', async () => {
      const res = await groupAPI.exitGroup('1');
      expect(res).toBe(`/api/group/1/member/`);
    });
  });
});
