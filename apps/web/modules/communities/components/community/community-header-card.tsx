import VerifiedImage from "@/images/illustrations/verified-rounded.svg";
import CommunityActions from "@/modules/communities/components/community/community-actions";
import MembersModal from "@/modules/communities/components/community/members-modal";
import Image from "next/image";

interface CommunityHeaderCardProps {
  community: any;
  currentUserId: string;
  t: (key: string) => string;
}

export default function CommunityHeaderCard({ community, currentUserId, t }: CommunityHeaderCardProps) {
  return (
    <div className="mb-8 rounded-2xl">
      <div className="relative min-h-48 overflow-hidden rounded-t-2xl">
        {community.communityBannerUrl ? (
          <Image
            src={community.communityBannerUrl}
            alt={t("common.community_banner")}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="min-h-48 w-full bg-gradient-to-r from-[#8fd3f4] to-[#a6c1ee]" />
        )}
      </div>
      <div className="relative z-10 -mt-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-b-xl bg-white p-4 shadow-xl md:flex-row md:items-center md:p-8">
          <div className="w-full min-w-0 flex-1">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold capitalize text-slate-800 md:text-3xl">
                  {community.communityName}
                </span>
                {community.whitelist && (
                  <Image
                    src={VerifiedImage as string}
                    alt={t("verified check icon")}
                    width={24}
                    height={24}
                  />
                )}
              </div>
              <div className="order-2 mt-3 w-full md:order-none md:ml-8 md:mt-0 md:w-auto">
                <CommunityActions community={community} currentUserId={currentUserId} />
              </div>
            </div>
            {community.communityDescription && (
              <p className="mt-6 text-sm text-slate-700 md:mt-2 md:text-lg">
                {community.communityDescription}
              </p>
            )}
            <div className="mt-4 flex flex-col flex-wrap gap-2 md:mt-6 md:flex-row md:items-center">
              <div className="flex">
                <span className="text-sm font-semibold text-slate-800 md:text-base">
                  {t("common.members")} ( {community.members?.length || 0} )
                </span>
                {community.members && community.members.length > 0 && (
                  <span className="ml-2 inline-block cursor-pointer text-sm font-medium text-sky-600 underline md:hidden md:text-base">
                    <MembersModal members={community.members} />
                  </span>
                )}
              </div>
              <div className="flex -space-x-3">
                {community.members?.slice(0, 8).map((member, idx) => (
                  <div key={member.id} style={{ zIndex: idx }}>
                    <div>
                      {member.imageUrl ? (
                        <Image
                          src={member.imageUrl}
                          alt={member.name || t("common.unnamed_user")}
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white"
                        />
                      ) : (
                        <div className="rounded-full bg-slate-200" style={{ width: 32, height: 32 }}></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {community.members && community.members.length > 0 && (
                <span className="ml-2 hidden cursor-pointer text-sm font-medium text-sky-600 underline md:inline-flex md:text-base">
                  <MembersModal members={community.members} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
