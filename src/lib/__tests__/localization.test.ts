import { t, SUPPORTED_LANGUAGES, LanguageCode } from "../localization";
import { getAccentStyles, ACCENT_THEMES } from "../themeAccent";

describe("localization module", () => {
  it("should return correct translations for supported languages", () => {
    expect(t("settingsBtn", "en")).toBe("⚙️ Settings");
    expect(t("settingsBtn", "de")).toBe("⚙️ Einstellungen");
    expect(t("settingsBtn", "fr")).toBe("⚙️ Paramètres");
    expect(t("settingsBtn", "ja")).toBe("⚙️ 設定");
  });

  it("should fallback to English for unknown keys or languages", () => {
    expect(t("settingsBtn", "invalid" as LanguageCode)).toBe("⚙️ Settings");
  });

  it("should list 4 supported languages", () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(4);
  });
});

describe("themeAccent module", () => {
  it("should return accent styles for AWS Amber, Emerald, Indigo, and Cyber Cyan", () => {
    expect(getAccentStyles("aws_orange").primary).toBe("#FF9900");
    expect(getAccentStyles("emerald_green").primary).toBe("#10B981");
    expect(getAccentStyles("indigo_blue").primary).toBe("#6366F1");
    expect(getAccentStyles("cyber_cyan").primary).toBe("#06B6D4");
  });

  it("should export 4 accent options", () => {
    expect(ACCENT_THEMES.length).toBe(4);
  });
});
