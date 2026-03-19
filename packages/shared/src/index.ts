// Types
export * from "./types";

// Constants
export * from "./constants";

// Utilities
export * from "./utils";

// Schemas
export * from "./schemas";

// Explicit exports to ensure TS sees them (fixes missing-export errors)
export { APP_DESCRIPTION } from "./constants/app.constants";
export { isValidImageFile } from "./utils/validation.utils";
export type { AddPlantPayload } from './types/my-garden.types';
export type {
  IScanResult,
  IScanHistoryDetail,
  IYoloPrediction,
} from "./types/scan-history.types";
export {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "./schemas/auth.schema";

// Legacy export (để không break code cũ)

export * from "./api/token-manager";
export * from "./api/scan.api";
export * from "./api/axios-client";
export * from "./api/plant.api";
export * from "./api/auth.api";
export * from "./api/user.api";
export * from "./api/weather.api";
export * from "./types/weather.types";
export * from "./api/admin.api";
export * from "./api/product.api";
export * from "./api/order.api";
export * from "./api/my-garden.api";
export * from "./types/my-garden.types";
export const helloWorld = () => {
  return "Hello from Shared Logic!";
};
