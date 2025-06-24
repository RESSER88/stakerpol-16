import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { Language } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';
import ExpandableText from '@/components/ui/ExpandableText';

interface ModernSpecificationsTableProps {
  product: Product;
  language: Language;
}

const ModernSpecificationsTable = ({ product, language }: ModernSpecificationsTableProps) => {
  const [showExtended, setShowExtended] = useState(false);
  const t = useTranslation(language);

  const handleToggleSpecs = () => {
    const newShowExtended = !showExtended;
    setShowExtended(newShowExtended);
    
    // Auto-scroll to top when expanding specifications
    if (newShowExtended) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Main specifications (always visible)
  const mainSpecs = [
    { label: t('model'), value: product.model },
    { label: t('serialNumber'), value: product.specs.serialNumber },
    { label: t('productionYear'), value: product.specs.productionYear },
    { label: t('mastLiftingCapacity'), value: product.specs.mastLiftingCapacity },
    { label: t('preliminaryLiftingCapacity'), value: product.specs.preliminaryLiftingCapacity },
    { label: t('workingHours'), value: product.specs.workingHours },
    { label: t('liftHeight'), value: product.specs.liftHeight },
    { label: t('minHeight'), value: product.specs.minHeight },
    { label: t('preliminaryLifting'), value: product.specs.preliminaryLifting },
    { label: t('battery'), value: product.specs.battery },
    { label: t('condition'), value: product.specs.condition }
  ].filter(spec => spec.value && spec.value.trim() !== '');

  // Extended specifications (collapsible)
  const extendedSpecs = [
    { label: t('driveType'), value: product.specs.driveType },
    { label: t('mast'), value: product.specs.mast },
    { label: t('freeStroke'), value: product.specs.freeStroke },
    { label: t('dimensions'), value: product.specs.dimensions },
    { label: t('wheels'), value: product.specs.wheels },
    { label: t('operatorPlatform'), value: product.specs.operatorPlatform },
    { label: t('additionalOptions'), value: product.specs.additionalOptions }
  ].filter(spec => spec.value && spec.value.trim() !== '');

  const hasExtendedSpecs = extendedSpecs.length > 0 || (product.specs.additionalDescription && product.specs.additionalDescription.trim() !== '');

  const moreSpecsText = {
    pl: 'Więcej specyfikacji',
    en: 'More specifications',
    cs: 'Více specifikací',
    sk: 'Viac špecifikácií',
    de: 'Weitere Spezifikationen'
  };

  const hideSpecsText = {
    pl: 'Ukryj dodatkowe specyfikacje',
    en: 'Hide additional specifications',
    cs: 'Skrýt další specifikace',
    sk: 'Skryť ďalšie špecifikácie',
    de: 'Zusätzliche Spezifikationen ausblenden'
  };

  return (
    <div className="space-y-6">
      {/* Main Specifications */}
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {mainSpecs.map((spec, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:justify-between p-4 hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-700 sm:w-1/2">{spec.label}</span>
                <span className="text-gray-900 mt-1 sm:mt-0 sm:text-right sm:w-1/2">{spec.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Extended Specifications Toggle */}
      {hasExtendedSpecs && (
        <>
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleToggleSpecs}
              className="flex items-center gap-2 text-stakerpol-navy border-stakerpol-navy hover:bg-stakerpol-navy hover:text-white transition-all duration-300"
            >
              {showExtended ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  {hideSpecsText[language] || hideSpecsText.pl}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  {moreSpecsText[language] || moreSpecsText.pl}
                </>
              )}
            </Button>
          </div>

          {/* Extended Specifications Content */}
          {showExtended && (
            <div className="animate-fade-in space-y-4">
              {extendedSpecs.length > 0 && (
                <Card className="shadow-sm border border-gray-200">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {extendedSpecs.map((spec, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:justify-between p-4 hover:bg-gray-50 transition-colors">
                          <span className="font-medium text-gray-700 sm:w-1/2">{spec.label}</span>
                          <span className="text-gray-900 mt-1 sm:mt-0 sm:text-right sm:w-1/2">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Description */}
              {product.specs.additionalDescription && product.specs.additionalDescription.trim() !== '' && (
                <Card className="shadow-sm border border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-700 mb-3">{t('additionalDescription')}</h4>
                    <ExpandableText 
                      text={product.specs.additionalDescription}
                      className="text-gray-600 leading-relaxed whitespace-pre-wrap"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModernSpecificationsTable;
