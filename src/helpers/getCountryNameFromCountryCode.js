// the actual polyfills:
require("@formatjs/intl-locale/polyfill");
require("@formatjs/intl-displaynames/polyfill");
// the locale data of the languages that you need to support:
require("@formatjs/intl-displaynames/locale-data/de");
require("@formatjs/intl-displaynames/locale-data/en");

export const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
