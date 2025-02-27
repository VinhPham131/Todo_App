import React, { useEffect, useState } from "react";
import { Button, Card, Modal, TextInput, Label, Dropdown, Textarea } from "flowbite-react";
import { HiPlus, HiUser, HiTrash, HiSearch } from "react-icons/hi";

import PopUpConfirmation from "./pop-up-comfirmation";
import FailToast from "./fail-toast";
import SuccessToast from "./success-toast";

export default function CardStatus({ status }) {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignee, setAssignee] = useState("");
    const [taskStatus, setTaskStatus] = useState(status._id);
    const [users, setUsers] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [search, setSearch] = useState("");
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [deletedTask, setDeletedTask] = useState(null);
    const [failMessage, setFailMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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

    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks?status=${status._id}`);
            const data = await response.json();
            setTasks(Array.isArray(data) ? data.filter(task => task.status === status._id) : []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchStatuses();
        fetchUsers();
    }, [status]);

    const resetForm = () => {
        setCurrentTask(null);
        setTitle("");
        setDescription("");
        setAssignee("");
        setTaskStatus(status._id);
    };

    const openModal = (task = null) => {
        if (task) {
            setCurrentTask(task);
            setTitle(task.title);
            setDescription(task.description);
            setAssignee(task.assignee);
            setTaskStatus(task.status);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const handleAddOrUpdateTask = async () => {
        if (!title || !description || !assignee || !taskStatus) {
            alert("Please fill in all fields");
            return;
        }

        const method = currentTask ? 'PATCH' : 'POST';
        const url = currentTask ? `http://localhost:3000/api/tasks/${currentTask._id}` : 'http://localhost:3000/api/tasks';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description, assignee, status: taskStatus })
            });
            const savedTask = await response.json();
            if (!response.ok) {
                setFailMessage(savedTask.message || `Failed to ${currentTask ? 'update' : 'add'} task`);
                return;
            }
            if (currentTask) {
                setTasks(tasks.map(task => task._id === savedTask._id ? savedTask : task));
            } else {
                setTasks([...tasks, savedTask]);
            }
            resetForm();
            setIsModalOpen(false);
            setSuccessMessage(`Task ${currentTask ? 'updated' : 'added'} successfully!`);
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
                const result = await response.json();
                if (!response.ok) {
                    setFailMessage(result.message || 'Failed to delete task');
                    return;
                }
                setTasks(tasks.filter(task => task._id !== deletedTask));
                setSuccessMessage("Task deleted successfully!");
                timeOut();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
            setIsConfirmationOpen(false);
            setDeletedTask(null);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const comfirmDelete = (task) => {
        setIsConfirmationOpen(true);
        setDeletedTask(task);
    };

    const timeOut = () => {
        setTimeout(() => {
            setFailMessage("");
            setSuccessMessage("");
        }, 2000);
    };

    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <div className="fixed top-4 right-4 z-50">
                {failMessage && <FailToast message={failMessage} />}
                {successMessage && <SuccessToast message={successMessage} />}
            </div>
            <Card className="w-[400px] max-h-screen min-h-32  text-center bg-black">

                <div className="flex justify-center items-center">
                    <h1 className="text-[20px] text-white">{status.name}</h1>
                </div>
                <div className="flex flex-col gap-3 overflow-auto max-h-[650px]">
                    {Array.isArray(tasks) && tasks.map((task) => (
                        <div key={task._id} className="flex p-3 rounded-md bg-gray-700 cursor-pointer" onClick={() => openModal(task)}>
                            <h1 className="text-white text-start">{task.title}</h1>
                            <HiTrash className="ml-auto my-auto align-middle text-white cursor-pointer" onClick={(e) => { e.stopPropagation(); comfirmDelete(task._id); }} />
                        </div>
                    ))}
                </div>
                <Button outline gradientDuoTone="purpleToPink" onClick={() => openModal()}>
                    <HiPlus className="mr-2 mt-[3px]" />
                    Add a task
                </Button>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Modal.Header>{currentTask ? title : 'Add a new task'}</Modal.Header>
                    <Modal.Body>
                        <Label className="text-black">Task title</Label>
                        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
                        <Label className="text-black">Description</Label>
                        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description" rows={4} />
                        <div className="flex flex-col gap-2">
                            <div>
                                <Label className="text-black">Assignee</Label>
                                <div className="flex gap-2">
                                    <TextInput
                                        placeholder="Search..."
                                        rightIcon={HiSearch}
                                        onChange={(e) => handleSearch(e)}
                                        value={search}
                                        className="w-[150px]"
                                    />

                                    <Dropdown label={assignee ? filteredUsers.find(u => u._id === assignee)?.username : "Select Assignee"} size="sm">
                                        {filteredUsers.length === 0 ? (
                                            <Dropdown.Item>
                                                No users found
                                            </Dropdown.Item>
                                        ) :
                                            (filteredUsers.map(user => (
                                                <Dropdown.Item key={user._id} onClick={() => setAssignee(user._id)}>
                                                    <div className="flex items-center">
                                                        <HiUser className="mr-2" />
                                                        {user.username}
                                                    </div>
                                                </Dropdown.Item>
                                            ))
                                            )}

                                    </Dropdown>
                                </div>

                            </div>
                            <div>
                                <Label className="text-black">Status</Label>
                                <Dropdown label={statuses.find(s => s._id === taskStatus)?.name || taskStatus} size="sm">
                                    {Array.isArray(statuses) && statuses.map(status => (
                                        <Dropdown.Item key={status._id} onClick={() => setTaskStatus(status._id)}>
                                            {status.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleAddOrUpdateTask} gradientDuoTone="purpleToPink">{currentTask ? 'Update Task' : 'Add Task'}</Button>
                        <Button onClick={() => setIsModalOpen(false)} color="gray">Cancel</Button>
                    </Modal.Footer>
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