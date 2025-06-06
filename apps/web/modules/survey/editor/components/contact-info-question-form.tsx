"use client";

import { QuestionFormInput } from "@/modules/survey/components/question-form-input";
import { Button } from "@/modules/ui/components/button";
import { QuestionToggleTable } from "@/modules/ui/components/question-toggle-table";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTranslate } from "@tolgee/react";
import { PlusIcon } from "lucide-react";
import { type JSX, useEffect } from "react";
import { createI18nString, extractLanguageCodes } from "@formbricks/lib/i18n/utils";
import { TSurvey, TSurveyContactInfoQuestion } from "@formbricks/types/surveys/types";

interface ContactInfoQuestionFormProps {
  localSurvey: TSurvey;
  question: TSurveyContactInfoQuestion;
  questionIdx: number;
  updateQuestion: (questionIdx: number, updatedAttributes: Partial<TSurveyContactInfoQuestion>) => void;
  lastQuestion: boolean;
  isInvalid: boolean;
  selectedLanguageCode: string;
}

export const ContactInfoQuestionForm = ({
  question,
  questionIdx,
  updateQuestion,
  isInvalid,
  localSurvey,
  selectedLanguageCode,
}: ContactInfoQuestionFormProps): JSX.Element => {
  const { t } = useTranslate();
  const surveyLanguageCodes = extractLanguageCodes(localSurvey.languages ?? []);

  const fields = [
    {
      id: "firstName",
      label: t("environments.surveys.edit.first_name"),
      ...question.firstName,
    },
    {
      id: "lastName",
      label: t("environments.surveys.edit.last_name"),
      ...question.lastName,
    },
    {
      id: "email",
      label: t("common.email"),
      ...question.email,
    },
    {
      id: "phone",
      label: t("common.phone"),
      ...question.phone,
    },
    {
      id: "company",
      label: t("environments.surveys.edit.company"),
      ...question.company,
    },
  ];

  useEffect(() => {
    const allFieldsAreOptional = [
      question.firstName,
      question.lastName,
      question.email,
      question.phone,
      question.company,
    ]
      .filter((field) => field.show)
      .every((field) => !field.required);

    updateQuestion(questionIdx, { required: !allFieldsAreOptional });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.firstName, question.lastName, question.email, question.phone, question.company]);

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
            className="mt-4"
            type="button"
            onClick={() => {
              updateQuestion(questionIdx, {
                subheader: createI18nString("", surveyLanguageCodes),
              });
            }}>
            <PlusIcon className="mr-1 h-4 w-4" />
            {t("environments.surveys.edit.add_description")}
          </Button>
        )}

        <QuestionToggleTable
          type="contact"
          fields={fields}
          localSurvey={localSurvey}
          questionIdx={questionIdx}
          isInvalid={isInvalid}
          updateQuestion={updateQuestion}
          selectedLanguageCode={selectedLanguageCode}
        />
      </div>
    </form>
  );
};
