import { z } from "zod";

const envSchema = z.object({
	BACKEND_API_URL: z.string().url(),
	THIRDWEB_CLIENT_ID: z.string(),
	PAYMENT_CONTRACT_ADDRESS: z.string(),
});

const env = envSchema.parse({
	BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL,
	THIRDWEB_CLIENT_ID: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
	PAYMENT_CONTRACT_ADDRESS: import.meta.env.VITE_PAYMENT_CONTRACT_ADDRESS,
});

export default env;
