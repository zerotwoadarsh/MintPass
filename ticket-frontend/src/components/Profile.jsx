import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
// FIX: Switched to a more modern and compatible QR code library
import QRCode from "react-qr-code";

// A Modal component to display the QR Code
const QRCodeModal = ({ ticket, onClose }) => {
    // The data to be encoded in the QR code
    const qrData = JSON.stringify({
        eventId: ticket.id,
        attendeeAddress: ticket.ownerAddress
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-purple-700" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-center mb-4 text-white">{ticket.name}</h3>
                {/* The new library requires a white background for the QR code to be scannable */}
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                    <QRCode value={qrData} size={256} />
                </div>
                <p className="text-center text-gray-400 mt-4 text-xs font-mono">Event ID: {ticket.id}</p>
                <button onClick={onClose} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
                    Close
                </button>
            </div>
        </div>
    );
};


// A small component to display a single ticket item
const TicketItem = ({ ticket, onShowQr }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between border border-gray-700/50">
        <div>
            <p className="font-bold text-purple-300">{ticket.name}</p>
            <p className="text-sm text-gray-400">Event ID: {ticket.id}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="font-bold text-lg text-white">{ticket.balance}</p>
                <p className="text-sm text-gray-400">Ticket(s)</p>
            </div>
            <button onClick={() => onShowQr(ticket)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6.5 6.5l-1.5-1.5M4 12H2m13.5-6.5l1.5-1.5M12 20v-1m6-11a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
        </div>
    </div>
);

const Profile = () => {
    const { contract, account } = useWeb3();
    const [myTickets, setMyTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchMyTickets = useCallback(async () => {
        if (!contract || !account) return;

        setIsLoading(true);
        try {
            const eventCount = await contract.getEventCount();
            const totalEvents = Number(eventCount);
            const ownedTickets = [];

            for (let i = 1; i <= totalEvents; i++) {
                const balance = await contract.balanceOf(account, i);
                const ticketCount = Number(balance);

                if (ticketCount > 0) {
                    const eventInfo = await contract.eventInfo(i);
                    ownedTickets.push({
                        id: Number(eventInfo.eventId),
                        name: eventInfo.name,
                        balance: ticketCount,
                        ownerAddress: account // Add owner address for QR code
                    });
                }
            }
            setMyTickets(ownedTickets);
        } catch (error) {
            console.error("Error fetching user's tickets:", error);
        } finally {
            setIsLoading(false);
        }
    }, [contract, account]);

    useEffect(() => {
        fetchMyTickets();
    }, [fetchMyTickets]);

    return (
        <>
            {selectedTicket && <QRCodeModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">My Profile</h2>
                    <p className="mt-2 text-lg font-mono text-purple-400 break-all">{account}</p>
                </div>

                <div className="mt-10">
                    <h3 className="text-xl font-semibold text-white mb-4">My Tickets</h3>
                    {isLoading ? (
                        <p className="text-center text-gray-400 animate-pulse">Loading your tickets...</p>
                    ) : myTickets.length > 0 ? (
                        <div className="space-y-4">
                            {myTickets.map(ticket => (
                                <TicketItem key={ticket.id} ticket={ticket} onShowQr={setSelectedTicket} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 px-6 bg-gray-800/30 rounded-lg">
                            <h4 className="text-lg font-semibold text-white">No Tickets Found</h4>
                            <p className="text-gray-400 mt-1">You haven't purchased any tickets yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;