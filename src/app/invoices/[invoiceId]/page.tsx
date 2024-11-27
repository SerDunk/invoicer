import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";

import { notFound } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { and } from "drizzle-orm";

import Invoice from "./Invoice";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  // Await the params object
  const { invoiceId: invoiceIdStr } = await params;

  const { userId, orgId } = await auth();
  if (!userId) {
    return;
  }

  const invoiceId = parseInt(invoiceIdStr);
  if (isNaN(invoiceId)) {
    throw new Error("Invalid ID");
  }

  let result;
  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(eq(Invoices.id, invoiceId), eq(Invoices.organisationId, orgId))
      )
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceId),
          eq(Invoices.userId, userId),
          isNull(Invoices.organisationId)
        )
      )
      .limit(1);
  }

  if (!result) {
    return notFound();
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers,
  };

  return <Invoice invoice={invoice} />;
}
