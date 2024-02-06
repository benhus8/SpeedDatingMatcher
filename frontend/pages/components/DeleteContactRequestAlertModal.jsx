import React, {useState} from "react";
import {
    Button, Dropdown, DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import {deleteContactRequest, deletePerson} from "../API/api";

export default function DeleteContactRequestAlertModal({
    isDeleteAlertModalOpen,
    onDeleteAlertModalClose,
    fetchDataOnClose,
    objectToDeleteName,
    objectToDelete
}) {
    const [selectedContact, setSelectedContact] = useState(null);

const handleDelete = async () => {
    try {
        if (selectedContact) {
            const { number: personRequestingContactId } = objectToDelete;
            await deleteContactRequest(
                personRequestingContactId,
                selectedContact
            );
            fetchDataOnClose();
            onDeleteAlertModalClose();
        } else {
            console.error("Selected contact is null");
        }
    } catch (error) {
        console.log(error);
    }
};


    return (
        <>
            {isDeleteAlertModalOpen && (
                <Modal
                    isOpen={isDeleteAlertModalOpen}
                    onClose={onDeleteAlertModalClose}
                    placement="top-center"
                >
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            Usuń preferencję osoby
                        </ModalHeader>
                        <ModalBody>
                            <p>Czy na pewno chcesz usunąć preferencję?</p>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button variant="bordered" className="capitalize">
                                        Wybierz preferowaną osobę
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Lista kontaktów"
                                    closeOnSelect={true}
                                >
                                    {objectToDeleteName && objectToDeleteName.length > 0 ? (
                                        objectToDeleteName.map((person, index) => (
                                            <DropdownItem
                                                key={index}
                                                onClick={() => setSelectedContact(person)}
                                            >
                                                {person}
                                            </DropdownItem>
                                        ))
                                    ) : (
                                        <DropdownItem disabled>Brak danych</DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={handleDelete}>
                                Usuń
                            </Button>
                            <Button color="default" onPress={onDeleteAlertModalClose}>
                                Anuluj
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}
