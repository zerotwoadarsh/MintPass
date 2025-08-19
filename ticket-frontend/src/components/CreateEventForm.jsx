import React from 'react';

export const CreateEventForm = () => {
    // We will add state and submission logic later
    return (
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-8 shadow-lg border border-gray-700/50">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Create a New Event</h2>
            <form className="space-y-6">
                <div>
                    <label htmlFor="eventName" className="block text-sm font-medium text-purple-300 mb-2">Event Name</label>
                    <input type="text" id="eventName" className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" placeholder="e.g., Stellar Sound Fest" />
                </div>
                <div>
                    <label htmlFor="ticketPrice" className="block text-sm font-medium text-purple-300 mb-2">Ticket Price (ETH)</label>
                    <input type="number" step="0.01" id="ticketPrice" className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" placeholder="e.g., 0.1" />
                </div>
                <div>
                    <label htmlFor="totalSupply" className="block text-sm font-medium text-purple-300 mb-2">Number of Tickets</label>
                    <input type="number" id="totalSupply" className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition" placeholder="e.g., 100" />
                </div>
                <div className="pt-4">
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
};