import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section } from "~/components/section";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";
import { PromotionBannerItem } from "./item";

interface PromotionBannerData {
  showType?: "slick" | "static";
  bgColor?: string;
  autoPlay?: boolean;
  changeSlidesEvery?: number;
  scrollDirection?: "left" | "right" | "up" | "down";
  scrollMode?: "marquee" | "slide";
  leftImage?: WeaverseImage | string;
  leftImageWidth?: number;
  leftImageHeight?: number;
  imagePosition?: "left" | "right";
  containerHeight?: number;
  maxWidth?: number;
}

type PromotionBannerProps = HydrogenComponentProps<PromotionBannerData>;

export const PromotionBanner = forwardRef<HTMLElement, PromotionBannerProps>(
  (props, ref) => {
    const {
      showType = "slick",
      bgColor = "#E8E8E8",
      autoPlay = true,
      changeSlidesEvery = 6,
      scrollDirection = "left",
      scrollMode = "marquee",
      leftImage,
      leftImageWidth = 80,
      leftImageHeight = 80,
      imagePosition = "left",
      containerHeight = 38,
      maxWidth = 500,
      ...rest
    } = props as PromotionBannerData & typeof props;

    const childInstances = useChildInstances();
    const animation = useAnimation();

    if (childInstances.length === 0) {
      return null;
    }

    const isHorizontal = scrollDirection === "left" || scrollDirection === "right";
    const isVertical = scrollDirection === "up" || scrollDirection === "down";

    // Marquee mode: continuous scrolling
    const marqueeKeyframes = 
      scrollDirection === "left" 
        ? `@keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }`
        : scrollDirection === "right"
        ? `@keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }`
        : scrollDirection === "up"
        ? `@keyframes scroll-up {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }`
        : `@keyframes scroll-down {
            0% { transform: translateY(-50%); }
            100% { transform: translateY(0); }
          }`;

    // Slide mode: one by one sliding
    // Calculate percentage for each slide transition
    const slidePercentage = 100 / childInstances.length;
    const slideKeyframes = isHorizontal
      ? `@keyframes slide-horizontal {
          ${Array.from({ length: childInstances.length }, (_, i) => {
            const start = i * slidePercentage;
            const end = (i + 1) * slidePercentage;
            return `${start}% { transform: translateX(-${i * 100}%); }
          ${end - 0.1}% { transform: translateX(-${i * 100}%); }
          ${end}% { transform: translateX(-${(i + 1) * 100}%); }`;
          }).join('\n          ')}
          100% { transform: translateX(-${(childInstances.length - 1) * 100}%); }
        }`
      : `@keyframes slide-vertical {
          ${Array.from({ length: childInstances.length }, (_, i) => {
            const start = i * slidePercentage;
            const end = (i + 1) * slidePercentage;
            // Each item is 100% of container height, so move by item index * container height
            // Since translateY % is relative to element height, and element height = items * container height,
            // we need to move by (item index / total items) * 100%
            const translatePercent = (i / childInstances.length) * 100;
            const nextTranslatePercent = ((i + 1) / childInstances.length) * 100;
            return `${start}% { transform: translateY(-${translatePercent}%); }
          ${end - 0.1}% { transform: translateY(-${translatePercent}%); }
          ${end}% { transform: translateY(-${nextTranslatePercent}%); }`;
          }).join('\n          ')}
          100% { transform: translateY(-${((childInstances.length - 1) / childInstances.length) * 100}%); }
        }`;

    const scrollKeyframes = scrollMode === "marquee" ? marqueeKeyframes : slideKeyframes;
    
    const animationName = scrollMode === "marquee"
      ? (scrollDirection === "left" ? "scroll-left"
        : scrollDirection === "right" ? "scroll-right"
        : scrollDirection === "up" ? "scroll-up"
        : "scroll-down")
      : (isHorizontal ? "slide-horizontal" : "slide-vertical");

    const animationDuration = scrollMode === "marquee"
      ? `${changeSlidesEvery * childInstances.length}s`
      : `${changeSlidesEvery * childInstances.length}s`;
    
    // Prepare image data for Image component
    const leftImageData: Partial<WeaverseImage> | undefined = leftImage
      ? typeof leftImage === "string"
        ? { url: leftImage, altText: "Fixed image" }
        : leftImage
      : undefined;
    
    const imageElement = leftImageData && (
      <div className="shrink-0">
        <Image
          data={leftImageData}
          alt=""
          className="object-contain"
          style={{
            width: `${leftImageWidth}px`,
            height: `${leftImageHeight}px`,
          }}
          loading="lazy"
          sizes="auto"
        />
      </div>
    );

    // Create responsive maxWidth style that only applies on lg (1024px) and above
    // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
    const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
      .promotion-banner-responsive {
        width: 100%;
      }
      @media (min-width: 1024px) {
        .promotion-banner-responsive {
          max-width: ${maxWidth}px;
        }
      }
    ` : `
      .promotion-banner-responsive {
        width: 100%;
      }
    `;

    return (
      <Section
        ref={ref}
        {...rest}
        className="promotion-banner-responsive mx-auto"
        style={{ backgroundColor: bgColor }}
        data-motion="fade-up"
        {...animation}
      >
        <style>{responsiveMaxWidthStyle}</style>
        <div className="w-full overflow-hidden">
          {showType === "slick" ? (
            <div className="promotion-banner-slick flex items-center gap-2 p-[10px]">
              <style>{`
                ${scrollKeyframes}
                .promotion-banner-slick .animate-scroll {
                  display: flex;
                  flex-direction: ${isVertical ? "column" : "row"};
                  animation: ${animationName} ${animationDuration} ${scrollMode === "slide" ? "ease-in-out" : "linear"} infinite;
                }
                .promotion-banner-slick:hover .animate-scroll {
                  animation-play-state: paused;
                }
                ${scrollMode === "slide" ? `
                  .promotion-banner-slick .scroll-container {
                    ${isHorizontal ? "width: 100%;" : `height: ${containerHeight}px;`}
                    position: relative;
                  }
                  .promotion-banner-slick .animate-scroll {
                    ${isVertical ? `
                      height: calc(100% * ${childInstances.length});
                    ` : ""}
                  }
                  .promotion-banner-slick .animate-scroll > * {
                    ${isHorizontal ? `
                      flex: 0 0 100%;
                      width: 100%;
                    ` : `
                      flex: 0 0 calc(100% / ${childInstances.length});
                      height: calc(100% / ${childInstances.length});
                      width: 100%;
                    `}
                  }
                ` : ""}
              `}</style>
              {/* Fixed image area - position based on imagePosition */}
              {imagePosition === "left" && imageElement}
              {/* Scrolling items */}
              <div className={`flex-1 overflow-hidden scroll-container ${isVertical && scrollMode === "slide" ? "" : isVertical ? "h-20" : ""}`}>
                <div className="animate-scroll">
                  {scrollMode === "marquee" ? (
                    <>
                      {/* Duplicate for seamless marquee loop */}
                      {childInstances.map((child, index) => (
                        <PromotionBannerItem
                          key={`marquee-${index}`}
                          {...(child.data as any)}
                        />
                      ))}
                      {childInstances.map((child, index) => (
                        <PromotionBannerItem
                          key={`marquee-dup-${index}`}
                          {...(child.data as any)}
                        />
                      ))}
                    </>
                  ) : (
                    // Slide mode: show all items, no duplication needed
                    childInstances.map((child, index) => (
                      <PromotionBannerItem
                        key={`slide-${index}`}
                        {...(child.data as any)}
                      />
                    ))
                  )}
                </div>
              </div>
              {/* Fixed image area - position based on imagePosition */}
              {imagePosition === "right" && imageElement}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Fixed image area - position based on imagePosition */}
              {imagePosition === "left" && imageElement}
              {/* Static items - always horizontal layout */}
              <div className="flex-1 flex flex-row gap-2">
                {childInstances.map((child, index) => (
                  <PromotionBannerItem
                    key={`static-${index}`}
                    {...(child.data as any)}
                  />
                ))}
              </div>
              {/* Fixed image area - position based on imagePosition */}
              {imagePosition === "right" && imageElement}
            </div>
          )}
        </div>
      </Section>
    );
  }
);

PromotionBanner.displayName = "PromotionBanner";

export default PromotionBanner;

export const schema = createSchema({
  type: "promotion-banner",
  title: "Promotion Banner",
  childTypes: ["promotion-banner--item"],
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "showType",
          label: "Display Type",
          defaultValue: "slick",
          configs: {
            options: [
              { value: "slick", label: "Carousel" },
              { value: "static", label: "Static" },
            ],
          },
        },
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#E8E8E8",
        },
        {
          type: "image",
          name: "leftImage",
          label: "Fixed Image",
        },
        {
          type: "select",
          name: "imagePosition",
          label: "Image Position",
          defaultValue: "left",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ],
          },
          condition: (data: PromotionBannerData) => !!data.leftImage,
        },
        {
          type: "range",
          name: "leftImageWidth",
          label: "Image Width",
          defaultValue: 80,
          configs: {
            min: 40,
            max: 150,
            step: 5,
            unit: "px",
          },
          condition: (data: PromotionBannerData) => !!data.leftImage,
        },
        {
          type: "range",
          name: "leftImageHeight",
          label: "Image Height",
          defaultValue: 80,
          configs: {
            min: 40,
            max: 150,
            step: 5,
            unit: "px",
          },
          condition: (data: PromotionBannerData) => !!data.leftImage,
        },
      ],
    },
    {
      group: "Animation",
      inputs: [
        {
          type: "switch",
          name: "autoPlay",
          label: "Auto Play",
          defaultValue: true,
        },
        {
          type: "select",
          name: "scrollMode",
          label: "Scroll Mode",
          defaultValue: "marquee",
          configs: {
            options: [
              { value: "marquee", label: "Marquee (Continuous)" },
              { value: "slide", label: "Slide (One by One)" },
            ],
          },
          condition: (data: PromotionBannerData) => data.showType === "slick" && data.autoPlay === true,
        },
        {
          type: "select",
          name: "scrollDirection",
          label: "Scroll Direction",
          defaultValue: "left",
          configs: {
            options: [
              { value: "left", label: "Left to Right" },
              { value: "right", label: "Right to Left" },
              { value: "up", label: "Bottom to Top" },
              { value: "down", label: "Top to Bottom" },
            ],
          },
          condition: (data: PromotionBannerData) => data.showType === "slick" && data.autoPlay === true,
        },
        {
          type: "range",
          name: "changeSlidesEvery",
          label: "Change Slides Every (seconds)",
          defaultValue: 6,
          configs: {
            min: 2,
            max: 30,
            step: 1,
            unit: "s",
          },
          condition: (data: PromotionBannerData) => data.showType === "slick" && data.autoPlay === true,
        },
        {
          type: "range",
          name: "containerHeight",
          label: "Container Height (vertical slide only)",
          defaultValue: 38,
          configs: {
            min: 20,
            max: 200,
            step: 2,
            unit: "px",
          },
          condition: (data: PromotionBannerData) => data.showType === "slick" && data.autoPlay === true && data.scrollMode === "slide" && (data.scrollDirection === "up" || data.scrollDirection === "down"),
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
  ],
  presets: {
    showType: "slick",
    bgColor: "#E8E8E8",
    autoPlay: true,
    changeSlidesEvery: 6,
    maxWidth: 500,
    children: [
      {
        type: "promotion-banner--item",
        title: "🏆 Must-Have Home Upgrade",
        description: "Trusted by 10,000+ Households",
        showStar: true,
      },
      {
        type: "promotion-banner--item",
        title: "🔥 #Best-Seller",
        description: "in Smart Fan Lights – Q1 2025",
        showStar: false,
      },
    ],
  },
});

