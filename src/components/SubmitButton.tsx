"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  console.log(pending);
  return (
    <div>
      <Button className="relative">
        <span className={pending ? "text-transparent" : ""}>Submit</span>
        {pending && (
          <span className="absolute flex justify-center items-center text-gray-400">
            <LoaderCircle className="animate-spin" />
          </span>
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
