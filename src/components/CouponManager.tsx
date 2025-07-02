
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Edit, Trash2, Plus, ToggleLeft, ToggleRight } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  discount_amount: number;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
}

const CouponManager = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_percentage: 0,
    discount_amount: 0,
    usage_limit: null as number | null,
    expires_at: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      loadCoupons();
      toast({
        title: "Success",
        description: `Coupon ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating coupon status:', error);
      toast({
        title: "Error",
        description: "Failed to update coupon status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadCoupons();
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async () => {
    if (!newCoupon.code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('coupons')
        .insert({
          code: newCoupon.code.toUpperCase(),
          discount_percentage: newCoupon.discount_percentage,
          discount_amount: newCoupon.discount_amount,
          usage_limit: newCoupon.usage_limit,
          expires_at: newCoupon.expires_at || null
        });

      if (error) throw error;

      setNewCoupon({ code: '', discount_percentage: 0, discount_amount: 0, usage_limit: null, expires_at: '' });
      setShowAddForm(false);
      loadCoupons();
      toast({
        title: "Success",
        description: "Coupon added successfully",
      });
    } catch (error) {
      console.error('Error adding coupon:', error);
      toast({
        title: "Error",
        description: "Failed to add coupon",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>🎟️ Coupon Management</CardTitle>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="font-semibold mb-4">Add New Coupon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <Input
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g., SAVE20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Discount Percentage (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newCoupon.discount_percentage}
                  onChange={(e) => setNewCoupon({...newCoupon, discount_percentage: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fixed Discount Amount (DA)</label>
                <Input
                  type="number"
                  min="0"
                  value={newCoupon.discount_amount}
                  onChange={(e) => setNewCoupon({...newCoupon, discount_amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Usage Limit (optional)</label>
                <Input
                  type="number"
                  min="1"
                  value={newCoupon.usage_limit || ''}
                  onChange={(e) => setNewCoupon({...newCoupon, usage_limit: e.target.value ? Number(e.target.value) : null})}
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expires At (optional)</label>
                <Input
                  type="date"
                  value={newCoupon.expires_at}
                  onChange={(e) => setNewCoupon({...newCoupon, expires_at: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd}>Add Coupon</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discount_percentage > 0 && `${coupon.discount_percentage}%`}
                    {coupon.discount_amount > 0 && `DA ${coupon.discount_amount}`}
                  </TableCell>
                  <TableCell>
                    {coupon.used_count} / {coupon.usage_limit || '∞'}
                  </TableCell>
                  <TableCell>{formatDate(coupon.expires_at)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                      className={coupon.is_active ? 'text-green-600' : 'text-red-600'}
                    >
                      {coupon.is_active ? (
                        <><ToggleRight className="w-4 h-4 mr-1" /> Active</>
                      ) : (
                        <><ToggleLeft className="w-4 h-4 mr-1" /> Inactive</>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(coupon.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CouponManager;
