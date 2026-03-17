"use client";

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

export const ImageUpload: React.FC = () => {
  const { setValue } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('profilePhoto', file);
      setPreview(URL.createObjectURL(file));
    }
  }, [setValue]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = () => {
    setValue('profilePhoto', null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="shrink-0">
        {preview ? (
          <Image className="h-16 w-16 object-cover rounded-full" src={preview} alt="Profile preview" width={64} height={64} />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <p className="text-sm text-indigo-600 hover:text-indigo-500">Upload Image</p>
      </div>
      {preview && (
        <button type="button" onClick={removeImage} className="text-sm text-red-600 hover:text-red-500">
          Remove
        </button>
      )}
    </div>
  );
};
