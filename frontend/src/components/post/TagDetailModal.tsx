import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

import { CSSTransition } from 'react-transition-group';
import { TagClass, TagVisual } from 'store/apis/tag';
import { RowCenterFlex } from './layout';
import { TagBubble } from 'components/tag/tagbubble';
import React from 'react';

export interface TagDetailModalIprops {
  isActive: boolean;
  onClose: () => void;
  modalRef: React.MutableRefObject<null>;
  modalAnimRef: React.MutableRefObject<null>;
  tagList: TagClass[] | null;
  selected: TagVisual[];
  setSelected: (value: React.SetStateAction<TagVisual[]>) => void;
}

const UNSELECTED = '#dbdbdb';

const TagDetailModal = ({
  isActive,
  onClose,
  modalRef,
  modalAnimRef,
  tagList,
  selected,
  setSelected,
}: TagDetailModalIprops) => {
  const filterOnClick = (tag: TagVisual) => {
    if (selected.filter(item => item.id == tag.id).length === 0) {
      setSelected(state => {
        return [...state, tag];
      });
    } else {
      setSelected(state => {
        return state.filter(item => item.id !== tag.id);
      });
    }
  };

  const closeHandler = () => {
    onClose?.();
  };

  const Modal = (
    <CSSTransition in={isActive} nodeRef={modalAnimRef} timeout={110} classNames="modal" unmountOnExit>
      <ModalOverlay ref={modalAnimRef}>
        <ModalContent className="modal" ref={modalRef}>
          <Divdiv>
            <ModalTitleWrapper>
              <ModalTitle>태그 자세히보기</ModalTitle>
              <ModalExitWrapper>
                <ModalCloseBtn onClick={closeHandler} data-testid="tagModalCloseBtn">
                  <FontAwesomeIcon icon={faX} />
                </ModalCloseBtn>
              </ModalExitWrapper>
            </ModalTitleWrapper>
            <ModalDescriptionSection>
              <span>아래 태그를 클릭하여 태그로 필터링할 수 있습니다.</span>
            </ModalDescriptionSection>
            {tagList?.map(tagClass => (
              <TagClassSection key={tagClass.id}>
                <div>
                  <h1>{tagClass.class_name}</h1>
                  <div style={{ backgroundColor: tagClass.color }}></div>
                </div>
                <div>
                  {tagClass.tags.map(tag => (
                    <TagBubble
                      key={tag.id}
                      color={
                        selected.length > 0 && selected.filter(item => item.id == tag.id).length === 0
                          ? UNSELECTED
                          : tag.color
                      }
                      onClick={() => filterOnClick(tag)}
                    >
                      {tag.name}
                    </TagBubble>
                  ))}
                  {selected.length == 0 && <TagBubble color={tagClass.color}>눌러서 추가</TagBubble>}
                </div>
              </TagClassSection>
            ))}
          </Divdiv>
        </ModalContent>
      </ModalOverlay>
    </CSSTransition>
  );
  return Modal;
};

export const ModalOverlay = styled.div`
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;

  background-color: var(--fit-modal-background);
`;

const ModalDescriptionSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 5px;
  padding: 0px 20px 10px 20px;

  > span {
    font-size: 15px;
    text-align: right;
  }
`;

const TagClassSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;

  padding: 10px 20px;
  > div:first-child {
    display: flex;
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    > h1 {
      /* Title */
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    > div:nth-child(2) {
      width: 15px;
      height: 15px;
      margin-left: 5px;
      border-radius: 20px;
    }
  }
  > div:nth-child(2) {
    display: flex;
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
`;
const ModalContent = styled.div`
  width: fit-content;
  height: fit-content;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 15px;
  /* Modal Shadow */
  -webkit-box-shadow: 0 10px 12px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 10px 12px rgba(0, 0, 0, 0.3);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  -webkit-background-clip: padding-box;
  -moz-background-clip: padding-box;
  background-clip: padding-box;
`;

const ModalTitleWrapper = styled(RowCenterFlex)`
  width: 100%;
  padding: 15px 20px 8px 20px;
  border-bottom: 1px solid gray;
`;

const ModalTitle = styled.span`
  font-size: 24px;
`;
const ModalExitWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 20px;

  font-size: 25px;
  color: var(--fit-red-neg);
`;

const Divdiv = styled.div`
  width: 1000px;
  height: 600px;
  background-color: var(--fit-white);
  overflow: auto;
  border-radius: inherit;
`;

const ModalCloseBtn = styled.div`
  width: fit-content;
  cursor: pointer;
`;

export default TagDetailModal;
