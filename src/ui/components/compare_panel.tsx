import { PartialProduct } from "@/lib/lib";
import { twMerge } from "tailwind-merge";
import { Text, Button, Image, ErrorMessage } from "./components";
import { IoIosClose } from "react-icons/io";
import { getAssetPathFromID, Paths } from "@/contants";
import { ComparisonControls } from "@/ui/logic/comparison";
import { useRouter } from "next/router";

const ProductCard = (props: {
  product: PartialProduct;
  className?: string;
  onRemove: () => void;
}) => {
  const logoSource =
    getAssetPathFromID(props.product.logo?.id) ?? props.product.logo_url ?? "";
  const logoAltText = props.product.logo?.title ?? props.product.title;
  return (
    <div
      className={twMerge(
        "w-full h-full",
        "flex md:flex-col flex-row gap-4 justify-start items-center align-top",
        props.className,
        "relative"
      )}
    >
      <IoIosClose
        className=" absolute right-3 -top-3 cursor-pointer"
        size={25}
        onClick={props.onRemove}
      />
      <Image
        className="p-1 size-20 rounded-2xl object-contain outline outline-1 outline-boundary-light bg-bg-primary/50 md:block hidden"
        src={logoSource}
        alt={logoAltText}
        fallbackSrc={Paths.IMAGE.FALLBACK}
      />
      <Text.CardTitle
        title={props.product.title}
        href={props.product.url}
        lineClamp="line-clamp-2"
        className={twMerge("w-full break-words overflow-clip", "md:")}
      />
    </div>
  );
};

const CompareBottomPanel = () => {
  const router = useRouter();
  return (
    <ComparisonControls>
      {({ removeAll, removeProduct, comparisonData }) => {
        let url = "/compare/";
        if (!!comparisonData[2] && !!comparisonData[1])
          url = url + `${comparisonData[1]?.slug}-vs-${comparisonData[2].slug}`;
        if (!!comparisonData[3]) url = url + `-vs-${comparisonData[3].slug}`;
        if (!comparisonData[1]) return <></>;
        return (
          <div
            className={twMerge(
              "fixed bottom-0 z-50",
              "bg-primary-light/50 outline outline-1 outline-boundary-light backdrop-filter backdrop-blur-lg shadow-compare-panel",
              "flex justify-center",
              "h-fit w-full"
            )}
          >
            <div className="flex flex-col justify-between w-full max-w-content-width md:gap-5 gap-3 py-5 md:px-14 px-4">
              <Text.H2>Compare Tools</Text.H2>
              <IoIosClose
                className="absolute right-3 top-3 cursor-pointer border border-boundary rounded-md bg-gray-300"
                size={30}
                onClick={removeAll}
              />
              {comparisonData.error?.map((e, i) => (
                <ErrorMessage
                  key={i}
                  text={e}
                  className="w-fit flex-nowrap p-1.5 transition-opacity bg-opacity-55 font-bold"
                />
              ))}
              <div className="flex flex-wrap md:flex-nowrap justify-between gap-10 items-center">
                <div className="grid md:grid-cols-5 grid-cols-1 gap-3 items-center align-middle text-center w-full">
                  {comparisonData[1] && (
                    <ProductCard
                      product={comparisonData[1]}
                      onRemove={() => removeProduct(comparisonData[1]?.id)}
                    />
                  )}
                  {comparisonData[2] && (
                    <>
                      <Text.P className="font-semibold hidden md:block">
                        Vs
                      </Text.P>
                      <ProductCard
                        product={comparisonData[2]}
                        onRemove={() => removeProduct(comparisonData[2]?.id)}
                      />
                    </>
                  )}
                  {comparisonData[3] && (
                    <>
                      <Text.P className="font-semibold hidden md:block">
                        Vs
                      </Text.P>
                      <ProductCard
                        product={comparisonData[3]}
                        onRemove={() => removeProduct(comparisonData[3]?.id)}
                      />
                    </>
                  )}
                </div>
                <Button.PrimaryBoundary
                  text="Compare"
                  disable={!comparisonData[2]}
                  action={{
                    type: "callback",
                    onClick: async () => {
                      router.push(url);
                      removeAll();
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );
      }}
    </ComparisonControls>
  );
};

export { CompareBottomPanel };
