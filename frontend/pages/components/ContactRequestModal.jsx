import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu
} from "@nextui-org/react";
import { createContactRequest } from "../API/api";

export default function ContactRequestModal({
  contactRequestObject,
  setContactRequestObject,
  fetchDataOnClose,
  isContactRequestModalOpen,
  onContactRequestModalClose,
  fetchContactRequest,
}) {
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setSelectedContactIds([]);
    setContactRequestObject(undefined);
    onContactRequestModalClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedContactIds.length > 0) {
        const person_requesting_contact_id = contactRequestObject.number;
        const requestData = {
          preferred_persons: selectedContactIds
        };
        await createContactRequest(requestData, person_requesting_contact_id);
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
                closeOnSelect={false}
                disallowEmptySelection
              >
                {fetchContactRequest && fetchContactRequest.length > 0 ? (
                  fetchContactRequest.map((contact) => (
                    <DropdownItem
                      key={contact.number}
                      onClick={() => {
                        if (selectedContactIds.includes(contact.number)) {
                          setSelectedContactIds(prevIds => prevIds.filter(id => id !== contact.number));
                        } else {
                          setSelectedContactIds(prevIds => [...prevIds, contact.number]);
                        }
                      }}
                    >
                      {contact.number} - {contact.first_name}
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
