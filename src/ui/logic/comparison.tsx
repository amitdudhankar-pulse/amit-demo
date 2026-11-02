import { PartialProduct } from "@/lib/lib";
import debounce from "lodash/debounce";
import {
  PropsWithChildren,
  useState,
  useContext,
  ReactElement,
  // useEffect,
  useRef,
} from "react";
import { createContext, Context } from "react";

interface ComparisonData {
  1?: PartialProduct;
  2?: PartialProduct;
  3?: PartialProduct;
  error?: string[];
}

interface ComparisonContextProps {
  comparisonData: ComparisonData;
  addProduct: (product: PartialProduct) => void;
  removeProduct: (id?: number) => void;
  removeAll: () => void;
}
const ComparisonContext = createContext<ComparisonContextProps>({
  comparisonData: {},
  addProduct: () => {},
  removeProduct: () => {},
  removeAll: () => {},
});

const ComparisonProvider = (props: PropsWithChildren) => {
  const [error, setError] = useState<string[]>([]);
  const [value, setValue] = useState<PartialProduct[]>([]);
  const { current: resetError } = useRef(
    debounce(() => setError([]), 1000 * 4, { leading: false })
  );
  const getComparisonData = () => ({
    1: value.length > 0 ? value[0] : undefined,
    2: value.length > 1 ? value[1] : undefined,
    3: value.length > 2 ? value[2] : undefined,
    error: error,
  });

  const addError = (text: string) => {
    // console.log(">> inside addError");
    setError([...error, text]);
    resetError();
  };

  const addProduct = (product: PartialProduct) => {
    if (value.length === 3) {
      addError(
        "Comparison supports only 3 tools. Remove a tool to add another."
      );
      return;
    }
    if (value.find((e) => e.id === product.id)) {
      addError(`"${product.title}" already added for comparison.`);
      return;
    }
    setValue([...value, product]);
  };

  const removeProduct = (id?: number) => {
    setValue(value.filter((e) => e.id !== id));
  };

  const removeAll = () => {
    setValue([]);
    setError([]);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonData: getComparisonData(),
        addProduct,
        removeProduct,
        removeAll,
      }}
    >
      {props.children}
    </ComparisonContext.Provider>
  );
};

const useComparisonContext = () =>
  useContext(ComparisonContext as Context<ComparisonContextProps>);

const ComparisonControls = (props: {
  children: (args: ComparisonContextProps) => ReactElement;
}) => props.children(useComparisonContext());

export { ComparisonProvider, ComparisonControls };
