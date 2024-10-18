"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Session } from "next-auth";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import LogoutButton from "../Buttons/LogoutButton";
import Placeholder from "@/public/placeholder-image.png";

const Profile = ({ session }: { session: Session | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="flex items-center">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full border border-primary/10 bg-background p-0"
            onClick={toggleDropdown}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={
                  session?.user.image || "../../../public/placeholder-image.png"
                }
                alt={session?.user.name || "User"}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {session?.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <motion.div
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-3 w-3 text-primary-foreground" />
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-row items-center space-x-3 p-2">
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src={session?.user.image || Placeholder}
                  alt={session?.user.name || "User"}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none">
                  {session?.user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{session?.user.username || "username"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session?.user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
