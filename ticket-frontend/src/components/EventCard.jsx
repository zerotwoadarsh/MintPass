import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

export const EventCard = ({ event, onTicketBought }) => {
  const { contract, blockExplorerUrl } = useWeb3(); // Get blockExplorerUrl from context
  const [isBuying, setIsBuying] = useState(false);

  const handleBuyTicket = async () => {
    if (!contract) return toast.error("Please connect your wallet first.");
    
    setIsBuying(true);
    const toastId = toast.loading('Please confirm in your wallet...');
    
    try {
      const priceInWei = ethers.parseEther(event.price);
      const tx = await contract.buyTickets(event.id, 1, { value: priceInWei });
      
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
      
      toast.success(`Ticket for ${event.name} bought!`, { id: toastId });
      if (onTicketBought) onTicketBought();

    } catch (error) {
      console.error("Error buying ticket:", error);
      toast.error(error.reason || "Failed to buy ticket.", { id: toastId });
    } finally {
      setIsBuying(false);
    }
  };

  const ticketsLeft = event.totalSupply - event.ticketsSold;

  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300 border border-gray-700/50 flex flex-col">
      <img className="w-full h-48 object-cover" src={`https://placehold.co/600x400/1a1a2e/c8b6ff?text=${event.name.replace(/\s/g,'+')}`} alt={event.name} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 text-purple-300">{event.name}</h3>
        <p className="text-gray-400 text-base mb-4">
          {ticketsLeft} / {event.totalSupply} tickets remaining
        </p>
        <div className="flex items-center justify-between mt-auto pt-4">
          <p className="text-lg font-semibold text-white">{event.price} ETH</p>
          <button 
            onClick={handleBuyTicket} 
            disabled={isBuying || ticketsLeft === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isBuying ? 'Processing...' : (ticketsLeft === 0 ? 'Sold Out' : 'Buy Ticket')}
          </button>
        </div>
      </div>
    </div>
  );
};