import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music4, User } from "lucide-react";

const PlaylistLoadingCard = () => (
  <Card className="flex flex-col justify-between overflow-hidden h-full bg-gray-900 border-gray-800">
    <CardHeader className="p-0">
      <div className="relative">
        <div className="w-full h-96 bg-gray-800 animate-pulse" />
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="text-gray-100 mb-3 animate-pulse">
        Loading...
      </CardTitle>
      <CardDescription className="text-gray-400 animate-pulse">
        Loading...
      </CardDescription>
    </CardContent>
    <CardFooter className="flex flex-col p-4 gap-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center text-gray-300 animate-pulse">
          <Music4 className="w-4 h-4 mr-2" />
          <span>Loading tracks...</span>
        </div>
        <div className="flex items-center text-gray-300 animate-pulse">
          <User className="w-4 h-4 mr-2" />
          <span>Loading followers...</span>
        </div>
      </div>
      <div className="flex justify-between w-full space-x-4">
        <Button className="w-full bg-gray-600 animate-pulse hover:bg-gray-600"></Button>
        <Button className="w-full bg-gray-600 animate-pulse hover:bg-gray-600"></Button>
      </div>
    </CardFooter>
  </Card>
);

export default PlaylistLoadingCard;
