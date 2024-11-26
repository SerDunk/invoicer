"use client";

import { Customers, Invoices } from "@/db/schema";
import { useOptimistic } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Container from "@/components/Container";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUS } from "@/data/invoice";
import { updateInvoice, deleteInvoice } from "@/app/actions";
import { ChevronDown, Ellipsis, Trash2 } from "lucide-react";

interface InvoiceProps {
  invoice: typeof Invoices.$inferSelect & {
    customer: typeof Customers.$inferSelect;
  };
}

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
    }
  );
  const handleOnStatusUpdate = async (formData: FormData) => {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status"));
    try {
      await updateInvoice(formData);
    } catch {
      setCurrentStatus(originalStatus);
    }
  };
  return (
    <div className="w-full h-full">
      <Container>
        <div className="flex flex-col gap-6 bg-background rounded-lg shadow-sm">
          <div className="flex justify-between gap-6 items-center border-b pb-4">
            <div className="flex gap-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Invoice #{invoice.id}
              </h1>
              <Badge
                className={cn(
                  "rounded-full text-sm font-medium capitalize",
                  currentStatus === "open" && "bg-blue-500 text-white",
                  currentStatus === "paid" && "bg-green-600 text-white",
                  currentStatus === "void" && "bg-zinc-700 text-white",
                  currentStatus === "uncollectible" && "bg-red-500 text-white"
                )}
              >
                {currentStatus}
              </Badge>
            </div>
            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex" variant="outline">
                    Change Status
                    <ChevronDown className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {AVAILABLE_STATUS.map((status) => (
                    <form key={status.id} action={handleOnStatusUpdate}>
                      <DropdownMenuItem>
                        <input type="hidden" name="id" value={invoice.id} />
                        <input type="hidden" name="status" value={status.id} />
                        <button>{status.label}</button>
                      </DropdownMenuItem>
                    </form>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex" variant="outline">
                      <span className="sr-only">More Options</span>
                      <Ellipsis className="w-4 h-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DialogTrigger asChild>
                      <DropdownMenuItem>
                        <button className="flex items-center gap-2">
                          <Trash2 className="w-4 h-auto" />
                          Delete Invoice
                        </button>
                      </DropdownMenuItem>
                    </DialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DialogContent>
                  <DialogHeader className="gap-4">
                    <DialogTitle className="text-2xl">
                      Delete Invoice?
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your invoice and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <form action={deleteInvoice}>
                      <input type="hidden" name="id" value={invoice.id} />
                      <Button
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-auto" />
                        Delete Invoice
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground mt-2">{invoice.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Billing Details</h2>
            <ul className="space-y-2">
              <li className="flex gap-6">
                <span className="text-muted-foreground">Invoice ID:</span>
                <span className="font-medium">{invoice.id}</span>
              </li>
              <li className="flex gap-6">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹{invoice.value / 100}</span>
              </li>
              <li className="flex gap-6">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {new Date(invoice.createTs).toLocaleDateString()}
                </span>
              </li>
              <li className="flex gap-6">
                <span className="text-muted-foreground">Billing Name:</span>
                <span className="font-medium">{invoice.customer.name}</span>
              </li>
              <li className="flex gap-6">
                <span className="text-muted-foreground">Billing Email:</span>
                <span className="font-medium">{invoice.customer.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
