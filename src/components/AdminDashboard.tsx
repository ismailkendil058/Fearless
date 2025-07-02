import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AdminLogin from "./AdminLogin";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import WilayaManager from "./WilayaManager";
import CouponManager from "./CouponManager";

interface Order {
  id: string;
  full_name: string;
  phone: string;
  wilaya: string;
  delivery_method: string;
  address: string;
  coupon_code: string;
  delivery_fee: number;
  discount: number;
  total_price: number;
  created_at: string;
}

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'wilayas' | 'coupons'>('orders');
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    }
    setLoadingOrders(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully",
    });
  };

  const exportOrders = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Phone,Wilaya,Delivery Method,Address,Coupon,Delivery Fee,Discount,Total,Date\n"
      + orders.map(order => 
          `"${order.full_name}","${order.phone}","${order.wilaya}","${order.delivery_method}","${order.address || ''}","${order.coupon_code || ''}",${order.delivery_fee},${order.discount},${order.total_price},"${new Date(order.created_at).toLocaleDateString()}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fearless_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendToGoogleSheets = async () => {
    if (!googleSheetsUrl) {
      toast({
        title: "Error",
        description: "Please enter your Google Sheets webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const ordersData = orders.map(order => ({
        name: order.full_name,
        phone: order.phone,
        wilaya: order.wilaya,
        delivery_method: order.delivery_method,
        address: order.address || '',
        coupon: order.coupon_code || '',
        delivery_fee: order.delivery_fee,
        discount: order.discount,
        total: order.total_price,
        date: new Date(order.created_at).toLocaleDateString()
      }));

      const response = await fetch(googleSheetsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({ orders: ordersData }),
      });

      toast({
        title: "Success",
        description: "Orders sent to Google Sheets successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send orders to Google Sheets",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin onBack={onBack} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="font-cinzel text-2xl font-bold" style={{ fontFamily: 'Old London, serif', fontWeight: 700, letterSpacing: '0.04em' }}>Fearless Admin</h1>
            <div className="flex gap-4">
              <Button onClick={handleSignOut} variant="destructive">
                Sign Out
              </Button>
              <Button onClick={onBack} variant="outline">
                Back to Site
              </Button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mt-4">
            <Button 
              variant={activeTab === 'orders' ? 'default' : 'outline'}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </Button>
            <Button 
              variant={activeTab === 'wilayas' ? 'default' : 'outline'}
              onClick={() => setActiveTab('wilayas')}
            >
              Wilayas & Delivery
            </Button>
            <Button 
              variant={activeTab === 'coupons' ? 'default' : 'outline'}
              onClick={() => setActiveTab('coupons')}
            >
              Coupons
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">DA {orders.reduce((sum, order) => sum + order.total_price, 0).toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">DA {orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + order.total_price, 0) / orders.length).toLocaleString() : 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Coupons Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.filter(order => order.coupon_code).length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Export Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Export Orders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button onClick={exportOrders} className="">
                    Export CSV
                  </Button>
                  <Button onClick={loadOrders} variant="outline" disabled={loadingOrders}>
                    {loadingOrders ? 'Loading...' : 'Refresh Orders'}
                  </Button>
                </div>
                
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">Google Sheets Webhook URL</label>
                    <input
                      type="url"
                      value={googleSheetsUrl}
                      onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/your-script-id/exec"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <Button onClick={sendToGoogleSheets} disabled={!googleSheetsUrl}>
                    Send to Google Sheets
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Wilaya</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Coupon</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.full_name}</TableCell>
                          <TableCell>{order.phone}</TableCell>
                          <TableCell>{order.wilaya}</TableCell>
                          <TableCell className="max-w-xs truncate">{order.address || 'Bureau delivery'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.delivery_method === 'home' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {order.delivery_method === 'home' ? 'Home' : 'Bureau'}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">DA {order.total_price.toLocaleString()}</TableCell>
                          <TableCell>
                            {order.coupon_code && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                {order.coupon_code}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {orders.length === 0 && !loadingOrders && (
                    <div className="text-center py-12 text-gray-500">
                      No orders yet
                    </div>
                  )}
                  
                  {loadingOrders && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading orders...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'wilayas' && <WilayaManager />}
        {activeTab === 'coupons' && <CouponManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
