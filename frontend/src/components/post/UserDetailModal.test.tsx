/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { UserDetailModal, UserDetailHorizontalModal } from './UserDetailModal';
import React from 'react';

jest.mock('react-transition-group', () => ({
  ...jest.requireActual('react-transition-group'),
  CSSTransition: (elem: any) => {
    // eslint-disable-next-line testing-library/no-node-access
    return <div>{elem.children.props.children}</div>;
  },
}));
beforeEach(() => jest.clearAllMocks());
afterAll(() => jest.restoreAllMocks());

const simpleUser = {
  username: 'un',
  nickname: 'nn',
  avatar: 'av',
  level: 1,
  exp: 99,
};

const mockNavigate = jest.fn();
const setup = () => {
  render(
    <UserDetailModal
      isActive={false}
      modalRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
      pivotRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
      userInfo={simpleUser}
      navigate={mockNavigate}
    />,
  );
};

describe('[UserDetailModal Component]', () => {
  test('basic rendering', () => {
    setup();

    const profileBtn = screen.getByTestId('profileBtn');
    fireEvent.click(profileBtn);
    expect(mockNavigate).toBeCalledWith(`/profile/${simpleUser.username}`);
  });
});

const setupHorizontal = () => {
  render(
    <UserDetailHorizontalModal
      isActive={false}
      modalRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
      pivotRef={document.createElement('img')}
      userInfo={simpleUser}
      navigate={mockNavigate}
    />,
  );
};

describe('[UserDetailHorizontalModal Component]', () => {
  test('basic rendering', () => {
    setupHorizontal();

    const profileBtn = screen.getByTestId('profileBtn');
    fireEvent.click(profileBtn);
    expect(mockNavigate).toBeCalledWith(`/profile/${simpleUser.username}`);
  });
});
