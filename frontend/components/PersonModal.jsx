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
                                        onPersonModalClose
                                    }) {
    const validateEmail = (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) ? setInvalidEmail(false) : setInvalidEmail(true);

    const [invalidNumber, setInvalidNumber] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    function handleClose() {
        setPersonObject(undefined)
        onPersonModalClose()
    }

    useEffect(() => {
        setErrorMessage(undefined)
    }, [isPersonModalOpen]);

    const handleSubmit = async (values, {resetForm}) => {
        if (mode === "add") {
            try {
                const responseData = await createPerson(values);
                if (responseData["non_field_errors"]) {
                    const errorString = responseData["non_field_errors"].join("\n");
                    if (errorString.includes("EMAIL_MUST_BE_UNIQUE")) {
                        toast.warning('Osoba o tym adresie email już istnieje!')
                    }
                } if (responseData["number"]) {
                     const errorString = responseData["number"].join("\n");
                    if (errorString.includes("person with this number already exists.")) {
                        toast.warning('Osoba o tym numerze już istnieje!')
                    }
                } else {
                    toast.success('Osoba dodana!');
                    fetchDataOnClose()
                    onPersonModalClose();
                    resetForm();
                    setPersonObject(undefined)

                }
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const responseData = await editPerson(values, personObject.number);
                if (responseData["non_field_errors"]) {
                    const errorString = responseData["non_field_errors"].join("\n");
                    if (errorString.includes("email must make a unique set")) {
                        toast.warning('Osoba o tym adresie email już istnieje!')
                    }
                } else {
                    fetchDataOnClose()
                    onPersonModalClose();
                    resetForm();
                    setPersonObject(undefined)
                }

            } catch (error) {
                console.log(error)
            }
        }

    };

    return (
        <>
            <Modal isOpen={isPersonModalOpen} onClose={handleClose} placement="top-center">
                <ModalContent>
                    <Formik
                        initialValues={mode === "add" ?
                            {number: undefined, first_name: "", email: ""}
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
                                        validate={(value) => !isNaN(value) && Number.isInteger(Number(value)) ? setInvalidNumber(false) : setInvalidNumber(true)}
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
                                                errorMessage={invalidNumber ? "Numer musi być liczbą" : undefined}
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
                                                errorMessage={invalidEmail ? "Niepoprawny format e-mail" : undefined}
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
