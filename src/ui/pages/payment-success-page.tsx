import { Button } from "@/ui/components/button/button";
import Link from "next/link";

export function PaymentSuccessPage({ config }: { config: any }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <SuccessCard />
    </div>
  );
}

// -----------------------
// Modular Components
// -----------------------

function SuccessCard() {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
      <SuccessIcon />
      <SuccessTitle />
      <SuccessMessage />
      <SuccessActions />
    </div>
  );
}

function SuccessIcon() {
  return <div className="text-green-600 text-5xl mb-4">✓</div>;
}

function SuccessTitle() {
  return (
    <h1 className="text-3xl font-semibold mb-2">
      Payment Successful 🎉
    </h1>
  );
}

function SuccessMessage() {
  return (
    <p className="text-gray-600 mb-6">
      Thank you for your payment. Your submission has been received and is now being processed.
    </p>
  );
}

function SuccessActions() {
  return (
    <div className="flex flex-col gap-3">
      <Link href="/new-tool-form">
        <Button.Primary
          text="Submit Another Tool"
          action={{ type: "url", url: "/new-tool-form" }}
          className="w-full"
        />
      </Link>

      <Link href="/">
        <Button.PrimaryBoundary
          text="Go Home"
          action={{ type: "url", url: "/" }}
          className="w-full"
        />
      </Link>
    </div>
  );
}
