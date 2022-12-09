import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';

export interface ImageDetailModalIprops {
  isActive: boolean;
  onClose: () => void;
  modalRef: React.MutableRefObject<null>;
  modalAnimRef: React.MutableRefObject<null>;
  activeImage: string;
}

const ImageDetailModal = ({ isActive, onClose, modalRef, modalAnimRef, activeImage }: ImageDetailModalIprops) => {
  const closeHandler = () => {
    onClose?.();
  };

  const Modal = (
    <CSSTransition in={isActive} nodeRef={modalAnimRef} timeout={110} classNames="modal" unmountOnExit>
      <ModalOverlay ref={modalAnimRef}>
        <ModalContent className="modal" ref={modalRef}>
          <img src={process.env.REACT_APP_API_IMAGE + activeImage} alt="ModalContent" />
          <ModalExitWrapper>
            <ModalCloseBtn onClick={closeHandler} data-testid="tagModalCloseBtn">
              <FontAwesomeIcon icon={faX} />
            </ModalCloseBtn>
          </ModalExitWrapper>
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

  img {
    max-width: 80vw;
    max-height: 80vh;
  }
`;

const ModalExitWrapper = styled.div`
  position: absolute;
  top: 0px;
  right: -30px;

  font-size: 25px;
  color: var(--fit-red-neg);
`;

const ModalCloseBtn = styled.div`
  width: fit-content;
  cursor: pointer;
`;

export default ImageDetailModal;
