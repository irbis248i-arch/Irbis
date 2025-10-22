
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageChange: (file: File) => void;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <div
        className={`relative w-full aspect-square border-2 border-dashed rounded-2xl flex items-center justify-center text-center transition-all duration-300 cursor-pointer group ${
          imagePreviewUrl ? 'border-pink-300 hover:border-pink-400' : 'border-gray-300 hover:border-pink-400 bg-gray-100'
        }`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {imagePreviewUrl ? (
          <>
            <img src={imagePreviewUrl} alt="Item preview" className="w-full h-full object-contain rounded-2xl p-2" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-2xl flex items-center justify-center transition-all duration-300">
               <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Change Item</p>
            </div>
          </>
        ) : (
          <div className="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-400">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};
