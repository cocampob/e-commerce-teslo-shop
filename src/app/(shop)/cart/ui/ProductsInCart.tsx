'use client'

import { ProductImage, QuantitySelector } from '@/components';
import { useCartStore } from '@/store'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const ProductsInCart = () => {
    const updateProductsQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);
    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart);

    useEffect(() => {
        setLoaded(true);
    }, []);


    if (!loaded) {
        return <p>Loading...</p>
    }

    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                        <ProductImage
                            src={product.image}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            alt={product.title}
                            className="mr-5 rounded" />
                        <div>
                            <Link
                                className='hover:underline cursor-pointer'
                                href={`/product/${product.slug}`}>
                                {product.title}
                                <p className='text-blue-600'>{product.size} </p>
                            </Link>
                            <p>${product.price}</p>
                            <QuantitySelector
                                quantity={product.quantity}
                                onQuantityChanged={quantity => updateProductsQuantity(product, quantity)}
                            />

                            <button className="underline mt-3"
                                onClick={() => removeProduct(product)}>
                                {/* <IoTrashOutline size={15}/>  */}
                                Remover
                            </button>
                        </div>
                    </div>

                ))
            }
        </>
    )
}
