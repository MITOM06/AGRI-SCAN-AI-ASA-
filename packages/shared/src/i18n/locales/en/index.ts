/**
 * English dictionary. Typed against `Dictionary` (derived from the Vietnamese
 * one) so a missing key fails the build instead of silently falling back.
 */
import type { Dictionary } from "../dictionary";
import { common } from "./common";
import { nav, footer } from "./nav";
import { auth } from "./auth";

export const en: Dictionary = {
  common,
  nav,
  footer,
  auth,
};
