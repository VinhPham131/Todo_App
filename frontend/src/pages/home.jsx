import React, { useEffect, useState } from 'react';
import CardStatus from '../components/card-status';
import SideBar from '../components/side-bar';

export default function Home() {
    const [statuses, setStatuses] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchStatuses();
        fetchTasks();
    }, []);

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
            const data = await response.json();
            setTasks(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const refreshTasks = () => {
        fetchTasks();
    }

    return (
        <div className='bg-theme max-h-screen h-screen flex'>
            <div>
                <SideBar className="bg-gray-500"/>
            </div>
            <div className="flex gap-10 p-4 justify-center flex-wrap overflow-y-auto mx-auto">
                {statuses.map((status) => (
                    <CardStatus key={status._id} status={status} tasks={tasks.filter(task => task.status === status._id)} updateTasks={refreshTasks} />
                ))}
            </div>
        </div>
    );
}
