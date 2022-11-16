import styled from 'styled-components';
import { ColumnCenterFlex, RowCenterFlex } from './layout';
import { CSSTransition } from 'react-transition-group';
import { UserInfo } from 'store/apis/post';
import { GreenBigBtn } from './button';
import { NavigateFunction } from 'react-router';

interface IProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const UserDetailModal = ({
  isActive,
  modalRef,
  pivotRef,
  userInfo,
  navigate,
}: {
  isActive: boolean;
  modalRef: React.MutableRefObject<null>;
  pivotRef: React.RefObject<HTMLImageElement>;
  userInfo: UserInfo;
  navigate: NavigateFunction;
}) => {
  const pivotInfo = pivotRef.current?.getBoundingClientRect();
  let left, top, width, height;
  if (pivotInfo) {
    left = pivotInfo.left;
    top = pivotInfo.top;
    width = pivotInfo.width;
    height = pivotInfo.height;
  } else {
    left = 0;
    top = 0;
    width = 0;
    height = 0;
  }
  return (
    <CSSTransition in={isActive} nodeRef={modalRef} timeout={110} classNames="modal" unmountOnExit>
      <ModalContent left={left} top={top} width={width} height={height} className="modal" ref={modalRef}>
        <Divdiv>
          <UserAvatarWrapper>
            <UserAvatar src={process.env.REACT_APP_API_IMAGE + userInfo.avatar} alt="profile" />
          </UserAvatarWrapper>

          <UserNameWrapper>
            <UserName>{userInfo.username}</UserName>
            <NickName>{userInfo.username}</NickName>
          </UserNameWrapper>

          <UserLevelWrapper>
            <Level>{userInfo.level} 레벨</Level>
            <Exp>{userInfo.exp} / 100</Exp>
          </UserLevelWrapper>
          <RowCenterFlex>
            <GreenBigBtn onClick={() => navigate(`/profile/${userInfo.username}`)} data-testid="profileBtn">
              프로필
            </GreenBigBtn>
            <GreenBigBtn>채팅</GreenBigBtn>
          </RowCenterFlex>
        </Divdiv>
      </ModalContent>
    </CSSTransition>
  );
};

const ModalContent = styled.div<IProps>`
  width: fit-content;
  height: fit-content;

  position: absolute;
  z-index: 99;

  display: flex;
  justify-content: center;
  align-items: center;

  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;

  ${({ left, top, width, height }) =>
    `
    top: ${top + height + 140}px;
    left: ${left + width - 30}px;
  `}
`;

const Divdiv = styled(ColumnCenterFlex)`
  position: fixed;
  width: 260px;
  height: 360px;
  background-color: var(--fit-white);

  padding-top: 24px;
  border-radius: inherit;
  &::before {
    // layout
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    bottom: 99%;
    left: 50%;
    transform: translate(-25%);
    border: 1.5rem solid transparent;

    // looks
    border-bottom-color: #fff;
    filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
  }
  /* Modal Shadow */
  -webkit-box-shadow: 0 16px 60px rgba(0, 0, 0, 0.55);
  -moz-box-shadow: 0 16px 60px rgba(0, 0, 0, 0.55);
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.55);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
`;

const UserAvatarWrapper = styled(ColumnCenterFlex)`
  width: 100%;
`;

const UserNameWrapper = styled(ColumnCenterFlex)`
  width: 100%;
  padding: 15px 20px;
`;

const UserLevelWrapper = styled(ColumnCenterFlex)`
  width: 100%;
  padding: 15px 20px;
`;

const UserName = styled.span`
  font-size: 26px;
  margin-bottom: 5px;
`;
const NickName = styled.span`
  font-size: 18px;
  color: var(--fit-disabled-gray);
`;

const Level = styled.span`
  font-size: 18px;
  margin-bottom: 8px;
`;
const Exp = styled.span`
  font-size: 16px;
`;

