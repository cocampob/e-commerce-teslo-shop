export const revalidate = 60; // 60 segundos

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/generated/prisma/enums";
import { initialData } from "@/seed/seed";
import { redirect } from "next/navigation";

interface Props {
  params: { 
    gender: string 
  },
  searchParams:{
    page?: string
  }
}


const seedProducts = initialData.products;



export default async function GenderByPage ({ params, searchParams }: Props) {

  const { gender } = await params;

    const page =   (await searchParams).page ? parseInt( (await searchParams).page as any ) : 1;
  
    const { products, totalPages, currentPage } = await getPaginatedProductsWithImages({
      page, 
      gender: gender as Gender,
    });
    
  
    if ( products.length === 0 ){
      redirect(`/gender/${gender}`);
    }
    
 

  const label: Record<string, string> = {
    'men': 'para Hombres',
    'women': 'para Mujeres', 
    'kid': 'para Niños',
    'unisex': 'para Todos'
  }

  // if(id == 'kids'){
  //   notFound();
  // }

  return (
    <>
      <Title
        title={`Articulos ${label[gender]}`}
        subtitle="Todos los productos"
        className="mb-2" />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />

    </>
  );
}