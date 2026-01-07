import {
  createSchema,
  IMAGES_PLACEHOLDERS,
  useThemeSettings,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { useCallback } from "react";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import { useAnimation } from "~/hooks/use-animation";
import type { SectionProps } from "~/components/section";
import { layoutInputs, Section } from "~/components/section";

export interface HeroImageProps extends VariantProps<typeof variants> {
  ref: React.Ref<HTMLElement>;
  maxWidth?: number;
  aspectRatio?: string;
  customAspectRatio?: string;
}

const variants = cva("flex flex-col [&_.paragraph]:mx-[unset]", {
  variants: {
    height: {
      small: "min-h-[40vh] lg:min-h-[50vh]",
      medium: "min-h-[50vh] lg:min-h-[60vh]",
      large: "min-h-[70vh] lg:min-h-[80vh]",
      full: "",
    },
    enableTransparentHeader: {
      true: "",
      false: "",
    },
    contentPosition: {
      "top left": "items-start justify-start [&_.paragraph]:text-left",
      "top center": "items-center justify-start [&_.paragraph]:text-center",
      "top right": "items-end justify-start [&_.paragraph]:text-right",
      "center left": "items-start justify-center [&_.paragraph]:text-left",
      "center center": "items-center justify-center [&_.paragraph]:text-center",
      "center right": "items-end justify-center [&_.paragraph]:text-right",
      "bottom left": "items-start justify-end [&_.paragraph]:text-left",
      "bottom center": "items-center justify-end [&_.paragraph]:text-center",
      "bottom right": "items-end justify-end [&_.paragraph]:text-right",
    },
  },
  compoundVariants: [
    {
      height: "full",
      enableTransparentHeader: true,
      className: "h-screen-no-topbar",
    },
    {
      height: "full",
      enableTransparentHeader: false,
      className: "h-screen-dynamic",
    },
  ],
  defaultVariants: {
    height: "large",
    contentPosition: "center center",
  },
});

export default function HeroImage(props: HeroImageProps & SectionProps) {
  const { ref, children, height, contentPosition, maxWidth = 500, aspectRatio, customAspectRatio, ...rest } = props;
  const { enableTransparentHeader } = useThemeSettings();
  const { backgroundImage } = rest;
  const [scope] = useAnimation();

  // Merge refs: preserve original ref for Weaverse, use scope for animation
  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      // Set scope ref for animation
      if (scope && "current" in scope) {
        scope.current = node;
      }
      // Handle original ref
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && "current" in ref) {
        ref.current = node;
      }
    },
    [ref, scope],
  );

  // Create responsive maxWidth style that only applies on lg (1024px) and above
  // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
  const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
    .hero-image-responsive {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .hero-image-responsive {
        max-width: ${maxWidth}px;
      }
    }
  ` : `
    .hero-image-responsive {
      width: 100%;
    }
  `;

  // Calculate aspect ratio for "adapt" option
  let calculatedAspectRatio: string | undefined;
  if (aspectRatio === "adapt" && backgroundImage) {
    const imageData: WeaverseImage | undefined =
      typeof backgroundImage === "string"
        ? undefined
        : backgroundImage;
    if (imageData?.width && imageData?.height) {
      calculatedAspectRatio = `${imageData.width}/${imageData.height}`;
    }
  }

  // Determine final aspect ratio value
  let finalAspectRatio: string | undefined;
  if (aspectRatio && aspectRatio !== "none") {
    if (aspectRatio === "custom" && customAspectRatio) {
      // Validate custom aspect ratio format (should be "width/height")
      const ratioMatch = customAspectRatio.trim().match(/^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
      if (ratioMatch) {
        finalAspectRatio = customAspectRatio.trim();
      }
    } else if (aspectRatio === "adapt" && calculatedAspectRatio) {
      finalAspectRatio = calculatedAspectRatio;
    } else if (aspectRatio !== "adapt" && aspectRatio !== "custom") {
      finalAspectRatio = aspectRatio;
    }
  }

  // Apply aspect ratio if specified
  // When aspectRatio is set, it overrides the height-based min-height
  const aspectRatioStyle = finalAspectRatio ? `
    .hero-image-with-aspect-ratio {
      aspect-ratio: ${finalAspectRatio};
      min-height: unset;
    }
  ` : "";

  return (
    <>
      <style>{responsiveMaxWidthStyle}</style>
      {aspectRatioStyle && <style>{aspectRatioStyle}</style>}
      <Section
        ref={setRefs}
        {...rest}
        className={`hero-image-responsive mx-auto ${finalAspectRatio ? "hero-image-with-aspect-ratio" : ""}`}
        containerClassName={variants({
          contentPosition,
          height: finalAspectRatio ? undefined : height,
          enableTransparentHeader,
        })}
        loading="eager"
      >
        {children}
      </Section>
    </>
  );
}

export const schema = createSchema({
  type: "hero-image",
  title: "Hero image",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "height",
          label: "Section height",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
              { value: "full", label: "Fullscreen" },
            ],
          },
        },
        {
          type: "position",
          name: "contentPosition",
          label: "Content position",
          defaultValue: "center center",
        },
        {
          type: "select",
          name: "aspectRatio",
          label: "Aspect Ratio",
          configs: {
            options: [
              { value: "none", label: "None (use height setting)" },
              { value: "adapt", label: "Adapt to image" },
              { value: "1/1", label: "Square (1/1)" },
              { value: "3/4", label: "Portrait (3/4)" },
              { value: "4/3", label: "Landscape (4/3)" },
              { value: "16/9", label: "Widescreen (16/9)" },
              { value: "21/9", label: "Ultrawide (21/9)" },
              { value: "custom", label: "Custom" },
            ],
          },
          defaultValue: "none",
          helpText: "Set aspect ratio for the section. When set, it overrides the height setting. 'Adapt to image' uses the background image's natural aspect ratio.",
        },
        {
          type: "text",
          name: "customAspectRatio",
          label: "Custom Aspect Ratio",
          defaultValue: "16/9",
          placeholder: "16/9",
          condition: (data: HeroImageProps) => data.aspectRatio === "custom",
          helpText: "Enter custom aspect ratio in format 'width/height' (e.g., '16/9', '2/1', '5/4')",
        },
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 500,
          configs: {
            min: 0,
            max: 1600,
            step: 20,
            unit: "px",
          },
          helpText: "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
        },
        ...layoutInputs.filter(
          (inp) => inp.name !== "divider" && inp.name !== "borderRadius",
        ),
      ],
    },
    {
      group: "Background",
      inputs: [
        ...backgroundInputs.filter(
          (inp) =>
            inp.name !== "backgroundFor" && inp.name !== "backgroundColor",
        ),
      ],
    },
    { group: "Overlay", inputs: overlayInputs },
  ],
  childTypes: ["subheading", "heading", "paragraph", "button", "promotion-badge"],
  presets: {
    height: "large",
    contentPosition: "center center",
    maxWidth: 500,
    backgroundImage: IMAGES_PLACEHOLDERS.banner_1,
    backgroundFit: "cover",
    enableOverlay: true,
    overlayOpacity: 40,
    children: [
      {
        type: "subheading",
        content: "Subheading",
        color: "#ffffff",
      },
      {
        type: "heading",
        content: "Hero image with text overlay",
        as: "h2",
        color: "#ffffff",
        size: "default",
      },
      {
        type: "paragraph",
        content:
          "Use this text to share information about your brand with your customers. Describe a product, share announcements, or welcome customers to your store.",
        color: "#ffffff",
      },
    ],
  },
});
