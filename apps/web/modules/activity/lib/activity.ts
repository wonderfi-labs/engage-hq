import { Activity, ActivityEventType, ActivityType, Prisma } from "@prisma/client";
import { prisma } from "@formbricks/database";
import {
  TEngagementCompletedMetadata,
  TEngagementCreatedMetadata,
  TMemberJoinedMetadata,
  TMemberLeftMetadata,
  TRewardPaidMetadata,
} from "@formbricks/types/activity";
import { DatabaseError, InvalidInputError } from "@formbricks/types/errors";

export const addMemberJoinedActivity = async ({
  userId,
  communityId,
  metadata,
}: {
  userId: string;
  communityId: string;
  metadata: TMemberJoinedMetadata;
}): Promise<string> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    // Check if user exists
    if (!user) {
      throw new InvalidInputError("User does not exist!");
    }

    const community = await prisma.user.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    // Check if community exists
    if (!community) {
      throw new InvalidInputError("Community does not exist!");
    }

    // Create new activity
    const activity = await prisma.activity.create({
      data: {
        userId: userId,
        communityId: communityId,
        activityEvent: ActivityEventType.MEMBER_JOINED,
        activityType: ActivityType.USER,
        metadata: metadata,
      },
    });

    return activity.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const addMemberLeftActivity = async ({
  userId,
  communityId,
  metadata,
}: {
  userId: string;
  communityId: string;
  metadata: TMemberLeftMetadata;
}): Promise<string> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    // Check if user exists
    if (!user) {
      throw new InvalidInputError("User does not exist!");
    }

    const community = await prisma.user.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    // Check if community exists
    if (!community) {
      throw new InvalidInputError("Community does not exist!");
    }

    // Create new activity
    const activity = await prisma.activity.create({
      data: {
        userId: userId,
        communityId: communityId,
        activityEvent: ActivityEventType.MEMBER_LEFT,
        activityType: ActivityType.USER,
        metadata: metadata,
      },
    });

    return activity.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const addEngagementCompletedActivity = async ({
  userId,
  communityId,
  metadata,
}: {
  userId: string;
  communityId: string | null;
  metadata: TEngagementCompletedMetadata;
}): Promise<string> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    // Check if user exists
    if (!user) {
      throw new InvalidInputError("User does not exist!");
    }

    if (communityId) {
      const community = await prisma.user.findUnique({
        where: { id: communityId },
        select: { id: true },
      });

      // Check if community exists
      if (!community) {
        throw new InvalidInputError("Community does not exist!");
      }
    }

    // Create new activity
    const activity = await prisma.activity.create({
      data: {
        userId: userId,
        communityId: communityId,
        activityEvent: ActivityEventType.ENGAGEMENT_COMPLETED,
        activityType: ActivityType.USER,
        metadata: metadata,
      },
    });

    return activity.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const addEngagementCreatedActivity = async ({
  communityId,
  metadata,
}: {
  communityId: string;
  metadata: TEngagementCreatedMetadata;
}): Promise<string> => {
  try {
    const community = await prisma.user.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    // Check if user exists
    if (!community) {
      throw new InvalidInputError("Community does not exist!");
    }

    // Create new activity
    const activity = await prisma.activity.create({
      data: {
        communityId: communityId,
        activityEvent: ActivityEventType.ENGAGEMENT_CREATED,
        activityType: ActivityType.COMMUNITY,
        metadata: metadata,
      },
    });

    return activity.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const addRewardPaidActivity = async ({
  userId,
  communityId,
  metadata,
}: {
  userId: string;
  communityId: string | null;
  metadata: TRewardPaidMetadata;
}): Promise<string> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    // Check if user exists
    if (!user) {
      throw new InvalidInputError("User does not exist!");
    }

    if (communityId) {
      const community = await prisma.user.findUnique({
        where: { id: communityId },
        select: { id: true },
      });

      // Check if community exists
      if (!community) {
        throw new InvalidInputError("Community does not exist!");
      }
    }

    // Create new activity
    const activity = await prisma.activity.create({
      data: {
        userId: userId,
        communityId: communityId,
        activityEvent: ActivityEventType.REWARD_PAID,
        activityType: ActivityType.USER,
        metadata: metadata,
      },
    });

    return activity.id;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const getCommunityActivity = async ({ communityId }: { communityId: string }): Promise<Activity[]> => {
  try {
    const community = await prisma.user.findUnique({
      where: { id: communityId },
      select: { id: true },
    });

    // Check if user exists
    if (!community) {
      throw new InvalidInputError("Community does not exist!");
    }

    const communityActivity = await prisma.activity.findMany({
      where: {
        communityId: communityId,
      },
      include: {
        user: true,
        community: true,
      },
    });

    return communityActivity;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};

export const getUserActivity = async ({ userId }: { userId: string }): Promise<Activity[]> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    // Check if user exists
    if (!user) {
      throw new InvalidInputError("User does not exist!");
    }

    const userActivity = await prisma.activity.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        community: true,
      },
    });

    return userActivity;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DatabaseError(error.message);
    }
    throw error;
  }
};
