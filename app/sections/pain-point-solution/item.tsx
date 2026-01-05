import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface PainPointSolutionItemData {
  painPoint?: string;
  solution?: string;
  painPointIcon?: WeaverseImage | string;
  solutionIcon?: WeaverseImage | string;
}

type PainPointSolutionItemProps =
  HydrogenComponentProps<PainPointSolutionItemData>;

export const PainPointSolutionItem = forwardRef<
  HTMLDivElement,
  PainPointSolutionItemProps
>((props, ref) => {
  const { painPoint, solution, painPointIcon, solutionIcon } = props;
  const animation = useAnimation();

  // Extract image URLs from WeaverseImage objects or strings
  const painPointIconUrl = painPointIcon 
    ? (typeof painPointIcon === "string" ? painPointIcon : painPointIcon.url)
    : null;
  const solutionIconUrl = solutionIcon 
    ? (typeof solutionIcon === "string" ? solutionIcon : solutionIcon.url)
    : null;

  return (
    <div
      ref={ref}
      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
      data-motion="slide-in"
      {...animation}
    >
      <div className="flex-1">
        {painPoint && (
          <div className="mb-3">
            {painPointIconUrl && (
              <img
                src={painPointIconUrl}
                alt=""
                className="w-6 h-6 inline-block mr-2"
              />
            )}
            <h3 className="font-semibold text-red-600 inline">
              Problem: {painPoint}
            </h3>
          </div>
        )}
        {solution && (
          <div>
            {solutionIconUrl && (
              <img
                src={solutionIconUrl}
                alt=""
                className="w-6 h-6 inline-block mr-2"
              />
            )}
            <p className="text-green-600">
              <span className="font-semibold">Solution: </span>
              {solution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

PainPointSolutionItem.displayName = "PainPointSolutionItem";

export default PainPointSolutionItem;

export const schema = createSchema({
  type: "pain-point-solution--item",
  title: "Pain Point Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "painPoint",
          label: "Pain Point",
          defaultValue: "Problem description",
        },
        {
          type: "richtext",
          name: "solution",
          label: "Solution",
          defaultValue: "Solution description",
        },
        {
          type: "image",
          name: "painPointIcon",
          label: "Pain Point Icon",
        },
        {
          type: "image",
          name: "solutionIcon",
          label: "Solution Icon",
        },
      ],
    },
  ],
  presets: {
    painPoint: "Problem description",
    solution: "Solution description",
  },
});

