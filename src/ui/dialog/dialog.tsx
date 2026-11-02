import {
  Form,
  Link,
  Text,
  UserMenu,
  Button,
  parseAMW,
} from "@/ui/components/components";
import { CMS, Product } from "@/lib/lib";
import {
  Dialog,
  DialogControls,
  DialogControlsProps,
  useDialogControls,
} from "./dialog_core";
import { Paths, Constants } from "@/contants";
import { FcGoogle } from "react-icons/fc";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  RedditShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  EmailShareButton,
  TelegramShareButton,
  WhatsappIcon,
  TwitterIcon,
  FacebookIcon,
  TelegramIcon,
  RedditIcon,
  LinkedinIcon,
  PinterestIcon,
  EmailIcon,
} from "react-share";
import { AuthControls } from "@/ui/logic/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { loginWithGoogle } from "@/lib/lib";

const NewsletterDialog = (props: { text: string }) => {
  return (
    <ThankYouDialog.Controls>
      {({ open: openThankyou }) => (
        <Dialog<void>
          id={Paths.DIALOG_ID.NEWSLETTER_FORM}
          className="md:w-10/12 bg-primary-light-extra max-w-screen-md"
        >
          {() => (
            <div className="flex flex-col gap-4">
              <div className="text-center">{parseAMW(props.text)}</div>
              <Form.Newsletter
                onSubmit={async (data) => {
                  await CMS.addNewsletterSubscriber(data);
                  openThankyou("You have succesfully subscribed");
                }}
              />
            </div>
          )}
        </Dialog>
      )}
    </ThankYouDialog.Controls>
  );
};

const UnderDev = () => {
  const { closeDialog } = useDialogControls({
    id: Paths.DIALOG_ID.UNDER_DEV,
  });
  return (
    <Dialog id={Paths.DIALOG_ID.UNDER_DEV}>
      {() => (
        <Form.Newsletter
          title="This feature is on its way! Subscribe to stay updated"
          onSubmit={async (data) => {
            await CMS.addNewsletterSubscriber(data);
            closeDialog();
          }}
        />
      )}
    </Dialog>
  );
};

const ShareDialog = () => {
  const size = 40;
  return (
    <Dialog<{ type: "blog" | "tool"; url: string }>
      id={Paths.DIALOG_ID.SHARE_PRODUCT}
    >
      {({ data }) => (
        <div className="flex flex-col gap-5 text-center">
          <Text.H2>
            {data?.type === "blog" ? "Share this Blog" : "Share this AI Tool"}
          </Text.H2>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              [FacebookShareButton, FacebookIcon],
              [WhatsappShareButton, WhatsappIcon],
              [TwitterShareButton, TwitterIcon],
              [RedditShareButton, RedditIcon],
              [LinkedinShareButton, LinkedinIcon],
              [PinterestShareButton, PinterestIcon],
              [EmailShareButton, EmailIcon],
              [TelegramShareButton, TelegramIcon],
            ].map(([Parent, Child]: any[], index: number) => (
              <Parent url={data?.url ?? ""} key={index}>
                <Child className="rounded-md" size={40} />
              </Parent>
            ))}
          </div>
        </div>
      )}
    </Dialog>
  );
};

const LoginDialog = () => {
  return (
    <Dialog<string> id={Paths.DIALOG_ID.LOGIN}>
      {({ data }) => (
        <div
          className="flex flex-col gap-5 text-center align-center w-full"
          style={{ alignItems: "center" }}
        >
          <Text.H2>Login to explore more features</Text.H2>
          <Text.P>
            Login to explore Exclusive deals, Comments & Reviews, Bookmarking,
            Comparisons & much more
          </Text.P>
          <AuthControls>
            {({ user }) => (
              <>
                {!!user ? (
                  <UserMenu user={user} menuOptions={[]} />
                ) : (
                  // <Button.GoogleLogin href={LOGIN_URL} />
                  // <Button.GoogleLogin
                  //   onClick={() => {
                  //     window.location.href = `${Constants.BASE_URL}/auth/login/google`;
                  //   }}
                  // />
                  <Button.GoogleLogin
                    onClick={() => {
                      window.location.href =
                  `${Constants.BASE_URL}/auth/login/google` +
                  `?redirect=${encodeURIComponent('https://uat-cms.groupify.ai/login')}`;
                  // `?redirect=${encodeURIComponent(window.location.origin)}`;
                    }}
                  />
                )}
              </>
            )}
          </AuthControls>
        </div>
      )}
    </Dialog>
  );
};

const DIALOG_ID = {
  Review: "review-form", // Changed from "dialog-review" to match Paths.DIALOG_ID.REVIEW_FORM
  Filter: "dialog-filter",
  Error: "error-dialog",
  ThankYou: "thank-you",
};

const Review = {
  ID: DIALOG_ID.Review,
  Dialog: () => (
    <ThankYouDialog.Controls>
      {({ open: openThankyou }) => (
        <Dialog<Product> id={DIALOG_ID.Review}>
          {({ data, close }) => (
            <Form.Review
              onSubmit={async (data) => {
                await CMS.addReview(data);
                openThankyou("Thank you for sharing your feedback");
                close();
              }}
              product={data!}
            />
          )}
        </Dialog>
      )}
    </ThankYouDialog.Controls>
  ),
};

const ErrorDialog = {
  ID: DIALOG_ID.Error,
  useDialog: () => useDialogControls<string>({ id: DIALOG_ID.Error }),
  Dialog: () => (
    <Dialog<string> id={DIALOG_ID.Error}>
      {({ data, close }) => <>{data}</>}
    </Dialog>
  ),
};

const ThankYouDialog = {
  ID: DIALOG_ID.ThankYou,
  Controls: (props: Omit<DialogControlsProps<string>, "id">) => (
    <DialogControls<string> id={DIALOG_ID.ThankYou}>
      {props.children}
    </DialogControls>
  ),
  Dialog: () => (
    <Dialog<string> id={DIALOG_ID.ThankYou}>
      {({ data, close }) => (
        <div className="flex flex-col gap-3 justify-center items-center text-center">
          <Text.H2>Thank You</Text.H2>
          <picture>
            <source
              srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp"
              type="image/webp"
            />
            <img
              className="size-32 p-7 rounded-full bg-gray-300"
              src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif"
              alt="🎉"
            />
          </picture>
          {data && <Text.P className="font-semibold">{data}</Text.P>}
        </div>
      )}
    </Dialog>
  ),
};

export {
  NewsletterDialog,
  ShareDialog,
  UnderDev,
  LoginDialog,
  Review,
  ErrorDialog,
  ThankYouDialog,
};
export * from "./dialog_core";
