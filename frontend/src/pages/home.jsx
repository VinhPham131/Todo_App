import React, { useEffect, useState } from 'react';
import CardStatus from '../components/card-status';

export default function Home() {
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/status');
                const data = await response.json();
                setStatuses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching statuses:', error);
            }
        };
        fetchStatuses();
    }, []);

    return (
        <div className="bg-theme max-h-screen h-screen flex gap-10 p-4 justify-center items-start">
            {statuses.map((status) => (
                <CardStatus key={status._id} status={status} />
            ))}
        </div>
    );
}
