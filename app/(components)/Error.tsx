"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MusicIcon, RefreshCcw, AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import ToastManager from "./ToastManager";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <ToastManager />
      <div className="flex flex-col items-center justify-center w-full h-auto md:h-full">
        {/* <div className="w-full h-full pt-14 sm:pt-20 flex flex-col items-center justify-center bg-black px-4 py-8"> */}
        <Card className="w-full max-w-sm sm:max-w-lg md:max-w-2xl bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4">
              <MusicIcon className="w-12 h-12 text-primary animate-pulse mb-2 sm:mb-0" />
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white text-center sm:text-left">
                Unexpected error!
              </CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-center mt-2">
              We hit a sour note. Don't worry, we're working on getting back in
              tune!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-500">
                  Error Details
                </h3>
                <p className="text-gray-300 mt-1">
                  {error.message || "An unexpected error occurred"}
                </p>
                {/* {error.digest && (
                  <p className="text-gray-400 text-sm mt-2">
                    Error ID: {error.digest}
                  </p>
                )} */}
              </div>
            </div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  What happened?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  An error occurred while trying to process your request. This
                  could be due to a temporary issue with our servers or a
                  problem with your connection.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  What can you do?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Try refreshing the page</li>
                  <li>Check your internet connection</li>
                  <li>
                    Make sure your email is authorized by Harmonize to test
                  </li>
                  <li>Clear your browser cache and cookies</li>
                  <li>Try again in a few minutes</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between">
            <Button onClick={reset} className="mb-2 sm:mb-0">
              <RefreshCcw className="mr-2 h-5 w-5" />
              <span className="font-bold">Try again</span>
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="bg-transparent hover:bg-transparent hover:text-primary border border-primary rounded-full text-primary"
              >
                <Home className="mr-2 h-5 w-5" />
                Go to Homepage
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
