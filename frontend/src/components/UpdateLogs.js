import React from "react";

function UpdateLogs({ events, userData, onClose }) {
    // Flatten all update history into a single array
    const allLogs = events.flatMap((event) => {
        if (!event.updateHistory || event.updateHistory.length === 0) return [];

        return event.updateHistory.map((entry) => ({
            ...entry,
            eventName: event.userIds
                .map((id) => {
                    const user = userData.find((u) => u._id === id);
                    return user ? user.Name : "Unknown";
                })
                .join(", "),
            eventId: event._id,
        }));
    });

    // Sort logs by updatedAt (newest first)
    const sortedLogs = allLogs.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Event Update Logs</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {sortedLogs.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No updates recorded yet.
                        </div>
                    ) : (
                        sortedLogs.map((log, index) => (
                            <div
                                key={`${log.eventId}-${index}`}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-semibold text-gray-800">
                                            Event: {log.eventName}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(log.updatedAt).toLocaleString("en-US", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </span>
                                </div>

                                <div className="space-y-1 text-sm">
                                    {Object.entries(log.changes).map(([field, change]) => (
                                        <div key={field} className="text-gray-600">
                                            <span className="font-medium capitalize text-gray-700">
                                                {field.replace(/([A-Z])/g, " $1").trim()}:
                                            </span>{" "}
                                            {field === "userIds" ? (
                                                <>
                                                    <span className="line-through text-red-500">
                                                        {change.old.join(", ")}
                                                    </span>
                                                    {" → "}
                                                    <span className="text-green-600">
                                                        {change.new.join(", ")}
                                                    </span>
                                                </>
                                            ) : field.includes("Date") ? (
                                                <>
                                                    <span className="line-through text-red-500">
                                                        {new Date(change.old).toLocaleString()}
                                                    </span>
                                                    {" → "}
                                                    <span className="text-green-600">
                                                        {new Date(change.new).toLocaleString()}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="line-through text-red-500">
                                                        {change.old}
                                                    </span>
                                                    {" → "}
                                                    <span className="text-green-600">
                                                        {change.new}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default UpdateLogs;
