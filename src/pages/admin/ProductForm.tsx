import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import { useProducts } from '../../store/ProductContext';
import { Product } from '../../types/Product';
import showToast from '../../components/ui/Toast';
import ImageUploader from '../../components/ui/ImageUploader';

import productSchema from '../../schemas/productSchemas';
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct } from '../../services/api';



interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSave: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { addProduct ,updateProduct } = useProducts();

  const { register, handleSubmit, watch, setValue, getValues, control, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      category: product?.category || "",
      youtubeUrl: product?.youtubeUrl || "",
      inStock: product?.inStock ?? true,
      featured: product?.featured ?? false,
      // skus: product?.skus || [],
      skus: [],
    }
});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skus"
  });

  useEffect(() => {
    console.log('Errors:', errors);
  }, [errors])

  //Submitting and Posting to API 
  const onSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    try {
      if (product) {
        // Update existing product
        await updateProduct(product.id, data);
      } else {
        // Create new product
        console.log('Creating new product with data:', data);
        await addProduct(data);
      }
      onSave();
      onClose();
      
    } catch (error) {
      console.error('Error saving product:', error);
      showToast.error('Failed to save product. Please try again.');
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("category")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Tops">Tops</option>
                <option value="Dresses">Dresses</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>


          {/*Price*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                {...register("price", {valueAsNumber: true})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL (Optional)
              </label>
              <input
                type="url"
                {...register("youtubeUrl")}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* SKUs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKUs *
            </label>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="text"
                    {...register(`skus.${index}.size`)}
                    placeholder="Size (e.g., S, M, L)"
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.skus?.[index]?.size ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="text"
                    {...register(`skus.${index}.color`)}
                    placeholder="Color (e.g., Red, Blue)"
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.skus?.[index]?.color ? 'border-red-500' : ''}`}
                  />
                  <input
                    type="number"
                    {...register(`skus.${index}.stock`, { valueAsNumber: true })}
                    placeholder="Stock"
                    min="0"
                    className={`w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.skus?.[index]?.stock ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ size: '', color: '', stock: 0 })}
                className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors w-1/8 flex items-center"
              >
                <Plus className="w-4 h-4" /> Add SKU
              </button>
            </div>
          </div>

          {/* Images */}
          <ImageUploader control={control} setValue={setValue} name="images" />

          {/* Toggles */}
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("inStock")}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("featured")}
                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-200"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;