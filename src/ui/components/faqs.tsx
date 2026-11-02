import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
// import { IoIosArrowDown } from "react-icons/io";
// import { CiSquareChevDown } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa6";
import { parseAMW, Text } from "@/ui/components/components";
import { twMerge } from "tailwind-merge";
import { FAQPageJsonLd } from "next-seo";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQCard = (props: {
  item: FAQItem;
  key?: string | number;
  defaultOpen?: boolean;
}) => (
  <Disclosure
    as="div"
    className={twMerge(
      "p-3",
      "bg-bg-primary outline outline-1 outline-boundary-light rounded-lg bg-opacity-80",
      "w-full",
      "bg-gray-500 outline outline-1 outline-gray-300 rounded-lg bg-opacity-10 backdrop-filter backdrop-blur-2xl",
      "shadow-sm",
      "h-fit md:min-w-96"
    )}
    defaultOpen={props.defaultOpen}
    key={props.key}
  >
    <DisclosureButton className="group flex w-full justify-between gap-2 items-start">
      <Text.H3 className="text-left">{props.item.question}</Text.H3>
      <FaChevronDown className="size-5  group-data-[open]:rotate-180" />
    </DisclosureButton>
    <DisclosurePanel className="mt-2 text-sm/5 ">
      {parseAMW(props.item.answer)}
    </DisclosurePanel>
  </Disclosure>
);

const FAQs = (props: { itemList: FAQItem[] }) => {
  return (
    <>
      <FAQPageJsonLd
        mainEntity={props.itemList.map((e) => ({
          questionName: e.question,
          acceptedAnswerText: e.answer,
        }))}
      />
      <div className="w-full flex flex-wrap flex-row gap-3">
        {props.itemList.map((item, index) => (
          <FAQCard item={item} key={index} />
        ))}
      </div>
    </>
  );
};

export { FAQs };
export type { FAQItem };
