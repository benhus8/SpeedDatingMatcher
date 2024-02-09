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
import {createContactRequest} from "../API/api";

export default function ContactRequestModal({
                                                contactRequestObject,
                                                setContactRequestObject,
                                                fetchDataOnClose,
                                                isContactRequestModalOpen,
                                                onContactRequestModalClose,
                                                fetchContactRequest,
                                            }) {
    const [errorMessage, setErrorMessage] = useState("");

    const [selectedNumbers, setSelectedNumbers] = useState(new Set([]));

    const selectedValue = useMemo(() => Array.from(selectedNumbers).join(", ").replaceAll("_", " "), [selectedNumbers]);
    const handleClose = () => {
        setSelectedNumbers(new Set([]))
        setContactRequestObject(undefined)
        onContactRequestModalClose()
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedNumbers.size > 0) {
                const person_requesting_contact_id = contactRequestObject.number;

                const numbersList = [];
                selectedNumbers.forEach(value => {
                    numbersList.push(value);
                });

                const requestData = {
                    preferred_persons: numbersList
                };
                await createContactRequest(requestData, person_requesting_contact_id);
                fetchDataOnClose();
                setSelectedNumbers(new Set([]))
                onContactRequestModalClose();
                setContactRequestObject(undefined);
            } else {
                setErrorMessage("Wybierz numer preferowanej osoby");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (<Modal
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
                            <Button variant="bordered">
                                {selectedValue !== "" ? selectedValue : "Wybierz numer preferowanej osoby"}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Lista kontaktów"
                            selectionMode="multiple"
                            closeOnSelect={false}
                            disallowEmptySelection
                            selectedKeys={selectedNumbers}
                            onSelectionChange={setSelectedNumbers}
                            className="max-h-56 overflow-y-auto"
                        >
                            {fetchContactRequest && fetchContactRequest.length > 0 ? (fetchContactRequest.map((contact) => (
                                <DropdownItem key={contact.number}>
                                    {contact.number} - {contact.first_name}
                                </DropdownItem>))) : (<DropdownItem disabled>Brak danych</DropdownItem>)}
                        </DropdownMenu>
                    </Dropdown>
                    {errorMessage && <p style={{color: "red"}}>{errorMessage}</p>}
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
    </Modal>);
}
