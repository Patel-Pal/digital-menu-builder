import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, X } from 'lucide-react';
import { useOrder } from '@/contexts/OrderContext';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
}

export function OrderModal({ isOpen, onClose, shopId }: OrderModalProps) {
  const { cart, updateQuantity, removeFromCart, getTotalAmount, clearCart, deviceId, customerName, setCustomerName } = useOrder();
  const [tableNumber, setTableNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!tableNumber.trim()) {
      toast.error('Please enter table number');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        shopId,
        customerName: customerName.trim(),
        tableNumber: tableNumber.trim(),
        orderNotes: orderNotes.trim(),
        deviceId,
        items: cart.map(item => ({
          menuItemId: item.menuItem._id,
          quantity: item.quantity
        }))
      };

      await orderService.createOrder(orderData);
      
      toast.success('Order placed successfully! Please wait for confirmation.');
      clearCart();
      onClose();
      setTableNumber('');
      setOrderNotes('');
    } catch (error: any) {
      console.error('Order submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Your Order</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Details */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="customerName">Your Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="orderNotes">Special Instructions (Optional)</Label>
              <Textarea
                id="orderNotes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Any special requests or notes..."
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold">Order Summary</h3>
            {cart.map((item) => (
              <Card key={item.menuItem._id} className="border-0 bg-muted/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.menuItem.image ? (
                        <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">🍽️</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.menuItem.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.menuItem.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.menuItem._id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>${getTotalAmount().toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitOrder} 
              disabled={isSubmitting || cart.length === 0}
              className="flex-1"
            >
              {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
