'use client';

import { useState } from 'react';

export default function ConnectButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/url');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting to eBay:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
    >
      {isLoading ? 'Connecting...' : 'Connect eBay'}
    </button>
  );
}