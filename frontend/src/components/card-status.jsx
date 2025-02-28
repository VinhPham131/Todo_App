import React, { useEffect, useState } from "react";
import { Button, Card, Modal, TextInput, Label, Dropdown, Textarea } from "flowbite-react";
import { HiPlus, HiUser, HiTrash, HiSearch } from "react-icons/hi";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import PopUpConfirmation from "./pop-up-comfirmation";
import SuccessToast from "./success-toast";

export default function CardStatus({ status, tasks, updateTasks }) {

    const taskSchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        assignee: z.string().optional(),
        status: z.string().min(1, "Status is required"),
    }).refine((data) => {
        const statusName = statuses.find(s => s._id === data.status)?.name || data.status;
        if (statusName !== "Todo" && !data.assignee) {
            return false;
        }
        return true;
    }, {
        message: "Assignee is required",
        path: ["assignee"],
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [deletedTask, setDeletedTask] = useState(null);
    const [failMessage, setFailMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");



    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isDirty },
        reset
    } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            assignee: "",
            status: status._id || "",
        }
    });

    useEffect(() => {
        fetchStatuses();
        fetchUsers();
    }, [status]);

    const fetchUsers = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/users");
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/status");
            const data = await response.json();
            setStatuses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    };

    const openModal = (task = null) => {
        setCurrentTask(task);
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                assignee: task.assignee,
                status: task.status,
                failMessage: setFailMessage("")
            });
        } else {
            reset(
                {
                    title: "",
                    description: "",
                    assignee: "",
                    status: status._id,
                    failMessage: setFailMessage(""),
                }
            );
        }
        setIsModalOpen(true);
    };

    const handleAddOrUpdateTask = async (data) => {
        const method = currentTask ? 'PATCH' : 'POST';
        const url = currentTask ? `http://localhost:3000/api/tasks/${currentTask._id}` : 'http://localhost:3000/api/tasks';

        data.assignee = data.assignee?.trim() ? data.assignee : null;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const savedTask = await response.json();
            if (!response.ok) {
                setFailMessage(savedTask.message || `Failed to ${currentTask ? 'update' : 'add'} task`);
                return;
            }

            setIsModalOpen(false);
            setSuccessMessage(`Task ${currentTask ? 'updated' : 'added'} successfully!`);
            updateTasks();

            timeOut();
        } catch (error) {
            console.error(`Error ${currentTask ? 'updating' : 'adding'} task:`, error);
        }
    };


    const handleDeleteTask = async () => {
        if (deletedTask) {
            try {
                const response = await fetch(`http://localhost:3000/api/tasks/${deletedTask}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    setFailMessage('Failed to delete task');
                    return;
                }

                setSuccessMessage("Task deleted successfully!");
                updateTasks();

                timeOut();
            } catch (error) {
                console.error("Error deleting task:", error);
            }

            setIsConfirmationOpen(false);
            setDeletedTask(null);
        }
    };


    const comfirmDelete = (task) => {
        setIsConfirmationOpen(true);
        setDeletedTask(task);
    };

    const timeOut = () => {
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);
    };

    return (
        <div>
            <div className="fixed top-4 right-4 z-50">
                {successMessage && <SuccessToast message={successMessage} />}
            </div>
            <Card className="w-[350px] max-h-screen min-h-32  text-center bg-black">
                <div className="flex justify-center items-center">
                    <h1 className="text-[20px] text-white">{status.name}</h1>
                </div>
                <div className="flex flex-col gap-3 overflow-auto max-h-[650px]">
                    {Array.isArray(tasks) && tasks.map((task) => (
                        <div key={task._id} className=" p-3 rounded-md bg-gray-700 cursor-pointer" onClick={() => openModal(task)}>
                            <div className="flex items-center gap-5 justify-between">
                                <h1 className="text-white text-start text-[17px] w-[250px] overflow-hidden">{task.title}</h1>
                                <HiTrash className="align-middle text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); comfirmDelete(task._id); }} />
                            </div>
                            <div className="flex items-center">
                                <HiUser className="mr-2 size-3" />
                                <h1 className="text-gray-500 text-[14px] text-ellipsis overflow-hidden whitespace-nowrap">
                                    {users.find(user => user._id === task.assignee)?.username || "Unassigned"}
                                </h1>
                            </div>
                        </div>
                    ))}
                </div>
                <Button outline gradientDuoTone="purpleToPink" onClick={() => openModal()}>
                    <HiPlus className="mr-2 mt-[3px]" />
                    Add a task
                </Button>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Modal.Header>{currentTask ? "Update" : 'Add a new task'}</Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(handleAddOrUpdateTask)} className="space-y-4">
                            <div>
                                <Label className="text-black">Task title</Label>
                                <TextInput {...register("title")} placeholder="Title" />
                                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                            </div>
                            <div>
                                <Label className="text-black">Description</Label>
                                <Textarea {...register("description")} placeholder="Task description" rows={4} />
                                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <Label className="text-black">Assignee</Label>
                                    <Dropdown
                                        label={users.find(user => user._id === watch("assignee"))?.username || "Select Assignee"}
                                        size="sm"
                                        className="relative w-[150px]"
                                    >
                                        <div className="max-h-[200px] overflow-auto">
                                            {users.length === 0 ? (
                                                <Dropdown.Item>No users found</Dropdown.Item>
                                            ) : (
                                                users.map(user => (
                                                    <Dropdown.Item
                                                        key={user._id}
                                                        onClick={() => {
                                                            setValue("assignee", user._id, { shouldDirty: true });
                                                            setSearchTerm("");
                                                        }}

                                                    >
                                                        <div className="flex items-center">
                                                            <HiUser className="mr-2" />
                                                            {user.username}
                                                        </div>
                                                    </Dropdown.Item>
                                                ))
                                            )}
                                        </div>
                                    </Dropdown>
                                    {errors.assignee && <p className="text-red-500">{errors.assignee.message}</p>}
                                </div>
                                <div>
                                    <Label className="text-black">Status</Label>
                                    <Dropdown label={statuses.find(status => status._id === watch("status"))?.name || "Select Status"} size="sm">
                                        {Array.isArray(statuses) && statuses.map(status => (
                                            <Dropdown.Item key={status._id} onClick={() => setValue("status", status._id, { shouldDirty: true })}>
                                                {status.name}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown>
                                </div>
                                <p className="text-red-500 mt-4">{failMessage}</p>
                                <div>
                                    <div className="flex justify-end mt-4 gap-5 border-t pt-4">
                                        <Button type="submit" gradientDuoTone="purpleToPink" disabled={!isDirty}>{currentTask ? 'Update Task' : 'Add Task'}</Button>
                                        <Button onClick={() => setIsModalOpen(false)} color="gray">Cancel</Button>                                </div>
                                </div>
                            </div>

                        </form>
                    </Modal.Body>
                </Modal>
                {isConfirmationOpen && (
                    <PopUpConfirmation
                        onConfirm={handleDeleteTask}
                        onCancel={() => setIsConfirmationOpen(false)}
                        title="task"
                    />
                )}
            </Card>
        </div>
    );
}