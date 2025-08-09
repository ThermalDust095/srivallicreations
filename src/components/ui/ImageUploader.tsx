import React, { useState, useEffect } from "react";
import { Controller, FieldValues, UseFormSetValue, Path } from "react-hook-form";
import { X } from "lucide-react";

interface ImageUploaderProps<T extends FieldValues = any> {
  control: any;
  setValue: UseFormSetValue<T>;
  name: Path<T>;
}

const ImageUploader = <T extends FieldValues = any>({
  control,
  setValue,
  name,
}: ImageUploaderProps<T>) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  // Keep previewUrls in sync with files
  useEffect(() => {
    if (!files.length) {
      setPreviewUrls([]);
      return;
    }
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[] as File[]}
      render={({ field }) => {
        // Sync local files state with field value
        useEffect(() => {
          setFiles(field.value || []);
        }, [field.value]);

        const removeImage = (index: number) => {
          const newFiles = (field.value || []).filter((_: any, i: number) => i !== index);
          setValue(name, newFiles, { shouldValidate: true });
          field.onChange(newFiles);
        };

        const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFiles = e.target.files;
          if (!selectedFiles) return;
          const newFiles = Array.from(selectedFiles);
          const combinedFiles = [...(field.value || []), ...newFiles];
          setValue(name, combinedFiles, { shouldValidate: true });
          field.onChange(combinedFiles);
          e.target.value = ""; // reset input
        };

        return (
          <>
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG, GIF, or WebP (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={onFilesChange}
              />
            </label>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt={`preview-${i}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/200x200?text=Invalid+Image";
                      }}
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(i)}
                      aria-label={`Remove image ${i + 1}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      }}
    />
  );
};

export default ImageUploader;
