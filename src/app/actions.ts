"use server";

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Status } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export async function addInvoice(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    return;
  }

  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organisationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      customerId: customer.id,
      status: "open",
      organisationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}

export async function updateInvoice(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  if (orgId) {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organisationId, orgId))
      );
  } else {
    await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organisationId)
        )
      );
  }

  revalidatePath(`/invoices/${id}`, "page");
}

export async function deleteInvoice(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;

  if (orgId) {
    await db
      .delete(Invoices)
      .where(
        and(eq(Invoices.id, parseInt(id)), eq(Invoices.organisationId, orgId))
      );
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organisationId)
        )
      );
  }

  redirect("/dashboard");
}
