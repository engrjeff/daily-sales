"use client"

import { useState } from "react"
import { SendIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useStoreId } from "../store/hooks"

export function EmployeeInviteDialog() {
  const storeId = useStoreId()
  const [open, setOpen] = useState(false)

  const linkToCopy = `${process.env.NEXT_PUBLIC_SITE_URL}/external/${storeId}/employee-invite`

  async function handleCopy() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(linkToCopy)

      toast.success("Link copied to clipboard!")

      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="cool">
          <SendIcon />
          Invite Employee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Employee</DialogTitle>
          <DialogDescription>
            Copy the link below and send it to the employee you want to invite.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted flex items-center gap-4 rounded-lg border p-2">
          <pre className="w-[300px] flex-1 whitespace-pre-line break-words text-sm">
            {linkToCopy}
          </pre>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="ml-auto shrink-0"
            onClick={handleCopy}
          >
            Copy Link{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
