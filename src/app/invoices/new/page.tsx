"use client";

import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addInvoice } from "@/app/actions";
import { SyntheticEvent, useState } from "react";
import Form from "next/Form";
import Container from "@/components/Container";

export default function NewInvoice() {
  const [state, setState] = useState("ready");

  const handleOnSubmit = async (event: SyntheticEvent) => {
    if (state === "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  };

  return (
    <div className="h-full">
      <Container className="">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-semibold">Create Invoice</h1>
        </div>

        <Form
          action={addInvoice}
          onSubmit={handleOnSubmit}
          className="flex gap-6 flex-col max-w-sm"
        >
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
            <SubmitButton />
          </div>
        </Form>
      </Container>
    </div>
  );
}
