'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { authenticate } from '@/actions';
import { useSearchParams } from 'next/navigation';
import { IoAlertOutline } from 'react-icons/io5';
import { useFormStatus } from 'react-dom';
import clsx from 'clsx';


export const LoginForm = () => {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const [errorMessage, formAction, state] = useActionState(
        authenticate,
        undefined,
    );
    

    //Todo: Recargar inicio de sesion
    

    // useEffect(() => {
    //     if (state ===  true) {
    //         window.location.replace('/')
    //     }
    // }, [state])

//  console.log(state);






    return (
        <form action={formAction} className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="email"
                name='email' />


            <label htmlFor="password">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="password"
                name='password'
            />


            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <IoAlertOutline className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>



            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <LoginButton />


            {/* divisor line */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

        </form>
    )
}


function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type='submit'
            className={clsx({
                "btn-primary": !pending,
                "btn-disabled": pending
            })}
            disabled={pending}
        >
            Ingresar
        </button>
    )
}