import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DropdownMenu,
  Dropdown, DropdownItem, DropdownTrigger,
} from "@nextui-org/react";
import { createContactRequest } from "../API/api";

export default function ContactRequestModal({
  contactRequestObject,
  setContactRequestObject,
  fetchDataOnClose,
  isContactRequestModalOpen,
  onContactRequestModalClose,
}) {
  const [invalidNumber, setInvalidNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState({ number: "" });

  function handleClose() {
    setContactRequestObject(undefined);
    onContactRequestModalClose();
  }

  useEffect(() => {
    setErrorMessage("");
    setValues({ number: "" }); // Reset values when modal opens
  }, [isContactRequestModalOpen]);

  const handleSubmit = async (values) => {
    try {
      const responseData = await createContactRequest(values);
      if (responseData["non_field_errors"]) {
        const errorString = responseData["non_field_errors"].join("\n");
        if (errorString.includes("email must make a unique set")) {
          setErrorMessage("Osoba o takim email-u już istnieje!");
        }
      } else {
        fetchDataOnClose();
        onContactRequestModalClose();
        setContactRequestObject(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal isOpen={isContactRequestModalOpen} onClose={handleClose} placement="top-center">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Dodaj preferencję</ModalHeader>
            <ModalBody>
            <Dropdown >
              <DropdownTrigger>
                <Button
                  variant="bordered"
                >
                  Wybierz numer preferowanej osoby
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Example with disabled actions">
                <DropdownItem key="1">1</DropdownItem>
                <DropdownItem key="2">2</DropdownItem>
                <DropdownItem key="3">3</DropdownItem>
              </DropdownMenu>
            </Dropdown>


              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onClick={handleClose}>
                Anuluj
              </Button>
              <Button className="bg-green-200" disabled={invalidNumber} type="submit">
                Zapisz
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
