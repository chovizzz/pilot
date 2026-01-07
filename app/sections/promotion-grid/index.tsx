import { createSchema, IMAGES_PLACEHOLDERS } from "@weaverse/hydrogen";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { backgroundInputs } from "~/components/background-image";
import { overlayInputs } from "~/components/overlay";
import type { SectionProps } from "~/components/section";
import { layoutInputs, Section } from "~/components/section";

interface PromotionGridProps
  extends VariantProps<typeof variants>,
    SectionProps {
  ref?: React.Ref<HTMLElement>;
  maxWidth?: number;
}

const variants = cva("flex flex-col sm:grid", {
  variants: {
    gridSize: {
      "1x1": "sm:grid-cols-1 sm:[&_.promotion-grid-item]:p-20",
      "2x2": "sm:grid-cols-2 sm:[&_.promotion-grid-item]:p-16",
      "3x3": "sm:grid-cols-3 sm:[&_.promotion-grid-item]:p-12",
      "4x4": "sm:grid-cols-4 sm:[&_.promotion-grid-item]:p-8",
    },
    gap: {
      0: "",
      4: "gap-1",
      8: "gap-2",
      12: "gap-3",
      16: "gap-4",
      20: "gap-5",
      24: "gap-3 lg:gap-6",
      28: "gap-3.5 lg:gap-7",
      32: "gap-4 lg:gap-8",
      36: "gap-4 lg:gap-9",
      40: "gap-5 lg:gap-10",
      44: "gap-5 lg:gap-11",
      48: "gap-6 lg:gap-12",
      52: "gap-6 lg:gap-[52px]",
      56: "gap-7 lg:gap-14",
      60: "gap-7 lg:gap-[60px]",
    },
  },
  defaultVariants: {
    gridSize: "2x2",
    gap: 20,
  },
});

function PromotionGrid(props: PromotionGridProps) {
  const { children, gridSize, gap, ref, maxWidth = 500, ...rest } = props;

  // Create responsive maxWidth style that only applies on lg (1024px) and above
  // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
  const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
    .promotion-grid-responsive {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .promotion-grid-responsive {
        max-width: ${maxWidth}px;
      }
    }
  ` : `
    .promotion-grid-responsive {
      width: 100%;
    }
  `;

  return (
    <>
      <style>{responsiveMaxWidthStyle}</style>
      <Section
        ref={ref}
        {...rest}
        className="promotion-grid-responsive mx-auto"
        containerClassName={variants({ gridSize, gap })}
      >
        {children}
      </Section>
    </>
  );
}

export default PromotionGrid;

export const schema = createSchema({
  type: "promotion-grid",
  title: "Promotion grid",
  settings: [
    {
      group: "Grid",
      inputs: [
        {
          type: "toggle-group",
          name: "gridSize",
          label: "Grid size",
          configs: {
            options: [
              { value: "1x1", label: "1 Column" },
              { value: "2x2", label: "2x2" },
              { value: "3x3", label: "3x3" },
              { value: "4x4", label: "4x4" },
            ],
          },
          defaultValue: "2x2",
        },
        {
          type: "range",
          name: "gap",
          label: "Items gap",
          configs: {
            min: 0,
            max: 60,
            step: 4,
            unit: "px",
          },
          defaultValue: 20,
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
      ],
    },
    { group: "Layout", inputs: layoutInputs },
    { group: "Background", inputs: backgroundInputs },
    { group: "Overlay", inputs: overlayInputs },
  ],
  childTypes: ["promotion-grid-item", "promotion-button"],
  presets: {
    gridSize: "2x2",
    gap: 20,
    maxWidth: 500,
    children: [
      {
        type: "promotion-grid-item",
        contentPosition: "top left",
        backgroundImage: IMAGES_PLACEHOLDERS.collection_1,
        enableOverlay: true,
        overlayColor: "#0c0c0c",
        overlayOpacity: 20,
        children: [
          {
            type: "heading",
            content: "Announce your promotion",
          },
          {
            type: "paragraph",
            content:
              "Include the smaller details of your promotion in text below the title.",
          },
          {
            type: "promotion-item--buttons",
            children: [
              {
                type: "button",
                text: "Shop now",
              },
            ],
          },
        ],
      },
      {
        type: "promotion-grid-item",
        contentPosition: "bottom right",
        backgroundImage: IMAGES_PLACEHOLDERS.collection_2,
        enableOverlay: true,
        overlayColor: "#0c0c0c",
        overlayOpacity: 20,
        children: [
          {
            type: "heading",
            content: "Announce your promotion",
          },
          {
            type: "paragraph",
            content:
              "Include the smaller details of your promotion in text below the title.",
          },
          {
            type: "promotion-item--buttons",
            children: [
              {
                type: "button",
                text: "Shop promotion",
              },
            ],
          },
        ],
      },
    ],
  },
});
