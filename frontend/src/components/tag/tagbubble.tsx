import styled from 'styled-components';
import 'styles/color.css';

interface IPropsTagBubble {
  color?: string;
  isPrime?: boolean;
}

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
