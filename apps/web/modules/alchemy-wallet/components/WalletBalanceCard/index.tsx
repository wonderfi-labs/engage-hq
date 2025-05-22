"use client";

import WalletAddress from "@/modules/alchemy-wallet/components/WalletBalanceCard/components/wallet-address";
import WalletEthBalance from "@/modules/alchemy-wallet/components/WalletBalanceCard/components/wallet-eth-balance";
import WalletTokenBalances from "@/modules/alchemy-wallet/components/WalletBalanceCard/components/wallet-token-balances";
import { useTranslate } from "@tolgee/react";
import { SessionProvider, signIn } from "next-auth/react";
import { cn } from "@formbricks/lib/cn";

export function WalletBalanceCard({ className = "" }: { className?: string }) {
  const { t } = useTranslate();

  return (
    <SessionProvider>
      <div
        className={cn(
          "relative my-4 flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm md:flex-row",
          className
        )}
        id={"wallet-balance"}>
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {/* Wallet Address */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-2">
              <h3 className="text-lg font-medium capitalize leading-6 text-slate-900">
                {t("environments.wallet.balance_card.wallet_address")}
              </h3>
            </div>
            <div className="bg-secondary text-secondary-foreground rounded-md p-2">
              <WalletAddress />
            </div>
          </div>
          {/* Eth Balance */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-2">
              <h3 className="text-lg font-medium capitalize leading-6 text-slate-900">
                {t("environments.wallet.balance_card.balance")}
              </h3>
            </div>
            <WalletEthBalance />
          </div>
        </div>
      </div>
      <WalletTokenBalances />
      <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
      {/* <a
  href={`/api/auth/signin/twitter?callbackUrl=${encodeURIComponent("")}`}
  target="_blank"
  rel="noopener noreferrer"
>
  Sign in with Twitter
</a> */}
    </SessionProvider>
  );
}

export default WalletBalanceCard;
