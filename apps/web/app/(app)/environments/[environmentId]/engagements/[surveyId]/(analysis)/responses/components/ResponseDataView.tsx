"use client";

import { ResponseTable } from "@/app/(app)/environments/[environmentId]/engagements/[surveyId]/(analysis)/responses/components/ResponseTable";
import { useTranslate } from "@tolgee/react";
import React from "react";
import { TEnvironment } from "@formbricks/types/environment";
import { TResponse } from "@formbricks/types/responses";
import { TSurvey } from "@formbricks/types/surveys/types";
import { TTag } from "@formbricks/types/tags";
import { TUser } from "@formbricks/types/user";
import { mapResponsesToTableData } from "../lib/response";

interface ResponseDataViewProps {
  survey: TSurvey;
  responses: TResponse[];
  user?: TUser;
  environment: TEnvironment;
  environmentTags: TTag[];
  isReadOnly: boolean;
  fetchNextPage: () => void;
  hasMore: boolean;
  deleteResponses: (responseIds: string[]) => void;
  updateResponse: (responseId: string, updatedResponse: TResponse) => void;
  isFetchingFirstPage: boolean;
}

export const ResponseDataView: React.FC<ResponseDataViewProps> = ({
  survey,
  responses,
  user,
  environment,
  environmentTags,
  isReadOnly,
  fetchNextPage,
  hasMore,
  deleteResponses,
  updateResponse,
  isFetchingFirstPage,
}) => {
  const { t } = useTranslate();
  const data = mapResponsesToTableData(responses, survey, t);

  return (
    <div className="w-full">
      <ResponseTable
        data={data}
        survey={survey}
        responses={responses}
        user={user}
        environmentTags={environmentTags}
        isReadOnly={isReadOnly}
        environment={environment}
        fetchNextPage={fetchNextPage}
        hasMore={hasMore}
        deleteResponses={deleteResponses}
        updateResponse={updateResponse}
        isFetchingFirstPage={isFetchingFirstPage}
      />
    </div>
  );
};
