import React, {useMemo, useState} from "react";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import {deleteContactRequest} from "../API/api";

export default function DeleteContactRequestAlertModal({
                                                           isDeleteAlertModalOpen,
                                                           onDeleteAlertModalClose,
                                                           fetchDataOnClose,
                                                           objectToDeleteName,
                                                           objectToDelete
                                                       }) {
    const [selectedContact, setSelectedContact] = useState(new Set([]));
    const selectedValue = useMemo(() => Array.from(selectedContact).join(", ").replaceAll("_", " "), [selectedContact]);
    const handleDelete = async () => {
        try {
            if (selectedContact) {
                const {number: personRequestingContactId} = objectToDelete;
                const contactRequestNumberToDelete = Array.from(selectedContact)[0];
                await deleteContactRequest(personRequestingContactId, contactRequestNumberToDelete);
                setSelectedContact(new Set([]))
                fetchDataOnClose();
                onDeleteAlertModalClose();
            } else {
                console.error("Selected contact is null");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        setSelectedContact(new Set([]))
        onDeleteAlertModalClose()
    };


    return (<>
        {isDeleteAlertModalOpen && (<Modal
            isOpen={isDeleteAlertModalOpen}
            onClose={handleClose}
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
                            <Button variant="bordered">
                                {selectedValue !== "" ? selectedValue : "Wybierz preferencję do usunięcia"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            className="max-h-56 overflow-y-auto"
                            aria-label="Lista kontaktów"
                            closeOnSelect={true}
                            selectionMode="single"
                            selectedKeys={selectedContact}
                            onSelectionChange={setSelectedContact}
                        >
                            {objectToDeleteName && objectToDeleteName.length > 0 ? (objectToDeleteName.map((personNumber, index) => (
                                <DropdownItem
                                    key={personNumber}
                                >
                                    {personNumber}
                                </DropdownItem>))) : (<DropdownItem disabled>Brak danych</DropdownItem>)}
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
        </Modal>)}
    </>);
}
