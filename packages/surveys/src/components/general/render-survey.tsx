// @ts-nocheck
import { useState } from "react";
import { SurveyContainerProps } from "@formbricks/types/formbricks-surveys";
import { SurveyContainer } from "../wrappers/survey-container";
import { Survey } from "./survey";

export function RenderSurvey(props: SurveyContainerProps) {
  const [isOpen, setIsOpen] = useState(true);

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (props.onClose) {
        props.onClose();
      }
    }, 1000); // wait for animation to finish}
  };

  return (
    <SurveyContainer
      mode={props.mode ?? "inline"}
      placement={props.placement}
      darkOverlay={props.darkOverlay}
      clickOutside={props.clickOutside}
      onClose={close}
      isOpen={isOpen}>
      <Survey
        {...props}
        clickOutside={props.placement === "center" ? props.clickOutside : true}
        onClose={close}
        onFinished={() => {
          props.onFinished?.();
        }}
      />
    </SurveyContainer>
  );
}
