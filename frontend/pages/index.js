import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import 'tailwindcss/tailwind.css'
import {
    Button,
    Card,
    CardBody,
    CircularProgress,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Image,
    Input,
    NextUIProvider,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@nextui-org/react";

import {deleteContactRequest, getAllPersonsWithContactRequests} from "./API/api";
import ConfirmationModal from './/components/confirmationModal';
import PersonModal from './components/PersonModal'
import {VerticalDotsIcon} from "./components/VerticalDotIcon";
import {SearchIcon} from "./components/SearchIcon";
import DeleteAlertModal from "./components/DeleteAlertModal";

import LoginModal from "./components/LoginModal";


const Home = () => {
    const [data, setData] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const {isOpen: isPersonModalOpen, onOpen: onPersonModalOpen, onClose: onPersonModalClose} = useDisclosure();
    const {
        isOpen: isDeleteAlertModalOpen, onOpen: onDeleteAlertModalOpen, onClose: onDeleteAlertModalClose
    } = useDisclosure();
    const {isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose} = useDisclosure();

    const [personObjectValue, setPersonObjectValue] = useState(undefined)
    const [objectToDelete, setObjectToDelete] = useState(undefined)

    const [deleteObjectType, setDeleteObjectType] = useState(undefined)


    function handleEditPerson(personRowValue) {
        onPersonModalOpen()
        setPersonObjectValue(personRowValue)
    }

    const handleDeletePerson = (person) => {
        setObjectToDelete(person)
        setDeleteObjectType("person")
        onDeleteAlertModalOpen()
    };
    const fetchData = async () => {
        setPersonObjectValue(undefined)
        try {
            const result = await getAllPersonsWithContactRequests(setIsLoggedIn);
            setData(result);
        } catch (error) {
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            onLoginModalOpen()
        }
    }, [isLoggedIn]);

    const columns = [{
        key: "number", label: "Numer",
    }, {
        key: "first_name", label: "Imię",
    }, {
        key: "email", label: "e-mail",
    }, {
        key: "preferred_persons", label: "Preferowane osoby",
    }, {
        key: "actions", label: "Akcje",
    },];

    const renderCell = React.useCallback((person, columnKey) => {
        const cellValue = person[columnKey];

        switch (columnKey) {
            case "number":
                return (<p className="text-bold text-sm capitalize">{cellValue}</p>);
            case "first_name":
                return (<p className="text-bold text-sm capitalize">{cellValue}</p>);
            case "email":
                return (<p className="text-bold text-sm">{cellValue}</p>);
            case "preferred_persons":
                return (<p className="text-bold text-sm">{mapPreferredPersons(cellValue)}</p>);
            case "actions":
                return (<div className="relative flex justify-end items-center gap-2">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly
                                    size="sm"
                                    variant="bordered"
                                    className="bg-pink-100 border-pink-200"

                            >
                                <VerticalDotsIcon className="text-default-300"/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownSection showDivider>
                                <DropdownItem onClick={() => handleEditPerson(person)}
                                              startContent={<Image src="/edit_person_icon.svg/"/>}
                                >
                                    Edytuj Osobę
                                </DropdownItem>
                                <DropdownItem startContent={<Image src="/add_contact_request.svg/"/>}
                                >
                                    Dodaj preferencję</DropdownItem>
                            </DropdownSection>
                            <DropdownSection>
                                <DropdownItem
                                    onClick={() => handleDeletePerson(person)}
                                    startContent={<Image src="/delete_person_icon.svg/"/>}
                                >Usuń osobę
                                </DropdownItem>
                                <DropdownItem startContent={<Image src="/delete_contact_request_icon.svg/"/>}>Usuń
                                    preferencję</DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                </div>);
            default:
                return cellValue;
        }
    }, []);


    function mapPreferredPersons(preferredPersons) {
        if (preferredPersons == null) return ''
        const strings = preferredPersons.map(number => String(number))
        return strings.join(", ")
    }

    const handleConfirmDelete = async (personIdToDelete) => {
        try {
            const {personRequestingContactId, preferredPersonId} = recordToDelete;
            if (personIdToDelete === preferredPersonId) {
                await deleteContactRequest(setIsLoggedIn, personRequestingContactId, preferredPersonId);
                setData(await getAllPersonsWithContactRequests());
            } else {
                console.error('Numer osoby do usunięcia nie pasuje do rekordu.');
            }
            setShowConfirmation(false);
        } catch (error) {
            console.error('Błąd podczas usuwania rekordu:', error);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };
    //TODO add filtering function
    return (<NextUIProvider>
        <div className="bg-pink-200 h-screen w-screen">
            <Head>
                <title>SpeedDatingMatcher</title>
            </Head>
            <div className="mx-10 flex">
                <Image
                    isZoomed
                    alt="MailIcon"
                    src="/mail_icon.png"
                />
                <h1 className="text-white mt-10 text-xl font-bold">Speed Dating Matcher</h1>
            </div>

            <div className="h-3/4-screen w-3/4-screen mx-0 justify-center items-center">
                <div className=" ml-10 mb-3">
                    <Button onPress={onPersonModalOpen}
                            className="bg-white text-black shadow-lg from-pink-500 border-pink-300"
                            variant="faded"
                            startContent={<Image src="/add_person_icon.svg/"/>}
                    >
                        Dodaj osobę
                    </Button>
                    <LoginModal
                        fetchDataFunction={fetchData}
                        isLoginModalOpen={isLoginModalOpen}
                        onLoginModalClose={onLoginModalClose}
                        setIsLoggedIn={setIsLoggedIn}
                    />
                    <PersonModal
                        mode={personObjectValue === undefined ? "add" : "edit"}
                        personObject={personObjectValue}
                        setPersonObject={setPersonObjectValue}
                        fetchDataOnClose={fetchData}
                        isPersonModalOpen={isPersonModalOpen}
                        onPersonModalClose={onPersonModalClose}
                    />
                    <DeleteAlertModal
                        objectToDeleteName={deleteObjectType}
                        objectToDelete={objectToDelete}
                        fetchDataOnClose={fetchData}
                        isDeleteAlertModalOpen={isDeleteAlertModalOpen}
                        onDeleteAlertModalClose={onDeleteAlertModalClose}
                    />

                </div>
                <Card
                    shadow="sm"
                    className="mx-10 border-pink-300"
                >
                    <CardBody>
                        <div>
                            <Input
                                size="sm"
                                isClearable
                                className="w-full sm:max-w-[25%] mb-3 ml-5"
                                placeholder="Wyszukaj po imieniu..."
                                startContent={<SearchIcon/>}
                                // value={filterValue}
                                onClear={() => onClear()}
                                // onValueChange={onSearchChange}
                            />

                            {data !== null ? (<Table
                                className="table-hover h-3/4-screen w-3/4-screen mx-1 "
                                aria-label="Example table with dynamic content"
                                color={"default"}
                                selectionMode="single"
                                fullWidth
                            >
                                <TableHeader columns={columns}>
                                    {(column) => <TableColumn
                                        key={column.key}
                                        width={400}
                                    >
                                        <p className="text-sm capitalize">{column.label}</p>
                                    </TableColumn>}
                                </TableHeader>
                                <TableBody items={data}>
                                    {(item) => (<TableRow key={item.number}>
                                        {columns.map((column) => (<TableCell key={column.key}>
                                            {renderCell(item, column.key)}
                                        </TableCell>))}
                                    </TableRow>)}
                                </TableBody>
                            </Table>) : (<div className="flex justify-center items-center">
                                    <CircularProgress aria-label="Loading..." color="default"/>
                                </div>

                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>

            <ConfirmationModal
                show={showConfirmation}
                onHide={handleCloseConfirmation}
                onConfirm={handleConfirmDelete}
            />
        </div>
    </NextUIProvider>);
};

export default Home;
