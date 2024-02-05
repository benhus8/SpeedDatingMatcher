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
    fetchData,
    objectToDeleteName,
    objectToDelete}) {

    const [selectedContact, setSelectedContact] = useState(null);

     const handleDelete = async()=> {
        try {
            const { number: preferredPersonId } = selectedContact;
            const { number: personRequestingContactId } = objectToDelete;
            await deleteContactRequest({
                person_requesting_contact_id: personRequestingContactId,
                preferred_person_id: preferredPersonId
            });
            fetchDataOnClose()
            onDeleteAlertModalClose();
        } catch (error) {
            console.log(error)
        }
    }
console.log(fetchData)
    return (<>
            <Modal isOpen={isDeleteAlertModalOpen} onClose={onDeleteAlertModalClose} placement="top-center">
                <ModalContent>
                    <ModalHeader
                        className="flex flex-col gap-1">{objectToDeleteName === "person" ? 'Usuń osobę' : 'Usuń pereferencję osoby'}</ModalHeader>
                    <ModalBody>
                        {objectToDeleteName === "person" ?
                                (<p1> Czy napewno chcesz usunąć preferencję?</p1>)
                            : (<p1> Delete contact request</p1>)
                        }
                        <Dropdown>
                          <DropdownTrigger>
                            <Button variant="bordered" className="capitalize">
                              Wybierz numer preferowanej osoby
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                              aria-label="Lista kontaktów"
                              closeOnSelect={false}
                          >
                            {fetchData && fetchData.length > 0 ? (
                              fetchData.map((contact) => (
                                <DropdownItem
                                  key={contact.preferred_person_id}
                                  onClick={() => setSelectedContact(contact)}
                                >
                                  {contact.preferred_person_id}
                                </DropdownItem>
                              ))
                            ) : (
                              <DropdownItem disabled>Brak danych</DropdownItem>
                            )}
                          </DropdownMenu>
                        </Dropdown>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={handleDelete}>Usuń</Button>
                        <Button color="default" onPress={onDeleteAlertModalClose}>Anuluj</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>);
}
