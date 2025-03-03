import React, { useEffect, useState } from 'react';
import CardStatus from '../components/card-status';
import SideBar from '../components/side-bar';
import { DndContext, closestCorners, useSensors, useSensor, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

import Task from '../components/task';
import FailToast from '../components/fail-toast';
import SuccessToast from '../components/success-toast';

export default function Home() {
    const [statuses, setStatuses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [failMessage, setFailMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchStatuses();
        fetchTasks();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (failMessage || successMessage) {
            const timer = setTimeout(() => {
                setFailMessage("");
                setSuccessMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [failMessage, successMessage]);

    const fetchStatuses = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/status');
            const data = await response.json();
            setStatuses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching statuses:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            let data = await response.json();

            if (Array.isArray(data)) {
                const storedOrder = JSON.parse(localStorage.getItem("taskOrder"));
                if (storedOrder) {
                    data.sort((a, b) => storedOrder.indexOf(a._id) - storedOrder.indexOf(b._id));
                }
                setTasks(data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };


    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const refreshTasks = () => {
        fetchTasks();
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const getTaskPositionVertical = (id) => tasks.findIndex((task) => task._id === id);

    const handleDragStart = (event) => {
        const { active } = event;
        const draggedTask = tasks.find(task => task._id === active.id);
        setActiveTask(draggedTask);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const draggedTask = tasks.find(task => task._id === active.id);
        const overContainer = statuses.find(status => status._id === over.id) || tasks.find(task => task._id === over.id)?.status;

        if (!draggedTask || !overContainer) return;

        const newStatus = typeof overContainer === "string" ? overContainer : overContainer._id;

        if (draggedTask.assignee === null) {
            setFailMessage("Task must be assigned to a user");
            console.log(failMessage);
            return;
        }
        if (draggedTask.status !== newStatus) {
            setTasks(tasks.map(task =>
                task._id === active.id ? { ...task, status: newStatus } : task
            ));
            try {
                const result = await fetch(`http://localhost:3000/api/tasks/${active.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                if(result.ok) {
                    setSuccessMessage("Task updated successfully");
                }
            } catch (error) {
                console.error("Error updating task status:", error);
            }
        } else {
            const oldIndex = getTaskPositionVertical(active.id);
            const newIndex = getTaskPositionVertical(over.id);
            const newTasks = arrayMove(tasks, oldIndex, newIndex);
            setTasks(newTasks);

            const newOrder = newTasks.map(task => task._id);
            localStorage.setItem("taskOrder", JSON.stringify(newOrder));
        }
    };
    return (
        <div className='bg-theme h-screen flex'>
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-4">
                {failMessage && <FailToast message={failMessage}/>}
                {successMessage && <SuccessToast message={successMessage}/>}
            </div>
            <div>
                <SideBar className="bg-gray-500" />
            </div>
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <div className='flex mx-auto gap-5 p-5'>
                    {statuses.map((status) => (
                        <SortableContext
                            key={status._id}
                            items={tasks.filter(task => task.status === status._id).map(task => task._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <CardStatus status={status} tasks={tasks.filter(task => task.status === status._id)} updateTasks={refreshTasks} />
                        </SortableContext>
                    ))}
                </div>
                <DragOverlay>
                    {activeTask && <Task task={activeTask} users={users} />}
                </DragOverlay>
            </DndContext>
        </div>
    );
}