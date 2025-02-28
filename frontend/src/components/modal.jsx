import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label, TextInput, Button, Dropdown } from 'flowbite-react';
import { Modal as FlowbiteModal } from 'flowbite-react';

const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    fullname: z.string().min(3, "Full name must be at least 3 characters"),
    sex: z.enum(["Male", "Female", "Others"], "Sex is required"),
    yearOfBirth: z.coerce.number().int().min(1900, "Invalid Year of Birth ").max(new Date().getFullYear(), "Invalid Year of Birth"),
});

export default function Modal({ isOpen, onClose, onSubmit, userData, title, buttonLabel, error }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isDirty },
        reset
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            username: "",
            email: "",
            fullname: "",
            sex: "",
            yearOfBirth: "",
        }
    });
    useEffect(() => {
        if (userData) {
            reset(userData);
        } else {
            reset({
                username: "",
                email: "",
                fullname: "",
                sex: "",
                yearOfBirth: "",
            });
        }
    }, [userData, reset]);

    return (
        <FlowbiteModal show={isOpen} onClose={onClose}>
            <FlowbiteModal.Header>{title}</FlowbiteModal.Header>
            <FlowbiteModal.Body>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <TextInput id="username" {...register("username")} readOnly={!!userData} />
                        {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <TextInput id="email" {...register("email")} />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="fullname">Full Name</Label>
                        <TextInput id="fullname" {...register("fullname")} />
                        {errors.fullname && <p className="text-red-500">{errors.fullname.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="sex">Sex</Label>
                        <Dropdown label={watch("sex") || "Select Sex"}>
                            {["Male", "Female", "Others"].map((option) => (
                                <Dropdown.Item key={option} onClick={() => setValue("sex", option, { shouldDirty: true })}>
                                    {option}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                        {errors.sex && <p className="text-red-500">{errors.sex.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="yearOfBirth">Year of Birth</Label>
                        <TextInput id="yearOfBirth" type="number" {...register("yearOfBirth")} />
                        {errors.yearOfBirth && <p className="text-red-500">{errors.yearOfBirth.message}</p>}
                    </div>
                    <p className="text-red-500 mt-4">{error}</p>
                    <div className="flex justify-end mt-4">
                        <Button type="submit" gradientMonochrome="pink" disabled={!isDirty}>{buttonLabel}</Button>
                    </div>
                </form>
            </FlowbiteModal.Body>
        </FlowbiteModal>
    );
}