export const UserDetailHorizontalModal = ({
  isActive,
  modalRef,
  pivotRef,
  userInfo,
  navigate,
}: {
  isActive: boolean;
  modalRef: React.MutableRefObject<null>;
  pivotRef: HTMLImageElement;
  userInfo: UserInfo;
  navigate: NavigateFunction;
}) => {
  const pivotInfo = pivotRef?.getBoundingClientRect();
  let left, top, width, height;
  if (pivotInfo) {
    left = pivotInfo.left;
    top = pivotInfo.top;
    width = pivotInfo.width;
    height = pivotInfo.height;
  } else {
    left = 0;
    top = 0;
    width = 0;
    height = 0;
  }
  return (
    <CSSTransition in={isActive} nodeRef={modalRef} timeout={110} classNames="modal" unmountOnExit>
      <ModalHorizontalContent left={left} top={top} width={width} height={height} className="modal" ref={modalRef}>
        <DivdivHorizontal>
          <UserAvatarHorizontalWrapper>
            <UserHorizontalAvatar src={process.env.REACT_APP_API_IMAGE + userInfo.avatar} alt="profile" />
          </UserAvatarHorizontalWrapper>
          <HorizontalRightWrapper>
            <UserNameHorizontalWrapper>
              <UserNameHorizontal>{userInfo.username}</UserNameHorizontal>
              <NickNameHorizontal>{userInfo.username}</NickNameHorizontal>
            </UserNameHorizontalWrapper>
            <UserLevelHorizontalWrapper>
              <LevelHorizontal>{userInfo.level} 레벨</LevelHorizontal>
              <ExpHorizontal>{userInfo.exp} / 100</ExpHorizontal>
            </UserLevelHorizontalWrapper>
            <RowCenterFlex>
              <GreenBigBtn onClick={() => navigate(`/profile/${userInfo.username}`)} data-testid="profileBtn">
                프로필
              </GreenBigBtn>
              <GreenBigBtn>채팅</GreenBigBtn>
            </RowCenterFlex>
          </HorizontalRightWrapper>
        </DivdivHorizontal>
      </ModalHorizontalContent>
    </CSSTransition>
  );
};

const UserHorizontalAvatar = styled.img`
  border: 4px solid black;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;

  background-position: center;
  background-size: cover;
`;

//   ${({ src, alt }) =>
//     `
//     title: ${alt}
//     background-size: contain;
//     background-position: center;
//     background-image: url(${src});
//   `}
// `;

const UserAvatarHorizontalWrapper = styled(ColumnCenterFlex)`
  width: 40%;
`;

const ModalHorizontalContent = styled.div<IProps>`
  width: fit-content;
  height: fit-content;

  z-index: 99;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  border-top-left-radius: 80px;
  border-top-right-radius: 15px;
  border-bottom-left-radius: 80px;
  border-bottom-right-radius: 15px;

  ${({ left, top, width, height }) =>
    `
    top: ${top - height}px;
    left: ${left + width + 200 + 20}px;
  `}
`;

const UserNameHorizontalWrapper = styled(ColumnCenterFlex)`
  width: 100%;
  padding: 10px 20px;
`;

const UserLevelHorizontalWrapper = styled(ColumnCenterFlex)`
  width: 100%;
  padding: 8px 20px;
`;

const DivdivHorizontal = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  position: fixed;
  width: 400px;
  height: 200px;
  background-color: var(--fit-white);

  padding-left: 32px;
  border-radius: inherit;
  &::before {
    // layout
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    right: 99%;
    top: 40%;
    border: 20px solid transparent;

    // looks
    border-right-color: #fff;
  }
  /* Modal Shadow */
  -webkit-box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
`;

const HorizontalRightWrapper = styled(ColumnCenterFlex)`
  width: 60%;
`;

const UserNameHorizontal = styled.span`
  font-size: 25px;
  margin-bottom: 5px;
`;
const NickNameHorizontal = styled.span`
  font-size: 15px;
  color: var(--fit-disabled-gray);
`;

const LevelHorizontal = styled.span`
  font-size: 15px;
  margin-bottom: 8px;
`;
const ExpHorizontal = styled.span`
  font-size: 13px;
`;
// Shared -------------------------------------------------------------
const UserAvatar = styled.img`
  border: 4px solid black;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;

  background-position: center;
  background-size: cover;
`;
