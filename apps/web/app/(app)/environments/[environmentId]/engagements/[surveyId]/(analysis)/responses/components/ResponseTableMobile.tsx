import { Modal } from "@/modules/ui/components/modal";
import { useTranslate } from "@tolgee/react";
import React, { useState } from "react";
import { TResponse, TResponseTableData } from "@formbricks/types/responses";
import { mapResponsesToTableData } from "../lib/response";

interface TResponseTableDataWithExtras extends TResponseTableData {
  verifiedAddress?: string;
}

interface ResponseTableMobileProps {
  data: TResponseTableData[];
  responses: TResponse[] | null;
  isExpanded: boolean | null;
  setSelectedResponseId: (id: string | null) => void;
  responsesLength: number;
  columns: any[];
  survey: any;
}

export const ResponseTableMobile: React.FC<ResponseTableMobileProps> = ({ data, responses, survey }) => {
  const [modalId, setModalId] = useState<string | null>(null);
  const { t } = useTranslate();
  const tableData = (
    responses && survey ? mapResponsesToTableData(responses, survey, t) : data
  ) as TResponseTableDataWithExtras[];

  if (!tableData || tableData.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-white text-center">
        {t("common.no_results")}
      </div>
    );
  }

  const modalRow = tableData.find((row) => row.responseId === modalId);
  let addressObj: { tokenAddress?: string; transactionHash?: string } | null = null;
  if (modalRow && modalRow.responseData?.address && typeof modalRow.responseData.address === "string") {
    try {
      addressObj = JSON.parse(modalRow.responseData.address);
    } catch (e) {
      addressObj = null;
    }
  }

  const renderResponseDataFields = (row: TResponseTableDataWithExtras) => {
    if (!row.responseData || typeof row.responseData !== "object") return null;
    return Object.entries(row.responseData).map(([key, value]) => {
      if (key == "address" && typeof value === "string") return null;
      return (
        <div key={key} className="mb-2">
          <div className="text-xs text-slate-500">{t(key)}</div>
          <div className="break-words text-base font-semibold text-slate-900">{String(value ?? "-")}</div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {tableData.map((row, idx) => (
        <div
          key={row.responseId || idx}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
          {renderResponseDataFields(row)}
          <div className="mb-2 text-xs text-slate-500">{t("Status")}</div>
          <div className="mb-2 text-base font-semibold text-slate-900">{row.status ?? "-"}</div>
          {row.verifiedEmail && (
            <>
              <div className="mb-2 text-xs text-slate-500">{t("Verified Email")}</div>
              <div className="mb-2 text-base font-semibold text-slate-900">{row.verifiedEmail}</div>
            </>
          )}
          {row.verifiedAddress && (
            <>
              <div className="mb-2 text-xs text-slate-500">{t("Verified Address")}</div>
              <div className="mb-2 flex items-center gap-2">
                <span className="block truncate text-base font-semibold text-slate-900">
                  {row.verifiedAddress}
                </span>
              </div>
            </>
          )}
          <button
            className="mt-2 w-full rounded bg-slate-100 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            onClick={() => setModalId(row.responseId)}>
            {t("View Detail")}
          </button>
        </div>
      ))}
      <Modal
        open={!!modalId}
        setOpen={(open) => !open && setModalId(null)}
        size="md"
        title={t("Response Detail")}
        className="max-h-[90vh] overflow-y-auto">
        {modalRow && (
          <div className="max-h-[70vh] overflow-y-auto pr-2">
            {renderResponseDataFields(modalRow)}
            <div className="mb-2 text-xs text-slate-500">{t("Status")}</div>
            <div className="mb-2 text-base font-semibold text-slate-900">{modalRow.status ?? "-"}</div>
            {modalRow.verifiedEmail && (
              <>
                <div className="mb-2 text-xs text-slate-500">{t("Verified Email")}</div>
                <div className="mb-2 text-base font-semibold text-slate-900">{modalRow.verifiedEmail}</div>
              </>
            )}
            {modalRow.verifiedAddress && (
              <>
                <div className="mb-2 text-xs text-slate-500">{t("Verified Address")}</div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="block max-w-[320px] truncate text-base font-semibold text-slate-900">
                    {modalRow.verifiedAddress}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(modalRow.verifiedAddress ?? "")}
                    className="text-xs text-blue-500 hover:underline"
                    title={t("Copy to clipboard")}>
                    {t("Copy")}
                  </button>
                </div>
              </>
            )}
            <div className="mb-2 text-xs text-slate-500">{t("Created At")}</div>
            <div className="mb-2 text-base font-semibold text-slate-900">
              {modalRow.createdAt ? new Date(modalRow.createdAt).toLocaleString() : "-"}
            </div>
            {addressObj && (
              <React.Fragment>
                <div className="mb-2 text-xs text-slate-500">{t("Token Address")}</div>
                <div className="mb-2 break-all text-base font-semibold text-slate-900">
                  {addressObj.tokenAddress}
                </div>
                <div className="mb-2 text-xs text-slate-500">{t("Transaction Hash")}</div>
                <div className="mb-2 break-all text-base font-semibold text-slate-900">
                  {addressObj.transactionHash}
                </div>
              </React.Fragment>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
