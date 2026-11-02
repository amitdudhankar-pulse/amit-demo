// import { twMerge } from "tailwind-merge";
// import { Button, Form, Menu, MenuButton, MenuList } from "./components";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { Product as ProductCore } from "@/lib/lib";
// type Product = Omit<
//   Omit<ProductCore, "category_relations">,
//   "function_relations"
// >;

// export interface FilterState {
//   showFree: boolean;
//   showPaid: boolean;
//   showFreemium: boolean;
//   showActiveDeals: boolean;

//   editorsChoice: boolean;
//   featured: boolean;
//   verified: boolean;
//   popular: boolean;
//   contentType: "tool" | "course" | "all";

//   enable: {
//     curation: boolean;
//     price: boolean;
//   };
// }
// interface ToolFilterState {
//   state: FilterState;
// }

// interface ToolFilterContextType {
//   filterState: ToolFilterState;
//   setFilterState: React.Dispatch<React.SetStateAction<ToolFilterState>>;
// }

// const ToolFilterContext = createContext<ToolFilterContextType | undefined>(
//   undefined
// );

// export const ToolFilterProvider: React.FC<{
//   children: React.ReactNode;
//   enable: {
//     price: boolean;
//     curation: boolean;
//   };
// }> = (props) => {
//   const [filterState, setFilterState] = useState<ToolFilterState>({
//     state: {
//       contentType: "tool",
//       showActiveDeals: true,
//       showFree: true,
//       showFreemium: true,
//       showPaid: true,
//       editorsChoice: true,
//       featured: true,
//       verified: true,
//       popular: true,
//       enable: props.enable,
//     },
//   });

//   return (
//     <ToolFilterContext.Provider value={{ filterState, setFilterState }}>
//       {props.children}
//     </ToolFilterContext.Provider>
//   );
// };

// export const useToolFilter = () => {
//   const context = useContext(ToolFilterContext);
//   if (context === undefined) {
//     throw new Error("useToolFilter must be used within a ToolFilterProvider");
//   }
//   return context;
// };

// const ToolFilterList: React.FC<{
//   toolList: Product[];
//   children: (filteredTools: Product[]) => React.ReactNode;
// }> = (props) => {
//   const { filterState } = useToolFilter();
//   const typeFilter = (p: Product, f: FilterState) => {
//     if (f.contentType === "all") return true;
//     if (f.contentType === "tool") return p.course !== true;
//     if (f.contentType === "course") return p.course === true;
//     return true;
//   };

//   const pricingFilter = (p: Product, f: FilterState) =>
//     (f.showActiveDeals && p.pricing_mode?.value === "active_deals") ||
//     (f.showFree && p.pricing_mode?.value === "free") ||
//     (f.showFreemium && p.pricing_mode?.value === "freemium") ||
//     (f.showPaid && p.pricing_mode?.value === "paid");

//   const curationFilter = (p: Product, f: FilterState) =>
//     (f.editorsChoice && p.editor_choice) ||
//     (f.featured && p.featured) ||
//     (f.verified && p.verified) ||
//     (f.popular && p.popular);

//   const filterToolArray = (p: Product[], f: FilterState) =>
//     p
//       .filter((e) => typeFilter(e, f))
//       .filter((e) =>
//         filterState.state.enable.price ? pricingFilter(e, f) : true
//       )
//       .filter((e) =>
//         filterState.state.enable.curation ? curationFilter(e, f) : true
//       );

//   return (
//     <>{props.children(filterToolArray(props.toolList, filterState.state))}</>
//   );
// };
// export default ToolFilterList;

// export const ToolFilterMenu = () => {
//   const { filterState, setFilterState } = useToolFilter();

//   return (
//     <Menu>
//       {({ isOpen }) => (
//         <>
//           <MenuButton>
//             <Button.Primary
//               text="Filter"
//               size="sm"
//               className={twMerge(isOpen ? "bg-primary-dark" : "bg-primary")}
//             />
//           </MenuButton>

