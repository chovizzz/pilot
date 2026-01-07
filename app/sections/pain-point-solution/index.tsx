import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface PainPointSolutionData {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  maxWidth?: number;
  padding?: number;
  titleColor?: string;
  titleSize?: number;
  buttonColor?: string;
  buttonSize?: number;
  bgColor?: string;
}

type PainPointSolutionProps = HydrogenComponentProps<PainPointSolutionData>;

export const PainPointSolution = forwardRef<
  HTMLDivElement,
  PainPointSolutionProps
>((props, ref) => {
  const {
    title = "Tired of Clunky Fans and Dim Lighting?",
    buttonText = ">Try Ceiling Fan with LED Light",
    buttonLink = "#",
    maxWidth = 480,
    padding = 20,
    titleColor = "#000000",
    titleSize = 26,
    buttonColor = "#ef7b2e",
    buttonSize = 22,
    bgColor = "#ffffff",
    children,
    ...rest
  } = props as PainPointSolutionData & typeof props;

  const animation = useAnimation();

  return (
    <div
      ref={ref}
      {...rest}
      className="w-full mx-auto leading-tight comment14-container"
      style={{
        backgroundColor: bgColor,
        maxWidth: `${maxWidth}px`,
      }}
      data-motion="fade-up"
      {...animation}
    >
      <div
        className="main-content max-w-7xl mx-auto"
        style={{ padding: `${padding}px` }}
      >
        {title && (
          <div
            className="comment14-title font-bold mb-2 text-center"
            style={{
              fontSize: `${titleSize}px`,
              color: titleColor,
            }}
          >
            {title}
          </div>
        )}
        {buttonText && (
          <div
            className="text-center comment14-button font-bold mb-6 underline"
            style={{
              fontSize: `${buttonSize}px`,
              color: buttonColor,
            }}
          >
            <a href={buttonLink}>{buttonText}</a>
          </div>
        )}
        {children}
      </div>
    </div>
  );
});

PainPointSolution.displayName = "PainPointSolution";

export default PainPointSolution;

export const schema = createSchema({
  type: "pain-point-solution",
  title: "Pain Point Solution",
  childTypes: ["pain-point-solution--items"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Tired of Clunky Fans and Dim Lighting?",
        },
        {
          type: "text",
          name: "buttonText",
          label: "Button Text",
          defaultValue: ">Try Ceiling Fan with LED Light",
        },
        {
          type: "text",
          name: "buttonLink",
          label: "Button Link",
          defaultValue: "#",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 480,
          configs: {
            min: 300,
            max: 1200,
            step: 20,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 20,
          configs: {
            min: 0,
            max: 80,
            step: 4,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "titleColor",
          label: "Title Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "buttonColor",
          label: "Button Color",
          defaultValue: "#ef7b2e",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "titleSize",
          label: "Title Size",
          defaultValue: 26,
          configs: {
            min: 16,
            max: 48,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "buttonSize",
          label: "Button Size",
          defaultValue: 22,
          configs: {
            min: 14,
            max: 36,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    title: "Tired of Clunky Fans and Dim Lighting?",
    buttonText: ">Try Ceiling Fan with LED Light",
    buttonLink: "#",
    maxWidth: 480,
    padding: 20,
    titleColor: "#000000",
    titleSize: 26,
    buttonColor: "#ef7b2e",
    buttonSize: 22,
    bgColor: "#ffffff",
    children: [
      {
        type: "pain-point-solution--items",
      },
    ],
  },
});

