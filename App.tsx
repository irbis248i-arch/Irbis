
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { OutfitCard } from './components/OutfitCard';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { generateOutfit } from './services/geminiService';
import type { Outfit, OutfitStyle } from './types';

const App: React.FC = () => {
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File) => {
    setSourceImageFile(file);
    if (sourceImageUrl) {
        URL.revokeObjectURL(sourceImageUrl);
    }
    setSourceImageUrl(URL.createObjectURL(file));
    setGeneratedOutfits([]);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!sourceImageFile) return;

    setIsLoading(true);
    setGeneratedOutfits([]);
    setError(null);

    const styles: OutfitStyle[] = ['Casual', 'Business', 'Night Out'];

    try {
      const outfitPromises = styles.map(style =>
        generateOutfit(sourceImageFile, style).then(imageUrl => ({
          title: style,
          imageUrl,
        }))
      );

      const results = await Promise.all(outfitPromises);
      setGeneratedOutfits(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [sourceImageFile]);

  const handleUseAsSource = useCallback(async (dataUrl: string, title: string) => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const fileName = `used-as-source-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      const newFile = new File([blob], fileName, { type: blob.type });

      handleImageChange(newFile);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to use image as source: ${errorMessage}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 font-sans text-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Virtual Stylist AI
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Stuck on what to wear? Upload an item and let AI create the perfect outfit for any occasion.
          </p>
        </header>

        <main className="flex flex-col items-center space-y-8">
          <ImageUploader 
            onImageChange={handleImageChange}
            imagePreviewUrl={sourceImageUrl}
          />

          {sourceImageFile && (
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <SparklesIcon className="w-6 h-6 mr-3" />
              {isLoading ? 'Generating...' : 'Generate Outfits'}
            </button>
          )}

          <div className="w-full max-w-5xl">
            {isLoading && <Loader />}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">Oops! Something went wrong.</p>
                <p>{error}</p>
              </div>
            )}
            {generatedOutfits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 animate-fade-in">
                {generatedOutfits.map((outfit) => (
                  <OutfitCard 
                    key={outfit.title} 
                    outfit={outfit} 
                    onUseAsSource={handleUseAsSource}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500">
          <p>Powered by Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
