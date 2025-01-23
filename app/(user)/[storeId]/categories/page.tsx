import { CategoriesTable } from "@/features/categories/categories-table"
import { CategoryForm } from "@/features/categories/category-form"

function CategoriesPage({ params }: { params: { storeId: string } }) {
  return (
    <div className="container flex max-w-5xl flex-1 flex-col gap-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Categories</p>
          <p className="text-muted-foreground text-sm">
            View and manage product categories.
          </p>
        </div>
        <CategoryForm />
      </div>

      <CategoriesTable storeId={params.storeId} />
    </div>
  )
}

export default CategoriesPage
