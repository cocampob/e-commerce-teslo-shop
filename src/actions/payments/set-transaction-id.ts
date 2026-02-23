'use server';

import prisma from "@/lib/prisma";

export const SetTransactionId = async (transactionId: string, orderId: string) => {
   // console.log({ transactionId, orderId });
    try {


        const order = await prisma.order.update({
            where: { id: orderId },
            data: { transactionId: transactionId }
        });
        if (!order) {
            return {
                ok: false,
                message: `No se encontró la orden con el ID ${orderId} `,
            }
        }
       // console.log({order});
        
        return { ok: true }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo actualizar el ID de la transacción'
        }

    }

}