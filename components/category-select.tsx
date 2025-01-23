"use client"

import * as React from "react"
import { CategoryFormComponent } from "@/features/categories/category-form"
import { Check, ChevronsUpDown, Loader2Icon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCategories } from "@/hooks/use-categories"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface CategoriesSelectProps {
  selectedCategoryId: string
  onChange: (categoryId: string) => void
}

export function CategorySelect({
  selectedCategoryId,
  onChange,
}: CategoriesSelectProps) {
  const [open, setOpen] = React.useState(false)

  const [categoryFormOpen, setCategoryFormOpen] = React.useState(false)

  const [search, setSearch] = React.useState("")

  const categoriesData = useCategories()

  return (
    <Popover open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              disabled={categoriesData.isLoading}
              aria-expanded={open}
              className="border-border bg-muted w-full justify-between"
            >
              {selectedCategoryId
                ? categoriesData?.data?.find(
                    (category) => category.id === selectedCategoryId
                  )?.name
                : "Select category"}
              {categoriesData.isLoading ? (
                <Loader2Icon className="ml-auto size-4 shrink-0 animate-spin" />
              ) : (
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              )}
            </Button>
          </DropdownMenuTrigger>
        </PopoverAnchor>
        <DropdownMenuContent align="start" className="w-52 p-0">
          <Command
            filter={(value, search) => {
              if (
                categoriesData?.data
                  ?.find((i) => i.id === value)
                  ?.name.toLowerCase()
                  .includes(search.toLowerCase())
              )
                return 1
              return 0
            }}
          >
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search category"
            />
            <CommandList>
              <CommandGroup>
                {categoriesData.data?.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={(currentValue) => {
                      onChange(
                        currentValue === selectedCategoryId ? "" : currentValue
                      )
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        selectedCategoryId === category.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="p-1">
            <PopoverTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() => setCategoryFormOpen(true)}
              >
                <PlusIcon /> Add {search ? `"${search}"` : "Category"}
              </Button>
            </PopoverTrigger>
          </div>
        </DropdownMenuContent>
        <PopoverContent align="start">
          <CategoryFormComponent
            forSelect
            initialValue={search}
            onCancel={() => setCategoryFormOpen(false)}
            onAfterSave={async (newId) => {
              await categoriesData.refetch()
              onChange(newId)
              setSearch("")
              setCategoryFormOpen(false)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </DropdownMenu>
    </Popover>
  )

  // return (
  //   <>
  //     <Popover
  //       open={open}
  //       onOpenChange={(open) => {
  //         setOpen(open)
  //         if (!open) {
  //           setCategoryFormOpen(false)
  //         }
  //       }}
  //     >
  //       <PopoverTrigger asChild>
  //         <Button
  //           variant="outline"
  //           role="combobox"
  //           disabled={categoriesData.isLoading}
  //           aria-expanded={open}
  //           className="border-border bg-muted w-full justify-between"
  //         >
  //           {selectedCategoryId
  //             ? categoriesData?.data?.find(
  //                 (category) => category.id === selectedCategoryId
  //               )?.name
  //             : "Select category"}
  //           {categoriesData.isLoading ? (
  //             <Loader2Icon className="ml-auto size-4 shrink-0 animate-spin" />
  //           ) : (
  //             <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
  //           )}
  //         </Button>
  //       </PopoverTrigger>
  //       <PopoverContent
  //         align="start"
  //         className="w-52 p-0"
  //         onInteractOutside={(e) => e.preventDefault()}
  //       >
  //         <Command
  //           filter={(value, search) => {
  //             if (
  //               categoriesData?.data
  //                 ?.find((i) => i.id === value)
  //                 ?.name.toLowerCase()
  //                 .includes(search.toLowerCase())
  //             )
  //               return 1
  //             return 0
  //           }}
  //         >
  //           <CommandInput
  //             value={search}
  //             onValueChange={setSearch}
  //             placeholder="Search category"
  //           />
  //           <CommandList>
  //             <CommandGroup>
  //               {categoriesData.data?.map((category) => (
  //                 <CommandItem
  //                   key={category.id}
  //                   value={category.id}
  //                   onSelect={(currentValue) => {
  //                     onChange(
  //                       currentValue === selectedCategoryId ? "" : currentValue
  //                     )
  //                     setOpen(false)
  //                   }}
  //                 >
  //                   <Check
  //                     className={cn(
  //                       "mr-2 size-4",
  //                       selectedCategoryId === category.id
  //                         ? "opacity-100"
  //                         : "opacity-0"
  //                     )}
  //                   />
  //                   {category.name}
  //                 </CommandItem>
  //               ))}
  //             </CommandGroup>

  //             {/* <div className="p-1">
  //               <Popover
  //                 open={categoryFormOpen}
  //                 onOpenChange={setCategoryFormOpen}
  //                 modal={true}
  //               >
  //                 <PopoverTrigger asChild>
  //                   <Button
  //                     type="button"
  //                     size="sm"
  //                     variant="secondary"
  //                     className="w-full"
  //                     onClick={() => setCategoryFormOpen(true)}
  //                   >
  //                     <PlusIcon /> Add {search ? `"${search}"` : "Category"}
  //                   </Button>
  //                 </PopoverTrigger>
  //                 <PopoverContent
  //                   className="sm:max-w-[425px]"
  //                   align="center"
  //                   side="right"
  //                   onInteractOutside={(e) => e.preventDefault()}
  //                 >
  //                   <CategoryFormComponent
  //                     forSelect
  //                     initialValue={search}
  //                     onCancel={() => setCategoryFormOpen(false)}
  //                     onAfterSave={async (newId) => {
  //                       await categoriesData.refetch()
  //                       onChange(newId)
  //                       setSearch("")
  //                       setCategoryFormOpen(false)
  //                       setOpen(false)
  //                     }}
  //                   />
  //                 </PopoverContent>
  //               </Popover>
  //             </div> */}

  //             <Dialog modal={false}>
  //               <DialogTrigger asChild>
  //                 <Button
  //                   type="button"
  //                   size="sm"
  //                   variant="secondary"
  //                   className="w-full"
  //                 >
  //                   <PlusIcon /> Add {search ? `"${search}"` : "Category"}
  //                 </Button>
  //               </DialogTrigger>
  //               <DialogContent
  //                 className="sm:max-w-[425px]"
  //                 onInteractOutside={(e) => e.preventDefault()}
  //               >
  //                 <DialogHeader>
  //                   <DialogTitle>New Category</DialogTitle>
  //                   <DialogDescription>
  //                     Fill in the details below.
  //                   </DialogDescription>
  //                 </DialogHeader>
  //                 <CategoryFormComponent
  //                   forSelect
  //                   initialValue={search}
  //                   onCancel={() => setOpen(false)}
  //                   onAfterSave={async (newId) => {
  //                     await categoriesData.refetch()
  //                     onChange(newId)
  //                     setSearch("")
  //                     setOpen(false)
  //                   }}
  //                 />
  //               </DialogContent>
  //             </Dialog>
  //           </CommandList>
  //         </Command>
  //       </PopoverContent>
  //     </Popover>
  //   </>
  // )
}
