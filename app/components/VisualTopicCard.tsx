import React from "react";

const VisualTopicCard = ({ id, name }: { id: string; name: string }) => {
    return (
        <div className="flex justify-between items-center px-5 py-4">
            <div className="text-black font-medium">{name}</div>

            <button className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition hover:cursor-pointer">
                Create
            </button>
        </div>
    );
};

export default VisualTopicCard;