import React, { ReactNode } from 'react';
import { boxStyle, StyledModal } from './style';
import CustomModal from '@mui/material/Modal';
import { Box, Fade } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';

interface ModalProps {
    isOpen: boolean;
    children: ReactNode;
    closeModal: Function;
    cancelButton?: ReactNode;
    submitButton?: ReactNode;
}

const Modal = ({ isOpen, closeModal, children, cancelButton, submitButton }: ModalProps) => {
    return (
        <StyledModal>
            <CustomModal
                open={isOpen}
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                onClose={() => closeModal(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >
                <Fade in={isOpen}>
                    <Box sx={boxStyle}>
                        <Box>
                            {children}
                        </Box>
                        {(cancelButton || submitButton) &&
                            <Box
                                sx={{
                                    marginTop: '30px',
                                    display: 'flex',
                                    gap: '15px',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                {
                                    cancelButton && cancelButton
                                }
                                {
                                    submitButton && submitButton
                                }
                            </Box>
                        }
                    </Box>
                </Fade>
            </CustomModal>
        </StyledModal>
    )
}

export default Modal