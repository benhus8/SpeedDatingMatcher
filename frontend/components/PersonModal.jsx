import React, {useEffect, useState} from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input
} from "@nextui-org/react";
import {Formik, Form, Field} from "formik";
import {createPerson, editPerson} from "../API/api";
import { toast } from 'react-toastify';

export default function PersonModal({
                                        mode,
                                        personObject,
                                        setPersonObject,
                                        fetchDataOnClose,
                                        isPersonModalOpen,
                                        onPersonModalClose,
                                        existingPersons = []
                                    }) {
    const [existingNumbersSet, setExistingNumbersSet] = useState(new Set());
    const [existingEmailsSet, setExistingEmailsSet] = useState(new Set());
    const [invalidNumber, setInvalidNumber] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [numberErrorMessage, setNumberErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const validateEmail = (value) => {
        const isValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
        if (!isValid) {
            setInvalidEmail(true);
            setEmailErrorMessage("Niepoprawny format e-mail");
        } else {
            setInvalidEmail(false);
            setEmailErrorMessage("");
            const normalized = String(value || '').trim().toLowerCase();
            if (existingEmailsSet.has(normalized)) {
                setInvalidEmail(true);
                setEmailErrorMessage('Osoba o tym adresie email już istnieje!');
            }
        }
    };

    function handleClose() {
        setPersonObject(undefined)
        onPersonModalClose()
    }

    useEffect(() => {
        setErrorMessage(undefined)
    }, [isPersonModalOpen]);

    // Build lookup sets for existing persons to validate duplicates client-side
    useEffect(() => {
        const personsArr = Array.isArray(existingPersons) ? existingPersons : [];
        const numbers = new Set(personsArr.map(p => String(p.number)));
        const emails = new Set(personsArr.map(p => String(p.email || '').trim().toLowerCase()));
        // Exclude current person's own values in edit mode
        if (mode === 'edit' && personObject) {
            numbers.delete(String(personObject.number));
            emails.delete(String((personObject.email || '').trim().toLowerCase()));
        }
        setExistingNumbersSet(numbers);
        setExistingEmailsSet(emails);
    }, [existingPersons, mode, personObject]);

    const handleSubmit = async (values, {resetForm}) => {
        // Normalize number to string to avoid NaN issues
        const payload = {
            ...values,
            number: values.number,
        };
        // Client-side duplicate checks before API call
        const normalizedNumber = String(values.number);
        const normalizedEmail = String(values.email || '').trim().toLowerCase();
        let hasClientDuplicate = false;
        if (existingNumbersSet.has(normalizedNumber)) {
            setInvalidNumber(true);
            setNumberErrorMessage('Osoba o tym numerze już istnieje!');
            toast.warning('Osoba o tym numerze już istnieje!');
            hasClientDuplicate = true;
        }
        if (existingEmailsSet.has(normalizedEmail)) {
            setInvalidEmail(true);
            setEmailErrorMessage('Osoba o tym adresie email już istnieje!');
            toast.warning('Osoba o tym adresie email już istnieje!');
            hasClientDuplicate = true;
        }
        if (hasClientDuplicate) {
            return; // Do not call API if duplicates exist locally
        }
        if (mode === "add") {
            try {
                await createPerson(payload);
                toast.success('Osoba dodana!');
                fetchDataOnClose();
                onPersonModalClose();
                resetForm();
                setPersonObject(undefined);
            } catch (error) {
                const data = error?.data || {};
                if (data.number) {
                    setInvalidNumber(true);
                    setNumberErrorMessage('Osoba o tym numerze już istnieje!');
                    toast.warning('Osoba o tym numerze już istnieje!');
                }
                if (data.email) {
                    setInvalidEmail(true);
                    setEmailErrorMessage('Osoba o tym adresie email już istnieje!');
                    toast.warning('Osoba o tym adresie email już istnieje!');
                }
                if (Array.isArray(data.non_field_errors) && data.non_field_errors.includes('EMAIL_MUST_BE_UNIQUE')) {
                    setInvalidEmail(true);
                    setEmailErrorMessage('Osoba o tym adresie email już istnieje!');
                    toast.warning('Osoba o tym adresie email już istnieje!');
                }
                if (!data.number && !data.email && !(Array.isArray(data.non_field_errors) && data.non_field_errors.includes('EMAIL_MUST_BE_UNIQUE'))) {
                    setErrorMessage('Nie udało się dodać osoby.');
                }
                console.log(error);
            }
        } else {
            try {
                await editPerson(payload, personObject.number);
                toast.success('Zmiany zapisane!');
                fetchDataOnClose();
                onPersonModalClose();
                resetForm();
                setPersonObject(undefined);
            } catch (error) {
                const data = error?.data || {};
                if (data.email) {
                    setInvalidEmail(true);
                    setEmailErrorMessage('Osoba o tym adresie email już istnieje!');
                    toast.warning('Osoba o tym adresie email już istnieje!');
                }
                if (Array.isArray(data.non_field_errors) && data.non_field_errors.includes('EMAIL_MUST_BE_UNIQUE')) {
                    setInvalidEmail(true);
                    setEmailErrorMessage('Osoba o tym adresie email już istnieje!');
                    toast.warning('Osoba o tym adresie email już istnieje!');
                }
                if (!data.email && !(Array.isArray(data.non_field_errors) && data.non_field_errors.includes('EMAIL_MUST_BE_UNIQUE'))) {
                    setErrorMessage('Nie udało się zapisać zmian.');
                }
                console.log(error);
            }
        }
    };

    return (
        <>
            <Modal isOpen={isPersonModalOpen} onClose={handleClose} placement="top-center">
                <ModalContent>
                    <Formik
                        initialValues={mode === "add" ?
                            {number: '', first_name: '', email: ''}
                            : personObject}
                        onSubmit={handleSubmit}
                    >
                        {({errors, touched, values}) => (
                            <Form>
                                <ModalHeader
                                    className="flex flex-col gap-1">{mode === "add" ? 'Dodaj' : 'Edytuj'} osobę</ModalHeader>
                                <ModalBody>
                                    <Field
                                        name="number"
                                        validate={(value) => {
                                            const valid = !isNaN(value) && Number.isInteger(Number(value));
                                            if (!valid) {
                                                setInvalidNumber(true);
                                                setNumberErrorMessage("Numer musi być liczbą");
                                            } else {
                                                setInvalidNumber(false);
                                                setNumberErrorMessage("");
                                                const normalized = String(value);
                                                if (existingNumbersSet.has(normalized)) {
                                                    setInvalidNumber(true);
                                                    setNumberErrorMessage('Osoba o tym numerze już istnieje!');
                                                }
                                            }
                                        }}
                                    >
                                        {({field}) => (
                                            <Input
                                                {...field}
                                                value={values.number}
                                                autoFocus
                                                label="Numer"
                                                placeholder="Wprowadź numer"
                                                variant="bordered"
                                                isDisabled={mode === "edit"}
                                                isInvalid={invalidNumber}
                                                errorMessage={invalidNumber ? numberErrorMessage : undefined}
                                            />
                                        )}
                                    </Field>
                                    <Field
                                        name="first_name"
                                        validate={(value) => value ? "" : "Pole jest wymagane"}
                                    >
                                        {({field}) => (
                                            <Input
                                                {...field}
                                                value={values.first_name}
                                                label="Imię"
                                                placeholder="Wprowadź imię"
                                                variant="bordered"

                                            />
                                        )}
                                    </Field>
                                    <Field
                                        name="email"
                                        validate={validateEmail}
                                    >
                                        {({field}) => (
                                            <Input
                                                {...field}
                                                value={values.email}
                                                label="E-mail"
                                                placeholder="Wprowadź e-mail"
                                                variant="bordered"
                                                isInvalid={invalidEmail}
                                                errorMessage={invalidEmail ? emailErrorMessage : undefined}
                                            />
                                        )}
                                    </Field>
                                    {errorMessage && (
                                        <p style={{color: "red"}}>{errorMessage}</p>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="flat" onPress={handleClose}>
                                        Anuluj
                                    </Button>
                                    <Button
                                        className="bg-green-200"
                                        isDisabled={invalidNumber || invalidEmail}
                                        type="submit">
                                        {mode === "add" ? 'Dodaj' : 'Zapisz'}
                                    </Button>
                                </ModalFooter>
                            </Form>

                        )}
                    </Formik>
                </ModalContent>
            </Modal>
        </>
    );
}
