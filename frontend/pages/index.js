import Head from 'next/head';
import React, {useEffect, useState} from 'react';
import 'tailwindcss/tailwind.css'
import {ToastContainer, toast} from 'react-toastify';
import {
    Button,
    Card,
    CardBody,
    Chip,
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
    Tooltip,
    useDisclosure
} from "@nextui-org/react";

import {getAllPersonsWithContactRequests, getContactRequests} from "../API/api";
import PersonModal from '../components/PersonModal'
import {VerticalDotsIcon} from "../components/VerticalDotIcon";
import {SearchIcon} from "../components/SearchIcon";
import DeleteAlertModal from "../components/DeleteAlertModal";
import ContactRequestModal from "../components/ContactRequestModal";
import DeleteContactRequestAlertModal from "../components/DeleteContactRequestAlertModal";
import LoginModal from "../components/LoginModal";
import SendEmailsAlertModal from "../components/SendEmailsAlertModal";
import {Grandstander} from "@next/font/google";
import ErrorBoundary from '../components/ErrorBoundary';
import { t } from '../i18n';
import Layout from '../components/Layout';

const font = Grandstander({subsets: ['latin']})
const Home = () => {

    const [data, setData] = useState(null);
    const [contactRequestData, setContactRequestData] = useState(null);
    const [filterValue, setFilterValue] = useState('');

    const {isOpen: isPersonModalOpen, onOpen: onPersonModalOpen, onClose: onPersonModalClose} = useDisclosure();

    const {
        isOpen: isContactRequestModalOpen,
        onOpen: onContactRequestModalOpen,
        onClose: onContactRequestModalClose
    } = useDisclosure();

    const {
        isOpen: isDeleteAlertModalOpen,
        onOpen: onDeleteAlertModalOpen,
        onClose: onDeleteAlertModalClose
    } = useDisclosure();

    const {
        isOpen: isSendEmailsAlertModalOpen,
        onOpen: onSendEmailsAlertModalOpen,
        onClose: onSendEmailsAlertModalClose
    } = useDisclosure();

    const {
        isOpen: isDeleteContactRequestAlertModalOpen,
        onOpen: onDeleteContactRequestAlertModalOpen,
        onClose: onDeleteContactRequestAlertModalClose
    } = useDisclosure();

    const [personObjectValue, setPersonObjectValue] = useState(undefined)
    const [objectToDelete, setObjectToDelete] = useState(undefined)

    const [deleteObjectType, setDeleteObjectType] = useState(undefined)
    const [preferredPersons, setPreferredPersons] = useState([])

    const {isOpen: isLoginModalOpen, onOpen: onLoginModalOpen, onClose: onLoginModalClose} = useDisclosure();
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [sortDescriptor, setSortDescriptor] = useState({ column: 'number', direction: 'ascending' })
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
            const result = await getAllPersonsWithContactRequests(setIsLoggedIn);
            setData(result);
        } catch (error) {
            toast.error('Nie udało się pobrać listy osób.');
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

    const renderCell = (person, columnKey) => {
        const cellValue = person[columnKey];
        switch (columnKey) {
            case "number":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "first_name":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "email":
                return (
                    <p className="text-bold text-sm">{cellValue}</p>
                );
            case "email_verified":
                return (
                    <Tooltip
                        showArrow
                        placement="bottom"
                        content={cellValue ? t('email_exists_tip') : t('email_maybe_invalid_tip')}
                    >
                        <Chip className="capitalize" color={cellValue ? "success" : "danger"} size="sm" variant="flat">
                            {cellValue ? t('verified') : t('not_verified')}
                        </Chip>
                    </Tooltip>
                );
            case "preferred_persons":
                return (
                    <p className="text-bold text-sm">{mapPreferredPersons(cellValue)}</p>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="bordered"
                                    className="bg-pink-100 border-pink-200"
                                >
                                    <VerticalDotsIcon className="text-default-300"/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        onClick={() => handleEditPerson(person)}
                                        startContent={<Image src="/edit_person_icon.svg" aria-label="edit-person"/>}
                                    >
                                        Edytuj Osobę
                                    </DropdownItem>
                                        <DropdownItem
                                            key="add-preference"
                                            onClick={() => handleAddContactRequest(person)}
                                            startContent={<Image src="/add_contact_request.svg"
                                                                 aria-label="add-contact-request"/>}
                                            isDisabled={data?.length ===1}
                                        >
                                            Dodaj preferencję
                                        </DropdownItem>
                                </DropdownSection>
                                <DropdownSection>
                                    <DropdownItem
                                        onClick={() => handleDeletePerson(person)}
                                        startContent={<Image src="/delete_person_icon.svg" aria-label="delete-person"/>}
                                    >
                                        Usuń osobę
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => handleDeleteContactRequest(person)}
                                        startContent={<Image src="/delete_contact_request_icon.svg"/>}
                                        aria-label="delete-contact-request"
                                        isDisabled={person?.preferred_persons.length === 0}
                                    >
                                        Usuń preferencję
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    };


    function mapPreferredPersons(preferredPersons) {
        if (preferredPersons == null) return ''
        const strings = preferredPersons.map(number => String(number))
        return strings.join(", ")
    }

    const handleSearchChange = (searchValue) => {
        const lowercaseValue = searchValue.toLowerCase();
        console.log("Filter value:", lowercaseValue);
        setFilterValue(lowercaseValue);
    };

    const filteredData = data && data.filter(item => {
        const nameMatch = item.first_name.toLowerCase().startsWith(filterValue.toLowerCase());
        const numberMatch = String(item.number).startsWith(filterValue);
        return nameMatch || numberMatch;
    });

    const sortedData = filteredData && [...filteredData].sort((a, b) => {
        const { column, direction } = sortDescriptor || {};
        if (!column) return 0;
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

    const pages = sortedData ? Math.max(1, Math.ceil(sortedData.length / rowsPerPage)) : 1;
    const paginatedData = sortedData && sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <NextUIProvider>
            <ErrorBoundary>
                <Layout
                    title={t('app_title')}
                    subtitle={"CRM Speed Dating"}
                    actions={(
                        <>
                            <Button onPress={onPersonModalOpen} className="bg-white text-black shadow border border-pink-300" variant="faded" startContent={<Image src="/add_person_icon.svg/" aria-label="add-person-button"/>}>
                                {t('add_person')}
                            </Button>
                            <Button onPress={onSendEmailsAlertModalOpen} className="bg-white text-black shadow border border-pink-300" variant="faded" startContent={<Image src="/love_letter_mail.svg/" className="w-5 h-5" aria-label="send-emails"/>}>
                                {t('send_letters')}
                            </Button>
                        </>
                    )}
                >
                    <Head>
                        <title>SpeedDatingMatcher</title>
                        <link rel="icon" href="/images/favicon.ico" sizes="any"/>
                    </Head>
                    <ToastContainer position="top-right"/>
                        <SendEmailsAlertModal
                            isSendEmailsAlertModalOpen={isSendEmailsAlertModalOpen}
                            onSendEmailsAlertModalClose={onSendEmailsAlertModalClose}
                        />
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
                            existingPersons={data || []}
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
                    <Card shadow="sm" className="border-pink-300">
                        <CardBody>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Input size="sm" isClearable className="w-full sm:max-w-[30%]" placeholder={t('search_placeholder')} startContent={<SearchIcon/>} value={filterValue} onClear={() => setFilterValue('')} onValueChange={(value) => handleSearchChange(value)} />
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600">Wierszy na stronę:</span>
                                        <select className="border rounded px-2 py-1 text-sm" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(1); }}>
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                        </select>
                                    </div>
                                </div>

                                {data !== null ? (
                                    <Table
                                        className="table-hover h-3/4-screen w-3/4-screen mx-1 "
                                        aria-label="Example table with dynamic content"
                                        color={"default"}
                                        selectionMode="single"
                                        fullWidth
                                        sortDescriptor={sortDescriptor}
                                        onSortChange={setSortDescriptor}
                                    >
                                        <TableHeader columns={columns}>
                                            {(column) =>
                                                <TableColumn
                                                    key={column.key}
                                                    width={400}
                                                    allowsSorting={column.key === 'number' || column.key === 'first_name'}
                                                >
                                                    <p className="text-sm capitalize">{column.label}</p>
                                                </TableColumn>
                                            }
                                        </TableHeader>
                                        <TableBody items={paginatedData}>
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
                                {sortedData && sortedData.length > 0 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs text-gray-600">Wyświetlanie {(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, sortedData.length)} z {sortedData.length}</span>
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="flat" isDisabled={page <= 1} onPress={() => setPage((p) => Math.max(1, p - 1))}>Poprzednia</Button>
                                            <Button size="sm" variant="flat" isDisabled={page >= pages} onPress={() => setPage((p) => Math.min(pages, p + 1))}>Następna</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </Layout>
            </ErrorBoundary>
        </NextUIProvider>
    );
};

export default Home;