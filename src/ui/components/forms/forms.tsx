import {
  Checkbox as HCheckbox,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Select,
  Textarea,
} from "@headlessui/react";
import {
  Text,
  Button,
  delayedPromise,
  Rating as RatingUI,
  ErrorMessage,
  ChakraTheme,
  ChakraProvider,
  ThankYouDialog,
  FilterState,
} from "@/ui/components/components";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ValidationError } from "@/lib/exceptions";
import { CiCircleInfo } from "react-icons/ci";
import {
  Review,
  Rating,
  NewReview,
  Product,
  Functions,
  ToolCategoryList,
  CMS,
  NewToolData,
  NewToolDataSchema,
} from "@/lib/lib";
import {
  Input as ChInput,
  InputGroup as ChInputGroup,
  InputLeftAddon,
  Checkbox as ChCheckbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Textarea as ChTextarea,
  extendTheme,
} from "@chakra-ui/react";
import React from "react";
import { FaX } from "react-icons/fa6";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { z, ZodError } from "zod";
import { Paths } from "@/contants";

const InputStyle = {
  _hover: { borderColor: "black" },
  baseStyle: {
    borderColor: "black",
    _hover: {
      borderColor: "black",
    },
    field: {
      borderColor: "black",
      _hover: {
        borderColor: "black",
      },
      _focus: {
        borderColor: "black",
      },
    },
    control: {
      borderColor: "gray.600",
      _hover: {
        borderColor: "black",
      },
      _focus: {
        borderColor: "black",
      },
    },
  },
};

const ChakraThemeForms = extendTheme({
  components: {
    Input: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: "black",
          },
          _hover: {
            borderColor: "black",
          },

          border: "1px solid black",
        },
      },
    },
    Radio: InputStyle,
    Select: InputStyle,
    Checkbox: InputStyle,
    // Textarea: InputStyle,
    InputLeftAddon: InputStyle,
  },
});

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

const useForm = <T,>(props: {
  initialValue: T;
  onSubmit?: (data: T) => Promise<void>;
  useStatefulRef?: boolean;
}) => {
  const [state, setState] = useState<T>(props.initialValue);
  const [errorMessage, setErrorMessage] = useState<
    undefined | string | string[]
  >(undefined);
  const handler = !!props.onSubmit
    ? async () => {
        setErrorMessage(undefined);
        await delayedPromise(1 * 1000);
        await props.onSubmit!(state)
          .then((_) => setErrorMessage(undefined))
          .catch((e) => {
            if (e instanceof ValidationError) setErrorMessage(e.message);
            throw e;
          });
      }
    : undefined;

  const reset = () => setState(props.initialValue);

  const setValue = (props: {
    [k in keyof T]?: any;
  }) => {
    setState({ ...state, ...props });
  };

  return {
    submitHandler: handler,
    value: state,
    setValue,
    errorMessage: errorMessage,
    reset,
  };
};

const NewsletterForm = (props: {
  title?: string;
  onSubmit?: (props: { email: string }) => Promise<void>;
}) => {
  const {
    value,
    setValue,
    submitHandler: handler,
    errorMessage,
  } = useForm<{ email: string }>({
    initialValue: { email: "" },
    onSubmit: props.onSubmit,
  });
  return (
    <Fieldset className="flex flex-col text-p gap-5">
      {!!errorMessage && <ErrorMessage text={errorMessage} />}
      <div className="flex flex-row gap-5">
        <Field className="flex flex-col gap-2 w-full">
          <Input
            className="outline outline-1 outline-gray-400 rounded-md bg-white text-p p-2 w-full placeholder:bg-white"
            name="email"
            placeholder="Email Address"
            onChange={(e) => setValue({ ...value, email: e.target.value })}
          />
        </Field>
        <div className="flex justify-end">
          <Button.PrimaryBoundary
            text="Subscribe"
            action={{ type: "callback", onClick: handler }}
          />
        </div>
      </div>
    </Fieldset>
  );
};

