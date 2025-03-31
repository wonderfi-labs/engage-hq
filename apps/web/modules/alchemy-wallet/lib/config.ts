import { alchemy, sepolia } from "@account-kit/infra";
import { AlchemyAccountsUIConfig, cookieStorage, createConfig } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "flat",
  auth: {
    sections: [
      [{ type: "email" }],
      [
        { type: "passkey" },
        { type: "social", authProviderId: "google", mode: "popup" },
        { type: "social", authProviderId: "facebook", mode: "popup" },
        {
          type: "social",
          authProviderId: "auth0",
          mode: "popup",
          auth0Connection: "discord",
          displayName: "Discord",
          logoUrl: "/images/discord.svg",
          scope: "openid profile",
        },
        {
          type: "social",
          authProviderId: "auth0",
          mode: "popup",
          auth0Connection: "twitter",
          displayName: "Twitter",
          logoUrl: "/images/twitter.svg",
          logoUrlDark: "/images/twitter-dark.svg",
          scope: "openid profile",
        },
      ],
      [
        {
          type: "external_wallets",
          walletConnect: { projectId: "your-project-id" },
        },
      ],
    ],
    addPasskeyOnSignup: false,
  },
};

// Alchemy config
export const alchemyConfig = createConfig(
  {
    transport: alchemy({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "" }),
    chain: sepolia,
    ssr: true,
    enablePopupOauth: true,
    storage: cookieStorage,
    // sessionConfig: {
    //     expirationTimeMs: 1000 * 60 * 60, // 60 minutes (default is 15 min)
    // },
  },
  uiConfig
);

export const queryClient = new QueryClient();
