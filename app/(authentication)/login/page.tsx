import { Coffee, Frown, Guitar, Smile, Star, Zap } from "lucide-react";

import LoginButton from "@/app/(components)/LoginButton";

const Login = async () => {
  return (
    <>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-white">Harmonize</h1>
          <p className="text-xl text-transparent bg-clip-text bg-gradient-to-t from-primary to-white via-white/80">
            Discover the mood of your music
          </p>
        </header>

        <main className="max-w-3xl w-full bg-gray-900/50 rounded-lg p-8 shadow-spotify">
          <p className="text-lg mb-6">
            Harmonize analyzes your Spotify playlists and categorizes songs into
            different moods, helping you understand the emotional landscape of
            your music.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { name: "Happy", icon: Smile },
              { name: "Sad", icon: Frown },
              { name: "Calm", icon: Coffee },
              { name: "Confident", icon: Star },
              { name: "Energetic", icon: Zap },
              { name: "Instrumental", icon: Guitar },
            ].map((category) => (
              <div
                key={category.name}
                className="flex items-center space-x-2 bg-gray-800 p-3 rounded-md"
              >
                <category.icon className="w-6 h-6 text-primary" />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
          <LoginButton />
        </main>

        <footer className="mt-8 text-sm text-gray-400 text-transparent bg-clip-text bg-gradient-to-t from-primary to-white via-white/80">
          <p>© 2024 Harmonize. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Login;
