// import { delayedPromise } from "@/ui/components/components";
import { CMS, Product } from "@/lib/lib";
import {
  PropsWithChildren,
  // useState,
  useContext,
  ReactElement,
  // useEffect,
} from "react";
import { createContext, Context } from "react";

// TODO: Actually, all APIs, that are being used on the client side, should be provided through this ContextProvider.

interface APIContextProps {
  setBookmark: (props: {
    productId: number;
    state: boolean;
  }) => Promise<boolean>;

  getBookmark: (props: { productId: number }) => Promise<boolean>;
  getAllBookmarkedTools: () => Promise<Product[]>;
}

const APIContext = createContext<APIContextProps>({
  setBookmark: () => Promise.resolve(false),
  getBookmark: () => Promise.resolve(false),
  getAllBookmarkedTools: () => Promise.resolve([]),
});

export const APIProvider = (props: PropsWithChildren) => {
  const setBookmark = async (props: { productId: number; state: boolean }) => {
    if (props.state) {
      await CMS.createBookmarkObjectForProduct({ productId: props.productId });
    } else {
      await CMS.deleteBookmarkObjectForProduct({ productId: props.productId });
    }
    return props.state;
  };

  const getBookmark = async (props: { productId: number }) => {
    const result = await CMS.getBookmarkObjectForProduct({
      productId: props.productId,
    });
    return result.length > 0;
  };

  const getAllBookmarkedTools = async () => {
    const result = await CMS.getAllBookmarkObjects();
    return result.map((e) => e.product);
  };

  return (
    <APIContext.Provider
      value={{ setBookmark, getBookmark, getAllBookmarkedTools }}
    >
      {props.children}
    </APIContext.Provider>
  );
};

export const useAPI = () => useContext(APIContext as Context<APIContextProps>);

export const APIControls = (props: {
  children: (args: APIContextProps) => ReactElement;
}) => props.children(useAPI());
