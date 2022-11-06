import styled from 'styled-components';
import 'styles/color.css';

interface IPropsColorButton {
  color?: string;
}

export const TagBubble = styled.button<IPropsColorButton>`
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
`;
export const TagBubbleCompact = styled.button<IPropsColorButton>`
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