const ReviewForm = ({
  ...props
}: {
  title?: string;
  value?: NewReview;
  product: Product;
  onSubmit?: (props: NewReview) => Promise<void>;
}) => {
  const { value, setValue, errorMessage, submitHandler } = useForm<NewReview>({
    initialValue: {
      product: props.product.id,
      ease_of_use: 0,
      value_for_money: 0,
      intuitive_interface: 0,
      overall_satisfaction: 0,
      support_team_responsiveness: 0,
      ease_of_customization: 0,
    },
    onSubmit: props.onSubmit,
  });

  return (
    <Fieldset className="flex flex-col text-p gap-5">
      <Legend>
        <Text.H2 className="font-bold">
          Write a Review For {props.product.title}
        </Text.H2>
      </Legend>
      {!!errorMessage && (
        <div className="flex flex-wrap gap-1.5 items-center w-full p-2 rounded-lg outline outline-1 outline-boundary-light bg-gray-200">
          <CiCircleInfo color="red" size={25} />
          <Text.Indicative className="text-red-500">
            {errorMessage}
          </Text.Indicative>
        </div>
      )}

      <div className="grid grid-cols-1 w-fit gap-2">
        {[
          ["Ease of Use", "ease_of_use"],
          ["Ease of Customization", "ease_of_customization"],
          ["Intuitive Interface", "intuitive_interface"],
          ["Value for Money ", "value_for_money"],
          ["Support Team Responsiveness ", "support_team_responsiveness"],
          ["Overall Satisfaction", "overall_satisfaction"],
        ].map(([k, v], i) => {
          const key = v as keyof Rating;
          return (
            <Field
              className="flex gap-3 items-center whitespace-nowrap"
              key={i}
            >
              <Text.P>{k}</Text.P>
              <RatingUI
                rating={value[key] ?? 0}
                onChange={(e) => {
                  const val = { ...value };
                  val[key] = e;
                  setValue(val);
                }}
              />
            </Field>
          );
        })}
      </div>
      <Field className="flex flex-col gap-2 ">
        <Label className="block">Comment</Label>
        <Textarea
          className="outline outline-1 outline-gray-400 rounded-md bg-white bg-opacity-70 text-p p-2"
          name="comment"
          value={props.value?.comment}
          onChange={(e) => setValue({ ...value, comment: e.target.value })}
        />
      </Field>
      <div className="flex justify-end w-full">
        <Button.Primary
          text="Submit"
          action={{ type: "callback", onClick: submitHandler }}
        />
      </div>
    </Fieldset>
  );
};

