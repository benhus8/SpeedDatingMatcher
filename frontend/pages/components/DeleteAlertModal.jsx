import React from "react";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {deletePerson} from "../API/api";

export default function DeleteAlertModal({
                                             isDeleteAlertModalOpen,
                                             onDeleteAlertModalClose,
                                             fetchDataOnClose,
                                             objectToDeleteName,
                                             objectToDelete
                                         }) {

    async function handleDelete() {
        try {
            await deletePerson(objectToDelete.number);
            fetchDataOnClose()
            onDeleteAlertModalClose();
        } catch (error) {
            console.log(error)
        }
    }

    return (<>
        <Modal isOpen={isDeleteAlertModalOpen} onClose={onDeleteAlertModalClose} placement="top-center">
            <ModalContent>
                <ModalHeader
                    className="flex flex-col gap-1">{objectToDeleteName === "person" ? 'Usuń osobę' : 'Usuń pereferencję osoby'}</ModalHeader>
                <ModalBody>
                    {objectToDeleteName === "person" ? ("Usunięcie osoby spowoduje usunięcie wszystkich jej preferencji oraz preferencji, w których jest zawarta. Usunąć osobę?") : ("Delete constact request")}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={handleDelete}>Usuń</Button>
                    <Button color="default" onPress={onDeleteAlertModalClose}>Anuluj</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>);
}
