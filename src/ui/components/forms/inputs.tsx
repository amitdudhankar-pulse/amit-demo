import {
  Checkbox as HCheckbox,
  Field,
  Fieldset,
  Label,
  Input as HInput,
  Legend,
  Select,
  Textarea,
} from "@headlessui/react";
import { twMerge } from "tailwind-merge";

const Input = {
  Checkbox: (props: {
    title?: string;
    className?: string;
    name?: string;
    value?: boolean;
    onChange?: (value: boolean) => void;
  }) => (
    <Field className={twMerge("flex flex-row gap-2 w-fit", props.className)}>
      <HCheckbox
        className={twMerge(
          "group block size-4 rounded border bg-white data-[checked]:bg-blue-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[checked]:data-[disabled]:bg-gray-500"
        )}
        name={props.name}
        onChange={props.onChange}
        checked={props.value}
      >
        <svg
          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </HCheckbox>
      <Label>{props.title}</Label>
    </Field>
  ),

  Text: (props: {
    className?: string;
    name: string;
    label: string;
    onChange?: (value: { target: { value: string } }) => void;
  }) => (
    <Field className={twMerge("flex flex-col gap-2 w-full", props.className)}>
      <Label className="block">{props.label}</Label>
      <HInput
        className="outline outline-1 outline-gray-400 rounded-md bg-white bg-opacity-70 text-p p-2"
        name="name"
        onChange={props.onChange}
      />
    </Field>
  ),
};

export { Input };
