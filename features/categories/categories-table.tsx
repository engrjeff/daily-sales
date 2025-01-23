import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyView } from "@/components/empty-view"

import { CategoryRowActions } from "./category-row-action"
import { getCategories } from "./queries"

export async function CategoriesTable({ storeId }: { storeId: string }) {
  const categories = await getCategories(storeId)

  return (
    <Table containerClass="border rounded-lg flex-nonel">
      <TableHeader>
        <TableRow>
          <TableHead className="w-9 text-center">#</TableHead>
          <TableHead>Category name</TableHead>
          <TableHead className="text-center">Assigned Products</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!categories.length ? (
          <TableRow>
            <TableCell colSpan={4} className="p-0">
              <EmptyView />
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category, n) => (
            <TableRow key={`category-${category.id}`}>
              <TableCell className="text-center">{n + 1}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell className="text-center">
                {category.products.length}
              </TableCell>
              <TableCell className="text-center">
                <CategoryRowActions category={category} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
