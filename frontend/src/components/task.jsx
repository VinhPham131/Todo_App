import React from 'react';
import { HiTrash, HiUser } from 'react-icons/hi';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

export default function Task({ task, users, openModal, comfirmDelete }) {
    const { attributes, setNodeRef, listeners, transform, transition } = useSortable({ 
        id: task._id,
    });

    const style = {
        transition: transition || 'transform 200ms ease',
        transform: CSS.Transform.toString(transform),

    };

    return (
        <div 
            ref={setNodeRef} 
            {...attributes} 
            {...listeners} 
            style={style} 
            key={task._id} 
            className="p-3 rounded-md bg-gray-700 cursor-pointer hover:bg-gray-600 transition-all"
            onClick={() => openModal(task)}
        >
            <div className="flex items-center gap-5 justify-between">
                <h1 className="text-white text-start text-[17px] w-[250px] overflow-hidden">{task.title}</h1>
                <HiTrash className="align-middle text-white cursor-pointer" 
                    onClick={(e) => { e.stopPropagation(); comfirmDelete(task._id); }} 
                />
            </div>
            <div className="flex items-center">
                <HiUser className="mr-2 size-3 text-gray-400" />
                <h1 className="text-gray-400 text-[14px] text-ellipsis overflow-hidden whitespace-nowrap">
                    {users.find(user => user._id === task.assignee)?.username || "Unassigned"}
                </h1>
            </div>
        </div>
    );
};
