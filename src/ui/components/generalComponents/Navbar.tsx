import {
  Logo,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  CloseIcon,
  HamburgerIcon,
  UserMenu,
  ClickToOpenDialog,
  Text,
} from "@/ui/components/components";
import { CMS, Configuration, loginWithGoogle, User } from "@/lib/lib";
import { NavbarAnimation } from "@/vendor/vendor";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";
import { Constants, Paths } from "@/contants";
import { useEffect } from "react";
import { AuthControls } from "@/ui/logic/auth";
import { IoIosLogOut } from "react-icons/io";
import {
  FaArrowDown,
  FaArrowUp,
  FaRegBookmark,
  FaSearch,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

// const LoginSection = (props: { className?: string }) => {
//   const router = useRouter();
//   return (
//     <AuthControls>
//       {({ user, logout }) => (
//         <>
//           {!!user ? (
//             <UserMenu
//               user={user}
//               menuOptions={[
//                 {
//                   title: "Favorites",
//                   onClick: () => {
//                     router.push(Paths.Frontend.FAVORITES.href);
//                   },
//                   icon: FaRegBookmark,
//                 },
//                 {
//                   title: "Logout",
//                   onClick: logout,
//                   icon: IoIosLogOut,
//                 },
//               ]}
//             />
//           ) : (
//             <Button.GoogleLogin href={LOGIN_URL} />
//           )}
//         </>
//       )}
//     </AuthControls>
//   );
// };

const LoginSection = (props: { className?: string }) => {
  const router = useRouter();

  return (
    <AuthControls>
      {({ user, logout, refresh }) => (
        <>
          {!!user ? (
            <UserMenu
              user={user}
              menuOptions={[
                {
                  title: "Favorites",
                  onClick: () => router.push(Paths.Frontend.FAVORITES.href),
                  icon: FaRegBookmark,
                },
                {
                  title: "Logout",
                  onClick: async () => {
                    await logout(); // Clean up Directus session
                  },
                  icon: IoIosLogOut,
                },
              ]}
            />
          ) : (
            // <Button.GoogleLogin
            //   onClick={async () => {
            //     try {
            //       // 1. Get Token from Firebase
            //       const result = await signInWithPopup(auth, googleProvider);
            //       const idToken = await result.user.getIdToken();

            //       // 2. Log into Directus using that token
            //       // Note: We use the CMS instance from your lib
            //       await CMS.login({
            //         provider: 'google',
            //         access_token: idToken
            //       });

            //       // 3. Trigger your existing refresh logic to update the Navbar
            //       await refresh();

            //     } catch (error) {
            //       console.error("Authentication failed", error);
            //     }
            //   }}
            // />
            // <Button.GoogleLogin
            //   onClick={async () => {
            //     const result = await signInWithPopup(auth, googleProvider);
            //     const idToken = await result.user.getIdToken();

            //     await loginWithGoogle(idToken); // REST call
            //     await refresh(); // AuthContext update
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
  );
};

const Navbar = (props: { className?: string; config: Configuration }) => {
  const navItems = [
    Paths.Frontend.SUBMIT_TOOL_FORM,
    Paths.Frontend.SUBSCRIBE_PAGE_FORM, // <-- add this
  ];

  const router = useRouter();

  useEffect(() => {
    void router.prefetch("/");
  }, [router]);

  const reducePath = (path: string) =>
    path
      .replace(Paths.Frontend.HOME.href, "")
      .replace(RegExp("page/.*"), "")
      .replace(RegExp("/", "g"), "");

  const isActive = (pathname: string) =>
    reducePath(router.pathname) === reducePath(pathname);

  const isHome = () =>
    reducePath(router.pathname) === reducePath(Paths.Frontend.HOME.href);

  return (
    <NavbarAnimation>
      <header
        className={twMerge(
          "flex flex-wrap justify-center items-center w-screen backdrop-filter backdrop-blur-2xl z-10"
        )}
      >
        <nav
          className={twMerge(
            "flex items-center justify-between w-full h-full py-1 pt-2 max-w-content-width",
            props.className
          )}
        >
          <Logo
            responsive
            mobileLogo={props.config.mobile_logo}
            desktopLogo={props.config.desktop_logo}
          />
          <div className="hidden md:flex flex-row">
            <ul className={twMerge("flex wrap items-center mx-4 gap-1 ")}>
              {props.config.nav_bar_menu?.map((e, i) => (
                <Menu key={"menu-" + i}>
                  {({ isOpen }) => (
                    <>
                      <MenuButton className="block flex-row gap-1 flex-nowrap whitespace-nowrap hover:bg-button-focus p-2 rounded-lg">
                        <div className="flex row gap-1 flex-nowrap whitespace-nowrap content-center">
                          <Text.P>{e.title}</Text.P>
                          {isOpen ? (
                            <MdKeyboardArrowUp size={20} />
                          ) : (
                            <MdKeyboardArrowDown size={20} />
                          )}
                        </div>
                      </MenuButton>
                      <MenuList>
                        {e.link_list.map((f, j) => (
                          <Link
                            noUnderline
                            href={f.url}
                            key={"link-" + j}
                            as={"a"}
                          >
                            <MenuItem>{f.title}</MenuItem>
                          </Link>
                        ))}
                      </MenuList>
                    </>
                  )}
                </Menu>
              ))}

              {navItems.map((item, index) => (
                <Link
                  key={index}
                  noUnderline
                  href={item.href}
                  as={"a"}
                  className={twMerge(
                    "px-3 py-1 rounded-md",
                    isActive(item.href)
                      ? "font-medium text-app-primary underline underline-offset-4"
                      : "hover:bg-button-focus"
                  )}
                >
                  <li className="leading-normal">{item.title}</li>
                </Link>
              ))}

              {!isHome() && (
                <Link
                  noUnderline
                  href={Paths.Frontend.SEARCH.href}
                  as={"a"}
                  className="p-2 hover:bg-button-focus rounded-md"
                >
                  <FaSearch />{" "}
                </Link>
              )}
            </ul>
            <LoginSection />
          </div>
          <div className="md:hidden flex flex-row">
            {/* <HamburgerIcon boxSize={12} /> */}
            <Menu closeOnSelect={false}>
              {({ isOpen }) => (
                <>
                  <MenuButton>
                    {isOpen ? <CloseIcon /> : <HamburgerIcon />}
                  </MenuButton>
                  <MenuList>
                    {props.config.nav_bar_menu?.map((e, index) => (
                      <Menu key={`mobile-menu-${index}`}>
                        {({ isOpen }) => (
                          <>
                            <MenuButton className="w-full px-4 py-2 text-left hover:bg-button-focus">
                              <div className="flex justify-between items-center">
                                <Text.P>{e.title}</Text.P>
                                {isOpen ? (
                                  <MdKeyboardArrowUp size={20} />
                                ) : (
                                  <MdKeyboardArrowDown size={20} />
                                )}
                              </div>
                            </MenuButton>
                            <MenuList className="flex flex-col gap-1 w-full border-l-2 border-boundary-light ml-2 max-h-[70vh] overflow-y-auto">
                              {e.link_list.map((f, i) => (
                                <Link
                                  noUnderline
                                  href={f.url}
                                  key={`link-mobile-${index}-${i}`}
                                  as={"a"}
                                  className="w-full hover:bg-button-focus/50 focus:ring-2 focus:ring-app-primary"
                                >
                                  <MenuItem className="w-full px-6 py-2 pl-8">
                                    {f.title}
                                  </MenuItem>
                                </Link>
                              ))}
                            </MenuList>
                            <hr className="border-boundary-light mx-1" />
                          </>
                        )}
                      </Menu>
                    ))}
                    <hr className="border-boundary-light mx-1" />
                    {navItems.map((item, index) => (
                      <Link key={index} noUnderline href={item.href} as={"a"}>
                        <MenuItem>{item.title}</MenuItem>
                      </Link>
                    ))}
                    {!isHome() && (
                      <Link
                        noUnderline
                        href={Paths.Frontend.SEARCH.href}
                        as={"a"}
                      >
                        <MenuItem>Search</MenuItem>
                      </Link>
                    )}

                    {/* <AuthControls>
                      {({ user, logout }) => ( */}
                    <AuthControls>
                      {({ user, logout, refresh }) => (
                        <>
                          {/* {!user && (
                            <Link key={"login"} noUnderline href={LOGIN_URL}>
                              <MenuItem>Login</MenuItem>
                            </Link>
                          )} */}
                          {!user && (
                            // <MenuItem
                            //   onClick={async () => {
                            //     const result = await signInWithPopup(
                            //       auth,
                            //       googleProvider
                            //     );
                            //     const idToken = await result.user.getIdToken();

                            //     // await loginWithGoogle(idToken);
                            //     await fetch(
                            //       `${Constants.BASE_URL}/firebase-auth/login`,
                            //       {
                            //         method: "POST",
                            //         headers: {
                            //           "Content-Type": "application/json",
                            //         },
                            //         credentials: "include",
                            //         body: JSON.stringify({ token: idToken }),
                            //       }
                            //     );

                            //     await refresh();
                            //   }}
                            // >
                            //   Login
                            // </MenuItem>
                            <MenuItem
                              onClick={() => {
                                window.location.href =
                                    `${Constants.BASE_URL}/auth/login/google` +
                                    `?redirect=${encodeURIComponent('https://uat-cms.groupify.ai/login')}`;
                              }}
                            >
                              Login
                            </MenuItem>
                          )}

                          {!!user && (
                            <MenuItem onClick={logout}>Logout</MenuItem>
                          )}
                        </>
                      )}
                    </AuthControls>
                  </MenuList>
                </>
              )}
            </Menu>
          </div>
        </nav>
      </header>
    </NavbarAnimation>
  );
};

export default Navbar;
