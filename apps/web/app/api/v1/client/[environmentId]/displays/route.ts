import { responses } from "@/app/lib/api/response";
import { transformErrorToDetails } from "@/app/lib/api/validator";
import { capturePosthogEnvironmentEvent } from "@formbricks/lib/posthogServer";
import { logger } from "@formbricks/logger";
import { ZDisplayCreateInput } from "@formbricks/types/displays";
import { InvalidInputError } from "@formbricks/types/errors";
import { createDisplay } from "./lib/display";

interface Context {
  params: Promise<{
    environmentId: string;
  }>;
}

export const OPTIONS = async (): Promise<Response> => {
  return responses.successResponse({}, true);
};

export const POST = async (request: Request, context: Context): Promise<Response> => {
  const params = await context.params;
  const jsonInput = await request.json();
  const inputValidation = ZDisplayCreateInput.safeParse({
    ...jsonInput,
    environmentId: params.environmentId,
  });

  if (!inputValidation.success) {
    return responses.badRequestResponse(
      "Fields are missing or incorrectly formatted",
      transformErrorToDetails(inputValidation.error),
      true
    );
  }

  if (inputValidation.data.userId) {
    const isContactsEnabled = false;
    if (!isContactsEnabled) {
      return responses.forbiddenResponse("User identification is only available for enterprise users.", true);
    }
  }

  try {
    const response = await createDisplay(inputValidation.data);

    await capturePosthogEnvironmentEvent(inputValidation.data.environmentId, "display created");
    return responses.successResponse(response, true);
  } catch (error) {
    if (error instanceof InvalidInputError) {
      return responses.badRequestResponse(error.message);
    } else {
      logger.error({ error, url: request.url }, "Error in POST /api/v1/client/[environmentId]/displays");
      return responses.internalServerErrorResponse(error.message);
    }
  }
};
