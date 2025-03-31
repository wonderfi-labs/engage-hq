"use client";
import { alchemyConfig, queryClient } from "@/modules/alchemy-wallet";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
 
export const AlchemyWalletProvider = (
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={alchemyConfig}
        queryClient={queryClient}
        initialState={props.initialState}>
        {props.children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
};
