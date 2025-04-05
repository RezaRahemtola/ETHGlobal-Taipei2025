import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { UploadIcon } from "lucide-react";
import { useAccountStore } from "@/stores/account";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
	return (
		<AvatarPrimitive.Root
			data-slot="avatar"
			className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
			{...props}
		/>
	);
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
	return (
		<AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full", className)} {...props} />
	);
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn("bg-muted flex size-full items-center justify-center rounded-full", className)}
			{...props}
		/>
	);
}

interface AvatarUploadProps {
	className?: string;
}

function AvatarUpload({ className }: Readonly<AvatarUploadProps>) {
	const { username, avatarUrl, uploadAvatar } = useAccountStore();
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = React.useState(false);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Check file type
		if (!file.type.startsWith("image/")) {
			toast.error("Invalid file type", {
				description: "Please upload an image file",
			});
			return;
		}

		// Check file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File too large", {
				description: "Maximum file size is 5MB",
			});
			return;
		}

		setIsUploading(true);
		try {
			await uploadAvatar(file);
		} finally {
			setIsUploading(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className={cn("relative", className)}>
			<Avatar className="h-full w-full">
				{isUploading ? (
					<AvatarFallback className="bg-indigo-700">
						<div className="size-6 border-2 border-white/30 border-t-white/90 rounded-full animate-spin" />
					</AvatarFallback>
				) : avatarUrl ? (
					<AvatarImage src={avatarUrl} alt={username || "User avatar"} />
				) : (
					<AvatarFallback className="text-2xl bg-indigo-800 font-bold">
						{username?.substring(0, 2).toUpperCase() ?? "UN"}
					</AvatarFallback>
				)}
			</Avatar>

			<div
				className={cn(
					"absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center cursor-pointer rounded-full",
					isUploading ? "opacity-100" : "opacity-0 hover:opacity-100",
				)}
				onClick={handleUploadClick}
			>
				{isUploading ? (
					<div className="size-6 border-2 border-white/30 border-t-white/90 rounded-full animate-spin" />
				) : (
					<UploadIcon className="size-6 text-white" />
				)}
			</div>

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/*"
				className="hidden"
				disabled={isUploading}
			/>
		</div>
	);
}

export { Avatar, AvatarImage, AvatarFallback, AvatarUpload };
