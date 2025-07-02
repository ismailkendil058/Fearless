import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface WilayaFee {
  wilaya: string;
  home_delivery_fee: number;
  bureau_delivery_fee: number;
}

const PRODUCT_PRICE = 1800;

const PurchaseForm = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [address, setAddress] = useState('');
  const [coupon, setCoupon] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'home' | 'bureau'>('home');
  const [discount, setDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wilayaFees, setWilayaFees] = useState<WilayaFee[]>([]);
  const [selectedWilayaFee, setSelectedWilayaFee] = useState<WilayaFee | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchWilayaFees = async () => {
      const { data, error } = await supabase
        .from('delivery_fees')
        .select('wilaya, home_delivery_fee, bureau_delivery_fee');

      if (error) {
        console.error('Error fetching wilaya fees:', error);
        return;
      }

      setWilayaFees(data || []);
    };

    fetchWilayaFees();
  }, []);

  useEffect(() => {
    const selectedWilaya = wilayaFees.find((fee) => fee.wilaya === wilaya);
    setSelectedWilayaFee(selectedWilaya || null);
  }, [wilaya, wilayaFees]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!wilaya.trim()) newErrors.wilaya = 'Wilaya is required.';
    if (deliveryMethod === 'home' && !address.trim()) newErrors.address = 'Full address is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);

    try {
      // Calculate effective subtotal after discount
      const subtotal = PRODUCT_PRICE * quantity - discount;
      // Calculate delivery fees with free shipping logic
      let effectiveBureauFee = selectedWilayaFee ? selectedWilayaFee.bureau_delivery_fee : 0;
      let effectiveHomeFee = selectedWilayaFee ? selectedWilayaFee.home_delivery_fee : 0;
      if (subtotal >= 3000 && selectedWilayaFee) {
        effectiveBureauFee = 0;
        effectiveHomeFee = selectedWilayaFee.home_delivery_fee - selectedWilayaFee.bureau_delivery_fee;
        if (effectiveHomeFee < 0) effectiveHomeFee = 0;
      }

      // Calculate final total
      const selectedFee = deliveryMethod === 'home' ? effectiveHomeFee : effectiveBureauFee;
      const finalTotal = PRODUCT_PRICE * quantity + selectedFee;

      // Insert order into database
      const { error } = await supabase
        .from('orders')
        .insert({
          full_name: fullName,
          phone: phone,
          wilaya: wilaya,
          delivery_method: deliveryMethod,
          address: deliveryMethod === 'home' ? address : null,
          coupon_code: coupon || null,
          delivery_fee: selectedFee,
          discount: discount,
          total_price: finalTotal,
          quantity: quantity
        });

      if (error) {
        console.error('Error saving order:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
        return;
      }

      // Show success message
      toast({
        title: "تم الطلب بنجاح! 🎉",
        description: "سيتم التواصل معك قريباً لتأكيد الطلب",
      });

      // Reset form
      setFullName('');
      setPhone('');
      setWilaya('');
      setAddress('');
      setCoupon('');
      setDeliveryMethod('home');
      setDiscount(0);
      setQuantity(1);

      window.location.href = '/admin';

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate effective subtotal after discount
  const subtotal = PRODUCT_PRICE * quantity - discount;
  // Calculate delivery fees with free shipping logic
  let effectiveBureauFee = selectedWilayaFee ? selectedWilayaFee.bureau_delivery_fee : 0;
  let effectiveHomeFee = selectedWilayaFee ? selectedWilayaFee.home_delivery_fee : 0;
  if (subtotal >= 3000 && selectedWilayaFee) {
    effectiveBureauFee = 0;
    effectiveHomeFee = selectedWilayaFee.home_delivery_fee - selectedWilayaFee.bureau_delivery_fee;
    if (effectiveHomeFee < 0) effectiveHomeFee = 0;
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 py-8 pb-0">
      <form onSubmit={handleSubmit} className={`w-full max-w-lg bg-white/90 rounded-2xl shadow-2xl shadow-blue-100 p-4 sm:p-8 border border-gray-200 ${t('order_now') === 'اطلب الآن' ? 'font-arabic' : ''} mb-0`}> 
        <h2 className="text-4xl mb-2 text-center text-gray-900" style={{ fontFamily: 'Old London, serif' }}>Order</h2>
        <p className="text-center text-gray-500 mb-8 font-inter">Take yours now</p>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-1">
              Full Name <span className="font-arabic text-base">| الاسم الكامل</span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="e.g. Mohamed Ahmed"
              className={`border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 focus:border-black transition shadow-sm focus:shadow-lg`}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-1">
              Phone Number <span className="font-arabic text-base">| رقم الهاتف</span>
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="e.g. 0555 12 34 56"
              className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 focus:border-black transition shadow-sm focus:shadow-lg`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="wilaya" className="block text-gray-700 text-sm font-semibold mb-1">
              Wilaya <span className="font-arabic text-base">| الولاية</span>
            </label>
            <select
              id="wilaya"
              className={`border ${errors.wilaya ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 focus:border-black transition shadow-sm focus:shadow-lg bg-white`}
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              required
            >
              <option value="">Select Wilaya</option>
              {wilayaFees.map((fee) => (
                <option key={fee.wilaya} value={fee.wilaya}>{fee.wilaya}</option>
              ))}
            </select>
            {errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya}</p>}
          </div>
          <div>
            <label htmlFor="deliveryMethod" className="block text-gray-700 text-sm font-semibold mb-1">
              Delivery Method <span className="font-arabic text-base">| طريقة التوصيل</span>
            </label>
            <select
              id="deliveryMethod"
              className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 focus:border-black transition shadow-sm focus:shadow-lg bg-white"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value as 'home' | 'bureau')}
              required
            >
              <option value="home">
                Home Delivery{selectedWilayaFee ? ` (${effectiveHomeFee.toLocaleString()} DA)` : ''}
              </option>
              <option value="bureau">
                Bureau de poste{selectedWilayaFee ? ` (${effectiveBureauFee.toLocaleString()} DA)` : ''}
              </option>
            </select>
          </div>
          {deliveryMethod === 'home' && (
            <div>
              <label htmlFor="address" className="block text-gray-700 text-sm font-semibold mb-1">
                Address <span className="font-arabic text-base">| العنوان</span>
              </label>
              <input
                type="text"
                id="address"
                placeholder="e.g. 123 Main St"
                className={`border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 focus:border-black transition shadow-sm focus:shadow-lg`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="coupon" className="block text-gray-700 text-sm font-semibold mb-1">
            Coupon Code (optional) <span className="font-arabic text-base">| كود التخفيض</span>
          </label>
          <input
            type="text"
            id="coupon"
            placeholder="e.g. SAVE20"
            className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 focus:border-black transition shadow-sm focus:shadow-lg"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-semibold mb-1">
            Number of Straps
          </label>
          <select
            id="quantity"
            className={`border rounded-lg w-full py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 focus:border-black transition shadow-sm focus:shadow-lg bg-white`}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          >
            {[1,2,3,4,5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Summary Section */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 flex flex-col gap-2 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span>Product price</span>
            <span>{(PRODUCT_PRICE * quantity).toLocaleString()} DA</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery fee</span>
            <span>{deliveryMethod === 'home' ? effectiveHomeFee.toLocaleString() : effectiveBureauFee.toLocaleString()} DA</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total price</span>
            <span>{((PRODUCT_PRICE * quantity) + (deliveryMethod === 'home' ? effectiveHomeFee : effectiveBureauFee)).toLocaleString()} DA</span>
          </div>
        </div>

        <button
          type="submit"
          className="min-w-[160px] max-w-[220px] w-full md:w-[200px] bg-black hover:bg-gray-900 text-white font-normal py-2 px-3 rounded-md transition-transform duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-60 text-base mb-2 transform hover:scale-105 mx-auto block"
          disabled={isSubmitting}
        >
          <span style={{ fontFamily: 'Old London, serif', fontSize: '1.1rem', letterSpacing: '0.05em', textShadow: '0 1px 4px rgba(0,0,0,0.12)', fontWeight: 400 }}>
            {isSubmitting ? t('sending_label') || 'Sending...' : 'Purchase'}
          </span>
        </button>
        <div className="text-center mt-2">
          <span className="inline-block bg-black text-white px-4 py-2 rounded-full font-semibold text-sm mt-2 font-arabic">الدفع عند الاستلام فقط</span>
        </div>
        <div className="text-center mt-2">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm mt-2">
            ✅ 100% Satisfaction or your money back
          </span>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;
