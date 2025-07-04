import { z } from "zod";

const ZRole = z.enum(["project_manager", "engineer", "founder", "marketing_specialist", "other"]);

export const ZUserLocale = z.enum(["en-US", "de-DE", "pt-BR", "fr-FR", "zh-Hant-TW", "pt-PT"]);

export type TUserLocale = z.infer<typeof ZUserLocale>;
export const ZUserObjective = z.enum([
  "increase_conversion",
  "improve_user_retention",
  "increase_user_adoption",
  "sharpen_marketing_messaging",
  "support_sales",
  "other",
]);

export type TUserObjective = z.infer<typeof ZUserObjective>;

export const ZUserNotificationSettings = z.object({
  alert: z.record(z.boolean()),
  weeklySummary: z.record(z.boolean()),
  unsubscribedOrganizationIds: z.array(z.string()).optional(),
});

export const ZUserName = z
  .string()
  .trim()
  .min(1, { message: "Name should be at least 1 character long" })
  .regex(/^[\p{L}\p{M}\s'\d-]+$/u, "Invalid name format");

export const ZUserEmail = z.string().max(255).email({ message: "Invalid email" });

export type TUserEmail = z.infer<typeof ZUserEmail>;

export const ZUserPassword = z
  .string()
  .min(8)
  .max(128, { message: "Password must be 128 characters or less" })
  .regex(/^(?=.*[A-Z])(?=.*\d).*$/);

export type TUserPassword = z.infer<typeof ZUserPassword>;

export type TUserNotificationSettings = z.infer<typeof ZUserNotificationSettings>;

const ZUserIdentityProvider = z.enum(["email", "google", "github", "azuread", "openid", "saml"]);

export const ZUser = z.object({
  id: z.string(),
  name: ZUserName,
  email: ZUserEmail,
  emailVerified: z.date().nullable(),
  imageUrl: z.string().url().nullable(),
  twoFactorEnabled: z.boolean(),
  identityProvider: ZUserIdentityProvider,
  createdAt: z.date(),
  updatedAt: z.date(),
  role: ZRole.nullable(),
  objective: ZUserObjective.nullable(),
  notificationSettings: ZUserNotificationSettings,
  whitelist: z.boolean(),
  locale: ZUserLocale,
  communityName: z.string().nullable(),
  communityDescription: z.string().nullable(),
  communityAvatarUrl: z.string().url().nullable(),
  communityBannerUrl: z.string().url().nullable(),
  communitySlug: z.string().nullable(),
});

export type TUser = z.infer<typeof ZUser>;

// Update this here if using the profile page
// https://www.notion.so/bitbuy/Create-UI-to-update-user-s-community-name-and-description-202f256cbc57807ba7f0cdd6e6f7d1e3?source=copy_link
export const ZUserUpdateInput = z.object({
  name: ZUserName.optional(),
  email: ZUserEmail.optional(),
  emailVerified: z.date().nullish(),
  password: ZUserPassword.optional(),
  role: ZRole.optional(),
  objective: ZUserObjective.nullish(),
  imageUrl: z.string().nullish(),
  notificationSettings: ZUserNotificationSettings.optional(),
  locale: ZUserLocale.optional(),
  communityName: z.string().nullish(),
  communityDescription: z.string().nullish(),
  communityAvatarUrl: z.string().nullish(),
  communityBannerUrl: z.string().nullish(),
  communitySlug: z.string().nullish(),
});

export type TUserUpdateInput = z.infer<typeof ZUserUpdateInput>;

export const ZUserCreateInput = z.object({
  name: ZUserName,
  email: ZUserEmail,
  password: ZUserPassword.optional(),
  emailVerified: z.date().optional(),
  role: ZRole.optional(),
  objective: ZUserObjective.nullish(),
  imageUrl: z.string().nullish(),
  identityProvider: ZUserIdentityProvider.optional(),
  identityProviderAccountId: z.string().optional(),
  locale: ZUserLocale.optional(),
  communityAvatarUrl: z.string().nullish(),
});

export type TUserCreateInput = z.infer<typeof ZUserCreateInput>;

export const ZUserSocial = z.object({
  id: z.string(),
  provider: z.string(),
  socialId: z.string(),
  socialName: z.string().nullable(),
  socialEmail: z.string(),
  socialAvatar: z.string().nullable(),
});

export type TUserSocial = z.infer<typeof ZUserSocial>;

export const ZCommunityMember = z.object({
  id: z.string(),
  name: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  email: ZUserEmail.optional(),
  socials: z.array(ZUserSocial).optional(),
});

export type TCommunityMember = z.infer<typeof ZCommunityMember>;

export const ZUserWhitelistInfo = z.object({
  id: z.string(),
  email: ZUserEmail,
  name: ZUserName,
  whitelist: z.boolean(),
  communityName: z.string().nullable(),
  communityDescription: z.string().nullable(),
  _count: z
    .object({
      communityMembers: z.number().optional(),
    })
    .optional(),
  createdSurveys: z.number().optional(),
  surveyRewards: z.number().optional(),
  surveysCompleted: z.number().optional(),
  createdAt: z.date().optional(),
  members: z.array(ZCommunityMember).optional(),
});

export type TUserWhitelistInfo = z.infer<typeof ZUserWhitelistInfo>;

export const ZUserCommunity = z.object({
  id: z.string(),
  user: ZUser,
  creator: ZUser,
});

export type TUserCommunity = z.infer<typeof ZUserCommunity>;
