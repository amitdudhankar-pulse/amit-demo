import { Text } from "@/ui/components/components";

export const ThanksMessage = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center text-center">
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

      <Text.P className="font-semibold">{message}</Text.P>
    </div>
  );
};
