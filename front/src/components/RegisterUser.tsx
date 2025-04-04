import { ChangeEvent, useEffect, useState } from "react";
import { useAccountStore } from "@/stores/account";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircleIcon, BadgeCheckIcon, CheckCircle2Icon, CheckIcon, UserIcon, XIcon } from "lucide-react";
import { checkUsernameAuthAvailableEnsUsernamePost } from "@/apis/backend/sdk.gen";
import { useDebounce } from "@/lib/utils";
import { z } from "zod";
import { thirdwebClient } from "@/config/thirdweb.ts";
import { useEnsName } from "thirdweb/react";

// Define username schema with Zod
const usernameSchema = z
	.string()
	.min(3, "Username must be at least 3 characters long")
	.regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers");

// Define a type for validation results
type ValidationResult = {
	success: boolean;
	error?: string;
};

export const RegisterUser = () => {
	const [username, setUsername] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [validation, setValidation] = useState<ValidationResult>({ success: true });
	const { registerUser, jwtToken } = useAccountStore();

	// Debounce username input for availability check
	const debouncedUsername = useDebounce(username, 500);

	// Validate username format using Zod
	useEffect(() => {
		if (!username) {
			setValidation({ success: true });
			return;
		}

		try {
			usernameSchema.parse(username);
			setValidation({ success: true });
		} catch (error) {
			if (error instanceof z.ZodError) {
				setValidation({
					success: false,
					error: error.errors[0].message,
				});
			}
		}
	}, [username]);

	// Check username availability whenever debounced username changes
	useEffect(() => {
		const checkUsernameAvailability = async () => {
			if (!debouncedUsername || !validation.success) {
				setIsAvailable(null);
				return;
			}

			setIsChecking(true);

			try {
				const response = await checkUsernameAuthAvailableEnsUsernamePost({
					path: {
						username: debouncedUsername,
					},
					headers: jwtToken
						? {
								Authorization: `Bearer ${jwtToken}`,
							}
						: undefined,
				});

				setIsAvailable(response.data?.available ?? false);
			} catch (error) {
				console.error("Error checking username availability:", error);
				setIsAvailable(false);
			} finally {
				setIsChecking(false);
			}
		};

		if (debouncedUsername && validation.success) {
			checkUsernameAvailability();
		}
	}, [debouncedUsername, jwtToken, validation.success]);

	// Handle username input change
	const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	// Check requirements for visual indicators
	const meetsLengthRequirement = username.length >= 3;
	const meetsAlphanumericRequirement = z
		.string()
		.regex(/^[a-zA-Z0-9]+$/)
		.safeParse(username).success;

	// Used for status message display
	const getStatusMessage = () => {
		if (!username) {
			return null;
		}

		if (!validation.success) {
			return validation.error;
		}

		if (isChecking) {
			return "Checking availability...";
		}

		if (isAvailable === true) {
			return "Username is available!";
		}

		if (isAvailable === false) {
			return "Username is already taken";
		}

		return null;
	};

	const handleRegister = async () => {
		// Validate with Zod before submission
		try {
			usernameSchema.parse(username);
		} catch (error) {
			if (error instanceof z.ZodError) {
				toast.error("Invalid username", {
					description: error.errors[0].message,
				});
				return;
			}
		}

		if (!isAvailable) {
			toast.error("Username not available", {
				description: "Please choose a different username",
			});
			return;
		}

		setIsSubmitting(true);

		// Proceed with registration
		const success = await registerUser(username);
		setIsSubmitting(false);

		if (!success) {
			// Error handling is done inside registerUser function
			return;
		}
	};

	// Get the color class for the status indicator
	const getStatusColor = () => {
		if (!validation.success) return "text-red-500";
		if (isAvailable === true) return "text-emerald-500";
		if (isAvailable === false) return "text-red-500";
		return "text-slate-400";
	};

	// Get the status icon
	const getStatusIcon = () => {
		if (!validation.success) {
			return <XIcon className="h-4 w-4 text-red-500" />;
		}

		if (isChecking) {
			return <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-indigo-500 animate-spin"></div>;
		}

		if (isAvailable === true) {
			return <CheckIcon className="h-4 w-4 text-emerald-500" />;
		}

		if (isAvailable === false) {
			return <XIcon className="h-4 w-4 text-red-500" />;
		}

		return null;
	};

	// Determine the border class for the input
	const getInputBorderClass = () => {
		if (!validation.success) return "border-red-400 focus-visible:ring-red-500";
		if (isAvailable === true) return "border-emerald-500 focus-visible:ring-emerald-500";
		if (isAvailable === false) return "border-red-400 focus-visible:ring-red-500";
		return "focus-visible:ring-indigo-500";
	};

	const { data: ensName } = useEnsName({
		client: thirdwebClient,
		address: "0x7Ab98f6b22ECb42E27Dc9C7d2d488F69b5CDD0b2",
	});
	return (
		<div className="flex min-h-[80vh] items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
				<div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white text-center">
					<div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
						<BadgeCheckIcon className="h-10 w-10 text-white" />
					</div>
					<CardTitle className="text-3xl font-bold mb-2">Almost there!</CardTitle>
					<CardDescription className="text-white/80 text-lg">
						Choose a username to complete your registration {ensName}
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
								onChange={handleUsernameChange}
								className={`pl-10 pr-10 h-12 border-slate-300 ${getInputBorderClass()}`}
							/>
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<span className="text-slate-400">@</span>
							</div>
							{username.length >= 1 && (
								<div className="absolute inset-y-0 right-0 flex items-center pr-3">{getStatusIcon()}</div>
							)}
						</div>
						{getStatusMessage() && (
							<div className={`text-sm flex items-center gap-1.5 ${getStatusColor()}`}>
								{!validation.success || isAvailable === false ? (
									<AlertCircleIcon className="h-4 w-4" />
								) : isAvailable === true ? (
									<CheckCircle2Icon className="h-4 w-4" />
								) : null}
								{getStatusMessage()}
							</div>
						)}
					</div>

					<div className="space-y-2 bg-slate-50 p-4 rounded-lg">
						<p className="text-sm text-slate-600 font-medium">Your username:</p>
						<ul className="space-y-2">
							<li className="flex items-center gap-2 text-sm text-slate-600">
								<CheckCircle2Icon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
								Will be your unique identifier in the app
							</li>
							<li className="flex items-center gap-2 text-sm text-slate-600">
								<CheckCircle2Icon
									className={`h-4 w-4 flex-shrink-0 ${meetsLengthRequirement ? "text-emerald-500" : "text-slate-300"}`}
								/>
								Must be at least 3 characters long
							</li>
							<li className="flex items-center gap-2 text-sm text-slate-600">
								<CheckCircle2Icon
									className={`h-4 w-4 flex-shrink-0 ${meetsAlphanumericRequirement ? "text-emerald-500" : "text-slate-300"}`}
								/>
								Can only contain letters and numbers
							</li>
						</ul>
					</div>
				</CardContent>

				<CardFooter className="px-8 pb-8 pt-0">
					<Button
						onClick={handleRegister}
						disabled={isSubmitting || isChecking || !validation.success || isAvailable !== true}
						className="w-full h-12 font-medium text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300"
					>
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
								Registering...
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