const NewToolForm = (
  props: PropsWithChildren<{ className?: string; legend: string }>
) => {
  const { value, setValue, errorMessage, reset, submitHandler } =
    useForm<NewToolData>({
      initialValue: {
        intention: "submit_new_tool",
        title: "",
        user_designation: "",
        user_email: "",
        user_name: "",
        function: [],
        category: "",
        long_description: "",
        usecases: "",
        pricing: "freemium",

        // ✅ REQUIRED SOCIAL LINKS (empty strings)
        youtube_url: "",
        facebook_url: "",
        x_url: "",
        instagram_url: "",
        linkedin_url: "",
        tiktok_url: "",

        // ✅ REQUIRED OTHER FIELDS
        pricing_url: "",
        tags: "",
        feedback: "",
        short_description: "",
        where_did_you_hear: "",

        // FAQ fields (likely required too)
        faq_ques_1: "",
        faq_ans_1: "",
        faq_ques_2: "",
        faq_ans_2: "",
        faq_ques_3: "",
        faq_ans_3: "",
      },

      // onSubmit: async (e) => {
      //   console.log(JSON.stringify(e, null, 2));
      //   try {
      //     const data = NewToolDataSchema.parse(e);
      //     await CMS.addNewToolEntry(e);
      //     window.location.href = Paths.OTHERS.PRICING;
      //   } catch (e) {
      //     if (e instanceof ZodError) {
      //       throw new ValidationError(e.issues.map((e) => e.message));
      //     }
      //   }
      // },

      onSubmit: async (formData) => {
        try {
          NewToolDataSchema.parse(formData);
          // 🔥 save user email for pricing page
          localStorage.setItem("groupify_user_email", formData.user_email);
          await CMS.addNewToolEntry(formData);

          // After saving, go to pricing page
          window.location.href = "/pricing";
        } catch (e) {
          if (e instanceof ZodError) {
            throw new ValidationError(e.issues.map((i) => i.message));
          }
        }
      },
    });

  return (
    <>
      <ChakraProvider
        theme={extendTheme({
          components: {
            Radio: {
              baseStyle: {
                control: {
                  borderColor: "gray.400",
                },
              },
            },
            Input: {
              defaultProps: { variant: "outline" },
              variants: {
                outline: {
                  field: {
                    borderColor: "gray.400",
                    _hover: {
                      borderColor: "gray.500",
                    },
                  },
                },
              },
            },
            Textarea: {
              defaultProps: { variant: "outline" },
              variants: {
                outline: {
                  borderColor: "gray.400",
                  _hover: {
                    borderColor: "gray.500",
                  },
                },
              },
            },
            Checkbox: {
              baseStyle: {
                control: {
                  borderColor: "gray.400",
                },
              },
            },
          },
        })}
      >
        <Fieldset
          className={twMerge(
            "flex flex-col text-p gap-7 w-full",
            props.className
          )}
        >
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col w-full">
              <Text.H3>What would you like to do ?</Text.H3>
              <hr className="border border-boundary-light w-full my-3" />
            </div>
            <div className="flex flex-col gap-4 md:pl-5 w-full">
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Select Option</Label>
                <RadioGroup
                  value={value.intention}
                  onChange={(e: "submit_new_tool" | "update_tool") => {
                    setValue({ intention: e });
                  }}
                >
                  <div className="flex flex-col flex-wrap gap-3 outline-1 outline-boundary-light rounded-md p-5">
                    <Radio value={"submit_new_tool"}>
                      Submit a new tool to GroupifyAI
                    </Radio>
                    <Radio value={"update_tool"}>
                      Update an existing tool on GroupifyAI
                    </Radio>
                  </div>
                </RadioGroup>
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col w-full">
              <Text.H3>Basic Info</Text.H3>
              <hr className="border border-boundary-light w-full my-3" />
            </div>
            <div className="flex flex-col gap-4 md:pl-5 w-full">
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Your Name</Label>
                <ChInput
                  variant="outline"
                  placeholder="Ex: Greatest Joe, etc"
                  value={value.user_name}
                  onChange={(e) => setValue({ user_name: e.target.value })}
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Company Email ID</Label>
                <ChInput
                  variant="outline"
                  placeholder="Ex: you@company-domain.com"
                  value={value.user_email}
                  onChange={(e) => setValue({ user_email: e.target.value })}
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Designation</Label>
                <ChInput
                  variant="outline"
                  placeholder="CEO / CTO / Marketer / Product Manager"
                  value={value.user_designation}
                  onChange={(e) =>
                    setValue({ user_designation: e.target.value })
                  }
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col w-full">
              <Text.H3>Tool Details</Text.H3>
              <hr className="border border-boundary-light w-full my-3" />
            </div>
            <div className="flex flex-col gap-4 md:pl-5 w-full">
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Tool Name</Label>
                <ChInput
                  variant="outline"
                  placeholder="Tool Title"
                  onChange={(e) => setValue({ title: e.target.value })}
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Tool URL</Label>
                <ChInputGroup>
                  <InputLeftAddon>https://groupify.ai/</InputLeftAddon>
                  <ChInput
                    variant="outline"
                    placeholder="Tool Url"
                    onChange={(e) => setValue({ slug: e.target.value })}
                  />
                </ChInputGroup>
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">
                  Category (pick one option)
                  <Text.Indicative className="font-light">
                    Suggest more Categories at the bottom, in feedback
                  </Text.Indicative>
                </Label>
                <RadioGroup
                  name="form-name"
                  onChange={(e) => setValue({ category: e })}
                >
                  <div className="flex flex-col flex-wrap gap-3 outline-1 outline-boundary-light rounded-md p-5">
                    {Object.values(ToolCategoryList)
                      .filter(
                        (e) => e.value !== ToolCategoryList.free_ai_tools?.value
                      )
                      .map((e, i) => (
                        <Radio key={i} value={e.value}>
                          {e.title}
                        </Radio>
                      ))}
                  </div>
                </RadioGroup>
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">
                  Function (pick 3 most relevant departments)
                  <Text.Indicative className="font-light">
                    Suggest more Functions at the bottom, in feedback
                  </Text.Indicative>
                </Label>
                <CheckboxGroup
                  defaultValue={[]}
                  onChange={(e) => setValue({ function: e })}
                >
                  <div className="flex flex-col md:flex-row gap-3 outline-1 outline-boundary-light rounded-md p-5">
                    <div className="flex flex-col flex-wrap gap-3 w-full md:w-5/10">
                      {Object.entries(Functions).map((e, i) => (
                        <>
                          {i % 2 ? (
                            <></>
                          ) : (
                            <ChCheckbox value={e[0]}>{e[1].title}</ChCheckbox>
                          )}
                        </>
                      ))}
                    </div>
                    <div className="flex flex-col flex-wrap gap-3 w-full md:w-5/10">
                      {Object.entries(Functions).map((e, i) => (
                        <>
                          {i % 2 ? (
                            <ChCheckbox value={e[0]}>{e[1].title}</ChCheckbox>
                          ) : (
                            <></>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                </CheckboxGroup>
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">
                  Short one-line description (Mention relevant keywords)
                </Label>
                <ChInput
                  variant="outline"
                  placeholder="Short Description"
                  onChange={(e) =>
                    setValue({ short_description: e.target.value })
                  }
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">
                  Long Description (features of the tool)
                </Label>
                <ChTextarea
                  variant="outline"
                  placeholder="Features of the tool"
                  onChange={(e) =>
                    setValue({ long_description: e.target.value })
                  }
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Use cases</Label>
                <ChTextarea
                  variant="outline"
                  placeholder="Usecase"
                  onChange={(e) => setValue({ usecases: e.target.value })}
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">FAQs (Top 3 most relevant)</Label>
                <div className="flex flex-col flex-wrap gap-4 outline-1 outline-boundary-light rounded-md">
                  <div className="flex flex-col flex-wrap gap-1 outline-1 outline-boundary-light rounded-md">
                    <ChInput
                      variant="outline"
                      placeholder="Question 1"
                      onChange={(e) =>
                        setValue({
                          faq_ques_1: e.target.value.trim(),
                        })
                      }
                    />
                    <ChTextarea
                      variant="outline"
                      placeholder="Answer 1"
                      disabled={!value.faq_ques_1}
                      onChange={(e) =>
                        setValue({
                          faq_ans_1: e.target.value.trim(),
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col flex-wrap gap-1 outline-1 outline-boundary-light rounded-md">
                    <ChInput
                      variant="outline"
                      placeholder="Question 2"
                      disabled={!value.faq_ans_1}
                      onChange={(e) =>
                        setValue({ faq_ques_2: e.target.value.trim() })
                      }
                    />
                    <ChTextarea
                      variant="outline"
                      placeholder="Answer 2"
                      disabled={!value.faq_ques_2}
                      onChange={(e) =>
                        setValue({ faq_ans_2: e.target.value.trim() })
                      }
                    />
                  </div>
                  <div className="flex flex-col flex-wrap gap-1 outline-1 outline-boundary-light rounded-md">
                    <ChInput
                      variant="outline"
                      placeholder="Question 3"
                      onChange={(e) =>
                        setValue({ faq_ques_3: e.target.value.trim() })
                      }
                      disabled={!value.faq_ans_2}
                    />
                    <ChTextarea
                      variant="outline"
                      placeholder="Answer 3"
                      onChange={(e) =>
                        setValue({ faq_ans_3: e.target.value.trim() })
                      }
                      disabled={!value.faq_ques_3}
                    />
                  </div>
                </div>
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Select Pricing</Label>
                <RadioGroup name="form-name">
                  <div className="flex flex-col flex-wrap gap-3 outline-1 outline-boundary-light rounded-md p-5">
                    <Radio value={"freemium"}>Freemium</Radio>
                    <Radio value="paid">Paid</Radio>
                    <Radio value="free">Free</Radio>
                  </div>
                </RadioGroup>
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Link to the Pricing Page</Label>
                <ChInputGroup>
                  <InputLeftAddon>https://</InputLeftAddon>
                  <ChInput
                    variant="outline"
                    placeholder="your-website.com/pricing"
                    // value={value.pricing_url}
                    onChange={(e) => setValue({ pricing_url: e.target.value })}
                  />
                </ChInputGroup>
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">
                  Social Media Links (Add at least one)
                </Label>

                <div className="flex flex-col flex-wrap gap-1 outline-1 outline-boundary-light rounded-md">
                  {[
                    {
                      Component: FaFacebook,
                      placeholder: "Facebook",
                      valueKey: "facebook_url",
                    },
                    {
                      Component: FaX,
                      placeholder: "X / Twitter",
                      valueKey: "x_url",
                    },
                    {
                      Component: FaInstagram,
                      placeholder: "Instagram",
                      valueKey: "instagram_url",
                    },
                    {
                      Component: FaLinkedinIn,
                      placeholder: "LinkedIn",
                      valueKey: "linkedin_url",
                    },
                    {
                      Component: FaYoutube,
                      placeholder: "Youtube",
                      valueKey: "youtube_url",
                    },
                    {
                      Component: FaTiktok,
                      placeholder: "Tiktok",
                      valueKey: "tiktok_url",
                    },
                  ].map(({ Component, placeholder, valueKey }, i) => (
                    <ChInputGroup key={i}>
                      <InputLeftAddon>
                        <Component />
                      </InputLeftAddon>
                      <ChInput
                        variant="outline"
                        placeholder={placeholder}
                        onChange={(e) =>
                          setValue(
                            JSON.parse(`{ "${valueKey}": "${e.target.value}" }`)
                          )
                        }
                      />
                    </ChInputGroup>
                  ))}
                </div>
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">
                  Tags (Select most relevant 3 - 10 tags)
                </Label>
                <ChInput
                  variant="outline"
                  placeholder="Ex: AI Generator, Images, Photorealistic, etc"
                  onChange={(e) => {
                    setValue({ tags: e.target.value });
                  }}
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Feedback / Suggestions</Label>
                <ChTextarea
                  variant="outline"
                  value={value.feedback}
                  placeholder="Any special requests, feedback or suggestions to add more categories / functions"
                  onChange={(e) => setValue({ feedback: e.target.value })}
                />
              </Field>
              <Field className="flex flex-col gap-2 w-full">
                <Label className="block">Where did you hear about us?</Label>
                <ChInput
                  variant="outline"
                  value={value.where_did_you_hear}
                  placeholder="Tell us where you're from and how you discovered us (e.g., Pune – via Instagram ad)"
                  onChange={(e) =>
                    setValue({ where_did_you_hear: e.target.value })
                  }
                />
              </Field>
            </div>
          </div>
          <div className="flex flex-col justify-end w-full items-end gap-3 pl-2">
            {errorMessage && (
              <ErrorMessage text={errorMessage} className="w-full" />
            )}
            <Button.Primary
              text="Submit"
              size="md"
              action={{
                type: "callback",
                onClick: async () => {
                  await submitHandler?.();
                },
              }}
            ></Button.Primary>
          </div>
        </Fieldset>
      </ChakraProvider>
    </>
  );
};

const Checkbox = (props: {
  className?: string;
  name?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
}) => (
  <HCheckbox
    className={twMerge(
      "group block size-4 rounded border bg-white data-[checked]:bg-blue-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[checked]:data-[disabled]:bg-gray-500",
      props.className
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
);

const FilterForm = ({
  enable = { curation: true, price: true },
  ...props
}: {
  className?: string;
  value: FilterState;
  enable?: {
    curation: boolean;
    price: boolean;
  };
  onSubmit?: (data: FilterState) => Promise<void>;
}) => {
  const { value, setValue, errorMessage, submitHandler } = useForm<FilterState>(
    {
      initialValue: props.value,
      onSubmit: props.onSubmit,
    }
  );

  return (
    <Fieldset
      className={twMerge("flex flex-col w-full gap-3", props.className)}
    >
      {enable?.price && (
        <>
          <Text.H3>Price</Text.H3>
          <hr className="border border-boundary w-full" />
          <div className="flex flex-col w-full gap-2">
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.showFree}
                onChange={(v) => setValue({ ...value, showFree: v })}
              />
              <Label>Free</Label>
            </Field>
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.showActiveDeals}
                onChange={(v) => setValue({ ...value, showActiveDeals: v })}
              />
              <Label>Active Deals</Label>
            </Field>
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.showFreemium}
                onChange={(v) => setValue({ ...value, showFreemium: v })}
              />
              <Label>Freemium</Label>
            </Field>
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.showPaid}
                onChange={(v) => setValue({ ...value, showPaid: v })}
              />
              <Label>Paid</Label>
            </Field>
          </div>
        </>
      )}

      {enable?.curation && (
        <>
          <Text.H3 className="mt-1">Curation</Text.H3>
          <hr className="border border-boundary w-full" />
          <div className="flex flex-col w-full gap-2">
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.editorsChoice}
                onChange={(v) => setValue({ ...value, editorsChoice: v })}
              />
              <Label>Editor&apos;s Choice</Label>
            </Field>
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.featured}
                onChange={(v) => setValue({ ...value, featured: v })}
              />
              <Label>Featured</Label>
            </Field>
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.verified}
                onChange={(v) => setValue({ ...value, verified: v })}
              />
              <Label>Verified</Label>
            </Field>
            <Field className="flex flex-row gap-2 w-fit">
              <Checkbox
                value={value.popular}
                onChange={(v) => setValue({ ...value, popular: v })}
              />
              <Label>Popular</Label>
            </Field>
          </div>
        </>
      )}

      <Button.Primary
        size="sm"
        text="Apply"
        action={{ type: "callback", onClick: submitHandler }}
      />
    </Fieldset>
  );
};

// const SponsorshipContactForm = (props: {
//   onSubmit?: (data: {
//     name: string;
//     email: string;
//     company?: string;
//     website?: string;
//     subject?: string;
//     message?: string;
//   }) => Promise<void>;
// }) => {
//   const { value, setValue, submitHandler, errorMessage } = useForm({
//     initialValue: {
//       name: "",
//       email: "",
//       company: "",
//       website: "",
//       subject: "",
//       message: "",
//     },
//     onSubmit: props.onSubmit,
//   });

//   return (
//     <Fieldset className="flex flex-col gap-6 w-full">
//       {errorMessage && <ErrorMessage text={errorMessage} />}

//       <Field className="flex flex-col gap-2">
//         <Label>Name</Label>
//         <Input
//           className="input-dark"
//           value={value.name}
//           onChange={(e) => setValue({ name: e.target.value })}
//         />
//       </Field>

//       <Field className="flex flex-col gap-2">
//         <Label>Email</Label>
//         <Input
//           type="email"
//           className="input-dark"
//           value={value.email}
//           onChange={(e) => setValue({ email: e.target.value })}
//         />
//       </Field>

//       <Field className="flex flex-col gap-2">
//         <Label>Company</Label>
//         <Input
//           className="input-dark"
//           value={value.company}
//           onChange={(e) => setValue({ company: e.target.value })}
//         />
//       </Field>

//       <Field className="flex flex-col gap-2">
//         <Label>Website</Label>
//         <Input
//           className="input-dark"
//           value={value.website}
//           onChange={(e) => setValue({ website: e.target.value })}
//         />
//       </Field>

//       <Field className="flex flex-col gap-2">
//         <Label>Subject</Label>
//         <Input
//           className="input-dark"
//           value={value.subject}
//           onChange={(e) => setValue({ subject: e.target.value })}
//         />
//       </Field>

//       <Field className="flex flex-col gap-2">
//         <Label>Message</Label>
//         <Textarea
//           rows={4}
//           className="input-dark"
//           value={value.message}
//           onChange={(e) => setValue({ message: e.target.value })}
//         />
//       </Field>

//       <div className="flex justify-end">
//         <Button.Primary
//           text="Submit"
//           action={{ type: "callback", onClick: submitHandler }}
//         />
//       </div>
//     </Fieldset>
//   );
// };

const SponsorshipContactForm = (props: {
  onSubmit?: (data: {
    name: string;
    email: string;
    company_name?: string;
    website?: string;
    subject?: string;
    message?: string;
  }) => Promise<void>;
}) => {
  const { value, setValue, submitHandler, errorMessage } = useForm({
    initialValue: {
      name: "",
      email: "",
      company_name: "",
      website: "",
      subject: "",
      message: "",
    },
    onSubmit: props.onSubmit,
  });

  return (
    <>
      <ChakraProvider
        theme={extendTheme({
          components: {
            Radio: {
              baseStyle: {
                control: {
                  borderColor: "gray.400",
                },
              },
            },
            Input: {
              defaultProps: { variant: "outline" },
              variants: {
                outline: {
                  field: {
                    borderColor: "gray.400",
                    _hover: {
                      borderColor: "gray.500",
                    },
                  },
                },
              },
            },
            Textarea: {
              defaultProps: { variant: "outline" },
              variants: {
                outline: {
                  borderColor: "gray.400",
                  _hover: {
                    borderColor: "gray.500",
                  },
                },
              },
            },
            Checkbox: {
              baseStyle: {
                control: {
                  borderColor: "gray.400",
                },
              },
            },
          },
        })}
      >
        <Fieldset
          className="
    flex flex-col gap-10 text-p
    w-full max-w-[900px]
    min-h-[520px]
    mx-auto
    px-6 md:px-10
    py-8 md:py-10
  "
        >
          {/* Error */}
          {errorMessage && <ErrorMessage text={errorMessage} />}

          {/* ===== SECTION: BASIC INFO ===== */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col w-full">
              <Text.H3>Contact Information</Text.H3>
              <hr className="border border-boundary-light w-full my-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:pl-5">
              <Field className="flex flex-col gap-2">
                <Label>Your Name</Label>
                <Input
                  className="input-dark h-10 border border-boundary-light rounded-md"
                  placeholder="Your full name"
                  value={value.name}
                  onChange={(e) => setValue({ name: e.target.value })}
                />
              </Field>

              <Field className="flex flex-col gap-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  className="input-dark h-10 border border-boundary-light rounded-md"
                  placeholder="you@company.com"
                  value={value.email}
                  onChange={(e) => setValue({ email: e.target.value })}
                />
              </Field>

              <Field className="flex flex-col gap-2">
                <Label>Company</Label>
                <Input
                  className="input-dark h-10 border border-boundary-light rounded-md"
                  placeholder="Company name"
                  value={value.company_name}
                  onChange={(e) => setValue({ company_name: e.target.value })}
                />
              </Field>

              <Field className="flex flex-col gap-2">
                <Label>Website</Label>
                <Input
                  className="input-dark h-10 border border-boundary-light rounded-md"
                  placeholder="https://yourcompany.com"
                  value={value.website}
                  onChange={(e) => setValue({ website: e.target.value })}
                />
              </Field>
            </div>
          </div>

          {/* ===== SECTION: MESSAGE ===== */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col w-full">
              <Text.H3>How can we help?</Text.H3>
              <hr className="border border-boundary-light w-full my-3" />
            </div>

            <div className="flex flex-col gap-6 md:pl-5">
              <Field className="flex flex-col gap-2">
                <Label>Subject</Label>
                <Input
                  className="input-dark h-10 border border-boundary-light rounded-md"
                  placeholder="Sponsorship / Partnership / Advertising"
                  value={value.subject}
                  onChange={(e) => setValue({ subject: e.target.value })}
                />
              </Field>

              <Field className="flex flex-col gap-2">
                <Label>Message</Label>
                <Textarea
                  rows={5}
                  className="input-dark h-10 border border-boundary-light rounded-md"
                  placeholder="Tell us about your goals, timeline, and expectations…"
                  value={value.message}
                  onChange={(e) => setValue({ message: e.target.value })}
                />
              </Field>
            </div>
          </div>

          {/* ===== ACTION ===== */}
          <div className="flex justify-end w-full">
            <Button.Primary
              text="Submit Request"
              size="md"
              action={{ type: "callback", onClick: submitHandler }}
            />
          </div>
        </Fieldset>
      </ChakraProvider>
    </>
  );
};

const Form = {
  Newsletter: NewsletterForm,
  NewTool: NewToolForm,
  Review: ReviewForm,
  Filter: FilterForm,
  SponsorshipContact: SponsorshipContactForm,
};

export { Form };
