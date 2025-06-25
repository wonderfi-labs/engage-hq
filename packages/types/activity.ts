import { z } from "zod";

export const ZActivityFeedItem = z.object({
  id: z.string().cuid2(),
  type: z.enum(["event", "attribute", "display"]),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  attributeLabel: z.string().nullable(),
  attributeValue: z.string().nullable(),
  actionLabel: z.string().nullable(),
  actionDescription: z.string().nullable(),
  actionType: z.string().nullable(),
  displaySurveyName: z.string().nullable(),
});

export type TActivityFeedItem = z.infer<typeof ZActivityFeedItem>;

// Custom EngageHq Activity Types

export const ZMemberJoinedMetadata = z.object({});

export type TMemberJoinedMetadata = z.infer<typeof ZMemberJoinedMetadata>;

export const ZMemberLeftMetadata = z.object({});

export type TMemberLeftMetadata = z.infer<typeof ZMemberLeftMetadata>;

export const ZEngagementCompletedMetadata = z.object({
  engagementId: z.string(),
});

export type TEngagementCompletedMetadata = z.infer<typeof ZEngagementCompletedMetadata>;

export const ZEngagementCreatedMetadata = z.object({
  engagementId: z.string(),
  reward: z.any(),
});

export type TEngagementCreatedMetadata = z.infer<typeof ZEngagementCreatedMetadata>;

export const ZRewardPaidMetadata = z.object({
  engagementId: z.string(),
  reward: z.any(),
});

export type TRewardPaidMetadata = z.infer<typeof ZRewardPaidMetadata>;
