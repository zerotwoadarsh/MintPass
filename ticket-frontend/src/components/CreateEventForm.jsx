
import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const CreateEventForm = () => {
    const { contract, blockExplorerUrl } = useWeb3(); // Get blockExplorerUrl from context
    const [eventName, setEventName] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract) return toast.error("Please connect your wallet first.");
        if (!eventName || !ticketPrice || !totalSupply) return toast.error("Please fill out all fields.");

        setIsSubmitting(true);
        const toastId = toast.loading('Please confirm in your wallet...');

        try {
            const priceInWei = ethers.parseEther(ticketPrice);
            const tx = await contract.createEvent(eventName, priceInWei, Number(totalSupply));
            
            // Provide real-time feedback with a link to the block explorer
            toast.loading(
                (t) => (
                    <span>
                        Transaction sent! Waiting for confirmation...
                        <a href={`${blockExplorerUrl}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline ml-2">
                            View
                        </a>
                    </span>
                ),
                { id: toastId }
            );

            await tx.wait();

            toast.success('Event created successfully!', { id: toastId });
            setEventName('');
            setTicketPrice('');
            setTotalSupply('');
        } catch (err) {
            console.error("Error creating event:", err);
            toast.error(err.reason || "Failed to create event.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-8 shadow-lg border border-gray-700/50 mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Create a New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form inputs remain the same */}
                <div>
                    <label htmlFor="eventName" className="block text-sm font-medium text-purple-300 mb-2">Event Name</label>
                    <input type="text" id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500" placeholder="e.g., Web3 Summit 2025" />
                </div>
                <div>
                    <label htmlFor="ticketPrice" className="block text-sm font-medium text-purple-300 mb-2">Ticket Price (ETH)</label>
                    <input type="number" step="0.001" id="ticketPrice" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500" placeholder="e.g., 0.05" />
                </div>
                <div>
                    <label htmlFor="totalSupply" className="block text-sm font-medium text-purple-300 mb-2">Number of Tickets</label>
                    <input type="number" id="totalSupply" value={totalSupply} onChange={(e) => setTotalSupply(e.target.value)} className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500" placeholder="e.g., 100" />
                </div>
                <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-full shadow-lg disabled:opacity-50">
                        {isSubmitting ? 'Processing...' : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};