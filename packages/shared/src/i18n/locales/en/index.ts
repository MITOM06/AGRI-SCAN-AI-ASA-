/**
 * English dictionary. Typed against `Dictionary` (derived from the Vietnamese
 * one) so a missing key fails the build instead of silently falling back.
 */
import type { Dictionary } from "../dictionary";
import { common } from "./common";
import { nav, footer } from "./nav";
import { auth } from "./auth";
import { landing } from "./landing";
import { scan } from "./scan";
import { encyclopedia } from "./encyclopedia";
import { weather } from "./weather";
import { shop } from "./shop";
import { myGarden } from "./my-garden";

export const en: Dictionary = {
  weather,
  shop,
  myGarden,
  common,
  nav,
  footer,
  auth,
  landing,
  scan,
  encyclopedia,
};
