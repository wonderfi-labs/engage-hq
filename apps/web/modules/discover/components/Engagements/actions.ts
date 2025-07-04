"use server";

import { authenticatedActionClient } from "@/lib/utils/action-client";
import { TExtendedSurvey, TSurveyCreator } from "@/modules/discover/types/survey";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@formbricks/database";
import { TResponse } from "@formbricks/types/responses";

const ZGetAvailableSurveysAction = z.object({
  take: z.number(),
  skip: z.number(),
  searchQuery: z.string().optional(),
  creatorId: z.string().optional(),
  sortBy: z.string().optional(),
});

const buildOrderByClause = (sortBy?: string): Prisma.SurveyOrderByWithRelationInput => {
  const orderMapping: { [key: string]: Prisma.SurveyOrderByWithRelationInput } = {
    name: { name: "asc" },
    createdAt: { createdAt: "desc" },
    updatedAt: { updatedAt: "desc" },
  };

  return sortBy ? orderMapping[sortBy] || { updatedAt: "desc" } : { updatedAt: "desc" };
};

export const getCompletedSurveysAction = authenticatedActionClient
  .schema(ZGetAvailableSurveysAction)
  .action(async ({ ctx, parsedInput }) => {
    const searchQuery = parsedInput.searchQuery;
    const creatorId = parsedInput.creatorId;
    const sortBy = parsedInput.sortBy || "updatedAt";
    const orderBy = buildOrderByClause(sortBy);

    const surveysPrisma = await prisma.survey.findMany({
      where: {
        ...(creatorId
          ? {
              creator: {
                id: creatorId,
              },
            }
          : {}),
        responses: {
          some: {
            data: {
              path: ["verifiedEmail"],
              equals: ctx.user.email,
            },
          },
        },
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        responses: {
          where: {
            data: {
              path: ["verifiedEmail"],
              equals: ctx.user.email,
            },
          },
        },
        triggers: {
          include: {
            actionClass: true,
          },
        },
        followUps: true,
        segment: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
      orderBy,
      take: parsedInput.take,
      skip: parsedInput.skip,
    });

    const extendedSurveys = await Promise.all(
      surveysPrisma.map(async (survey) => {
        const totalResponseCount = await prisma.response.count({
          where: {
            surveyId: survey.id,
          },
        });

        //Prisma SurveyType: enum {link, web, website, app}
        //TSurveyType: enum {link, app}
        let surveyType = "link";
        switch (survey.type) {
          case "app":
            surveyType = "app";
            break;
          default:
            surveyType = "link";
        }

        let creator: TSurveyCreator | undefined = undefined;
        if (survey.createdBy) {
          const user = await prisma.user.findFirst({
            where: {
              id: survey.createdBy,
            },
            select: {
              id: true,
              name: true,
              imageUrl: true,
              communityName: true,
              communityAvatarUrl: true,
            },
          });
          if (user) {
            creator = {
              id: user.id,
              name: user.name || "",
              imageUrl: user.imageUrl || "",
              communityName: user.communityName || "",
              communityAvatarUrl: user.communityAvatarUrl || "",
            };
          }
        }

        const extendedSurvey = {
          ...survey,
          type: surveyType,
          responseCount: totalResponseCount,
          creator: creator,
          segment: survey.segment
            ? {
                ...survey.segment,
                // segment specific surveys
                surveys: [],
              }
            : null,
        };

        return extendedSurvey;
      })
    );
    return extendedSurveys as TExtendedSurvey[];
  });

export const getAvailableSurveysAction = authenticatedActionClient
  .schema(ZGetAvailableSurveysAction)
  .action(async ({ ctx, parsedInput }) => {
    const searchQuery = parsedInput.searchQuery;
    const creatorId = parsedInput.creatorId;
    const sortBy = parsedInput.sortBy || "updatedAt";
    const orderBy = buildOrderByClause(sortBy);
    const surveysPrisma = await prisma.survey.findMany({
      where: {
        public: true,
        status: "inProgress",
        ...(creatorId
          ? {
              creator: {
                id: creatorId,
              },
            }
          : {}),
        responses: {
          none: {
            data: {
              path: ["verifiedEmail"],
              equals: ctx.user.email,
            },
          },
        },
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        triggers: {
          include: {
            actionClass: true,
          },
        },
        followUps: true,
        segment: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
      orderBy,
      take: parsedInput.take,
      skip: parsedInput.skip,
    });

    const extendedSurveys = await Promise.all(
      surveysPrisma.map(async (survey) => {
        const totalResponseCount = await prisma.response.count({
          where: {
            surveyId: survey.id,
          },
        });

        //Prisma SurveyType: enum {link, web, website, app}
        //TSurveyType: enum {link, app}
        let surveyType = "link";
        switch (survey.type) {
          case "app":
            surveyType = "app";
            break;
          default:
            surveyType = "link";
        }

        let creator: TSurveyCreator | undefined = undefined;
        if (survey.createdBy) {
          const user = await prisma.user.findFirst({
            where: {
              id: survey.createdBy,
            },
          });
          if (user) {
            creator = {
              id: user.id,
              name: user.name,
              imageUrl: user.imageUrl,
              communityName: user.communityName || "",
              communityAvatarUrl: user.communityAvatarUrl || "",
            };
          }
        }

        const extendedSurvey = {
          ...survey,
          type: surveyType,
          responseCount: totalResponseCount,
          creator: creator,
          segment: survey.segment
            ? {
                ...survey.segment,
                // segment specific surveys
                surveys: [],
              }
            : null,
        };

        return extendedSurvey;
      })
    );
    return extendedSurveys as TExtendedSurvey[];
  });

export const getUserResponseAction = authenticatedActionClient
  .schema(z.object({ surveyId: z.string(), creatorId: z.string() }))
  .action(async ({ ctx, parsedInput }) => {
    const { surveyId, creatorId } = parsedInput;

    const isCreator = ctx.user.id == creatorId;

    if (!ctx.user.email) {
      throw new Error("User email not found");
    }

    const response = await prisma.response.findFirst({
      where: {
        surveyId,
        data: {
          path: ["verifiedEmail"],
          equals: ctx.user.email,
        },
      },
      include: {
        contact: true,
        tags: {
          include: {
            tag: true,
          },
        },
        notes: {
          include: {
            user: true,
          },
        },
      },
    });

    //restrict access if the user is not the respondent or not the survey creator
    if (!response && !isCreator) {
      return null;
    }

    if (!response) {
      return null;
    }

    let formattedContact: { id: string; userId: string } | null = null;
    if (response.contact) {
      formattedContact = {
        id: response.contact.id,
        userId: response.contact.userId || "",
      };
    }

    const userResponse: TResponse = {
      id: response.id,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      surveyId: response.surveyId,
      finished: response.finished,
      data: response.data || {},
      language: response.language,
      meta: response.meta || {},
      ttc: response.ttc || {},
      variables: response.variables || {},
      notes: response.notes || [],
      tags: Array.isArray(response.tags) ? response.tags.map((tr) => tr.tag) : [],
      contactAttributes: response.contactAttributes || {},
      singleUseId: response.singleUseId,
      contact: formattedContact,
      displayId: response.displayId,
      endingId: response.endingId || null,
    };

    return userResponse;
  });

export const getPastEngagementsAction = authenticatedActionClient
  .schema(ZGetAvailableSurveysAction)
  .action(async ({ ctx, parsedInput }) => {
    const searchQuery = parsedInput.searchQuery;
    const creatorId = parsedInput.creatorId;
    const sortBy = parsedInput.sortBy || "updatedAt";
    const orderBy = buildOrderByClause(sortBy);

    const surveysPrisma = await prisma.survey.findMany({
      where: {
        closeOnDate: {
          lt: new Date(),
        },
        ...(creatorId
          ? {
              creator: {
                id: creatorId,
              },
            }
          : {}),

        //search query if provided
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        responses: {
          where: {
            data: {
              path: ["verifiedEmail"],
              equals: ctx.user.email,
            },
          },
        },
        creator: true,
        triggers: {
          include: {
            actionClass: true,
          },
        },
        followUps: true,
        segment: true,
        languages: {
          include: {
            language: true,
          },
        },
      },
      orderBy,
      take: parsedInput.take,
      skip: parsedInput.skip,
    });

    const extendedSurveys = await Promise.all(
      surveysPrisma.map(async (survey) => {
        let surveyType = "link";
        switch (survey.type) {
          case "app":
            surveyType = "app";
            break;
          default:
            surveyType = "link";
        }

        let creator: TSurveyCreator | undefined = undefined;
        if (survey.createdBy) {
          const user = await prisma.user.findFirst({
            where: {
              id: survey.createdBy,
            },
            select: {
              id: true,
              name: true,
              imageUrl: true,
              communityName: true,
              communityAvatarUrl: true,
            },
          });

          if (user) {
            creator = {
              id: user.id,
              name: user.name || "",
              imageUrl: user.imageUrl || "",
              communityName: user.communityName || "",
              communityAvatarUrl: user.communityAvatarUrl || "",
            };
          }
        }

        const responseCount = await prisma.response.count({
          where: {
            surveyId: survey.id,
          },
        });

        return {
          ...survey,
          type: surveyType,
          responseCount,
          creator,
          segment: survey.segment ? { ...survey.segment, surveys: [] } : null,
        };
      })
    );

    return extendedSurveys as TExtendedSurvey[];
  });
