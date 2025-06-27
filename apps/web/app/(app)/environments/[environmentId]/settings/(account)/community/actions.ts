"use server";

import { authenticatedActionClient } from "@/lib/utils/action-client";
import { z } from "zod";
import { prisma } from "@formbricks/database";
import { deleteFile } from "@formbricks/lib/storage/service";
import { getFileNameWithIdFromUrl } from "@formbricks/lib/storage/utils";
import { updateUser } from "@formbricks/lib/user/service";
import { ZId } from "@formbricks/types/common";
import { ZUserUpdateInput } from "@formbricks/types/user";

export const updateUserAction = authenticatedActionClient
  .schema(ZUserUpdateInput.partial())
  .action(async ({ parsedInput, ctx }) => {
    return await updateUser(ctx.user.id, parsedInput);
  });

//communityAvatarActions
const ZUpdateCommunityAvatarAction = z.object({
  communityAvatarUrl: z.string(),
});

export const updateCommunityAvatarAction = authenticatedActionClient
  .schema(ZUpdateCommunityAvatarAction)
  .action(async ({ parsedInput, ctx }) => {
    return await updateUser(ctx.user.id, { communityAvatarUrl: parsedInput.communityAvatarUrl });
  });

const ZRemoveCommunityAvatarAction = z.object({
  environmentId: ZId,
});

export const removeCommunityAvatarAction = authenticatedActionClient
  .schema(ZRemoveCommunityAvatarAction)
  .action(async ({ parsedInput, ctx }) => {
    const communityAvatarUrl = ctx.user.communityAvatarUrl;
    if (!communityAvatarUrl) {
      throw new Error("Image not found");
    }

    const fileName = getFileNameWithIdFromUrl(communityAvatarUrl);
    if (!fileName) {
      throw new Error("Invalid filename");
    }

    const deletionResult = await deleteFile(parsedInput.environmentId, "public", fileName);
    if (!deletionResult.success) {
      throw new Error("Deletion failed");
    }
    return await updateUser(ctx.user.id, { communityAvatarUrl: null });
  });

const ZUpdateAvatarAction = z.object({
  avatarUrl: z.string(),
});

export const updateAvatarAction = authenticatedActionClient
  .schema(ZUpdateAvatarAction)
  .action(async ({ parsedInput, ctx }) => {
    return await updateUser(ctx.user.id, { imageUrl: parsedInput.avatarUrl });
  });

const ZRemoveAvatarAction = z.object({
  environmentId: ZId,
});

export const removeAvatarAction = authenticatedActionClient
  .schema(ZRemoveAvatarAction)
  .action(async ({ parsedInput, ctx }) => {
    const imageUrl = ctx.user.imageUrl;
    if (!imageUrl) {
      throw new Error("Image not found");
    }

    const fileName = getFileNameWithIdFromUrl(imageUrl);
    if (!fileName) {
      throw new Error("Invalid filename");
    }

    const deletionResult = await deleteFile(parsedInput.environmentId, "public", fileName);
    if (!deletionResult.success) {
      throw new Error("Deletion failed");
    }
    return await updateUser(ctx.user.id, { imageUrl: null });
  });

//communityBannerActions
export const updateCommunityBannerAction = authenticatedActionClient
  .schema(z.object({ communityBannerUrl: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    return await updateUser(ctx.user.id, { communityBannerUrl: parsedInput.communityBannerUrl });
  });

export const removeCommunityBannerAction = authenticatedActionClient
  .schema(z.object({ environmentId: ZId }))
  .action(async ({ parsedInput, ctx }) => {
    const communityBannerUrl = ctx.user.communityBannerUrl;
    if (!communityBannerUrl) {
      throw new Error("Banner image not found");
    }

    const fileName = getFileNameWithIdFromUrl(communityBannerUrl);
    if (!fileName) {
      throw new Error("Invalid filename");
    }

    const deletionResult = await deleteFile(parsedInput.environmentId, "public", fileName);
    if (!deletionResult.success) {
      throw new Error("Banner deletion failed");
    }
    return await updateUser(ctx.user.id, { communityBannerUrl: null });
  });

//Slug actoins
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ZSlug = z.string().regex(slugRegex);

const ZUpdateCommunityAction = z.object({
  communityName: z.string(),
  communityDescription: z.string().optional(),
  communitySlug: ZSlug.optional(),
});

export const updateCommunityAction = authenticatedActionClient
  .schema(ZUpdateCommunityAction)
  .action(async ({ parsedInput, ctx }) => {
    const { communityName, communityDescription, communitySlug } = parsedInput;

    return await updateUser(ctx.user.id, {
      communityName,
      communityDescription,
      communitySlug,
    });
  });

export async function findUniqueCommunitySlugAction(baseSlug: string, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { communitySlug: true },
  });

  if (user?.communitySlug == baseSlug) {
    return baseSlug;
  }

  const existingSlugs = await prisma.user.findMany({
    where: {
      communitySlug: {
        startsWith: baseSlug,
      },
      id: { not: userId },
    },
    select: {
      communitySlug: true,
    },
  });

  const exactBaseSlugExists = existingSlugs.some(({ communitySlug }) => communitySlug === baseSlug);
  if (!exactBaseSlugExists) return baseSlug;

  const suffixNumbers = existingSlugs.map(({ communitySlug }) => {
    const match = communitySlug?.match(new RegExp(`^${baseSlug}-(\\d+)$`)); //extract the number after the base slug
    return match ? Number(match[1]) : 0;
  });

  const maxSuffix = Math.max(0, ...suffixNumbers);
  const nextSuffix = maxSuffix + 1;
  return `${baseSlug}-${nextSuffix}`;
}
