import { useEffect, useMemo, useRef, useState } from "react";
import type { JSX } from "react";
import { type TJsEnvironmentStateSurvey } from "@formbricks/types/js";
import { type TProjectStyling } from "@formbricks/types/project";
import { type TCardArrangementOptions } from "@formbricks/types/styling";
import { type TSurveyQuestionId, type TSurveyStyling } from "@formbricks/types/surveys/types";
import { cn } from "../../lib/utils";
import { StackedCard } from "./stacked-card";

// offset = 0 -> Current question card
// offset < 0 -> Question cards that are already answered
// offset > 0 -> Question that aren't answered yet
interface StackedCardsContainerProps {
  cardArrangement: TCardArrangementOptions;
  currentQuestionId: TSurveyQuestionId;
  survey: TJsEnvironmentStateSurvey;
  getCardContent: (questionIdxTemp: number, offset: number) => JSX.Element | undefined;
  styling: TProjectStyling | TSurveyStyling;
  setQuestionId: (questionId: TSurveyQuestionId) => void;
  shouldResetQuestionId?: boolean;
  fullSizeCards: boolean;
}

export function StackedCardsContainer({
  cardArrangement,
  currentQuestionId,
  survey,
  getCardContent,
  styling,
  setQuestionId,
  shouldResetQuestionId = true,
  fullSizeCards = false,
}: StackedCardsContainerProps) {
  const [hovered, setHovered] = useState(false);
  const highlightBorderColor = survey.styling?.overwriteThemeStyling
    ? survey.styling?.highlightBorderColor?.light
    : styling.highlightBorderColor?.light;
  const cardRoundess = survey.styling?.overwriteThemeStyling ? survey.styling?.roundness : styling.roundness;
  const cardBackgroundColor = survey.styling?.overwriteThemeStyling
    ? survey.styling?.cardBackgroundColor?.light
    : styling.cardBackgroundColor?.light;
  const cardBorderColor = survey.styling?.overwriteThemeStyling
    ? survey.styling?.cardBorderColor?.light
    : styling.cardBorderColor?.light;
  const cardShadowColor = survey.styling?.overwriteThemeStyling
    ? survey.styling?.cardShadowColor?.light
    : styling.cardShadowColor?.light;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const [cardHeight, setCardHeight] = useState("auto");
  const [cardWidth, setCardWidth] = useState<number>(0);

  const questionIdxTemp = useMemo(() => {
    if (currentQuestionId === "start") return survey.welcomeCard.enabled ? -1 : 0;
    if (!survey.questions.map((question) => question.id).includes(currentQuestionId)) {
      return survey.questions.length;
    }
    return survey.questions.findIndex((question) => question.id === currentQuestionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only update when currentQuestionId changes
  }, [currentQuestionId, survey.welcomeCard.enabled, survey.questions.length]);

  const [prevQuestionIdx, setPrevQuestionIdx] = useState(questionIdxTemp - 1);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(questionIdxTemp);
  const [nextQuestionIdx, setNextQuestionIdx] = useState(questionIdxTemp + 1);
  const [visitedQuestions, setVisitedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (questionIdxTemp > currentQuestionIdx) {
      // Next button is clicked
      setPrevQuestionIdx(currentQuestionIdx);
      setCurrentQuestionIdx(questionIdxTemp);
      setNextQuestionIdx(questionIdxTemp + 1);
      setVisitedQuestions((prev) => {
        return [...prev, currentQuestionIdx];
      });
    } else if (questionIdxTemp < currentQuestionIdx) {
      // Back button is clicked
      setNextQuestionIdx(currentQuestionIdx);
      setCurrentQuestionIdx(questionIdxTemp);
      setPrevQuestionIdx(visitedQuestions[visitedQuestions.length - 2]);
      setVisitedQuestions((prev) => {
        if (prev.length > 0) {
          const newStack = prev.slice(0, -1);
          return newStack;
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only update when questionIdxTemp changes
  }, [questionIdxTemp]);

  const backgroundStyles = useMemo(() => {
    const backgroundColor = cardBackgroundColor;
    return {
      backgroundColor,
    };
  }, [cardBackgroundColor]);

  const borderStyles = useMemo(() => {
    const baseStyle = {
      border: "1px solid",
      borderRadius: cardRoundess ? cardRoundess : "var(--border-radius)",
    };
    // Determine borderColor based on the survey type and availability of highlightBorderColor
    const borderColor =
      survey.type === "link" || !highlightBorderColor ? cardBorderColor : highlightBorderColor;
    return {
      ...baseStyle,
      borderColor,
    };
  }, [cardRoundess, survey.type, highlightBorderColor, cardBorderColor]);

  const boxShadowStyles = useMemo(() => {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow
    // NOTE: May want to update to allow slider or removal of shadow
    const boxShadow = `1px 1px ${cardShadowColor}`;
    return {
      boxShadow,
    };
  }, [cardShadowColor]);

  // UseEffect to handle the resize of current question card and set cardHeight accordingly
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentElement = cardRefs.current[questionIdxTemp];
      if (currentElement) {
        if (resizeObserver.current) {
          resizeObserver.current.disconnect();
        }
        resizeObserver.current = new ResizeObserver((entries) => {
          for (const entry of entries) {
            setCardHeight(`${entry.contentRect.height.toString()}px`);
            setCardWidth(entry.contentRect.width);
          }
        });
        resizeObserver.current.observe(currentElement);
      }
    }, 0);
    return () => {
      resizeObserver.current?.disconnect();
      clearTimeout(timer);
    };
  }, [questionIdxTemp, cardArrangement, cardRefs]);

  // Reset question progress, when card arrangement changes
  useEffect(() => {
    if (shouldResetQuestionId) {
      setQuestionId(survey.welcomeCard.enabled ? "start" : survey.questions[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only update when cardArrangement changes
  }, [cardArrangement]);

  return (
    <div
      className="relative flex h-full items-end justify-center md:items-center"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}>
      <div style={{ height: cardHeight }} />
      {cardArrangement === "simple" ? (
        <div
          id={`questionCard-${questionIdxTemp.toString()}`}
          className={cn("bg-survey-bg w-full overflow-hidden", fullSizeCards ? "h-full" : "")}
          style={{ ...borderStyles, ...backgroundStyles }}>
          {getCardContent(questionIdxTemp, 0)}
        </div>
      ) : (
        questionIdxTemp !== undefined &&
        [prevQuestionIdx, currentQuestionIdx, nextQuestionIdx, nextQuestionIdx + 1].map(
          (dynamicQuestionIndex, index) => {
            const hasEndingCard = survey.endings.length > 0;
            // Check for hiding extra card
            if (dynamicQuestionIndex > survey.questions.length + (hasEndingCard ? 0 : -1)) return;
            const offset = index - 1;
            return (
              <StackedCard
                key={dynamicQuestionIndex}
                cardRefs={cardRefs}
                dynamicQuestionIndex={dynamicQuestionIndex}
                offset={offset}
                fullSizeCards={fullSizeCards}
                backgroundStyles={backgroundStyles}
                borderStyles={borderStyles}
                boxShadowStyles={boxShadowStyles}
                getCardContent={getCardContent}
                cardHeight={cardHeight}
                survey={survey}
                cardWidth={cardWidth}
                hovered={hovered}
                cardArrangement={cardArrangement}
              />
            );
          }
        )
      )}
    </div>
  );
}
