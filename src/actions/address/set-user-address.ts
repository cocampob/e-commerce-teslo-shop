'use server';

import { Address } from '@/interfaces';
import prisma from '@/lib/prisma';



export const setUserAddres = async (address: Address, userId: string) => {
    try {

        const newAddress = await createOrRepalceAddress(address, userId);

        return {
            ok: true,
            address: newAddress,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo grabar la dirección'
        }

    }
}

const createOrRepalceAddress = async (address: Address, userId: string) => {

    try {  

        const storedAddress = await prisma.userAddress.findUnique({
            where: { userId }
        });

        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            postalCode: address.postalCode,
            city: address.city,
        }

        if (!storedAddress) {
            const newAddres = await prisma.userAddress.create({
                data: addressToSave,
            });
            return newAddres;
        }

        const updatedAddress = await prisma.userAddress.update({
            where: { userId },
            data: addressToSave,
        });

        return updatedAddress;

    } catch (error) {
        console.log(error);
        throw new Error('No se pudo grabar la dirección');
    }
}