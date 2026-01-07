import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface PromotionButtonData {
  buttonText?: string;
  buttonLink?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonBorderColor?: string;
  buttonFontSize?: number;
  arrowIcon?: WeaverseImage | string;
  leftText?: string;
  leftIcon?: WeaverseImage | string;
  rightText?: string;
  rightIcon?: WeaverseImage | string;
  textColor?: string;
  textSize?: number;
  enableSticky?: boolean;
  stickyOffset?: number;
  maxWidth?: number;
  padding?: number;
  shrinkScale?: number;
  shrinkDuration?: number;
  iconRotateSpeed?: number;
}

type PromotionButtonProps = HydrogenComponentProps<PromotionButtonData>;

export const PromotionButton = forwardRef<
  HTMLDivElement,
  PromotionButtonProps
>((props, ref) => {
  const {
    buttonText = "BUY NOW 50% OFF",
    buttonLink = "#",
    buttonBgColor = "#FFD1B3",
    buttonTextColor = "#0C3201",
    buttonBorderColor = "#000000",
    buttonFontSize = 20,
    arrowIcon,
    leftText = "90-day refund guarantee",
    leftIcon,
    rightText = "Limited stock left",
    rightIcon,
    textColor = "#000000",
    textSize = 12,
    enableSticky = false,
    stickyOffset = 0,
    maxWidth = 480,
    padding = 10,
    shrinkScale = 0.95,
    shrinkDuration = 2,
    iconRotateSpeed = 3,
    ...rest
  } = props as PromotionButtonData & typeof props;

  const animation = useAnimation();
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Prepare image data for Image component
  const arrowIconData: Partial<WeaverseImage> | undefined = arrowIcon
    ? typeof arrowIcon === "string"
      ? { url: arrowIcon, altText: "Arrow icon" }
      : arrowIcon
    : undefined;
  const leftIconData: Partial<WeaverseImage> | undefined = leftIcon
    ? typeof leftIcon === "string"
      ? { url: leftIcon, altText: "Left icon" }
      : leftIcon
    : undefined;
  const rightIconData: Partial<WeaverseImage> | undefined = rightIcon
    ? typeof rightIcon === "string"
      ? { url: rightIcon, altText: "Right icon" }
      : rightIcon
    : undefined;

  // Handle sticky behavior when scrolling out of viewport
  useEffect(() => {
    if (!enableSticky) {
      setIsSticky(false);
      const wrapper = wrapperRef.current;
      const contentRoot = document.querySelector('.weaverse-content-root') as HTMLElement;
      if (wrapper) {
        wrapper.style.minHeight = "";
      }
      if (contentRoot) {
        contentRoot.style.paddingBottom = "";
      }
      return;
    }

    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    // Store initial height to maintain wrapper height when container becomes fixed
    const initialHeight = container.offsetHeight;
    wrapper.style.minHeight = `${initialHeight}px`;

    // Get the weaverse-content-root element
    const contentRoot = document.querySelector('.weaverse-content-root') as HTMLElement;
    if (!contentRoot) return;

    let lastStickyState = false;
    let ticking = false;
    let resizeObserver: ResizeObserver | null = null;

    const updatePadding = (shouldBeSticky: boolean) => {
      if (shouldBeSticky) {
        // When sticky, add padding-bottom to weaverse-content-root to reserve space at the bottom
        // This prevents the button from covering content when it sticks to the bottom
        const containerHeight = container.offsetHeight;
        const totalHeight = containerHeight + stickyOffset;
        contentRoot.style.paddingBottom = `${totalHeight}px`;
      } else {
        // When not sticky, remove padding-bottom
        contentRoot.style.paddingBottom = "";
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        // Check if the wrapper's bottom edge has scrolled past the viewport
        // Only set sticky when wrapper is completely above viewport
        const shouldBeSticky = rect.bottom <= 0;

        // Only update state if it changed to prevent unnecessary re-renders
        if (shouldBeSticky !== lastStickyState) {
          setIsSticky(shouldBeSticky);
          updatePadding(shouldBeSticky);
          lastStickyState = shouldBeSticky;
        }

        ticking = false;
      });
    };

    // Update padding on resize when sticky
    resizeObserver = new ResizeObserver(() => {
      if (lastStickyState) {
        updatePadding(true);
      }
    });
    resizeObserver.observe(container);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (wrapper) {
        wrapper.style.minHeight = "";
      }
      if (contentRoot) {
        contentRoot.style.paddingBottom = "";
      }
    };
  }, [enableSticky, stickyOffset]);

  // Create shrink animation keyframes with configurable scale
  const shrinkKeyframes = `@keyframes btnshrink {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(${shrinkScale}); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;

  return (
    <div
      ref={wrapperRef}
      {...rest}
      className="relative"
      data-motion="fade-up"
      {...animation}
    >
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        id="promotion-button-container"
        className={`w-full mx-auto leading-tight button7-container buttonSolt ${
          isSticky ? "fixed left-0 right-0 z-50" : ""
        }`}
        style={{
          backgroundColor: "#ffffff",
          ...(isSticky
            ? {
                bottom: `${stickyOffset}px`,
                padding: `${padding}px 30px`,
                boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
              }
            : {}),
        }}
      >
      <style>{shrinkKeyframes}</style>
      <div
        className="main-content mx-auto"
        style={{
          padding: isSticky ? 0 : `${padding}px 30px`,
          maxWidth: `${maxWidth}px`,
        }}
      >
        {/* Main Button */}
        <a
          href={buttonLink}
          className="h-auto mx-auto flex relative items-center justify-center gap-2 rounded-full px-6 py-2 text-center font-bold button7 overflow-hidden btnshrink_animation"
          style={{
            color: buttonTextColor,
            fontSize: `${buttonFontSize}px`,
            backgroundColor: buttonBgColor,
            boxShadow: `${buttonBorderColor} 0px 2px 0px 3px`,
            animation: `btnshrink ${shrinkDuration}s ease-in-out infinite`,
          }}
        >
          <div>{buttonText}</div>
          {arrowIconData && (
            <div
              className="imgage-section-container"
              style={{
                width: "32px",
                aspectRatio: "30 / 30",
              }}
            >
              <Image
                data={arrowIconData}
                alt=""
                width={30}
                height={30}
                className="w-full h-full object-contain"
                loading="lazy"
                sizes="auto"
              />
            </div>
          )}
        </a>

        {/* Bottom Text Row */}
        <div className="flex items-center gap-2 mt-4 justify-center">
          {/* Left Text with Icon */}
          <div className="flex items-center gap-1 button7-bottom-left">
            {leftIconData && (
              <div
                className="imgage-section-container left_icon"
                style={{
                  width: "12px",
                  aspectRatio: "42 / 48",
                }}
              >
                <Image
                  data={leftIconData}
                  alt=""
                  width={42}
                  height={48}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  sizes="auto"
                />
              </div>
            )}
            <div
              style={{
                fontSize: `${textSize}px`,
                color: textColor,
              }}
            >
              {leftText}
            </div>
          </div>

          {/* Right Text with Icon */}
          <div className="flex items-center gap-1 button7-bottom-right">
            {rightIconData && (
              <div
                className="imgage-section-container right_icon"
                style={{
                  width: "12px",
                  aspectRatio: "42 / 56",
                }}
              >
                <Image
                  data={rightIconData}
                  alt=""
                  width={42}
                  height={56}
                  className="w-full h-full object-contain"
                  style={{
                    animation: `spin ${iconRotateSpeed}s linear infinite`,
                  }}
                  loading="lazy"
                  sizes="auto"
                />
              </div>
            )}
            <div
              style={{
                fontSize: `${textSize}px`,
                color: textColor,
              }}
            >
              {rightText}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
});

PromotionButton.displayName = "PromotionButton";

export default PromotionButton;

export const schema = createSchema({
  type: "promotion-button",
  title: "Promotion Button",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "buttonText",
          label: "Button Text",
          defaultValue: "BUY NOW 50% OFF",
        },
        {
          type: "text",
          name: "buttonLink",
          label: "Button Link",
          defaultValue: "#",
        },
        {
          type: "image",
          name: "arrowIcon",
          label: "Arrow Icon",
        },
        {
          type: "text",
          name: "leftText",
          label: "Left Text",
          defaultValue: "90-day refund guarantee",
        },
        {
          type: "image",
          name: "leftIcon",
          label: "Left Icon",
        },
        {
          type: "text",
          name: "rightText",
          label: "Right Text",
          defaultValue: "Limited stock left",
        },
        {
          type: "image",
          name: "rightIcon",
          label: "Right Icon",
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
            min: 0,
            max: 800,
            step: 10,
            unit: "px",
          },
          helpText: "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
        },
        {
          type: "switch",
          name: "enableSticky",
          label: "Enable Sticky Bottom",
          defaultValue: false,
          helpText: "When enabled, the button will stick to the bottom when scrolling out of viewport",
        },
        {
          type: "range",
          name: "stickyOffset",
          label: "Sticky Offset",
          defaultValue: 0,
          configs: {
            min: 0,
            max: 100,
            step: 5,
            unit: "px",
          },
          condition: (data: PromotionButtonData) => data.enableSticky === true,
          helpText: "Distance from bottom when sticky",
        },
      ],
    },
    {
      group: "Button Style",
      inputs: [
        {
          type: "color",
          name: "buttonBgColor",
          label: "Background Color",
          defaultValue: "#FFD1B3",
        },
        {
          type: "color",
          name: "buttonTextColor",
          label: "Text Color",
          defaultValue: "#0C3201",
        },
        {
          type: "color",
          name: "buttonBorderColor",
          label: "Border/Shadow Color",
          defaultValue: "#000000",
        },
        {
          type: "range",
          name: "buttonFontSize",
          label: "Font Size",
          defaultValue: 20,
          configs: {
            min: 14,
            max: 32,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Text Style",
      inputs: [
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#000000",
        },
        {
          type: "range",
          name: "textSize",
          label: "Text Size",
          defaultValue: 12,
          configs: {
            min: 10,
            max: 18,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Animation",
      inputs: [
        {
          type: "range",
          name: "shrinkScale",
          label: "Shrink Scale",
          defaultValue: 0.95,
          configs: {
            min: 0.8,
            max: 0.99,
            step: 0.01,
          },
          helpText: "Scale value when button shrinks (lower = more shrink)",
        },
        {
          type: "range",
          name: "shrinkDuration",
          label: "Shrink Duration",
          defaultValue: 2,
          configs: {
            min: 0.5,
            max: 5,
            step: 0.1,
            unit: "s",
          },
          helpText: "Animation duration for button shrink (lower = faster)",
        },
        {
          type: "range",
          name: "iconRotateSpeed",
          label: "Icon Rotate Speed",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 10,
            step: 0.5,
            unit: "s",
          },
          helpText: "Animation duration for icon rotation (lower = faster)",
        },
      ],
    },
  ],
  presets: {
    buttonText: "BUY NOW 50% OFF",
    buttonLink: "#",
    buttonBgColor: "#FFD1B3",
    buttonTextColor: "#0C3201",
    buttonBorderColor: "#000000",
    buttonFontSize: 20,
    leftText: "90-day refund guarantee",
    rightText: "Limited stock left",
    textColor: "#000000",
    textSize: 12,
    maxWidth: 480,
    padding: 10,
    enableSticky: false,
    shrinkScale: 0.95,
    shrinkDuration: 2,
    iconRotateSpeed: 3,
  },
});

