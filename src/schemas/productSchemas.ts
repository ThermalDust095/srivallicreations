import { z } from "zod";
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  youtubeUrl: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),
  inStock: z.boolean(),
  featured: z.boolean(),
  // images: z
  // .instanceof(FileList)
  // .refine((val) => val.length > 0, "At least one image is required")
  // .refine((files) => Array.from(files).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Only JPEG, PNG, GIF, and WebP images are allowed")
  // .transform((files) => Array.from(files))
  // .nullable(),
  images: z.array(z.instanceof(File))
    .nonempty("At least one image is required")
    .refine(files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 
            "Only JPEG, PNG, GIF, and WebP images are allowed"),
  skus: z.array(
    z.object({
      size: z.string().min(1, "Size is required"),
      color: z.string().min(1, "Color is required"),
      stock: z.number().min(0, "Stock cannot be negative"),
    })
  ).nonempty("At least one SKU is required"),
});

export default productSchema;