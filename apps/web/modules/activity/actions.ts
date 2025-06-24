"use server";

import { authenticatedActionClient } from "@/lib/utils/action-client";
import {
  addEngagementCompletedActivity,
  addEngagementCreatedActivity,
  addMemberJoinedActivity,
  addMemberLeftActivity,
  addRewardPaidActivity,
  getCommunityActivity,
  getUserActivity,
} from "@/modules/activity/lib/activity";
import { Activity } from "@prisma/client";
import { z } from "zod";

const ZAddMemberJoinedActivityAction = z.object({
  communityId: z.string(),
});

export const addMemberJoinedActivityAction = authenticatedActionClient
  .schema(ZAddMemberJoinedActivityAction)
  .action(async ({ parsedInput, ctx }) => {
    const activityId = await addMemberJoinedActivity({
      userId: ctx.user.id,
      communityId: parsedInput.communityId,
      metadata: {},
    });

    return activityId;
  });

const ZAddMemberLeftActivityAction = z.object({
  communityId: z.string(),
});

export const addMemberLeftActivityAction = authenticatedActionClient
  .schema(ZAddMemberLeftActivityAction)
  .action(async ({ parsedInput, ctx }) => {
    const activityId = await addMemberLeftActivity({
      userId: ctx.user.id,
      communityId: parsedInput.communityId,
      metadata: {},
    });

    return activityId;
  });

const ZAddEngagementCompletedActivityAction = z.object({
  communityId: z.string().nullable(),
  engagementId: z.string(),
});

export const addEngagementCompletedActivityAction = authenticatedActionClient
  .schema(ZAddEngagementCompletedActivityAction)
  .action(async ({ parsedInput, ctx }) => {
    const activityId = await addEngagementCompletedActivity({
      userId: ctx.user.id,
      communityId: parsedInput.communityId,
      metadata: {
        engagementId: parsedInput.engagementId,
      },
    });

    return activityId;
  });

const ZAddEngagementCreatedActivityAction = z.object({
  engagementId: z.string(),
  reward: z.any(),
});

export const addEngagementCreatedActivityAction = authenticatedActionClient
  .schema(ZAddEngagementCreatedActivityAction)
  .action(async ({ parsedInput, ctx }) => {
    const activityId = await addEngagementCreatedActivity({
      communityId: ctx.user.id,
      metadata: {
        engagementId: parsedInput.engagementId,
        reward: parsedInput.reward,
      },
    });

    return activityId;
  });

const ZAddRewardPaidActivityAction = z.object({
  communityId: z.string().nullable(),
  engagementId: z.string(),
  reward: z.any(),
});

export const addRewardPaidActivityAction = authenticatedActionClient
  .schema(ZAddRewardPaidActivityAction)
  .action(async ({ parsedInput, ctx }) => {
    const activityId = await addRewardPaidActivity({
      userId: ctx.user.id,
      communityId: parsedInput.communityId,
      metadata: {
        engagementId: parsedInput.engagementId,
        reward: parsedInput.reward,
      },
    });

    return activityId;
  });

const ZGetCommunityActivityAction = z.object({
  communityId: z.string(),
});

export const getCommunityActivityAction = authenticatedActionClient
  .schema(ZGetCommunityActivityAction)
  .action(async ({ parsedInput }): Promise<Activity[]> => {
    const communityActivity = await getCommunityActivity({
      communityId: parsedInput.communityId,
    });

    return communityActivity;
  });

const ZGetUserActivityAction = z.object({
  userId: z.string(),
});

export const getUserActivityAction = authenticatedActionClient
  .schema(ZGetUserActivityAction)
  .action(async ({ parsedInput }): Promise<Activity[]> => {
    const userActivity = await getUserActivity({
      userId: parsedInput.userId,
    });

    return userActivity;
  });

const ZGetCurrentUserActivityAction = z.object({});

export const getCurrentUserActivityAction = authenticatedActionClient
  .schema(ZGetCurrentUserActivityAction)
  .action(async ({ ctx }): Promise<Activity[]> => {
    const userActivity = await getUserActivity({
      userId: ctx.user.id,
    });

    return userActivity;
  });
