import { getCategories, getProductBySlug } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/ProductForm';


interface Props {
  params: {
    slug: string;
  }
}


export default async function ProductPage({ params }: Props) {

  const { slug } = await params;

  const [ product, categorie ] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);


  // const product = await getProductBySlug(slug);
  // const categorie = await getCategories();
  const categories = categorie.categories!.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  //Todo: new product

  if (!product && slug !== 'new') {
    redirect('/admin/products');
  }

  const title = (slug === 'new') ? 'Nuevo Producto' : 'Editar Producto';

  return (
    <>
      <Title title={title} />
      <ProductForm product={product ?? {} } categories={categories} />
    </>
  );
}