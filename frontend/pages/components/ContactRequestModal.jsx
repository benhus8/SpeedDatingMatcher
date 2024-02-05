import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DropdownMenu,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
} from "@nextui-org/react";
import { createContactRequest, getContactRequests } from "../API/api";

export default function ContactRequestModal({
  contactRequestObject,
  setContactRequestObject,
  fetchDataOnClose,
  isContactRequestModalOpen,
  onContactRequestModalClose,
  fetchContactRequest,
}) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );


  const handleClose = () => {
    setContactRequestObject(undefined);
    onContactRequestModalClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedContact) {
        const { number: preferredPersonId } = selectedContact;
        const { number: personRequestingContactId } = contactRequestObject;
        await createContactRequest({
          person_requesting_contact_id: personRequestingContactId,
          preferred_person_id: preferredPersonId
        });
        fetchDataOnClose();
        onContactRequestModalClose();
        setContactRequestObject(undefined);
      } else {
        setErrorMessage("Wybierz numer preferowanej osoby");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isContactRequestModalOpen}
      onClose={handleClose}
      placement="top-center"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            Dodaj preferencję
          </ModalHeader>
          <ModalBody>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize">
                  Wybierz numer preferowanej osoby
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                  aria-label="Lista kontaktów"
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  onSelectionChange={setSelectedKeys}
                  closeOnSelect={false}
                  disallowEmptySelection>

                {fetchContactRequest && fetchContactRequest.length > 0 ? (
                  fetchContactRequest.map((contact) => (
                    <DropdownItem
                      key={contact.number}
                      onClick={() => setSelectedContact(contact)}
                    >
                      {contact.number}
                      {' - '}
                      {contact.first_name}
                    </DropdownItem>
                  ))
                ) : (
                  <DropdownItem disabled>Brak danych</DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onClick={handleClose}>
              Anuluj
            </Button>
            <Button className="bg-green-200" type="submit">
              Zapisz
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

