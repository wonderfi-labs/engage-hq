import checkmark from "@/images/activity/checkmark.png";
import member from "@/images/activity/member.png";
import plus from "@/images/activity/plus.png";
import trophy from "@/images/activity/trophy.png";
import { Activity, ActivityEventType } from "@prisma/client";
import Image from "next/image";

type ActivityFeedRowType = {
  activity: Activity;
};
export default function ActivityFeedRow({ activity }: ActivityFeedRowType) {
  let imageSource = checkmark;
  let activityText = "";

  // change image and text based on activity type, add date as well
  switch (activity.activityEvent) {
    case ActivityEventType.MEMBER_JOINED:
      imageSource = member;
      activityText = `Member has joined`;
      break;

    case ActivityEventType.MEMBER_LEFT:
      imageSource = member;
      activityText = "Member has left";
      break;

    case ActivityEventType.ENGAGEMENT_COMPLETED:
      imageSource = checkmark;
      activityText = "Engagement completed";
      break;

    case ActivityEventType.ENGAGEMENT_CREATED:
      imageSource = plus;
      activityText = "New engagement posted";
      break;

    case ActivityEventType.REWARD_PAID:
      imageSource = trophy;
      activityText = "Reward paid to user";
      break;

    default:
      return;
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="h-24px w-[24px]">
        <Image src={imageSource} alt={"activity-icon"} className="object-contain" />
      </div>
      <div className="text-gray-600">{activityText}</div>
    </div>
  );
}
