'use server';

import { Product } from '@/generated/prisma/client';
import { Gender, Size } from '@/generated/prisma/enums';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');


const productSchema = z.object({
    id: z.uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.enum(Gender),
});


export const createUpdateProduct = async (formData: any) => {

    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(data);

    if (!productParsed.success) {
        console.log(productParsed.error);
        return {
            ok: false
        }
    }
    const product = productParsed.data;
    product.slug = product.slug.toLowerCase().replace(/\s+/g, '-').trim();

    const { id, ...rest } = product;

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            let product: Product;
            const tagsArray = rest.tags.split(',').map((tag) => tag.trim().toLocaleLowerCase());

            if (id) {
                // Actualizar producto existente
                product = await prisma.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray,
                        }
                    }
                });
            } else {
                // Crear nuevo producto
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray,
                        }
                    }
                })
            }
            // Proceso de carga y guardado de imágenes
            // Recorrer las imagenes y gaurdarlas en el sistema de archivos o servicio de almacenamiento
            if (formData.getAll('images')) {
                //[https://url.jpg],[https://url.jpg] arreglo de urls de las imagenes guardadas
                const images = await uploadImages(formData.getAll('images') as File[]);
                if (!images) {
                    throw new Error('Error al subir las imagenes');
                }
                
                await prisma.productImage.createMany({
                    data: images.map( image => ({
                        url: image!,
                        productId: product.id,
                    }))
                })

            }


            return {
                product
            }
        });
        // Todo: RevalidatePaths
        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${product?.slug}`);
        revalidatePath(`/product/${product?.slug}`);

        return {
            ok: true,
            product: prismaTx.product,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: ' Error al guardar el producto en la base de datos '
        }
    }
}


const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = images.map(async (image) => {
            try {

                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(r => r.secure_url);
            } catch (error) {
                console.log(error);
                return null;
            }
        })

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;

    } catch (error) {
        console.log(error);
        return null;

    }
}