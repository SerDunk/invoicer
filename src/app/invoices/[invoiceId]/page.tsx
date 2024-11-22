import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import Container from "@/components/Container";

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const invoiceId = parseInt(params.invoiceId);
  if (isNaN(invoiceId)) {
    throw new Error("Invalid ID");
  }
  const [result] = await db
    .select()
    .from(Invoices)
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  if (!result) {
    return notFound();
  }

  return (
    <div className=" mx-auto p-6">
      <Container>
        <div className="flex flex-col gap-6 bg-background p-8 rounded-lg shadow-sm">
          <div className="flex gap-6 items-center border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Invoice #{invoiceId}
            </h1>
            <Badge
              className={cn(
                "rounded-full text-sm font-medium capitalize",
                result.status === "open" && "bg-blue-500 text-white",
                result.status === "paid" && "bg-green-600 text-white",
                result.status === "void" && "bg-zinc-700 text-white",
                result.status === "uncollectible" && "bg-red-500 text-white"
              )}
            >
              {result.status}
            </Badge>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground mt-2">{result.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Billing Details</h2>
            <ul className="space-y-2">
              <li className="flex gap-6">
                <span className="text-muted-foreground">Invoice ID:</span>
                <span className="font-medium">{result.id}</span>
              </li>
              <li className="flex gap-6">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">₹{result.value / 100}</span>
              </li>
              <li className="flex gap-6">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {new Date(result.createTs).toLocaleDateString()}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
