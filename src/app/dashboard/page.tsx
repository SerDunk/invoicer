import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import { Invoices, Customers } from "@/db/schema";
import Container from "@/components/Container";
import { auth } from "@clerk/nextjs/server";
import { eq, isNull, and } from "drizzle-orm";

export default async function Dashboard() {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  let results;
  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organisationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organisationId)));
  }

  const invoices = results?.map(({ invoices, customers }) => {
    return {
      ...invoices,
      customer: customers,
    };
  });
  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-semibold">Invoices</h1>
          <p>
            <Button className="inline-flex" variant="ghost" asChild>
              <Link href="/invoices/new">
                <CirclePlus className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4">Date</TableHead>
              <TableHead className="p-4">Customer</TableHead>
              <TableHead className="p-4">Email</TableHead>
              <TableHead className="text-center p-4">Status</TableHead>
              <TableHead className="text-right p-4">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="text-left p-0">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-semibold p-4 block"
                    >
                      {new Date(invoice.createTs).toLocaleDateString()}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0 ">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-semibold p-4 block"
                    >
                      {invoice.customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-left p-0">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="p-4 block"
                    >
                      {invoice.customer.mail}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center p-0er ">
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium capitalize",
                        invoice.status === "open" && "bg-blue-500 text-white",
                        invoice.status === "paid" && "bg-green-600 text-white",
                        invoice.status === "void" && "bg-zinc-700 text-white",
                        invoice.status === "uncollectible" &&
                          "bg-red-500 text-white"
                      )}
                    >
                      {invoice.status}{" "}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right p-0t">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-semibold p-4 block"
                    >
                      ₹{invoice.value / 100}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
