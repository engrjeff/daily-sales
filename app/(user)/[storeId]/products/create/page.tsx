import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductForm } from "@/features/product/product-form"
import { getProductToCopyById } from "@/features/product/queries"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const generateMetadata = ({ searchParams }: PageProps): Metadata => {
  return {
    title: searchParams?.copyId ? "Copy Product" : "Add Product",
  }
}

interface PageProps {
  params: { storeId: string }
  searchParams?: { copyId?: string }
}

async function CreateProductPage({ params, searchParams }: PageProps) {
  const productToCopy = await getProductToCopyById({
    productId: searchParams?.copyId,
    storeId: params.storeId,
  })

  if (!productToCopy && searchParams?.copyId) notFound()

  return (
    <div className="container relative flex max-w-4xl flex-col space-y-6 overflow-hidden">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${params.storeId}/dashboard`}>Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${params.storeId}/products`}>Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ProductForm storeId={params.storeId} initialValues={productToCopy} />
    </div>
  )
}

export default CreateProductPage
