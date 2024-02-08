import React, {useEffect, useState} from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import animationData from '../../public/animations/check.json';
import dynamic from 'next/dynamic';
import {sendEmails} from "../API/api";


export default function SendEmailsAlertModal({
                                                 isSendEmailsAlertModalOpen, onSendEmailsAlertModalClose
                                             }) {
    const [showAnimation, setShowAnimation] = useState(false)
    const Lottie = dynamic(() => import('react-lottie'), {ssr: false});

    const defaultOptions = {
        loop: false, autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    async function handleSendEmails() {
        try {
            await sendEmails()
            setShowAnimation(true)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
    }, [setShowAnimation]);

    const handleAnimationComplete = () => {
        setShowAnimation(false);
        onSendEmailsAlertModalClose();
    };

    return (<>
        <Modal isOpen={isSendEmailsAlertModalOpen} onClose={onSendEmailsAlertModalClose} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1"> Wyślij e-maile</ModalHeader>
                <ModalBody>
                    <div className="text-center">
                        {showAnimation === false ? (
                            "Jeśli potwierdzisz tę akcję nastąpi wysyłka wiadomości do wszystkich dopasowanych osób, czy nadal chcesz wykonać tę operację?"
                        ) : (
                            <div className="text-center">
                                <p>Wiadomości wysłane!</p>
                                <Lottie
                                    options={defaultOptions}
                                    isStopped={!showAnimation}
                                    height={150}
                                    width={150}
                                    eventListeners={[{
                                        eventName: 'complete', callback: () => handleAnimationComplete()
                                    }]}
                                />
                            </div>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={handleSendEmails}>Wyślij</Button>
                    <Button color="default" onPress={onSendEmailsAlertModalClose}>Anuluj</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>);
}
