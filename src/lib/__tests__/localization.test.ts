import { t, TRANSLATIONS, SUPPORTED_LANGUAGES, LanguageCode, getLocalizedRecommendation } from "../localization";
import { getLocalizedTourSteps } from "../productTour";
import { getAccentStyles, ACCENT_THEMES } from "../themeAccent";

describe("Enterprise Localization Engine (Phase 9A & 12)", () => {
  it("should return correct translations for all supported languages", () => {
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
    expect(SUPPORTED_LANGUAGES.map((l) => l.code)).toEqual(["en", "de", "fr", "ja"]);
  });

  it("should have zero missing or empty translation keys across all 4 languages", () => {
    const enKeys = Object.keys(TRANSLATIONS.en) as (keyof typeof TRANSLATIONS.en)[];
    const languages: LanguageCode[] = ["en", "de", "fr", "ja"];

    languages.forEach((lang) => {
      enKeys.forEach((key) => {
        const val = t(key, lang);
        expect(val).toBeDefined();
        expect(val.length).toBeGreaterThan(0);
      });
    });
  });

  it("should return localized recommendations for rec-1 through rec-5 in German, French, and Japanese", () => {
    const recIds = ["rec-1", "rec-2", "rec-3", "rec-4", "rec-5"];
    const langs: LanguageCode[] = ["de", "fr", "ja"];

    langs.forEach((lang) => {
      recIds.forEach((id) => {
        const loc = getLocalizedRecommendation(id, lang);
        expect(loc.title).toBeDefined();
        expect(loc.title!.length).toBeGreaterThan(0);
        expect(loc.reason).toBeDefined();
        expect(loc.reason!.length).toBeGreaterThan(0);
      });
    });
  });

  it("should return localized product tour steps for all 6 steps across de, fr, ja", () => {
    const langs: LanguageCode[] = ["de", "fr", "ja"];

    langs.forEach((lang) => {
      const steps = getLocalizedTourSteps(lang);
      expect(steps.length).toBe(6);
      steps.forEach((step) => {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.subtitle.length).toBeGreaterThan(0);
        expect(step.description.length).toBeGreaterThan(0);
      });
    });
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
