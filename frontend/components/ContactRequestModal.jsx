import React, {useMemo, useState} from "react";
import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
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
    // Removed search input; keep UI simple
    const [selectedNumbers, setSelectedNumbers] = useState(new Set([]));
    const [sortDescriptor, setSortDescriptor] = useState({ column: 'number', direction: 'ascending' });
    const alreadyPreferredSet = useMemo(() => new Set((contactRequestObject?.preferred_persons || []).map(n => String(n))), [contactRequestObject]);
    const availableContacts = useMemo(() => {
        const all = Array.isArray(fetchContactRequest) ? fetchContactRequest : [];
        return all
            .filter(c => String(c.number) !== String(contactRequestObject?.number))
            .filter(c => !alreadyPreferredSet.has(String(c.number)));
    }, [fetchContactRequest, contactRequestObject, alreadyPreferredSet]);

    const sortedContacts = useMemo(() => {
        const arr = [...availableContacts];
        const { column, direction } = sortDescriptor || {};
        if (!column) return arr;
        arr.sort((a, b) => {
            let x = a[column];
            let y = b[column];
            if (column === 'number') {
                x = Number(x);
                y = Number(y);
            } else {
                x = String(x).toLowerCase();
                y = String(y).toLowerCase();
            }
            const res = x < y ? -1 : x > y ? 1 : 0;
            return direction === 'descending' ? -res : res;
        });
        return arr;
    }, [availableContacts, sortDescriptor]);
    const handleClose = () => {
        setSelectedNumbers(new Set([]))
        setContactRequestObject(undefined)
        onContactRequestModalClose()
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedArray = Array.from(selectedNumbers);
            if (selectedArray.length > 0) {
                const person_requesting_contact_id = contactRequestObject.number;

                const numbersList = selectedArray.map(value => parseInt(String(value), 10));
                // Final guard: exclude self if somehow present
                const filteredNumbers = numbersList.filter(n => String(n) !== String(person_requesting_contact_id));
                if (filteredNumbers.length !== numbersList.length) {
                    setErrorMessage("Nie można przypisać preferencji do samego siebie.");
                    return;
                }

                const requestData = {
                    preferred_persons: filteredNumbers
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
                    <span>Dodaj preferencję</span>
                    {contactRequestObject && (
                        <span className="text-sm text-gray-600">dla: {contactRequestObject.number} — {contactRequestObject.first_name}</span>
                    )}
                </ModalHeader>
                <ModalBody>
                    
                    <div className="mt-3 max-h-56 overflow-y-auto border rounded p-2">
                        {sortedContacts && sortedContacts.length > 0 ? (
                            <Table
                                aria-label="Wybierz preferowane osoby"
                                selectionMode="multiple"
                                selectedKeys={selectedNumbers}
                                onSelectionChange={(keys) => {
                                    // Normalize NextUI Selection to a Set of string keys
                                    if (keys === 'all') {
                                        const allKeys = new Set(sortedContacts.map(c => String(c.number)));
                                        setSelectedNumbers(allKeys);
                                    } else if (keys instanceof Set) {
                                        setSelectedNumbers(keys);
                                    } else if (Array.isArray(keys)) {
                                        setSelectedNumbers(new Set(keys.map(k => String(k))));
                                    } else {
                                        setSelectedNumbers(new Set([]));
                                    }
                                    setErrorMessage("");
                                }}
                                sortDescriptor={sortDescriptor}
                                onSortChange={setSortDescriptor}
                            >
                                <TableHeader>
                                    <TableColumn key="number" allowsSorting>Numer</TableColumn>
                                    <TableColumn key="first_name" allowsSorting>Imię</TableColumn>
                                </TableHeader>
                                <TableBody items={sortedContacts}>
                                    {(item) => (
                                        <TableRow key={String(item.number)}>
                                            <TableCell>{item.number}</TableCell>
                                            <TableCell>{item.first_name}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-sm text-gray-600">Brak wyników</p>
                        )}
                    </div>
                    {Array.from(selectedNumbers).length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                            {Array.from(selectedNumbers).map(key => (
                                <Chip
                                    key={key}
                                    color="primary"
                                    variant="flat"
                                    onClose={() => {
                                        const next = new Set(Array.from(selectedNumbers));
                                        next.delete(key);
                                        setSelectedNumbers(next);
                                        setErrorMessage("");
                                    }}
                                >
                                    {key}
                                </Chip>
                            ))}
                        </div>
                    )}
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
