import { type TJsEnvironmentStateSurvey, type TJsFileUploadParams } from "@formbricks/types/js";
import { type TResponseData, type TResponseDataValue, type TResponseTtc } from "@formbricks/types/responses";
import { type TUploadFileConfig } from "@formbricks/types/storage";
import {
  type TSurveyQuestion,
  type TSurveyQuestionChoice,
  type TSurveyQuestionId,
  TSurveyQuestionTypeEnum,
} from "@formbricks/types/surveys/types";
import { getLocalizedValue } from "../../lib/i18n";
import { AddressQuestion } from "../questions/address-question";
import { CalQuestion } from "../questions/cal-question";
import { ConsentQuestion } from "../questions/consent-question";
import { ContactInfoQuestion } from "../questions/contact-info-question";
import { CTAQuestion } from "../questions/cta-question";
import { DateQuestion } from "../questions/date-question";
import { DeployTokenQuestion } from "../questions/deploy-token-question";
import { FileUploadQuestion } from "../questions/file-upload-question";
import { MatrixQuestion } from "../questions/matrix-question";
import { MultipleChoiceMultiQuestion } from "../questions/multiple-choice-multi-question";
import { MultipleChoiceSingleQuestion } from "../questions/multiple-choice-single-question";
import { NPSQuestion } from "../questions/nps-question";
import { OpenTextQuestion } from "../questions/open-text-question";
import { PictureSelectionQuestion } from "../questions/picture-selection-question";
import { RankingQuestion } from "../questions/ranking-question";
import { RatingQuestion } from "../questions/rating-question";

interface QuestionConditionalProps {
  question: TSurveyQuestion;
  value: string | number | string[] | Record<string, string>;
  onChange: (responseData: TResponseData) => void;
  onSubmit: (data: TResponseData, ttc: TResponseTtc) => void;
  onBack: () => void;
  onFileUpload: (file: TJsFileUploadParams["file"], config?: TUploadFileConfig) => Promise<string>;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  languageCode: string;
  prefilledQuestionValue?: TResponseDataValue;
  skipPrefilled?: boolean;
  ttc: TResponseTtc;
  setTtc: (ttc: TResponseTtc) => void;
  survey: TJsEnvironmentStateSurvey;
  surveyId: string;
  autoFocusEnabled: boolean;
  currentQuestionId: TSurveyQuestionId;
  isBackButtonHidden: boolean;
  setIsResponseSendingFinished?: (finish: boolean) => void;
  onOpenExternalURL?: (url: string) => void | Promise<void>;
}

export function QuestionConditional({
  question,
  value,
  onChange,
  onSubmit,
  onBack,
  isFirstQuestion,
  isLastQuestion,
  languageCode,
  prefilledQuestionValue,
  skipPrefilled,
  ttc,
  setTtc,
  survey,
  surveyId,
  onFileUpload,
  autoFocusEnabled,
  currentQuestionId,
  isBackButtonHidden,
  setIsResponseSendingFinished,
  onOpenExternalURL,
}: QuestionConditionalProps) {
  const getResponseValueForRankingQuestion = (
    value: string[],
    choices: TSurveyQuestionChoice[]
  ): string[] => {
    return value
      .map((label) => choices.find((choice) => getLocalizedValue(choice.label, languageCode) === label)?.id)
      .filter((id): id is TSurveyQuestionChoice["id"] => id !== undefined);
  };

  if (!value && (prefilledQuestionValue || prefilledQuestionValue === "")) {
    if (skipPrefilled) {
      onSubmit({ [question.id]: prefilledQuestionValue }, { [question.id]: 0 });
    } else {
      onChange({ [question.id]: prefilledQuestionValue });
    }
  }

  return question.type === TSurveyQuestionTypeEnum.OpenText ? (
    <OpenTextQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.MultipleChoiceSingle ? (
    <MultipleChoiceSingleQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "string" ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.MultipleChoiceMulti ? (
    <MultipleChoiceMultiQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.NPS ? (
    <NPSQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "number" ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.CTA ? (
    <CTAQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
      onOpenExternalURL={onOpenExternalURL}
    />
  ) : question.type === TSurveyQuestionTypeEnum.Rating ? (
    <RatingQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "number" ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.Consent ? (
    <ConsentQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.Date ? (
    <DateQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.PictureSelection ? (
    <PictureSelectionQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.FileUpload ? (
    <FileUploadQuestion
      key={question.id}
      surveyId={surveyId}
      question={question}
      survey={survey}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      onFileUpload={onFileUpload}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.Cal ? (
    <CalQuestion
      key={question.id}
      question={question}
      survey={survey}
      value={typeof value === "string" ? value : ""}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      autoFocusEnabled={autoFocusEnabled}
      setTtc={setTtc}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.Matrix ? (
    <MatrixQuestion
      question={question}
      survey={survey}
      value={typeof value === "object" && !Array.isArray(value) ? value : {}}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.Address ? (
    <AddressQuestion
      question={question}
      survey={survey}
      value={Array.isArray(value) ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      currentQuestionId={currentQuestionId}
      autoFocusEnabled={autoFocusEnabled}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.Ranking ? (
    <RankingQuestion
      question={question}
      survey={survey}
      value={Array.isArray(value) ? getResponseValueForRankingQuestion(value, question.choices) : []}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      autoFocusEnabled={autoFocusEnabled}
      currentQuestionId={currentQuestionId}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.ContactInfo ? (
    <ContactInfoQuestion
      question={question}
      survey={survey}
      value={Array.isArray(value) ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      currentQuestionId={currentQuestionId}
      autoFocusEnabled={autoFocusEnabled}
      isBackButtonHidden={isBackButtonHidden}
    />
  ) : question.type === TSurveyQuestionTypeEnum.DeployToken ? (
    <DeployTokenQuestion
      question={question}
      survey={survey}
      value={Array.isArray(value) ? value : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
      onBack={onBack}
      isFirstQuestion={isFirstQuestion}
      isLastQuestion={isLastQuestion}
      languageCode={languageCode}
      ttc={ttc}
      setTtc={setTtc}
      currentQuestionId={currentQuestionId}
      autoFocusEnabled={autoFocusEnabled}
      isBackButtonHidden={isBackButtonHidden}
      setIsResponseSendingFinished={setIsResponseSendingFinished}
    />
  ) : null;
}
