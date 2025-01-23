/* eslint-disable @next/next/no-img-element */
'use client';

import { cn } from '@/lib/utils';
import { ImagePlusIcon, XIcon } from 'lucide-react';
import * as React from 'react';

interface ImageInputProps {
  urlValue?: string;
  onValueChange: (newUrlValue?: string) => void;
  className?: string;
}

export function ImageInput({
  urlValue,
  onValueChange,
  className,
}: ImageInputProps) {
  const id = React.useId();

  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;

    if (!files || !files.item(0)) return;

    const image = files.item(0);

    if (!image) return;

    setImageFile(image);

    const reader = new FileReader();

    reader.onloadend = () => {
      onValueChange(reader.result as string);
    };

    reader.readAsDataURL(image);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onValueChange('');
    setImageFile(null);
  };

  return (
    <div
      className={cn(
        'bg-muted/80 hover:bg-muted/30 relative size-[60px] overflow-hidden rounded border border-dashed',
        {
          'border-solid': !!urlValue,
        },
        className
      )}
    >
      {(urlValue || imageFile) && (
        <button
          className="absolute right-px top-px z-20 rounded-full bg-gray-500 p-px text-white hover:bg-gray-600"
          aria-label="remove image"
          onClick={handleRemove}
        >
          <XIcon className="size-4" />
        </button>
      )}
      <label
        htmlFor={`image-input-${id}`}
        className="text-muted-foreground flex size-full cursor-pointer items-center justify-center"
      >
        <input
          type="file"
          id={`image-input-${id}`}
          hidden
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleChange}
          ref={inputRef}
          key={imageFile?.name}
        />
        {urlValue ? (
          <img
            src={urlValue}
            alt="preview"
            width="100%"
            height="100%"
            className="block size-full object-contain"
          />
        ) : (
          <ImagePlusIcon size={16} />
        )}
      </label>
    </div>
  );
}
