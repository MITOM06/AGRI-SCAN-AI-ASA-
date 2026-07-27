/**
 * Từ điển tiếng Việt — đây là NGUỒN SỰ THẬT về cấu trúc key.
 * Kiểu `Dictionary` được suy ra từ chính object này, nên mọi ngôn ngữ khác
 * bắt buộc phải có đủ key, thiếu là lỗi biên dịch.
 */
import { common } from "./common";
import { nav, footer } from "./nav";
import { auth } from "./auth";
import { landing } from "./landing";
import { scan } from "./scan";
import { encyclopedia } from "./encyclopedia";
import { weather } from "./weather";
import { shop } from "./shop";
import { myGarden } from "./my-garden";
import { community } from "./community";
import { profile } from "./profile";
import { admin } from "./admin";
import { feedback } from "./feedback";
import { billing } from "./billing";
import { privacy, terms, about } from "./static-pages";
import { settings } from "./settings";
import { home } from "./home";
import { notifications } from "./notifications";
import { tips, onboarding } from "./guides";

export const vi = {
  tips,
  onboarding,
  notifications,
  settings,
  home,
  admin,
  feedback,
  billing,
  privacy,
  terms,
  about,
  weather,
  shop,
  myGarden,
  community,
  profile,
  common,
  nav,
  footer,
  auth,
  landing,
  scan,
  encyclopedia,
} as const;
