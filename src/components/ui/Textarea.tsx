"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Textarea as HeroTextarea, TextAreaProps as HeroTextAreaProps } from "@heroui/react";

interface TextareaProps extends Omit<HeroTextAreaProps, "name"> {
  name: string;
  label: string;
}

export const Textarea: React.FC<TextareaProps> = ({ name, label, ...rest }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <HeroTextarea
      {...register(name)}
      label={label}
      labelPlacement="outside"
      variant="bordered"
      radius="md"
      size="lg"
      isInvalid={!!error}
      errorMessage={error?.message?.toString()}
      {...rest}
      classNames={{
        label: "uppercase text-[12px] font-bold text-black tracking-tight mb-2",
        inputWrapper: [
          "bg-[#F8F9FC]",
          "border-[#E2E8F0]",
          "hover:border-slate-300",
          "focus-within:!border-indigo-500",
          "shadow-none",
          "px-4",
          "py-3",
          "group-data-[focus=true]:border-indigo-500",
        ].join(" "),
        input: "text-base text-slate-900 placeholder:text-slate-400 font-medium",
        errorMessage: "text-xs font-medium text-red-500 mt-1",
      }}
    />
  );
};
