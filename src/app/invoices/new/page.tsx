import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export default async function NewInvoice() {
  const results = await db.execute(sql`SELECT current_database()`);
  return (
    <div className="flex flex-col gap-4 h-full mx-auto max-w-5xl my-3">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Create Invoice</h1>
      </div>
      {JSON.stringify(results)}
      <form className="flex gap-6 flex-col max-w-sm">
        <div>
          <Label htmlFor="name" className="block mb-2 font-semibold text-sm">
            Billing Name
          </Label>
          <Input id="name" name="name" type="text"></Input>
        </div>
        <div>
          <Label htmlFor="mail" className="block mb-2 font-semibold text-sm">
            Billing Email
          </Label>
          <Input id="mail" name="mail" type="text"></Input>
        </div>
        <div>
          <Label htmlFor="value" className="block mb-2 font-semibold text-sm">
            Value
          </Label>
          <Input id="value" name="value" type="text"></Input>
        </div>
        <div>
          <Label
            htmlFor="description"
            className="block mb-2 font-semibold text-sm"
          >
            Billing Name
          </Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
}
