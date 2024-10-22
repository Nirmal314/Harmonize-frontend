import { getErrorMessage, getErrorTitle } from "@/utils/error";
import { redirect } from "next/navigation";
import { Music, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: {
    error?: string;
  };
};

export default function AuthErrorPage({ searchParams }: Props) {
  if (!searchParams.error) redirect("/");

  const errorMessage = getErrorMessage(searchParams.error);
  const errorTitle = getErrorTitle(searchParams.error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-zinc-900 rounded-lg border border-primary/20 shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Music className="text-primary w-12 h-12 mr-2" />
          <h1 className="text-3xl font-bold text-primary">Harmonize</h1>
        </div>
        <div className="text-center mb-6">
          <AlertTriangle className="text-red-500 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            {errorTitle}
          </h2>
          <p className="text-zinc-400">{errorMessage}</p>
        </div>
        <Button asChild className="flex justify-center">
          <Link href="/" className="rounded-full">
            <span className="font-bold">Return to Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
