/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import TagDetailModal from './TagDetailModal';
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

const mockDispatch = jest.fn();
const setup = () => {
  render(
    <TagDetailModal
      isActive={false}
      onClose={jest.fn()}
      modalRef={{ current: document.createElement('button') } as unknown as React.MutableRefObject<null>}
      modalAnimRef={1 as unknown as React.MutableRefObject<null>}
      tagList={[]}
      selected={[]}
      setSelected={jest.fn()}
      dispatch={mockDispatch}
    />,
  );
};

describe('[TagDetailModal Component]', () => {
  test('basic rendering', () => {
    setup();

    const closeBtn = screen.getByTestId('tagModalCloseBtn');
    fireEvent.click(closeBtn);
  });
});
