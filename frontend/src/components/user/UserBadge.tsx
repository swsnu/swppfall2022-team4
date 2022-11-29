import { faCertificate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import 'styles/color.css';
import { getContrastYIQ } from 'utils/color';

interface IPropsLevelBadge {
  color?: string;
}

interface IPropsUserBadge {
  nickname: string;
  level: number;
}

const LevelColors = [
  '#DCE3E9', // 1level
  '#AEE4B1', // 2level
  '#C1E5F1', // 3level
  '#FCD11A', // 4level
  '#FAB9B9', // 5level
  '#F678AD', // 6level
  '#98A3F9', // 7level
  '#4893b9', // 8level
  '#2863a9', // 9level
  '#000000', // 10+level
];

const getLevelColors = (level: number) => {
  if (level >= 10) return LevelColors[9];
  else if (level <= 1) return LevelColors[0];
  else return LevelColors[level - 1];
};

export const LevelBadgeFn = (level: number) => {
  if (level <= 3) return <LevelBadgeLow color={getLevelColors(level)}>{level}</LevelBadgeLow>;
  else if (level <= 9)
    return (
      <LevelBadgeMiddle color={getLevelColors(level)}>
        <FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>
        <span>{level}</span>
      </LevelBadgeMiddle>
    );
  else
    return (
      <LevelBadgeHigh color={getLevelColors(level)}>
        <FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>
        <span>{level}</span>
      </LevelBadgeHigh>
    );
};

export const UserBadge = ({ nickname, level }: IPropsUserBadge) => (
  <UserBadgeWrapper>
    {nickname} {LevelBadgeFn(level)}
  </UserBadgeWrapper>
);

const UserBadgeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LevelBadgeLow = styled.div<IPropsLevelBadge>`
  margin-left: 5px;
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  border-radius: 50%;
  position: relative;
  ${({ color }) =>
    color &&
    `
      background: ${color};
      color: ${getContrastYIQ(color)};
    `}
  > span {
    position: absolute;
    align-self: center;
    font-size: 20px;
  }
`;

const LevelBadgeMiddle = styled.div<IPropsLevelBadge>`
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  > svg {
    width: 20px;
    height: 20px;
    ${({ color }) =>
      color &&
      `
      color: ${color};
    `}
  }
  > span {
    position: absolute;
    top: 5.3px;
    right: 7px;
    text-align: center;
    font-size: 12px;
    ${({ color }) =>
      color &&
      `
      color: ${getContrastYIQ(color)};
    `}
  }
`;

const LevelBadgeHigh = styled.div<IPropsLevelBadge>`
  margin-left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  > svg {
    width: 22px;
    height: 22px;
    ${({ color }) =>
      color &&
      `
      color: ${color};
    `}
  }
  > span {
    position: absolute;
    top: 5.5px;
    right: 5.5px;
    text-align: center;
    font-size: 12px;
    ${({ color }) =>
      color &&
      `
      color: ${getContrastYIQ(color)};
    `}
  }
`;
