"use client";

import { QuestionFormInput } from "@/modules/survey/components/question-form-input";
import { AdvancedOptionToggle } from "@/modules/ui/components/advanced-option-toggle";
import { Button } from "@/modules/ui/components/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTranslate } from "@tolgee/react";
import { PlusIcon } from "lucide-react";
import type { JSX } from "react";
import { createI18nString, extractLanguageCodes } from "@formbricks/lib/i18n/utils";
import { TSurvey, TSurveyNPSQuestion } from "@formbricks/types/surveys/types";

interface NPSQuestionFormProps {
  localSurvey: TSurvey;
  question: TSurveyNPSQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TSurveyNPSQuestion>) => void;
  lastQuestion: boolean;
  selectedLanguageCode: string;
  isInvalid: boolean;
}

export const NPSQuestionForm = ({
  question,
  questionIdx,
  updateQuestion,
  lastQuestion,
  isInvalid,
  localSurvey,
  selectedLanguageCode,
}: NPSQuestionFormProps): JSX.Element => {
  const { t } = useTranslate();
  const surveyLanguageCodes = extractLanguageCodes(localSurvey.languages);
  // Auto animate
  const [parent] = useAutoAnimate();

  return (
    <form>
      <QuestionFormInput
        id="headline"
        value={question.headline}
        label={t("environments.surveys.edit.question") + "*"}
        localSurvey={localSurvey}
        questionIdx={questionIdx}
        isInvalid={isInvalid}
        updateQuestion={updateQuestion}
        selectedLanguageCode={selectedLanguageCode}
      />

      <div ref={parent}>
        {question.subheader !== undefined && (
          <div className="inline-flex w-full items-center">
            <div className="w-full">
              <QuestionFormInput
                id="subheader"
                value={question.subheader}
                label={t("common.description")}
                localSurvey={localSurvey}
                questionIdx={questionIdx}
                isInvalid={isInvalid}
                updateQuestion={updateQuestion}
                selectedLanguageCode={selectedLanguageCode}
              />
            </div>
          </div>
        )}
        {question.subheader === undefined && (
          <Button
            size="sm"
            variant="secondary"
            className="mt-3"
            type="button"
            onClick={() => {
              updateQuestion(questionIdx, {
                subheader: createI18nString("", surveyLanguageCodes),
              });
            }}>
            {" "}
            <PlusIcon className="mr-1 h-4 w-4" />
            {t("environments.surveys.edit.add_description")}
          </Button>
        )}
      </div>

      <div className="flex justify-between space-x-2">
        <div className="w-full">
          <QuestionFormInput
            id="lowerLabel"
            value={question.lowerLabel}
            label={t("environments.surveys.edit.lower_label")}
            localSurvey={localSurvey}
            questionIdx={questionIdx}
            isInvalid={isInvalid}
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
          />
        </div>
        <div className="w-full">
          <QuestionFormInput
            id="upperLabel"
            value={question.upperLabel}
            label={t("environments.surveys.edit.upper_label")}
            localSurvey={localSurvey}
            questionIdx={questionIdx}
            isInvalid={isInvalid}
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
          />
        </div>
      </div>

      {!question.required && (
        <div className="mt-3">
          <QuestionFormInput
            id="buttonLabel"
            value={question.buttonLabel}
            label={t("environments.surveys.edit.next_button_label")}
            localSurvey={localSurvey}
            questionIdx={questionIdx}
            maxLength={48}
            placeholder={lastQuestion ? t("common.finish") : t("common.next")}
            isInvalid={isInvalid}
            updateQuestion={updateQuestion}
            selectedLanguageCode={selectedLanguageCode}
          />
        </div>
      )}

      <AdvancedOptionToggle
        isChecked={question.isColorCodingEnabled}
        onToggle={() => updateQuestion(questionIdx, { isColorCodingEnabled: !question.isColorCodingEnabled })}
        htmlId="isColorCodingEnabled"
        title={t("environments.surveys.edit.add_color_coding")}
        description={t("environments.surveys.edit.add_color_coding_description")}
        childBorder
        customContainerClass="p-0 mt-4"
      />
    </form>
  );
};
