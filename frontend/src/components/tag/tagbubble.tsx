import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import 'styles/color.css';

interface IPropsTagBubble {
  color?: string;
  isPrime?: boolean;
}

interface IPropsTagBubbleX {
  testId?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const TagBubbleX = ({ testId, onClick }: IPropsTagBubbleX) => (
  <TagBubbleXstyle data-testid={testId} onClick={onClick}>
    <FontAwesomeIcon icon={faX} />
  </TagBubbleXstyle>
);

export const TagBubbleXstyle = styled.div`
  margin-left: 5px;
  font-size: 10px;
  color: red;
  width: fit-content;
  height: fit-content;
  display: block;
  cursor: pointer;
`;

export const TagBubbleWithFunc = styled.button<IPropsTagBubble>`
  height: 25px;
  border-radius: 30px;
  padding: 1px 10px;
  border: none;
  margin: 1px 2px;
  width: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ color }) =>
    color &&
    `
      background: ${color};
    `}
`;

export const TagBubble = styled.button<IPropsTagBubble>`
  height: 20px;
  width: fit-content;
  border-radius: 25px;
  padding: 1px 12px;
  border: none;
  white-space: nowrap;
  margin: 1px 3px;
  ${({ color }) =>
    color &&
    `
      background: ${color};
    `}
  ${({ isPrime }) =>
    isPrime &&
    `
      border: 2px solid green;
    `}
`;

export const TagBubbleCompact = styled.button<IPropsTagBubble>`
  height: fit-content;
  width: fit-content;
  border-radius: 20px;
  padding: 4px 6px;
  border: none;
  white-space: nowrap;
  font-size: 11px;
  cursor: inherit;
  ${({ color }) =>
    color &&
    `
      background: ${color};
    `}
`;
