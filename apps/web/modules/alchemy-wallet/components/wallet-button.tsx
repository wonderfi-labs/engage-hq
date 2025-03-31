"use client";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import React from "react";

export function WalletButton(): React.JSX.Element {
    const user = useUser();
    const { openAuthModal } = useAuthModal();
    const signerStatus = useSignerStatus();
    const { logout } = useLogout();
  return (
    <div className="flex flex-col items-center px-6 py-4 gap-4 justify-center text-center">
    {signerStatus.isInitializing ? (
      <>Loading...</>
    ) : user ? (
      <div className="flex flex-col gap-2 p-2">
        <p className="text-xl font-bold">Success!</p>
        You're logged in as {user.email ?? "anon"}.<button
          className="akui-btn akui-btn-primary mt-6"
          onClick={() => logout()}
        >
          Log out
        </button>
      </div>
    ) : (
      <button className="akui-btn akui-btn-primary" onClick={openAuthModal}>
        Login
      </button>
    )}
  </div>
  );
}

export default WalletButton;
