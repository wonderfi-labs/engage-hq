"use client";

import { Alert, AlertDescription } from "@/modules/ui/components/alert";
import { Button } from "@/modules/ui/components/button";
import { Input } from "@/modules/ui/components/input";
import { Label } from "@/modules/ui/components/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationRole } from "@prisma/client";
import { useTranslate } from "@tolgee/react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { TOrganizationRole, ZOrganizationRole } from "@formbricks/types/memberships";
import { ZUserName } from "@formbricks/types/user";

interface IndividualInviteTabProps {
  setOpen: (v: boolean) => void;
  onSubmit: (data: { name: string; email: string; role: TOrganizationRole }[]) => void;
  environmentId: string;
  membershipRole?: TOrganizationRole;
}

export const IndividualInviteTab = ({ setOpen, onSubmit }: IndividualInviteTabProps) => {
  const ZFormSchema = z.object({
    name: ZUserName,
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email" }),
    role: ZOrganizationRole,
    teamIds: z.array(z.string()),
  });

  type TFormData = z.infer<typeof ZFormSchema>;
  const { t } = useTranslate();
  const form = useForm<TFormData>({
    resolver: zodResolver(ZFormSchema),
    defaultValues: {
      role: "owner",
      teamIds: [],
    },
  });

  const {
    register,
    getValues,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = form;

  const submitEventClass = async () => {
    const data = getValues();
    data.role = data.role || OrganizationRole.owner;
    onSubmit([data]);
    setOpen(false);
    reset();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(submitEventClass)} className="flex flex-col gap-6">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="memberNameInput">{t("common.full_name")}</Label>
          <Input
            id="memberNameInput"
            placeholder="e.g. Bob"
            {...register("name", { required: true, validate: (value) => value.trim() !== "" })}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="memberEmailInput">{t("common.email")}</Label>
          <Input
            id="memberEmailInput"
            type="email"
            placeholder="e.g. bob@work.com"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          {watch("role") === "member" && (
            <Alert className="mt-2" variant="info">
              <AlertDescription>{t("environments.settings.teams.member_role_info_message")}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            size="default"
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
            }}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" size="default" loading={isSubmitting}>
            {t("common.invite")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
