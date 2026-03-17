"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Select as HeroSelect, SelectItem, SelectProps as HeroSelectProps } from "@heroui/react";

interface SelectProps extends Omit<HeroSelectProps, "name" | "children"> {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ name, label, options, ...rest }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <HeroSelect
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
        trigger: [
          "bg-[#F8F9FC]",
          "border-[#E2E8F0]",
          "hover:border-slate-300",
          "focus-within:!border-indigo-500",
          "shadow-none",
          "h-[54px]",
          "px-4",
          "group-data-[focus=true]:border-indigo-500",
        ].join(" "),
        value: "text-base text-black placeholder:text-slate-900 font-medium",
        errorMessage: "text-xs font-medium text-red-500 mt-1",
      }}
    >
      {options.map((option) => (
        <SelectItem key={option.value} textValue={option.label} className="text-black">
          {option.label}
        </SelectItem>
      ))}
    </HeroSelect>
  );
};
