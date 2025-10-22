
import React from 'react';
import type { Outfit } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { RefreshIcon } from './icons/RefreshIcon';

interface OutfitCardProps {
  outfit: Outfit;
  onUseAsSource: (imageUrl: string, title: string) => void;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onUseAsSource }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = outfit.imageUrl;
    const fileName = `virtual-stylist-${outfit.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUseAsSourceClick = () => {
    onUseAsSource(outfit.imageUrl, outfit.title);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={outfit.imageUrl}
          alt={`AI-generated ${outfit.title} outfit`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center space-x-4">
          <button
            onClick={handleDownload}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 delay-100"
            title="Download Image"
            aria-label="Download Image"
          >
            <DownloadIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleUseAsSourceClick}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 delay-200"
            title="Use as New Source"
            aria-label="Use as New Source"
          >
            <RefreshIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 text-center">{outfit.title}</h3>
      </div>
    </div>
  );
};
