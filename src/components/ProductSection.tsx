import { useLanguage } from "./LanguageContext";
import ProductImageCarousel from "./ProductImageCarousel";

const ProductSection = () => {
  const { t } = useLanguage();

  return (
    <section id="product-section" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Product Grid */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Product Image Carousel */}
            <div className="w-full md:w-1/2 flex justify-center">
              <ProductImageCarousel />
            </div>
            {/* Product Details */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block bg-black text-white px-3 py-1 text-base font-semibold rounded">NEW</span>
                <span className="flex text-yellow-400 text-lg">{'★'.repeat(5)}</span>
              </div>
              <h3 className="text-4xl font-normal mb-2 text-center md:text-left" style={{ fontFamily: 'Old London, serif' }}>
                Fearless Lifting Straps
              </h3>
              <div className="text-2xl font-semibold text-black mb-2 text-center md:text-left">1800 DA</div>
              <div className="text-base text-gray-700 text-center md:text-left mb-2">
                <span className="font-bold text-lg md:text-xl text-gray-800 block mb-1" style={{ letterSpacing: '0.01em' }}>
                  Trusted by 2000+ Algerian athletes
                </span>
              </div>
              {/* Features */}
              <div className="w-full">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    Heavy Duty Material
                    <span className="font-arabic text-gray-500 ml-2">خامة قوية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    Non-slip Grip
                    <span className="font-arabic text-gray-500 ml-2">قبضة مانعة للانزلاق</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    Wrist Support
                    <span className="font-arabic text-gray-500 ml-2">حماية للمعصم</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                    Designed in Algeria
                    <span className="font-arabic text-gray-500 ml-2">تصميم جزائري</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
