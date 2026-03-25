"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input as HeroInput, InputProps as HeroInputProps } from "@heroui/react";

interface InputProps extends Omit<HeroInputProps, "name"> {
  name: string;
  label: string;
}

export const Input: React.FC<InputProps> = ({ name, label, ...rest }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <>
 
      <HeroInput
      {...register(name)}
      label={label}
      labelPlacement="outside"
      variant="flat"
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
          "h-[54px]",
          "px-4",
          "group-data-[focus=true]:border-indigo-500",
        ].join(" "),
        input: "text-black placeholder:text-slate-400 font-medium",
        errorMessage: "text-xs font-medium text-red-500 mt-1",
      }}
    />
    </>
  );
};
