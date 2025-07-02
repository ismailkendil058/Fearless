
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'new_arrival': 'NEW ARRIVAL',
    'free_shipping': 'Free shipping on orders over DA 5,000',
    
    // Hero
    'hero_title': 'Train Harder. Lift Fearlessly.',
    'hero_subtitle': 'Premium lifting straps designed for serious athletes',
    'shop_now': 'Shop Now',
    
    // Product
    'product_name': 'Fearless Lifting Straps',
    'price': 'DA 3,900.00',
    'new_tag': 'NEW',
    'features_title': 'Features:',
    'feature_1': 'Heavy Duty Material',
    'feature_2': 'Non-slip Grip',
    'feature_3': 'Wrist Support',
    'feature_4': 'Designed in Algeria',
    'trusted_by': 'Trusted by 2000+ Algerian athletes',
    
    // Form
    'order_now': 'Order Now',
    'full_name': 'Full Name',
    'phone_number': 'Phone Number',
    'wilaya': 'Wilaya',
    'select_wilaya': 'Select your wilaya',
    'delivery_method': 'Delivery Method',
    'home_delivery': 'Home Delivery',
    'bureau_delivery': 'Bureau de poste',
    'address': 'Address',
    'coupon_code': 'Coupon Code (Optional)',
    'delivery_fee': 'Delivery Fee',
    'total_price': 'Total Price',
    'place_order': 'Place Order',
    'cod_only': 'Cash on Delivery Only',
    
    // Footer
    'follow_us': 'Follow Us',
    'contact_whatsapp': 'Contact via WhatsApp',
  },
  ar: {
    // Header
    'new_arrival': 'وصول جديد',
    'free_shipping': 'شحن مجاني للطلبات أكثر من 5000 دج',
    
    // Hero
    'hero_title': 'تدرّب بقوة. ارفع بدون خوف.',
    'hero_subtitle': 'أحزمة رفع أثقال مميزة مصممة للرياضيين الجادين',
    'shop_now': 'اشتري الآن',
    
    // Product
    'product_name': 'أحزمة رفع الأثقال فيرليس',
    'price': '3,900.00 دج',
    'new_tag': 'جديد',
    'features_title': 'المميزات:',
    'feature_1': 'خامة قوية',
    'feature_2': 'قبضة مانعة للانزلاق',
    'feature_3': 'حماية للمعصم',
    'feature_4': 'تصميم جزائري',
    'trusted_by': 'موثوق من قبل أكثر من 2000 رياضي جزائري',
    
    // Form
    'order_now': 'اطلب الآن',
    'full_name': 'الاسم الكامل',
    'phone_number': 'رقم الهاتف',
    'wilaya': 'الولاية',
    'select_wilaya': 'اختر ولايتك',
    'delivery_method': 'طريقة التوصيل',
    'home_delivery': 'التوصيل إلى المنزل',
    'bureau_delivery': 'مكتب البريد',
    'address': 'العنوان',
    'coupon_code': 'كود التخفيض (اختياري)',
    'delivery_fee': 'رسوم التوصيل',
    'total_price': 'السعر الإجمالي',
    'place_order': 'تأكيد الطلب',
    'cod_only': 'الدفع عند الاستلام فقط',
    
    // Footer
    'follow_us': 'تابعنا',
    'contact_whatsapp': 'تواصل عبر واتساب',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
