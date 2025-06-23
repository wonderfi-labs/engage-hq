"use client";

import {
  removeCommunityAvatarAction,
  updateCommunityAvatarAction,
} from "@/app/(app)/environments/[environmentId]/settings/(account)/community/actions";
import { handleFileUpload } from "@/app/lib/fileUpload";
import { ProfileAvatar } from "@/modules/ui/components/avatars";
import { Button } from "@/modules/ui/components/button";
import {
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormProvider,
} from "@/modules/ui/components/form";
import { Input } from "@/modules/ui/components/input";
import { Textarea } from "@/modules/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslate } from "@tolgee/react";
import { debounce } from "lodash";
import { Check, RefreshCw } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { generate } from "random-words";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { TUser } from "@formbricks/types/user";
import {
  findUniqueCommunitySlugAction,
  removeCommunityBannerAction,
  updateCommunityBannerAction,
  updateUserAction,
} from "../actions";

const ZEditCommunityFormSchema = z.object({
  communityName: z.string(),
  communityDescription: z.string().optional(),
  communitySlug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Only lowercase letters, numbers, and hyphens (-) are allowed.")
    .optional(),
});

type TEditCommunityForm = z.infer<typeof ZEditCommunityFormSchema>;

interface EditCommunityFormProps {
  user: TUser;
  environmentId: string;
  session: Session;
}

