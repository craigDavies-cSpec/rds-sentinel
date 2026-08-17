"use client";

import React from "react";
import { getLocalizedTourSteps, markTourCompleted } from "@/lib/productTour";
import { LanguageCode, t } from "@/lib/localization";

interface ProductTourModalProps {
  isTourActive: boolean;
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number | ((prev: number) => number)) => void;
  setIsTourActive: (active: boolean) => void;
  language: LanguageCode;
}

export function ProductTourModal({
  isTourActive,
  currentStepIndex,
  setCurrentStepIndex,
  setIsTourActive,
  language,
}: ProductTourModalProps) {
  const tourSteps = getLocalizedTourSteps(language);
  const step = tourSteps[currentStepIndex] || tourSteps[0];

  React.useEffect(() => {
    if (!isTourActive || !step?.targetElementId) return;

    const el = document.querySelector(step.targetElementId);
    if (el) {
      el.classList.add("tour-spotlight-active");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return () => {
      if (el) {
        el.classList.remove("tour-spotlight-active");
      }
    };
  }, [isTourActive, step]);

  if (!isTourActive) return null;

  const isLast = currentStepIndex === tourSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      markTourCompleted();
      setIsTourActive(false);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-aws-lightContainer dark:bg-aws-container border border-aws-orange rounded-xl shadow-2xl w-full max-w-md p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b border-aws-lightBorder dark:border-aws-border pb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-aws-orange text-white font-mono font-bold text-[10px] uppercase">
              {step.badgeText}
            </span>
            <span className="text-xs font-mono font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary">
              {step.subtitle}
            </span>
          </div>
          <button
            id="product-tour-skip-btn"
            onClick={() => {
              markTourCompleted();
              setIsTourActive(false);
            }}
            className="text-xs font-bold text-aws-lightTextSecondary dark:text-aws-textSecondary hover:text-aws-orange cursor-pointer px-1.5 py-0.5"
          >
            {t("skipTourBtn", language)}
          </button>
        </div>

        <div>
          <h3 className="font-bold text-base text-aws-lightTextPrimary dark:text-aws-textPrimary mb-1">
            {step.title}
          </h3>
          <p className="text-xs text-aws-lightTextSecondary dark:text-aws-textSecondary leading-relaxed">
            {step.description}
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-aws-lightBorder dark:border-aws-border">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-3 py-1.5 rounded font-bold text-xs cursor-pointer transition-all ${
              currentStepIndex === 0
                ? "opacity-40 cursor-not-allowed text-aws-lightTextSecondary dark:text-aws-textSecondary"
                : "bg-aws-lightBg dark:bg-aws-dark border border-aws-lightBorder dark:border-aws-border text-aws-lightTextPrimary dark:text-aws-textPrimary hover:border-aws-orange"
            }`}
          >
            ← {t("tourBackBtn", language)}
          </button>

          <div className="flex items-center gap-1">
            {tourSteps.map((s, idx) => (
              <span
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStepIndex ? "bg-aws-orange scale-125" : "bg-aws-lightBorder dark:bg-aws-border"
                }`}
              />
            ))}
          </div>

          <button
            id="product-tour-next-btn"
            onClick={handleNext}
            className="px-4 py-1.5 rounded bg-aws-orange hover:bg-aws-orangeHover text-white font-bold text-xs shadow cursor-pointer transition-all active:scale-95"
          >
            {isLast ? t("tourFinishBtn", language) : `${t("tourNextBtn", language)} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
