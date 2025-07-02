import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Edit, Trash2, Plus } from "lucide-react";

interface DeliveryFee {
  id: string;
  wilaya: string;
  home_delivery_fee: number;
  bureau_delivery_fee: number;
}

const WilayaManager = () => {
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFee[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWilaya, setNewWilaya] = useState({
    wilaya: '',
    home_delivery_fee: 0,
    bureau_delivery_fee: 0
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDeliveryFees();
  }, []);

  const loadDeliveryFees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('delivery_fees')
        .select('*')
        .order('wilaya');

      if (error) throw error;
      setDeliveryFees(data || []);
    } catch (error) {
      console.error('Error loading delivery fees:', error);
      toast({
        title: "Error",
        description: "Failed to load delivery fees",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEdit = (fee: DeliveryFee) => {
    setEditingId(fee.id);
  };

  const handleSave = async (id: string, homeFee: number, bureauFee: number) => {
    try {
      const { error } = await supabase
        .from('delivery_fees')
        .update({
          home_delivery_fee: homeFee,
          bureau_delivery_fee: bureauFee
        })
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      loadDeliveryFees();
      toast({
        title: "Success",
        description: "Delivery fees updated successfully",
      });
    } catch (error) {
      console.error('Error updating delivery fees:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery fees",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wilaya?')) return;

    try {
      const { error } = await supabase
        .from('delivery_fees')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadDeliveryFees();
      toast({
        title: "Success",
        description: "Wilaya deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting wilaya:', error);
      toast({
        title: "Error",
        description: "Failed to delete wilaya",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async () => {
    if (!newWilaya.wilaya.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wilaya name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('delivery_fees')
        .insert({
          wilaya: newWilaya.wilaya,
          home_delivery_fee: newWilaya.home_delivery_fee,
          bureau_delivery_fee: newWilaya.bureau_delivery_fee
        });

      if (error) throw error;

      setNewWilaya({ wilaya: '', home_delivery_fee: 0, bureau_delivery_fee: 0 });
      setShowAddForm(false);
      loadDeliveryFees();
      toast({
        title: "Success",
        description: "Wilaya added successfully",
      });
    } catch (error) {
      console.error('Error adding wilaya:', error);
      toast({
        title: "Error",
        description: "Failed to add wilaya",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wilaya & Delivery Management</CardTitle>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className=""
        >
          Add Wilaya
        </Button>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h3 className="font-semibold mb-4">Add New Wilaya</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Wilaya Name</label>
                <Input
                  value={newWilaya.wilaya}
                  onChange={(e) => setNewWilaya({...newWilaya, wilaya: e.target.value})}
                  placeholder="e.g., 59 - New Wilaya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Home Delivery Fee (DA)</label>
                <Input
                  type="number"
                  value={newWilaya.home_delivery_fee}
                  onChange={(e) => setNewWilaya({...newWilaya, home_delivery_fee: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bureau Delivery Fee (DA)</label>
                <Input
                  type="number"
                  value={newWilaya.bureau_delivery_fee}
                  onChange={(e) => setNewWilaya({...newWilaya, bureau_delivery_fee: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd}>Add Wilaya</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Wilaya</TableHead>
                <TableHead>Home Delivery (DA)</TableHead>
                <TableHead>Bureau Delivery (DA)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.wilaya}</TableCell>
                  <TableCell>
                    {editingId === fee.id ? (
                      <Input
                        type="number"
                        defaultValue={fee.home_delivery_fee}
                        id={`home-${fee.id}`}
                        className="w-20"
                      />
                    ) : (
                      `DA ${fee.home_delivery_fee}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === fee.id ? (
                      <Input
                        type="number"
                        defaultValue={fee.bureau_delivery_fee}
                        id={`bureau-${fee.id}`}
                        className="w-20"
                      />
                    ) : (
                      `DA ${fee.bureau_delivery_fee}`
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingId === fee.id ? (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              const homeInput = document.getElementById(`home-${fee.id}`) as HTMLInputElement;
                              const bureauInput = document.getElementById(`bureau-${fee.id}`) as HTMLInputElement;
                              handleSave(fee.id, Number(homeInput.value), Number(bureauInput.value));
                            }}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(fee)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(fee.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
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

export default WilayaManager;
