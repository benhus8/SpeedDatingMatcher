import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import 'tailwindcss/tailwind.css'
import {
    Button,
    Card,
    CardBody,
    getKeyValue,
    Image,
    NextUIProvider,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    CircularProgress,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Input, useDisclosure, Chip
} from "@nextui-org/react";

import {deleteContactRequest, getAllPersonsWithContactRequests, getPersonsContactRequest, getContactRequests} from "./API/api";
import PersonModal from './components/PersonModal'
import {VerticalDotsIcon} from "./components/VerticalDotIcon";
import {SearchIcon} from "./components/SearchIcon";
import DeleteAlertModal from "./components/DeleteAlertModal";
import ContactRequestModal from "./components/ContactRequestModal";
import DeleteContactRequestAlertModal from "./components/DeleteContactRequestAlertModal";

import LoginModal from "./components/LoginModal";


const Home = () => {
    const [data, setData] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [contactRequestData, setContactRequestData] = useState(null);
    const [filterValue, setFilterValue] = useState('');

    const {isOpen: isPersonModalOpen, onOpen: onPersonModalOpen, onClose: onPersonModalClose} = useDisclosure();
    const {isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose} = useDisclosure();

    const {isOpen: isContactRequestModalOpen, onOpen: onContactRequestModalOpen, onClose: onContactRequestModalClose} = useDisclosure();

    const {isOpen: isDeleteAlertModalOpen, onOpen: onDeleteAlertModalOpen, onClose: onDeleteAlertModalClose} = useDisclosure();

    const {isOpen: isDeleteContactRequestAlertModalOpen, onOpen: onDeleteContactRequestAlertModalOpen, onClose: onDeleteContactRequestAlertModalClose} = useDisclosure();

    const [personObjectValue, setPersonObjectValue] = useState(undefined)
    const [objectToDelete, setObjectToDelete] = useState(undefined)

    const [deleteObjectType, setDeleteObjectType] = useState(undefined)
    const [preferredPersons, setPreferredPersons] = useState([])

    function handleEditPerson(personRowValue) {
        onPersonModalOpen()
        setPersonObjectValue(personRowValue)
    }

    function handleAddContactRequest(personRowValue) {
        onContactRequestModalOpen()
        setPersonObjectValue(personRowValue)
    }

    const handleDeletePerson = (person) => {
        setObjectToDelete(person)
        setDeleteObjectType("person")
        onDeleteAlertModalOpen()
    };

    const handleDeleteContactRequest = (personRowValue) => {
    setPreferredPersons(personRowValue.preferred_persons);
    setObjectToDelete(personRowValue);
    onDeleteContactRequestAlertModalOpen();
    };

    const fetchData = async () => {
        setPersonObjectValue(undefined)
        try {
            const result = await getAllPersonsWithContactRequests();
            setData(result);
            return result;
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            onLoginModalOpen()
        }
    }, [isLoggedIn]);

    const fetchContactRequests = async () => {
        try {
            if (personObjectValue !== undefined) {
                const result = await getContactRequests(personObjectValue.number);
                console.log("API Response:", result);
                if (result !== undefined) {
                    setContactRequestData(result);
                }
                return result;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchContactRequests()
            .catch(error => {
                console.error("Error fetching data in useEffect:", error);
            });
    }, [personObjectValue]);



    const columns = [
        {
            key: "number",
            label: "Numer",
        },
        {
            key: "first_name",
            label: "Imię",
        },
        {
            key: "email",
            label: "e-mail",
        },
        {
            key: "email_verified",
            label: "weryfikacja",
        },
        {
            key: "preferred_persons",
            label: "Preferowane osoby",
        },
        {
            key: "actions",
            label: "Akcje",
        },
    ];

    const renderCell = React.useCallback((person, columnKey) => {
        const cellValue = person[columnKey];
        switch (columnKey) {
            case "number":
                return (<p className="text-bold text-sm capitalize">{cellValue}</p>);
            case "first_name":
                return (<p className="text-bold text-sm capitalize">{cellValue}</p>);
            case "email":
                return (<p className="text-bold text-sm">{cellValue}</p>);
                return (
                    <p className="text-bold text-sm">{cellValue}</p>
                );
           case "email_verified":
                return (
                    <Chip className="capitalize" color={cellValue ? "success" : "danger"} size="sm" variant="flat">
                        {cellValue ? "Zweryfikowany" : "Nie zweryfikowany"}
                    </Chip>
                );
            case "preferred_persons":
                return (<p className="text-bold text-sm">{mapPreferredPersons(cellValue)}</p>);
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
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
                                    <DropdownItem onClick={() => handleEditPerson(person)} startContent={<Image src="/edit_person_icon.svg/"/> }
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
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);



    function mapPreferredPersons(preferredPersons) {
        if (preferredPersons == null) return ''
        const strings = preferredPersons.map(number => String(number))
        return strings.join(", ")
    }

    const handleSearchChange = (searchValue) => {
        const lowercaseValue = searchValue.toLowerCase();
        console.log("Filter value:", lowercaseValue);
        setFilterValue(lowercaseValue);
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

    const filteredData = data && data.filter(item =>
      item.first_name.toLowerCase().startsWith(filterValue.toLowerCase())
    );

    return (
        <NextUIProvider>
            <div className="bg-pink-200 h-screen w-screen">
                <Head className="shadow-lg" >
                    <title className="shadow-lg" >SpeedDatingMatcher</title>
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
                <div className="h-3/4-screen w-3/4-screen mx-0 justify-center items-center">
                    <div className=" ml-10 mb-3 ">
                        <Button onPress={onPersonModalOpen}
                                className="bg-white text-black shadow-lg from-pink-500 border-pink-300"
                                variant="faded"
                                startContent={<Image src="/add_person_icon.svg/"/>}
                        >
                            Dodaj osobę
                        </Button>
                        {//TODO add onPress handle
                        }
                        <Button
                                className="bg-white text-black shadow-lg from-pink-500 border-pink-300 ml-2"
                                variant="faded"
                                startContent={<Image src="/love_letter_mail.svg/" className="w-5 h-5"/>}
                        >
                            Wyślij listy
                        </Button>
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

                        <DeleteContactRequestAlertModal
                            objectToDeleteName={preferredPersons}
                            objectToDelete={objectToDelete}
                            fetchDataOnClose={fetchData}
                            isDeleteAlertModalOpen={isDeleteContactRequestAlertModalOpen}
                            onDeleteAlertModalClose={onDeleteContactRequestAlertModalClose}
                        />

                        <ContactRequestModal
                            contactRequestObject={personObjectValue}
                            setContactRequestObject={setPersonObjectValue}
                            fetchDataOnClose={fetchData}
                            fetchContactRequest={contactRequestData}
                            isContactRequestModalOpen={isContactRequestModalOpen}
                            onContactRequestModalClose={onContactRequestModalClose}
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
                                    value={filterValue}
                                    onClear={() => setFilterValue('')}
                                    onValueChange={(value) => handleSearchChange(value)}
                                />

                                {data !== null ? (
                                    <Table
                                        className="table-hover h-3/4-screen w-3/4-screen mx-1 "
                                        aria-label="Example table with dynamic content"
                                        color={"default"}
                                        selectionMode="single"
                                        fullWidth
                                    >
                                        <TableHeader columns={columns}>
                                            {(column) =>
                                                <TableColumn
                                                    key={column.key}
                                                    width={400}
                                                >
                                                    <p className="text-sm capitalize">{column.label}</p>
                                                </TableColumn>
                                            }
                                        </TableHeader>
                                        <TableBody items={filteredData}>
                                            {(item) => (
                                                <TableRow key={item.number}>
                                                    {columns.map((column) => (
                                                        <TableCell key={column.key}>
                                                            {renderCell(item, column.key)}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            )}
                                        </TableBody>

                                    </Table>
                                ) : (
                                    <div className="flex justify-center items-center">
                                        <CircularProgress aria-label="Loading..." color="default"/>
                                    </div>

                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </NextUIProvider>
    );
};

export default Home;
