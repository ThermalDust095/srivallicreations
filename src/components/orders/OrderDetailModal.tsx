import React from 'react';
import { X, Package, MapPin, CreditCard, Clock, Truck } from 'lucide-react';
import { Order } from '../../types/Order';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  isAdmin?: boolean;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  order, 
  onClose, 
  isAdmin = false 
}) => {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
        return 'info';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg" title="Order Details">
      <div className="space-y-6">
        {/* Order Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusVariant(order.status)} className="flex items-center space-x-1">
            {getStatusIcon(order.status)}
            <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </Badge>
        </div>

        {/* Order Items */}
        <Card>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-pink-600" />
            Order Items
          </h4>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{item.productName}</h5>
                  <div className="text-sm text-gray-600 space-x-4">
                    <span>Size: {item.size}</span>
                    <span>Color: {item.color}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">₹{item.subtotal.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card>
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-pink-600" />
            Delivery Address
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="font-medium text-gray-900">{order.deliveryAddress.fullName}</div>
              <div className="text-sm text-gray-600">{order.deliveryAddress.phoneNumber}</div>
              <div className="text-sm text-gray-600">
                {order.deliveryAddress.addressLine1}
                {order.deliveryAddress.addressLine2 && (
                  <><br />{order.deliveryAddress.addressLine2}</>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
              </div>
              <div className="text-sm text-gray-600">{order.deliveryAddress.country}</div>
            </div>
          </div>
        </Card>

        {/* Payment & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-pink-600" />
              Payment Information
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-pink-600" />
              Delivery Information
            </h4>
            <div className="space-y-2">
              {order.estimatedDelivery && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="font-mono text-sm">{order.trackingNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-sm">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h4>
            <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{order.notes}</p>
          </Card>
        )}

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OrderDetailModal;