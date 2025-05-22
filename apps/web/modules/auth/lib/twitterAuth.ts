import { OAuthConfig } from "next-auth/providers/oauth";

export const TwitterOAuth2Provider = {
  id: "twitter",
  name: "Twitter",
  type: "oauth",
  authorization: {
    url: "https://twitter.com/i/oauth2/authorize",
    params: {
      scope: "tweet.read users.read follows.read offline.access",
      response_type: "code",
    },
  },
  token: "https://api.twitter.com/2/oauth2/token",
  userinfo: "https://api.twitter.com/2/users/me",
  profile(profile: any) {
    return {
      id: profile.data.id,
      name: profile.data.name,
      username: profile.data.username,
      email: null,
      image: null,
    };
  },
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
  checks: ["pkce", "state"],
} satisfies OAuthConfig<any>;

// export interface TwitterProfile {
//     id: string,
//     name: string,
//     username: string,
//     email: string | null,
//     image: string | null,
// }