export const EditCommunityForm = ({ user, environmentId, session }: EditCommunityFormProps) => {
  const communityAvatarUrl = user.communityAvatarUrl;
  const communityBannerUrl = user.communityBannerUrl;
  const inputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoadingBanner, setIsLoadingBanner] = useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean>(false);
  const [previewSlug, setPreviewSlug] = useState<string>(user.communitySlug || "");
  const hasExistingSlug = !!user.communitySlug;
  const router = useRouter();
  const { t } = useTranslate();

  function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, "");
    str = str.toLowerCase();
    str = str
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-"); // remove consecutive hyphens
    return str;
  }

  const randomCommunityName = generate({ exactly: 2, join: " " }) as string;
  const form = useForm<TEditCommunityForm>({
    defaultValues: {
      communityName:
        user.communityName || randomCommunityName.charAt(0).toUpperCase() + randomCommunityName.slice(1),
      communityDescription: user.communityDescription || "",
      communitySlug: user.communitySlug || "",
    },
    mode: "onChange",
    resolver: zodResolver(ZEditCommunityFormSchema),
  });

  const { isSubmitting } = form.formState;
  const { setValue } = form;

  const communityName = form.watch("communityName");

  const generateUniqueSlug = useRef(
    debounce(async (name: string) => {
      if (!name) {
        setValue("communitySlug", "");
        setPreviewSlug("");
        setIsSlugAvailable(false);
        return;
      }
      setIsGeneratingSlug(true);
      try {
        const baseSlug = slugify(name);
        const uniqueSlug = await findUniqueCommunitySlugAction(baseSlug, communityName);
        setValue("communitySlug", uniqueSlug);
        setPreviewSlug(uniqueSlug || "");
        setIsSlugAvailable(true);
      } catch (error) {
        setIsSlugAvailable(false);
      } finally {
        setIsGeneratingSlug(false);
      }
    }, 500)
  ).current;

  useEffect(() => {
    if (hasExistingSlug && communityName != user.communityName) {
      if (communityName && communityName.length > 0) {
        generateUniqueSlug(communityName);
      } else {
        setPreviewSlug("");
        setValue("communitySlug", "");
        setIsSlugAvailable(false);
      }
    } else if (hasExistingSlug) {
      setPreviewSlug(user.communitySlug || "");
      setValue("communitySlug", user.communitySlug || "");
      setIsSlugAvailable(true);
    } else if (communityName && communityName.length > 0) {
      generateUniqueSlug(communityName);
    } else {
      setPreviewSlug("");
      setValue("communitySlug", "");
      setIsSlugAvailable(false);
    }
    return () => {
      generateUniqueSlug.cancel();
    };
  }, [communityName, generateUniqueSlug, setValue, hasExistingSlug, user.communitySlug]);
  const onSubmit: SubmitHandler<TEditCommunityForm> = async (data) => {
    try {
      await updateUserAction({
        communityName: data.communityName,
        communityDescription: data.communityDescription,
        communitySlug: data.communitySlug,
      });

      toast.success(t("environments.settings.profile.profile_updated_successfully"));
      router.refresh();

      form.reset({
        communityName: data.communityName,
        communityDescription: data.communityDescription,
        communitySlug: data.communitySlug,
      });
    } catch (error: unknown) {
      toast.error(`${t("common.error")}: error`);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsLoadingAvatar(true);
    try {
      if (communityAvatarUrl) {
        await removeCommunityAvatarAction({ environmentId });
      }

      const { url, error } = await handleFileUpload(file, environmentId);

      if (error) {
        toast.error(error);
        return;
      }

      await updateCommunityAvatarAction({ communityAvatarUrl: url });
      toast.success(t("environments.settings.profile.avatar_updated_successfully"));
      router.refresh();
    } catch (err) {
      toast.error(t("environments.settings.profile.avatar_update_failed"));
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsLoadingAvatar(true);
    try {
      await removeCommunityAvatarAction({ environmentId });
      toast.success(t("environments.settings.profile.avatar_removed_successfully"));
      router.refresh();
    } catch (err) {
      toast.error(t("environments.settings.profile.avatar_update_failed"));
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    setIsLoadingBanner(true);
    try {
      if (communityBannerUrl) {
        await removeCommunityBannerAction({ environmentId });
      }
      const { url, error } = await handleFileUpload(file, environmentId);
      if (error) {
        toast.error(error);
        return;
      }
      await updateCommunityBannerAction({ communityBannerUrl: url });
      toast.success(t("environments.settings.profile.banner_updated_successfully"));
      router.refresh();
    } catch (err) {
      toast.error(t("environments.settings.profile.banner_update_failed"));
    } finally {
      setIsLoadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleRemoveBanner = async () => {
    setIsLoadingBanner(true);
    try {
      await removeCommunityBannerAction({ environmentId });
      toast.success(t("environments.settings.profile.banner_removed_successfully"));
      router.refresh();
    } catch (err) {
      toast.error(t("environments.settings.profile.banner_update_failed"));
    } finally {
      setIsLoadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-slate-700">
          {t("environments.settings.profile.community_avatar")}
        </h3>

        <div className="">
          <div className="relative h-16 w-16 overflow-hidden rounded-full">
            {isLoadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <svg className="h-7 w-7 animate-spin text-slate-200" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
            <ProfileAvatar userId={session.user.id} imageUrl={communityAvatarUrl} />
          </div>

          <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={isLoadingAvatar}>
              {communityAvatarUrl
                ? t("environments.settings.profile.change_image")
                : t("environments.settings.profile.upload_image")}
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAvatarUpload(file);
                  }
                }}
              />
            </Button>

            {communityAvatarUrl && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={isLoadingAvatar}>
                {t("environments.settings.profile.remove_image")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-slate-700">
          {t("environments.settings.profile.community_banner")}
        </h3>

        <div className="">
          <div className="relative h-32 w-full overflow-hidden rounded-md">
            {isLoadingBanner && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <svg className="h-7 w-7 animate-spin text-slate-200" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
            {communityBannerUrl ? (
              <Image
                src={communityBannerUrl}
                alt="Community banner"
                fill
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-sm text-gray-400">
                  {t("environments.settings.profile.no_banner_image")}
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => bannerInputRef.current?.click()}
              disabled={isLoadingBanner}>
              {communityBannerUrl
                ? t("environments.settings.profile.change_banner")
                : t("environments.settings.profile.upload_banner")}
              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleBannerUpload(file);
                    e.target.value = "";
                  }
                }}
              />
            </Button>

            {communityBannerUrl && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveBanner}
                disabled={isLoadingBanner}>
                {t("environments.settings.profile.remove_banner")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <FormProvider {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="communityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.community_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("common.community_name")}
                    isInvalid={!!form.formState.errors.communityName}
                  />
                </FormControl>
                <FormError />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="">
              <FormLabel className="text-sm font-medium">{t("common.community_slug")}</FormLabel>
            </div>
            <div className="space-y-2">
              <div
                className={`relative flex-grow rounded-md border px-3 py-2 text-sm ${
                  !hasExistingSlug || (hasExistingSlug && communityName != user.communityName)
                    ? "bg-yellow-50"
                    : "bg-gray-50 text-gray-700"
                }`}>
                {isGeneratingSlug ? (
                  <div className="flex items-center justify-between">
                    <span>{previewSlug || t("environments.settings.profile.generating_slug")}</span>
                    <RefreshCw className="ml-2 h-4 w-4 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>{previewSlug}</span>
                    {isSlugAvailable && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                )}
              </div>
              <p
                className={`text-xs ${
                  !hasExistingSlug || (hasExistingSlug && communityName !== user.communityName)
                    ? "font-semibold text-yellow-700"
                    : "text-gray-500"
                }`}>
                {!hasExistingSlug || (hasExistingSlug && communityName !== user.communityName)
                  ? t("environments.settings.profile.this_will_be_your_community_slug")
                  : t("environments.settings.profile.slug_is_automatically_generated_from_community_name")}
              </p>
              {/* Not used for UI. only to register slug for react hook form. (React-hook-form requirement) */}
              <input type="hidden" {...form.register("communitySlug")} />
            </div>
          </div>

          <FormField
            control={form.control}
            name="communityDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.community_description")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("common.community_description")}
                    className="min-h-24"
                    value={field.value || ""}
                  />
                </FormControl>
                <FormError />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <Button
              type="submit"
              disabled={
                (hasExistingSlug && communityName == user.communityName) ||
                isSubmitting ||
                isLoadingAvatar ||
                isLoadingBanner ||
                isGeneratingSlug
              }>
              {t("common.update")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditCommunityForm;
