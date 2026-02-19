import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, bookingAPI, menuAPI, testimonialAPI } from '../api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { 
  LogOut, ShoppingBag, Calendar, Star, Menu as MenuIcon,
  DollarSign, Users, TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    pendingTestimonials: 0
  });
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem('is_admin');
    if (!isAdmin || isAdmin === 'false') {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [ordersRes, bookingsRes, menuRes] = await Promise.all([
        orderAPI.getAll(),
        bookingAPI.getAll(),
        menuAPI.getCategories()
      ]);

      setOrders(ordersRes.data);
      setBookings(bookingsRes.data);
      setMenuCategories(menuRes.data);

      // Calculate stats
      const totalRevenue = ordersRes.data
        .filter(o => o.payment_status === 'completed')
        .reduce((sum, o) => sum + o.total_amount, 0);
      
      const pendingBookings = bookingsRes.data.filter(b => b.status === 'pending').length;

      setStats({
        totalOrders: ordersRes.data.length,
        totalRevenue,
        pendingBookings,
        pendingTestimonials: 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('is_admin');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingAPI.updateStatus(bookingId, newStatus);
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Indian Spices Restaurant</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Menu Items
              </CardTitle>
              <MenuIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {menuCategories.reduce((sum, cat) => sum + cat.items.length, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No orders yet</p>
                  ) : (
                    orders.slice(0, 10).map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{order.order_number}</p>
                            <p className="text-sm text-gray-600">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-600">₹{order.total_amount}</p>
                            <p className="text-sm text-gray-500">{order.items.length} items</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Badge className={getStatusColor(order.order_status)}>
                            {order.order_status}
                          </Badge>
                          <Badge className={getStatusColor(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleOrderStatusUpdate(order.id, 'preparing')}
                            disabled={order.order_status !== 'received'}
                          >
                            Start Preparing
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                            disabled={order.order_status !== 'preparing'}
                          >
                            Mark Ready
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}
                            disabled={order.order_status !== 'ready'}
                          >
                            Delivered
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Table Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings yet</p>
                  ) : (
                    bookings.slice(0, 10).map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{booking.name}</p>
                            <p className="text-sm text-gray-600">{booking.email}</p>
                            <p className="text-sm text-gray-500">{booking.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{booking.date}</p>
                            <p className="text-sm text-gray-500">{booking.time}</p>
                            <p className="text-sm text-gray-500">{booking.guests} guests</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                            disabled={booking.status !== 'pending'}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <CardTitle>Menu Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {menuCategories.map((category) => (
                    <div key={category.id}>
                      <h3 className="text-lg font-semibold mb-3">{category.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.items.map((item) => (
                          <div key={item.id} className="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">₹{item.price}</p>
                            </div>
                            <Badge variant={item.available ? 'default' : 'destructive'}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
