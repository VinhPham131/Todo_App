import React, { useState, useEffect } from 'react';
import { Label, TextInput, Button, Dropdown } from 'flowbite-react';
import { Modal as FlowbiteModal } from 'flowbite-react';

export default function Modal({ isOpen, onClose, onSubmit, userData, title, buttonLabel }) {
    const [user, setUser] = useState(userData || {
        username: "",
        email: "",
        fullname: "",
        sex: "",
        yearOfBirth: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(user);
        if (!userData) {
            setUser({
                username: "",
                email: "",
                fullname: "",
                sex: "",
                yearOfBirth: ""
            });
        }
    }

    useEffect(() => {
        if (userData) {
            setUser(userData);
        }
    }, [userData]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUser({ ...user, [id]: value });
    }

    const handleDropdownChange = (value) => {
        setUser({ ...user, sex: value });
    }

    return (
        <FlowbiteModal show={isOpen} onClose={onClose}>
            <FlowbiteModal.Header>{title}</FlowbiteModal.Header>
            <FlowbiteModal.Body>
                <form onSubmit={handleSubmit}>
                    <Label htmlFor="username">Username</Label>
                    <TextInput id="username" value={user.username} onChange={handleChange} required readOnly={!!userData} />
                    <Label htmlFor="email">Email</Label>
                    <TextInput id="email" value={user.email} onChange={handleChange} required />
                    <Label hrmlFor="fullname">Full Name</Label>
                    <TextInput id="fullname" value={user.fullname} onChange={handleChange} required />
                    <Label htmlFor="sex">Sex</Label>
                    <Dropdown label={user.sex || "Sex"}>
                        <Dropdown.Item onClick={() => handleDropdownChange("Male")}>Male</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDropdownChange("Female")}>Female</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDropdownChange("Others")}>Others</Dropdown.Item>
                    </Dropdown>
                    <Label htmlFor="yearOfBirth">Year of Birth</Label>
                    <TextInput id="yearOfBirth" value={user.yearOfBirth} onChange={handleChange} required />
                    <div className="flex justify-end mt-4">
                        <Button type="submit" gradientMonochrome="pink">{buttonLabel}</Button>
                    </div>
                </form>
            </FlowbiteModal.Body>
        </FlowbiteModal>
    )
}