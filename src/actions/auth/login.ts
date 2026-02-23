'use server';

import { signIn } from '@/auth.config';
import { sleep } from '@/utils';
import { AuthError } from 'next-auth';

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {

    // await sleep(2);

    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: true,
    },
    );
    // window.location.replace('/');
    // console.log(Object.fromEntries(formData));

    return 'Success';


  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Error en las credenciales';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


export const login = async( email: string, password: string ) => {

  try {
     await signIn('credentials',{ email, password })

     return {ok: true}

  } catch (error) {
    return{
      ok: false,
      message: 'No se pudo iniciar sesión',
    }
  }

}