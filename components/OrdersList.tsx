'use client';

import { useState, useEffect } from 'react';
import { Order } from '../types';

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError('Failed to fetch orders. Please try reconnecting your eBay account.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found in your eBay account
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.orderId} className="p-4 border rounded hover:shadow-md transition-shadow duration-200">
          <h3 className="font-semibold text-lg">{order.title}</h3>
          <div className="mt-2 text-sm text-gray-600">
            <p>Order ID: {order.orderId}</p>
            <p>Status: {order.status}</p>
            <p>Date: {order.createdDate}</p>
            <p>Total: {order.total.value} {order.total.currency}</p>
          </div>
        </div>
      ))}
    </div>
  );
}