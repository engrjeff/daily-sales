import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductEditForm } from "@/features/product/product-edit-form"
import { getProductById } from "@/features/product/queries"

interface ProductPageProps {
  params: { storeId: string; id: string }
}

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const data = await getProductById({
    productId: params.id,
    storeId: params.storeId,
  })

  return {
    title: data?.product?.name,
  }
}

async function ProductPage({ params }: ProductPageProps) {
  const data = await getProductById({
    productId: params.id,
    storeId: params.storeId,
  })

  if (!data?.product) notFound()

  return (
    <div className="container relative flex max-w-4xl flex-col space-y-6 overflow-hidden">
      <ProductEditForm
        storeId={params.storeId}
        initialValues={data.product}
        lastUpdated={data.updatedAt}
      />
    </div>
  )
}

export default ProductPage
