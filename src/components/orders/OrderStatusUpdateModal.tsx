import React, { useState } from 'react';
import { Package, Truck } from 'lucide-react';
import { Order } from '../../types/Order';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface OrderStatusUpdateModalProps {
  order: Order;
  onClose: () => void;
  onUpdate: (orderId: string, status: Order['status']) => Promise<void>;
}

const OrderStatusUpdateModal: React.FC<OrderStatusUpdateModalProps> = ({
  order,
  onClose,
  onUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions: { value: Order['status']; label: string; description: string }[] = [
    { value: 'pending', label: 'Pending', description: 'Order received, awaiting confirmation' },
    { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed and being prepared' },
    { value: 'processing', label: 'Processing', description: 'Order is being packed' },
    { value: 'shipped', label: 'Shipped', description: 'Order has been dispatched' },
    { value: 'delivered', label: 'Delivered', description: 'Order has been delivered' },
    { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onUpdate(order.id, selectedStatus);
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Update Order Status">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Order Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Order #{order.id.slice(-8).toUpperCase()}
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Customer: {order.deliveryAddress.fullName}</div>
            <div>Total: ₹{order.totalAmount.toFixed(2)}</div>
            <div>Current Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
          </div>
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            New Status
          </label>
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <label
                key={option.value}
                className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedStatus === option.value
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={selectedStatus === option.value}
                  onChange={(e) => setSelectedStatus(e.target.value as Order['status'])}
                  className="mt-1 text-pink-600 focus:ring-pink-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Tracking Number (for shipped status) */}
        {selectedStatus === 'shipped' && (
          <div>
            <Input
              label="Tracking Number (Optional)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              icon={<Truck className="w-4 h-4" />}
            />
          </div>
        )}

        {/* Order Timeline Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Status Timeline</h4>
          <div className="space-y-2">
            {statusOptions
              .filter(option => {
                const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
                const currentIndex = statusOrder.indexOf(selectedStatus);
                const optionIndex = statusOrder.indexOf(option.value);
                return optionIndex <= currentIndex || option.value === 'cancelled';
              })
              .map((option, index) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    option.value === selectedStatus ? 'bg-pink-600' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    option.value === selectedStatus ? 'text-pink-600 font-medium' : 'text-gray-600'
                  }`}>
                    {option.label}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            className="flex-1"
          >
            Update Status
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderStatusUpdateModal;