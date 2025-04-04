import { useState } from "react";
import { useAccountStore } from "@/stores/account";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2Icon, BadgeCheckIcon, UserIcon } from "lucide-react";

export const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const registerUser = useAccountStore((state) => state.registerUser);

  const handleRegister = async () => {
    if (!username.trim()) {
      toast.error("Username required", {
        description: "Please enter a username to continue",
      });
      return;
    }

    setIsChecking(true);
    
    // Mock username availability check
    setTimeout(async () => {
      // For demo purposes: username must be at least 4 characters
      const isAvailable = username.length >= 4;
      
      if (!isAvailable) {
        toast.error("Username not available", {
          description: "Please choose a different username",
        });
        setIsChecking(false);
        return;
      }
      
      // Proceed with registration
      const success = await registerUser(username);
      setIsChecking(false);
      
      if (!success) {
        // Error handling is done inside registerUser function
        return;
      }
    }, 1000); // Simulate network delay
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <BadgeCheckIcon className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">Almost there!</CardTitle>
          <CardDescription className="text-white/80 text-lg">
            Choose a username to complete your registration
          </CardDescription>
        </div>
        
        <CardContent className="space-y-6 p-8">
          <div className="space-y-3">
            <Label htmlFor="username" className="flex items-center gap-2 text-base font-semibold">
              <UserIcon className="h-4 w-4 text-indigo-500" />
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="e.g. satoshi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-12 border-slate-300 focus-visible:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-slate-400">@</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-600 font-medium">Your username:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                Will be your unique identifier in the app
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                Must be at least 4 characters long
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
                Can contain letters, numbers, and underscores
              </li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="px-8 pb-8 pt-0">
          <Button 
            onClick={handleRegister} 
            disabled={isChecking || !username}
            className="w-full h-12 font-medium text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
          >
            {isChecking ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                Checking availability...
              </span>
            ) : (
              "Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};