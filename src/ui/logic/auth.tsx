import { CMS, User } from "@/lib/lib";
import {
  PropsWithChildren,
  useState,
  useContext,
  ReactElement,
  useEffect,
} from "react";
import { createContext, Context } from "react";

interface AuthContextProps {
  user?: User;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  logout: () => Promise.resolve(),
  refresh: () => Promise.resolve(),
});

const AuthProvider = (props: PropsWithChildren) => {
  const [value, setValue] = useState<User>();

  const refresh = async () => {
    const user = await CMS.getUser();
    setValue(user);
  };

  const logout = async () => {
    await CMS.logout();
    setValue(undefined);
  };

  // useEffect(() => {
  //   CMS.getUser().then((e) => setValue(e));
  // }, []);
  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user: value, refresh, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () =>
  useContext(AuthContext as Context<AuthContextProps>);

const AuthControls = (props: {
  children: (args: AuthContextProps) => ReactElement;
}) => props.children(useAuthState());

export { AuthProvider, AuthControls };
