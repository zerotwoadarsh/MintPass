import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { EventCard } from './EventCard';
import { SkeletonCard } from './SkeletonCard'; // Import the new SkeletonCard
import { ethers } from 'ethers';

export const EventList = () => {
    const { contract } = useWeb3();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        if (!contract) return;

        setIsLoading(true);
        try {
            const eventCount = await contract.getEventCount();
            const totalEvents = Number(eventCount);
            
            const fetchedEvents = [];
            for (let i = 1; i <= totalEvents; i++) {
                const eventData = await contract.eventInfo(i);
                fetchedEvents.push({
                    id: Number(eventData.eventId),
                    name: eventData.name,
                    price: ethers.formatEther(eventData.ticketPrice),
                    totalSupply: Number(eventData.totalSupply),
                    ticketsSold: Number(eventData.ticketsSold),
                });
            }
            setEvents(fetchedEvents.reverse());
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // This is the new loading state UI
    const renderSkeletons = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create an array of 6 items to map over for the skeleton display */}
            {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-black">Upcoming Events</h2>
                <button onClick={fetchEvents} className="text-purple-300 hover:text-white transition p-2 rounded-full hover:bg-gray-700">
                    <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" /></svg>
                </button>
            </div>

            {isLoading ? (
                renderSkeletons()
            ) : events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} onTicketBought={fetchEvents} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-gray-800/30 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">No Events Found</h3>
                    <p className="text-gray-400 mt-2">Be the first to create an event on MintPass!</p>
                </div>
            )}
        </div>
    );
};