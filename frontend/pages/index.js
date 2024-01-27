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
    CircularProgress
} from "@nextui-org/react";

import {deleteRecord, getData} from "./API/api";
import ConfirmationModal from './/components/confirmationModal';
import {DeleteIcon} from './/components/DeleteIcon';
import DeleteConfirmationModal from './/components/confirmationModal';


const Home = () => {
    const [data, setData] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getData();
                console.log('Dane z serwera:', result);
                setData(result);
            } catch (error) {
                console.error('Błąd w komponencie:', error);
            }
        };

        fetchData();
    }, []);


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
            case "preferred_persons":
                return (
                    mapPreferredPersons(cellValue)
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Button isIconOnly color="danger" aria-label="Like" variant="ghost">
                            <DeleteIcon/>
                        </Button>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const handleDeleteClick = (personRequestingContactId, preferredPersonId) => {
        setRecordToDelete({personRequestingContactId, preferredPersonId});
        setShowConfirmation(true);
    };

    function mapPreferredPersons(preferredPersons) {
        console.log(preferredPersons)
        if (preferredPersons == null) return ''
        const strings = preferredPersons.map(number => String(number))
        return strings.join(", ")
    }

    const handleConfirmDelete = async (personIdToDelete) => {
        try {
            const {personRequestingContactId, preferredPersonId} = recordToDelete;
            if (personIdToDelete === preferredPersonId) {
                await deleteRecord(personRequestingContactId, preferredPersonId);
                setData(await getData());
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

    return (
        <NextUIProvider>
            <div className="bg-pink-200 h-screen w-screen">
                <Head>
                    <title>SpeedDatingMatcher</title>
                </Head>
                <div className="mx-10 flex">
                    <Image
                        alt="MailIcon"
                        src="/mail_icon.png"
                    />
                    <h1 className="text-white mt-10 text-xl font-bold">Speed Dating Matcher</h1>
                </div>

                <div className="h-3/4-screen w-3/4-screen mx-0 justify-center items-center">
                    <div className=" ml-10 mb-3">
                        <Button
                            className="bg-white text-black shadow-lg from-pink-500 border-pink-300"
                            variant="faded"
                        >
                            Dodaj nową osobę
                        </Button>
                    </div>
                    <Card
                        shadow="sm"
                        className="mx-10 border-pink-300"
                    >
                        <CardBody>
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
                                                {column.label}
                                            </TableColumn>
                                        }
                                    </TableHeader>
                                    <TableBody items={data}>
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
                                <CircularProgress aria-label="Loading..."/>
                            )}

                        </CardBody>
                    </Card>
                </div>

                <ConfirmationModal
                    show={showConfirmation}
                    onHide={handleCloseConfirmation}
                    onConfirm={handleConfirmDelete}
                />
                <DeleteConfirmationModal
                    show={showConfirmation}
                    onHide={handleCloseConfirmation}
                    onConfirmDelete={handleConfirmDelete}
                />
            </div>
        </NextUIProvider>
    );
};

export default Home;
