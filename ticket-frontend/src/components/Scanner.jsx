
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

export const Scanner = () => {
    const { contract, account, blockExplorerUrl } = useWeb3(); // Get blockExplorerUrl
    const [eventId, setEventId] = useState('');
    const [attendeeAddress, setAttendeeAddress] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    
    // ... (useEffect for scanner is unchanged)
    useEffect(() => {
        if (!isScanning) return;
        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        const onScanSuccess = (decodedText) => {
            try {
                const data = JSON.parse(decodedText);
                if (data.eventId && data.attendeeAddress) {
                    setEventId(data.eventId);
                    setAttendeeAddress(data.attendeeAddress);
                    toast.success("QR Code scanned successfully!");
                    scanner.clear();
                    setIsScanning(false);
                } else {
                   toast.error("Invalid QR Code format.");
                }
            } catch (e) {
                toast.error("Failed to parse QR Code.");
            }
        };
        scanner.render(onScanSuccess, () => {});
        return () => { if (scanner) scanner.clear().catch(err => console.error("Scanner clear failed", err)); };
    }, [isScanning]);


    const handleRedeem = async (e) => {
        e.preventDefault();
        if (!contract) return toast.error("Please connect your wallet.");
        if (!eventId || !attendeeAddress) return toast.error("Please fill out all fields.");

        setIsVerifying(true);
        const toastId = toast.loading('Please confirm in your wallet...');

        try {
            const SCANNER_ROLE = await contract.SCANNER_ROLE();
            const hasRole = await contract.hasRole(SCANNER_ROLE, account);
            if (!hasRole) throw new Error("Your account does not have SCANNER_ROLE.");

            const tx = await contract.redeemTicket(eventId, attendeeAddress);
            toast.loading(
                (t) => (
                    <span>
                        Redeeming on blockchain...
                        <a href={`${blockExplorerUrl}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline ml-2">
                            View
                        </a>
                    </span>
                ),
                { id: toastId }
            );
            await tx.wait();
            
            toast.success('Ticket redeemed successfully!', { id: toastId });
            setEventId('');
            setAttendeeAddress('');
        } catch (err) {
            console.error("Error redeeming ticket:", err);
            toast.error(err.reason || err.message || "Failed to redeem ticket.", { id: toastId });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-8 shadow-lg border border-gray-700/50 mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Ticket Scanner</h2>
            {/* ... (rest of the JSX is the same) */}
            {isScanning ? (
                <div>
                    <div id="qr-reader" style={{ width: '100%' }}></div>
                    <button onClick={() => setIsScanning(false)} className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                        Cancel Scan
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsScanning(true)} className="w-full mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2">
                    <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6.5 6.5l-1.5-1.5M4 12H2m13.5-6.5l1.5-1.5M12 20v-1m6-11a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Scan QR Code
                </button>
            )}
            <form onSubmit={handleRedeem} className="space-y-6">
                <div>
                    <label htmlFor="eventId" className="block text-sm font-medium text-purple-300 mb-2">Event ID</label>
                    <input type="number" id="eventId" value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500" placeholder="e.g., 1" />
                </div>
                <div>
                    <label htmlFor="attendeeAddress" className="block text-sm font-medium text-purple-300 mb-2">Attendee Wallet Address</label>
                    <input type="text" id="attendeeAddress" value={attendeeAddress} onChange={(e) => setAttendeeAddress(e.target.value)} className="w-full bg-gray-700 text-white rounded-md p-3 border border-gray-600 focus:ring-2 focus:ring-purple-500" placeholder="0x..." />
                </div>
                <div className="pt-4">
                    <button type="submit" disabled={isVerifying} className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-full shadow-lg disabled:opacity-50">
                        {isVerifying ? 'Verifying...' : 'Verify & Redeem Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
};