//           <MenuList>
//             {/* CATEGORY SELECT */}
//             <div className="p-4 border-b">
//               <label className="font-semibold block mb-2">Content Type</label>
//               <select
//                 className="border p-2 rounded w-full"
//                 value={filterState.state.contentType}
//                 onChange={(e) =>
//                   setFilterState({
//                     ...filterState,
//                     state: {
//                       ...filterState.state,
//                       contentType: e.target.value as any,
//                     },
//                   })
//                 }
//               >
//                 <option value="all">All</option>
//                 <option value="tool">AI Tools</option>
//                 <option value="course">AI Courses</option>
//               </select>
//             </div>

//             {/* EXISTING FILTER FORM */}
//             <Form.Filter
//               className="p-5"
//               onSubmit={async (data) => {
//                 setFilterState({
//                   ...filterState,
//                   state: { ...filterState.state, ...data },
//                 });
//               }}
//               value={filterState.state}
//               enable={filterState.state.enable}
//             />
//           </MenuList>
//         </>
//       )}
//     </Menu>
//   );
// };

import { twMerge } from "tailwind-merge";
import { Button, Form, Menu, MenuButton, MenuList } from "./components";
import React, { createContext, useContext, useState } from "react";
import { Product as ProductCore } from "@/lib/lib";

type Product = Omit<
  Omit<ProductCore, "category_relations">,
  "function_relations"
>;

export interface FilterState {
  showFree: boolean;
  showPaid: boolean;
  showFreemium: boolean;
  showActiveDeals: boolean;

  editorsChoice: boolean;
  featured: boolean;
  verified: boolean;
  popular: boolean;

  contentType: "tool" | "course" | "all";

  enable: {
    curation: boolean;
    price: boolean;
  };
}

interface ToolFilterState {
  state: FilterState;
}

interface ToolFilterContextType {
  filterState: ToolFilterState;
  setFilterState: React.Dispatch<React.SetStateAction<ToolFilterState>>;
}

const ToolFilterContext = createContext<ToolFilterContextType | undefined>(
  undefined,
);

// export const ToolFilterProvider: React.FC<{
//   children: React.ReactNode;
//   enable: {
//     price: boolean;
//     curation: boolean;
//   };
// }> = (props) => {
//   const [filterState, setFilterState] = useState<ToolFilterState>({
//     state: {
//       contentType: "tool",
//       showActiveDeals: false,
//       showFree: false,
//       showFreemium: false,
//       showPaid: false,
//       editorsChoice: false,
//       featured: false,
//       verified: false,
//       popular: false,
//       // showActiveDeals: true,
//       // showFree: true,
//       // showFreemium: true,
//       // showPaid: true,
//       // editorsChoice: true,
//       // featured: true,
//       // verified: true,
//       // popular: true,
//       enable: props.enable,
//     },
//   });

//   return (
//     <ToolFilterContext.Provider value={{ filterState, setFilterState }}>
//       {props.children}
//     </ToolFilterContext.Provider>
//   );
// };

export const ToolFilterProvider: React.FC<{
  children: React.ReactNode;
  enable: {
    price: boolean;
    curation: boolean;
  };
  defaultPriceChecked?: boolean; // 👈 ADD THIS
}> = (props) => {
  const [filterState, setFilterState] = useState<ToolFilterState>({
    state: {
      contentType: "tool",

      // 👇 PRICE DEFAULTS CONTROLLED HERE
      showActiveDeals: props.defaultPriceChecked ?? false,
      showFree: props.defaultPriceChecked ?? false,
      showFreemium: props.defaultPriceChecked ?? false,
      showPaid: props.defaultPriceChecked ?? false,

      // 👇 everything else stays unticked
      editorsChoice: false,
      featured: false,
      verified: false,
      popular: false,

      enable: props.enable,
    },
  });

  return (
    <ToolFilterContext.Provider value={{ filterState, setFilterState }}>
      {props.children}
    </ToolFilterContext.Provider>
  );
};

export const useToolFilter = () => {
  const context = useContext(ToolFilterContext);
  if (context === undefined) {
    throw new Error("useToolFilter must be used within a ToolFilterProvider");
  }
  return context;
};

