import { TUser } from "@formbricks/types/user";

export const mockUser: TUser = {
  id: "cm5xj580r00000cmgdj9ohups",
  name: "mock User",
  email: "john.doe@example.com",
  emailVerified: new Date("2024-01-01T00:00:00.000Z"),
  imageUrl: "https://www.google.com",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  twoFactorEnabled: false,
  identityProvider: "google",
  objective: "improve_user_retention",
  notificationSettings: {
    alert: {},
    weeklySummary: {},
    unsubscribedOrganizationIds: [],
  },
  whitelist: false,
  role: "other",
  locale: "en-US",
  communityName: "Mock Community",
  communityDescription: "This is a mock community for testing",
  communityAvatarUrl: null,
  communityBannerUrl: null,
  communitySlug: "mock-community",
};
