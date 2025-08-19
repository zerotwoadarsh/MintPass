import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { EventCard } from './EventCard';
import { ethers } from 'ethers';

export const EventList = () => {
    const { contract } = useWeb3();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!contract) return;

            try {
                // We need a way to get the total number of events. Let's assume our contract has a function `getEventCount()`.
                // NOTE: Our current contract is missing this. We will add it in the next step.
                // For now, we will use a placeholder.
                const eventCount = 1; // Placeholder
                
                const fetchedEvents = [];
                // Let's assume event IDs start from 1.
                for (let i = 1; i <= eventCount; i++) {
                    const eventData = await contract.eventInfo(i);
                    // The contract returns a struct as an array-like object. We map it to a JS object.
                    fetchedEvents.push({
                        id: Number(eventData.eventId),
                        name: eventData.name,
                        price: ethers.formatEther(eventData.ticketPrice),
                        totalSupply: Number(eventData.totalSupply),
                        ticketsSold: Number(eventData.ticketsSold),
                    });
                }
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
                // This might fail if the contract doesn't have `getEventCount` yet. That's okay for now.
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [contract]);

    if (isLoading) {
        return <p className="text-center text-purple-300 animate-pulse">Loading events from the blockchain...</p>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Upcoming Events</h2>
            {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No events found. Be the first to create one!</p>
            )}
        </div>
    );
};
