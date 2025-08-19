import React from 'react';

export const EventCard = ({ event }) => {
  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300 border border-gray-700/50 flex flex-col">
      <img className="w-full h-48 object-cover" src={`https://placehold.co/600x400/1a1a2e/c8b6ff?text=${event.name.replace(/\s/g,'+')}`} alt={event.name} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 text-purple-300">{event.name}</h3>
        <p className="text-gray-400 text-base mb-4">
          {Number(event.ticketsSold)} / {Number(event.totalSupply)} tickets sold
        </p>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-lg font-semibold text-white">{event.price} ETH</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
