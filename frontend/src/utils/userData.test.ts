import { userInitialState, userReducer, checkBody, socialUserInitialState, socialUserReducer } from './userData';

describe('userData', () => {
  describe('userReducer', () => {
    test('username', () => {
      expect(userReducer(userInitialState, { name: 'username', value: 'ㄱ' })).toEqual({
        ...userInitialState,
        username: '',
        usernameWarning: { content: '* 영어와 숫자만 입력할 수 있습니다.', color: '#686868' },
      });

      expect(userReducer(userInitialState, { name: 'username', value: 'ㄱ1' })).toEqual({
        ...userInitialState,
        username: '1',
        usernameWarning: { content: '* 영어와 숫자만 입력할 수 있습니다.', color: '#ff3939' },
      });

      expect(userReducer(userInitialState, { name: 'username', value: '12341234' })).toEqual({
        ...userInitialState,
        username: '12341234',
        usernameWarning: { ...userInitialState.usernameWarning, color: '#009112' },
      });
    });

    test('password', () => {
      expect(userReducer(userInitialState, { name: 'password', value: 'ㄱ' })).toEqual({
        ...userInitialState,
        password: '',
        passwordWarning: { content: '* 한글을 입력할 수 없습니다.', color: '#686868' },
      });

      expect(userReducer(userInitialState, { name: 'password', value: 'ㄱ1' })).toEqual({
        ...userInitialState,
        password: '1',
        passwordWarning: { content: '* 한글을 입력할 수 없습니다.', color: '#ff3939' },
      });

      expect(userReducer(userInitialState, { name: 'password', value: '12341234' })).toEqual({
        ...userInitialState,
        password: '12341234',
        passwordWarning: { ...userInitialState.passwordWarning, color: '#009112' },
      });

      expect(
        userReducer({ ...userInitialState, passwordConfirm: '1234123' }, { name: 'password', value: '12341234' }),
      ).toEqual({
        ...userInitialState,
        password: '12341234',
        passwordWarning: { ...userInitialState.passwordWarning, color: '#009112' },
        passwordConfirm: '1234123',
        passwordConfirmWarning: {
          content: '* 비밀번호가 일치하지 않습니다.',
          color: '#ff3939',
        },
      });

      expect(
        userReducer({ ...userInitialState, passwordConfirm: '12341234' }, { name: 'password', value: '12341234' }),
      ).toEqual({
        ...userInitialState,
        password: '12341234',
        passwordWarning: { ...userInitialState.passwordWarning, color: '#009112' },
        passwordConfirm: '12341234',
        passwordConfirmWarning: {
          content: '* 비밀번호가 일치합니다.',
          color: '#009112',
        },
      });
    });

    test('passwordConfirm', () => {
      expect(userReducer(userInitialState, { name: 'passwordConfirm', value: '' })).toEqual({
        ...userInitialState,
        passwordConfirm: '',
        passwordConfirmWarning: { content: '', color: '#686868' },
      });

      expect(
        userReducer({ ...userInitialState, password: '12341234' }, { name: 'passwordConfirm', value: '12341234' }),
      ).toEqual({
        ...userInitialState,
        password: '12341234',
        passwordConfirm: '12341234',
        passwordConfirmWarning: { content: '* 비밀번호가 일치합니다.', color: '#009112' },
      });

      expect(
        userReducer({ ...userInitialState, password: '1234123' }, { name: 'passwordConfirm', value: '12341234' }),
      ).toEqual({
        ...userInitialState,
        password: '1234123',
        passwordConfirm: '12341234',
        passwordConfirmWarning: { content: '* 비밀번호가 일치하지 않습니다.', color: '#ff3939' },
      });
    });

    test('nickname', () => {
      expect(userReducer(userInitialState, { name: 'nickname', value: '' })).toEqual({
        ...userInitialState,
        nickname: '',
        nicknameWarning: { content: '* 2자 이상 8자 이하', color: '#686868' },
      });

      expect(userReducer(userInitialState, { name: 'nickname', value: '1' })).toEqual({
        ...userInitialState,
        nickname: '1',
        nicknameWarning: { content: '* 2자 이상 8자 이하', color: '#ff3939' },
      });

      expect(userReducer(userInitialState, { name: 'nickname', value: '12341234' })).toEqual({
        ...userInitialState,
        nickname: '12341234',
        nicknameWarning: { content: '* 2자 이상 8자 이하', color: '#009112' },
      });
    });

    test('gender', () => {
      expect(userReducer(userInitialState, { name: 'gender', value: 'male' })).toEqual({
        ...userInitialState,
        gender: 'male',
      });
    });

    test('height', () => {
      expect(userReducer(userInitialState, { name: 'height', value: '26343' })).toEqual({
        ...userInitialState,
        height: '26343',
        bodyWarning: { content: '* 키는 정수 또는 소수점 첫째 자리까지여야 합니다.', color: '#ff3939' },
      });

      expect(userReducer(userInitialState, { name: 'height', value: '263.3' })).toEqual({
        ...userInitialState,
        height: '263.3',
        bodyWarning: { content: '', color: '#009112' },
      });
    });

    test('weight', () => {
      expect(userReducer(userInitialState, { name: 'weight', value: '26343' })).toEqual({
        ...userInitialState,
        weight: '26343',
        bodyWarning: { content: '* 몸무게는 정수 또는 소수점 첫째 자리까지여야 합니다.', color: '#ff3939' },
      });

      expect(userReducer(userInitialState, { name: 'weight', value: '263.3' })).toEqual({
        ...userInitialState,
        weight: '263.3',
        bodyWarning: { content: '', color: '#009112' },
      });
    });

    test('age', () => {
      expect(userReducer(userInitialState, { name: 'age', value: '33' })).toEqual({
        ...userInitialState,
        age: '33',
      });
    });

    test('etc', () => {
      expect(userReducer(userInitialState, { name: 'etc', value: '' })).toEqual(userInitialState);
    });
  });

  describe('socialUserReducer', () => {
    test('username', () => {
      expect(socialUserReducer(socialUserInitialState, { name: 'username', value: '12341234' })).toEqual({
        ...socialUserInitialState,
        username: '12341234',
      });
    });
    test('nickname', () => {
      expect(socialUserReducer(socialUserInitialState, { name: 'nickname', value: '' })).toEqual({
        ...socialUserInitialState,
        nickname: '',
        nicknameWarning: { content: '* 2자 이상 8자 이하', color: '#686868' },
      });

      expect(socialUserReducer(socialUserInitialState, { name: 'nickname', value: '1' })).toEqual({
        ...socialUserInitialState,
        nickname: '1',
        nicknameWarning: { content: '* 2자 이상 8자 이하', color: '#ff3939' },
      });

      expect(socialUserReducer(socialUserInitialState, { name: 'nickname', value: '12341234' })).toEqual({
        ...socialUserInitialState,
        nickname: '12341234',
        nicknameWarning: { content: '* 2자 이상 8자 이하', color: '#009112' },
      });
    });

    test('gender', () => {
      expect(socialUserReducer(socialUserInitialState, { name: 'gender', value: 'male' })).toEqual({
        ...socialUserInitialState,
        gender: 'male',
      });
    });

    test('height', () => {
      expect(socialUserReducer(socialUserInitialState, { name: 'height', value: '26343' })).toEqual({
        ...socialUserInitialState,
        height: '26343',
        bodyWarning: { content: '* 키는 정수 또는 소수점 첫째 자리까지여야 합니다.', color: '#ff3939' },
      });

      expect(socialUserReducer(socialUserInitialState, { name: 'height', value: '263.3' })).toEqual({
        ...socialUserInitialState,
        height: '263.3',
        bodyWarning: { content: '', color: '#009112' },
      });
    });

    test('weight', () => {
      expect(socialUserReducer(socialUserInitialState, { name: 'weight', value: '26343' })).toEqual({
        ...socialUserInitialState,
        weight: '26343',
        bodyWarning: { content: '* 몸무게는 정수 또는 소수점 첫째 자리까지여야 합니다.', color: '#ff3939' },
      });

      expect(socialUserReducer(socialUserInitialState, { name: 'weight', value: '263.3' })).toEqual({
        ...socialUserInitialState,
        weight: '263.3',
        bodyWarning: { content: '', color: '#009112' },
      });
    });

    test('age', () => {
      expect(socialUserReducer(socialUserInitialState, { name: 'age', value: '33' })).toEqual({
        ...socialUserInitialState,
        age: '33',
      });
    });

    test('etc', () => {
      expect(socialUserReducer(socialUserInitialState, { name: 'etc', value: '' })).toEqual(socialUserInitialState);
    });
  });

  describe('checkBody', () => {
    global.alert = jest.fn().mockImplementation(() => null);
    expect(checkBody('0', '100', '20')).toBe(false);
    expect(checkBody('100', '0', '20')).toBe(false);
    expect(checkBody('100', '100', '0')).toBe(false);
    expect(checkBody('100', '100', '20')).toBe(true);
  });
});