// ⭐ FILTERING LOGIC (TOOLS + COURSES + ALL)
const ToolFilterList: React.FC<{
  toolList: Product[];
  children: (filteredTools: Product[]) => React.ReactNode;
}> = (props) => {
  const { filterState } = useToolFilter();
  const f = filterState.state;

  const typeFilter = (p: Product) => {
    if (f.contentType === "all") return true;
    if (f.contentType === "tool") return p.course !== true;
    if (f.contentType === "course") return p.course === true;
    return true;
  };

  // const pricingFilter = (p: Product) => {
  //   if (f.contentType !== "tool") return true;
  //   return (
  //     (f.showActiveDeals && p.pricing_mode?.value === "active_deals") ||
  //     (f.showFree && p.pricing_mode?.value === "free") ||
  //     (f.showFreemium && p.pricing_mode?.value === "freemium") ||
  //     (f.showPaid && p.pricing_mode?.value === "paid")
  //   );
  // };

  const pricingFilter = (p: Product) => {
    const checks: boolean[] = [];

    if (f.showActiveDeals)
      checks.push(p.pricing_mode?.value === "active_deals");

    if (f.showFree) checks.push(p.pricing_mode?.value === "free");

    if (f.showFreemium) checks.push(p.pricing_mode?.value === "freemium");

    if (f.showPaid) checks.push(p.pricing_mode?.value === "paid");

    // 🔑 nothing selected → allow all
    if (checks.length === 0) return true;

    // OR logic inside price group
    return checks.some(Boolean);
  };

  // const curationFilter = (p: Product) => {
  //   return (
  //     (f.editorsChoice && p.editor_choice) ||
  //     (f.featured && p.featured) ||
  //     (f.verified && p.verified) ||
  //     (f.popular && p.popular)
  //   );
  // };

  const curationFilter = (p: Product) => {
    const f = filterState.state;

    const checks: boolean[] = [];

    // push checks only when toggle is ON
    if (f.editorsChoice) checks.push(p.editor_choice === true);
    if (f.featured) checks.push(p.featured === true);
    if (f.verified) checks.push(p.verified === true);
    if (f.popular) checks.push(p.popular === true);

    // if nothing selected → allow everything
    if (checks.length === 0) return true;

    // must pass ALL active checks
    return checks.every(Boolean);
  };

  const filtered = props.toolList
    .filter(typeFilter)
    .filter((e) => (f.enable.price ? pricingFilter(e) : true))
    .filter((e) => (f.enable.curation ? curationFilter(e) : true));

  return <>{props.children(filtered)}</>;
};

export default ToolFilterList;

// ⭐ SMART FILTER RESET ON TYPE CHANGE
export const ToolFilterMenu = () => {
  const { filterState, setFilterState } = useToolFilter();

  const handleContentTypeChange = (value: "tool" | "course" | "all") => {
    let updates: Partial<FilterState> = { contentType: value };

    if (value === "course" || value === "all") {
      if (value === "course") {
        updates = {
          ...updates,
          // disable price filters (courses don't use pricing)
          showActiveDeals: false,
          showFree: false,
          showFreemium: false,
          showPaid: false,
        };
      }
    }

    setFilterState({
      ...filterState,
      state: { ...filterState.state, ...updates },
    });
  };

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton as={Button.Primary}
            text="Filter"
            size="sm"
            className={twMerge(isOpen ? "bg-primary-dark" : "bg-primary")}
          />

          <MenuList>
            <div className="p-4 border-b">
              <label className="font-semibold block mb-2">Content Type</label>
              <select
                className="border p-2 rounded w-full"
                value={filterState.state.contentType}
                onChange={(e) => handleContentTypeChange(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="tool">AI Tools</option>
                <option value="course">AI Courses</option>
              </select>
            </div>

            <Form.Filter
              className="p-5"
              // onSubmit={async (data) => {
              //   setFilterState({
              //     ...filterState,
              //     state: { ...filterState.state, ...data },
              //   });
              // }}
              onSubmit={async (data) => {
                setFilterState((prev) => ({
                  ...prev,
                  state: {
                    ...prev.state,
                    ...data, // apply user toggles
                    contentType: prev.state.contentType, // keep current type!
                  },
                }));
              }}
              value={filterState.state}
              enable={filterState.state.enable}
            />
          </MenuList>
        </>
      )}
    </Menu>
  );
};
