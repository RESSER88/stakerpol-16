
import { Product } from '@/types';
import { Language } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';

interface LiftHeightBadgeProps {
  product: Product;
  language: Language;
}

const LiftHeightBadge = ({ product, language }: LiftHeightBadgeProps) => {
  const t = useTranslation(language);
  
  // Only render if liftHeight exists and is not empty
  if (!product.specs.liftHeight || product.specs.liftHeight.trim() === '') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in">
      <div className="bg-stakerpol-navy text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-stakerpol-navy/90 transition-colors duration-200">
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-75">{t('liftHeight')}:</span>
          <span className="font-semibold">{product.specs.liftHeight}</span>
        </div>
      </div>
    </div>
  );
};

export default LiftHeightBadge;
