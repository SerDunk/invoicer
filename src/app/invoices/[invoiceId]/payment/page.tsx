import { Customers, Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import Container from "@/components/Container";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { createPayment, updateStatus } from "@/app/actions";
import Stripe from "stripe";

interface InvoiceProps {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ status: string; session_id: string }>;
}
const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

export default async function Invoice({ params, searchParams }: InvoiceProps) {
  const { invoiceId: invoiceIdStr } = await params;
  const sessionId = (await searchParams).session_id;
  const isSuccess = sessionId && (await searchParams).status === "success";
  const isCanceled = (await searchParams).status === "canceled";
  let isError = isSuccess && !sessionId;

  const invoiceId = parseInt(invoiceIdStr);
  if (isNaN(invoiceId)) {
    throw new Error("Invalid ID");
  }

  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(
      sessionId
    );
    if (payment_status !== "paid") {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");
      await updateStatus(formData);
    }
  }

  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    return notFound();
  }

  const invoice = {
    ...result,
    customer: result.name,
  };
  return (
    <div className="w-full h-full">
      <Container>
        {isError && (
          <p className="bg-red-100 text-red-500 text-center px-3 py-2 rounded-lg mb-5 ">
            Something went wrong , Please try again!
          </p>
        )}
        {isCanceled && (
          <p className="bg-yellow-100 text-red-500 text-center px-3 py-2 rounded-lg mb-5 ">
            Payment is cancelled , Please try again!
          </p>
        )}

        <div className="">
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-6 bg-background rounded-lg shadow-sm">
              <div className="flex justify-between gap-6 items-center border-b pb-4">
                <div className="flex gap-8">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Invoice #{invoice.id}
                  </h1>
                  <Badge
                    className={cn(
                      "rounded-full text-sm font-medium capitalize",
                      invoice.status === "open" && "bg-blue-500 text-white",
                      invoice.status === "paid" && "bg-green-600 text-white",
                      invoice.status === "void" && "bg-zinc-700 text-white",
                      invoice.status === "uncollectible" &&
                        "bg-red-500 text-white"
                    )}
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground mt-2">
                  {invoice.description}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl mb-4">Manage Invoice</h2>
              {invoice.status === "open" && (
                <form action={createPayment}>
                  <input type="hidden" name="id" value={invoice.id}></input>
                  <Button className="flex gap-2 bg-green-600 font-bold">
                    <CreditCard className="w-5 h-auto" />
                    Pay Invoice
                  </Button>
                </form>
              )}
              {invoice.status === "paid" && (
                <p className="flex gap-2 text-xl font-bold">
                  <Check className="w-8 h-auto bg-green-500 rounded-full text-white p-1" />
                  Invoice Paid
                </p>
              )}
            </div>
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
                <span className="font-medium">{invoice.name}</span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
