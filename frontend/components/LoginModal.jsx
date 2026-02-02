import React, {useEffect, useState} from "react";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {Field, Form, Formik} from "formik";
import {getToken} from "../API/api";

export default function LoginModal({isLoginModalOpen, onLoginModalClose, fetchDataFunction, setIsLoggedIn}) {
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setErrorMessage(undefined)
    }, [isLoginModalOpen]);

    const handleSubmit = async (values, {resetForm}) => {
        try {
            const data = await getToken(values);
            const { access } = data || {};
            if (!access) {
                setErrorMessage("Niepoprawne dane, spróbuj ponownie");
                return;
            }
            window.sessionStorage.setItem('access_token', `Bearer ${access}`);
            setIsLoggedIn(true);
            fetchDataFunction();
            onLoginModalClose();
            resetForm();
        } catch (error) {
            console.log(error)
            setErrorMessage("Wystąpił błąd logowania. Spróbuj ponownie.");
        }
    };

    return (<>
        <Modal isOpen={isLoginModalOpen} placement="top-center" backdrop="blur" hideCloseButton={true}>
            <ModalContent>
                <Formik
                    initialValues={{username: '', password: ''}}
                    onSubmit={handleSubmit}
                >
                    {({errors, touched, values}) => (<Form>
                            <ModalHeader
                                className="flex flex-col gap-1">Zaloguj się</ModalHeader>
                            <ModalBody>
                                <Field
                                    name="username"
                                    validate={(value) => !value ? "Pole jest wymagane" : ""}>
                                    {({field}) => (<Input
                                        {...field}
                                        value={values.username}
                                        autoFocus
                                        label="Nazwa użytkownika"
                                        variant="bordered"
                                        isRequired={true}
                                    />)}
                                </Field>
                                <Field
                                    name="password"
                                    validate={(value) => !value ? "Pole jest wymagane" : ""}
                                >
                                    {({field}) => (<Input
                                        {...field}
                                        value={values.password}
                                        label="Hasło"
                                        variant="bordered"
                                        isRequired={true}
                                        type="password"
                                    />)}
                                </Field>
                                {errorMessage && (<p style={{color: "red"}}>{errorMessage}</p>)}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="bg-green-200"
                                    type="submit">
                                    Zaloguj się
                                </Button>
                            </ModalFooter>
                        </Form>

                    )}
                </Formik>
            </ModalContent>
        </Modal>
    </>);
}
