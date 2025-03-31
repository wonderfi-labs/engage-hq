"use client";
<<<<<<< HEAD

=======
>>>>>>> 1f1cf956e (init alchemy-wallet module)
import { alchemyConfig, queryClient } from "@/modules/alchemy-wallet";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
<<<<<<< HEAD

export const AlchemyWalletProvider = (props: PropsWithChildren<{ initialState?: AlchemyClientState }>) => {
=======
 
export const AlchemyWalletProvider = (
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) => {
>>>>>>> 1f1cf956e (init alchemy-wallet module)
  return (
    <QueryClientProvider client={queryClient}>
      <AlchemyAccountProvider
        config={alchemyConfig}
        queryClient={queryClient}
<<<<<<< HEAD
        initialState={props.initialState}>
=======
        initialState={props.initialState}
      >
>>>>>>> 1f1cf956e (init alchemy-wallet module)
        {props.children}
      </AlchemyAccountProvider>
    </QueryClientProvider>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> 1f1cf956e (init alchemy-wallet module)
