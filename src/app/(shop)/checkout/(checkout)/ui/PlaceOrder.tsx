'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { placeOrder } from '@/actions';
import { currencyFormat } from '@/utils';
import { useShallow } from 'zustand/shallow';
import { useAddressStore, useCartStore } from '@/store';
import { useRouter } from 'next/navigation';



export const PlaceOrder = () => {

    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPlaceinOrder, setIsPlaceinOrder] = useState(false);

    const address = useAddressStore(state => state.address);
    
    const { subTotal, tax, total, itemsInCart } = useCartStore(useShallow((state) =>
        state.getsummaryInformation()));

    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);


    useEffect(() => {
        setLoaded(true);
    }, []);

    const onPlaceOrder = async () => {
        setIsPlaceinOrder(true);
        // await sleep(2);

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }));

      //  console.log({address, productsToOrder });



        //! Server Action
        const resp = await placeOrder(productsToOrder, address)
        if (!resp.ok) {
            setIsPlaceinOrder(false);
            setErrorMessage(resp.message);
            return;
        }

        
        //* Todo salio bien en este punto!!
        clearCart();
        router.replace('/orders/' + resp.order?.id);

    }


    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Direccion de entrega</h2>

            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de compra</h2>

            <div className="grid grid-cols-2">

                <span>No. Productos</span>
                <span className="text-right">{itemsInCart === 1 ? '1 articulo' : `${itemsInCart} articulos`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

            </div>
            <div className="mt-5 mb-2 w-full">

                <p className="mb-5">
                    {/* Disclaimer */}
                    <span className="text-xs">
                        Al hacer clic en "Generar compra", usted acepta nuestro <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                    </span>
                </p>

                <p className='text-red-500'>{errorMessage}</p>


                <button
                    // href="/orders/123"
                    onClick={onPlaceOrder}
                    className={
                        clsx({
                            'btn-primary': !isPlaceinOrder,
                            'btn-disabled': isPlaceinOrder
                        })
                    }
                >
                    Generar orden
                </button>
            </div>

        </div>

    )
}
