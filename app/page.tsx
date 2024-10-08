"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Smile, Frown, Cloud, Zap, Star, Mic } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import LoginButton from "@/app/(components)/LoginButton";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const getErrorMessage = (error: string): string => {
  switch (error) {
    case "OAuthCallback":
      return "There was an issue with the OAuth authentication. Please try again or contact support if the problem persists.";
    case "invalid_request":
      return "The request was invalid. Please check your details and try again.";
    case "access_denied":
      return "Access was denied. Please ensure you have the necessary permissions.";
    default:
      return "An unknown error occurred. Please try again later.";
  }
};

const Home = () => {
  const moodCategoriesRef = useRef<HTMLElement>(null);
  const readyToHarmonizeRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(getErrorMessage(error));
      router.push("/");
    }
  }, [searchParams]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const scrollToNextSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 pt-14">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="min-h-screen flex items-center justify-center px-4 md:px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6"
            >
              Welcome to{" "}
              <motion.span
                className="text-primary relative inline-block"
                initial={{ backgroundSize: "0 3px" }}
                animate={{ backgroundSize: "100% 3px" }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  paddingBottom: "8px",
                  backgroundImage:
                    "linear-gradient(to right, #18d860, #18d860)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0 100%",
                }}
              >
                Harmonize
              </motion.span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Discover the emotional landscape of your music. Harmonize connects
              with Spotify to categorize your playlist songs based on moods.
            </motion.p>
            <motion.div variants={itemVariants} className="space-x-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => scrollToNextSection(moodCategoriesRef)}
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </motion.section>
        <section
          ref={moodCategoriesRef}
          className="min-h-screen flex items-center justify-center px-4 md:px-6 bg-gray-900"
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-center mb-12"
            >
              <motion.span
                className="text-primary relative inline-block"
                initial={{ backgroundSize: "0 3px" }}
                whileInView={{ backgroundSize: "100% 3px" }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  paddingBottom: "8px",
                  backgroundImage:
                    "linear-gradient(to right, #18d860, #18d860)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0 100%",
                }}
              >
                Mood Categories
              </motion.span>
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
            >
              <motion.div variants={itemVariants} className="w-full max-w-sm">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex flex-col items-center p-6">
                    <Smile className={`h-12 w-12 mb-4 text-yellow-500`} />
                    <h3
                      className={`text-lg font-bold text-white pb-1 border-b-2 border-yellow-500`}
                    >
                      Happy
                    </h3>
                    <p className="text-sm text-gray-300 text-center mt-2">
                      Upbeat and joyful tunes to lift your spirits
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants} className="w-full max-w-sm">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex flex-col items-center p-6">
                    <Frown className={`h-12 w-12 mb-4 text-blue-500`} />
                    <h3
                      className={`text-lg font-bold text-white pb-1 border-b-2 border-blue-500`}
                    >
                      Sad
                    </h3>
                    <p className="text-sm text-gray-300 text-center mt-2">
                      Melancholic melodies for introspective moments
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants} className="w-full max-w-sm">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex flex-col items-center p-6">
                    <Cloud className={`h-12 w-12 mb-4 text-green-500`} />
                    <h3
                      className={`text-lg font-bold text-white pb-1 border-b-2 border-green-500`}
                    >
                      Calm
                    </h3>
                    <p className="text-sm text-gray-300 text-center mt-2">
                      Soothing sounds for relaxation and peace
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants} className="w-full max-w-sm">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex flex-col items-center p-6">
                    <Zap className={`h-12 w-12 mb-4 text-red-500`} />
                    <h3
                      className={`text-lg font-bold text-white pb-1 border-b-2 border-red-500`}
                    >
                      Energetic
                    </h3>
                    <p className="text-sm text-gray-300 text-center mt-2">
                      High-energy tracks to get you moving
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants} className="w-full max-w-sm">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex flex-col items-center p-6">
                    <Star className={`h-12 w-12 mb-4 text-purple-500`} />
                    <h3
                      className={`text-lg font-bold text-white pb-1 border-b-2 border-purple-500`}
                    >
                      Confident
                    </h3>
                    <p className="text-sm text-gray-300 text-center mt-2">
                      Empowering songs to boost your self-esteem
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={itemVariants} className="w-full max-w-sm">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="flex flex-col items-center p-6">
                    <Mic className={`h-12 w-12 mb-4 text-orange-500`} />
                    <h3
                      className={`text-lg font-bold text-white pb-1 border-b-2 border-orange-500`}
                    >
                      Instrumental
                    </h3>
                    <p className="text-sm text-gray-300 text-center mt-2">
                      Captivating melodies without lyrics
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 text-center"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => scrollToNextSection(readyToHarmonizeRef)}
              >
                Let's connect to your Spotify!
              </Button>
            </motion.div>
          </div>
        </section>
        <motion.section
          ref={readyToHarmonizeRef}
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          className="min-h-screen flex items-center justify-center px-4 md:px-6"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-6"
            >
              <motion.span
                className="text-primary relative inline-block"
                initial={{ backgroundSize: "0 3px" }}
                whileInView={{ backgroundSize: "100% 3px" }}
                transition={{ duration: 1, delay: 1 }}
                style={{
                  paddingBottom: "8px",
                  backgroundImage:
                    "linear-gradient(to right, #18d860, #18d860)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0 100%",
                }}
              >
                Ready to Harmonize Your Music?
              </motion.span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Connect your Spotify account and start exploring the emotional
              journey of your playlists.
            </motion.p>
            <motion.div variants={itemVariants}>
              <LoginButton className="w-full" />
            </motion.div>
          </div>
        </motion.section>
      </main>
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-6 px-4 md:px-6 border-t border-gray-800"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 Harmonize. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link className="text-sm text-gray-400 hover:text-primary" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm text-gray-400 hover:text-primary" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </motion.footer>
    </div>
  );
};
export default Home;
