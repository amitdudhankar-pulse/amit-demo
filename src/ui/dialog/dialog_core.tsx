import { useRouter } from "next/router";
import {
  useState,
  PropsWithChildren,
  useContext,
  createContext,
  Context,
  ReactElement,
  FC,
} from "react";
import { DialogPanel, Dialog as HeadlessDialog } from "@headlessui/react";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { twMerge } from "tailwind-merge";

interface DialogData<T> {
  dialogId: string;
  args?: T;
}
interface DialogContextProps<T> {
  value: DialogData<T> | undefined;
  setValue: React.Dispatch<React.SetStateAction<DialogData<T> | undefined>>;
}
const DialogContext = createContext<DialogContextProps<any>>({
  value: undefined,
  setValue: () => {},
});

const DialogProvider = <T,>(
  props: PropsWithChildren<{ dialogId?: string }>
) => {
  const [value, setValue] = useState<DialogData<T> | undefined>(
    !!props.dialogId ? { dialogId: props.dialogId } : undefined
  );

  return (
    <DialogContext.Provider value={{ value, setValue }}>
      {props.children}
    </DialogContext.Provider>
  );
};

const useDialogContext = <T,>() =>
  useContext(DialogContext as Context<DialogContextProps<T>>);

const Dialog = <T,>(props: {
  id: string;
  children: (args: { data: T | undefined; close: () => void }) => JSX.Element;
  className?: string;
}) => {
  const { value: dialogData, setValue: setDialogData } = useDialogContext<T>();

  const close = () => {
    if (dialogData?.dialogId === props.id) setDialogData(undefined);
  };

  return (
    <HeadlessDialog
      open={dialogData?.dialogId === props.id}
      onClose={close}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black bg-opacity-55 backdrop-filter backdrop-blur-sm">
        <DialogPanel
          className={twMerge(
            "relative w-fit h-fit space-y-4 outline outline-1 outline-gray-500 shadow-focusCard rounded-lg p-2 bg-white",
            props.className
          )}
        >
          <CloseIcon
            className="absolute top-2 right-2 sm:size-8 size-6 hover:bg-slate-300 hover:cursor-pointer rounded-md text-primary"
            onClick={close}
          />
          {dialogData?.dialogId && (
            <div className="p-3 sm:p-10">
              {props.children({ data: dialogData?.args, close })}
            </div>
          )}
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
};

const ClickToOpenDialog = <T,>(
  props: PropsWithChildren<{ className?: string } & DialogData<T>>
) => {
  const { value, setValue } = useDialogContext();
  return (
    <div
      className={props.className}
      onClick={() => {
        console.log("> clicked on open-dialog");
        setValue(props);
      }}
    >
      {props.children}
    </div>
  );
};

const useDialogControls = <T,>(props: { id: string }) => {
  const { value, setValue } = useDialogContext();
  return {
    openDialog: (data: T) => setValue({ dialogId: props.id, args: data }),
    closeDialog: () => {
      if (value?.dialogId === props.id) setValue(undefined);
    },
  };
};

type DialogControlsProps<T> = {
  children?: (args: {
    close: () => void;
    open: (data: T) => void;
  }) => ReactElement;
  id: string;
};
const DialogControls = <T,>(props: DialogControlsProps<T>) => {
  const { openDialog: open, closeDialog: close } = useDialogControls<T>({
    id: props.id,
  });
  return props.children?.({
    close,
    open,
  });
};

export type { DialogControlsProps };

export {
  DialogControls,
  Dialog,
  DialogProvider,
  useDialogContext,
  ClickToOpenDialog,
  useDialogControls,
};
