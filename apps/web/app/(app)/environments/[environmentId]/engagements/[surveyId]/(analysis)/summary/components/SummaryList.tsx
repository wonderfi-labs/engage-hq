"use client";

import {
  SelectedFilterValue,
  useResponseFilter,
} from "@/app/(app)/environments/[environmentId]/components/ResponseFilterContext";
import { EmptyAppSurveys } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/components/EmptyInAppSurveys";
import { CTASummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/CTASummary";
import { CalSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/CalSummary";
import { ConsentSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/ConsentSummary";
import { ContactInfoSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/ContactInfoSummary";
import { DateQuestionSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/DateQuestionSummary";
import { FileUploadSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/FileUploadSummary";
import { HiddenFieldsSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/HiddenFieldsSummary";
import { MatrixQuestionSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/MatrixQuestionSummary";
import { MultipleChoiceSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/MultipleChoiceSummary";
import { NPSSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/NPSSummary";
import { OpenTextSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/OpenTextSummary";
import { PictureChoiceSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/PictureChoiceSummary";
import { RankingSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/RankingSummary";
import { RatingSummary } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/components/RatingSummary";
import { constructToastMessage } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/summary/lib/utils";
import { OptionsType } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/components/QuestionsComboBox";
import { EmptySpaceFiller } from "@/modules/ui/components/empty-space-filler";
import { SkeletonLoader } from "@/modules/ui/components/skeleton-loader";
import { useTranslate } from "@tolgee/react";
import { toast } from "react-hot-toast";
import { getLocalizedValue } from "@formbricks/lib/i18n/utils";
import { TEnvironment } from "@formbricks/types/environment";
import { TI18nString, TSurveyQuestionId, TSurveySummary } from "@formbricks/types/surveys/types";
import { TSurveyQuestionTypeEnum } from "@formbricks/types/surveys/types";
import { TSurvey } from "@formbricks/types/surveys/types";
import { AddressSummary } from "./AddressSummary";

interface SummaryListProps {
  summary: TSurveySummary["summary"];
  responseCount: number | null;
  environment: TEnvironment;
  survey: TSurvey;
  totalResponseCount: number;
  documentsPerPage?: number;
}

export const SummaryList = ({
  summary,
  environment,
  responseCount,
  survey,
  totalResponseCount,
  documentsPerPage,
}: SummaryListProps) => {
  const { setSelectedFilter, selectedFilter } = useResponseFilter();
  const { t } = useTranslate();
  const setFilter = (
    questionId: TSurveyQuestionId,
    label: TI18nString,
    questionType: TSurveyQuestionTypeEnum,
    filterValue: string,
    filterComboBoxValue?: string | string[]
  ) => {
    const filterObject: SelectedFilterValue = { ...selectedFilter };
    const value = {
      id: questionId,
      label: getLocalizedValue(label, "default"),
      questionType: questionType,
      type: OptionsType.QUESTIONS,
    };

    // Find the index of the existing filter with the same questionId
    const existingFilterIndex = filterObject.filter.findIndex(
      (filter) => filter.questionType.id === questionId
    );

    if (existingFilterIndex !== -1) {
      // Replace the existing filter
      filterObject.filter[existingFilterIndex] = {
        questionType: value,
        filterType: {
          filterComboBoxValue: filterComboBoxValue,
          filterValue: filterValue,
        },
      };
      toast.success(t("environments.surveys.summary.filter_updated_successfully"), { duration: 5000 });
    } else {
      // Add new filter
      filterObject.filter.push({
        questionType: value,
        filterType: {
          filterComboBoxValue: filterComboBoxValue,
          filterValue: filterValue,
        },
      });
      toast.success(
        constructToastMessage(questionType, filterValue, survey, questionId, t, filterComboBoxValue) ??
          t("environments.surveys.summary.filter_added_successfully"),
        { duration: 5000 }
      );
    }

    setSelectedFilter({
      filter: [...filterObject.filter],
      onlyComplete: filterObject.onlyComplete,
    });
  };

  return (
    <div className="mt-10 space-y-8">
      {survey.type === "app" && responseCount === 0 && !environment.appSetupCompleted ? (
        <EmptyAppSurveys environment={environment} />
      ) : summary.length === 0 ? (
        <SkeletonLoader type="summary" />
      ) : responseCount === 0 ? (
        <EmptySpaceFiller
          type="response"
          environment={environment}
          noWidgetRequired={survey.type === "link"}
          emptyMessage={
            totalResponseCount === 0
              ? undefined
              : t("environments.surveys.summary.no_response_matches_filter")
          }
        />
      ) : (
        summary.map((questionSummary) => {
          if (questionSummary.type === TSurveyQuestionTypeEnum.OpenText) {
            return (
              <OpenTextSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                survey={survey}
                documentsPerPage={documentsPerPage}
              />
            );
          }
          if (
            questionSummary.type === TSurveyQuestionTypeEnum.MultipleChoiceSingle ||
            questionSummary.type === TSurveyQuestionTypeEnum.MultipleChoiceMulti
          ) {
            return (
              <MultipleChoiceSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                surveyType={survey.type}
                survey={survey}
                setFilter={setFilter}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.NPS) {
            return (
              <NPSSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                survey={survey}
                setFilter={setFilter}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.CTA) {
            return (
              <CTASummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                survey={survey}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.Rating) {
            return (
              <RatingSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                survey={survey}
                setFilter={setFilter}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.Consent) {
            return (
              <ConsentSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                survey={survey}
                setFilter={setFilter}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.PictureSelection) {
            return (
              <PictureChoiceSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                survey={survey}
                setFilter={setFilter}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.Date) {
            return (
              <DateQuestionSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                survey={survey}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.FileUpload) {
            return (
              <FileUploadSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                survey={survey}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.Cal) {
            return (
              <CalSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                survey={survey}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.Matrix) {
            return (
              <MatrixQuestionSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                survey={survey}
                setFilter={setFilter}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.Address) {
            return (
              <AddressSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                survey={survey}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.Ranking) {
            return (
              <RankingSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                surveyType={survey.type}
                survey={survey}
              />
            );
          }
          if (questionSummary.type === "hiddenField") {
            return (
              <HiddenFieldsSummary
                key={questionSummary.id}
                questionSummary={questionSummary}
                environment={environment}
              />
            );
          }
          if (questionSummary.type === TSurveyQuestionTypeEnum.ContactInfo) {
            return (
              <ContactInfoSummary
                key={questionSummary.question.id}
                questionSummary={questionSummary}
                environmentId={environment.id}
                survey={survey}
              />
            );
          }

          return null;
        })
      )}
    </div>
  );
};
