import { NotFoundCTA } from "@/components/notfound-cta"

function ProductNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h1 className="text-primary text-lg font-semibold">404</h1>
      <p>Page not found.</p>

      <NotFoundCTA path="products">Back to Product List</NotFoundCTA>
    </div>
  )
}

export default ProductNotFound
