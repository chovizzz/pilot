import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef, useEffect, useState } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface BackToTopData {
  right?: number;
  bottom?: number;
  bgColor?: string;
  iconColor?: string;
  iconSize?: number;
  borderRadius?: number;
  showOnScroll?: number;
  zIndex?: number;
}

type BackToTopProps = HydrogenComponentProps<BackToTopData>;

// Chevron up icon SVG component
const ChevronUpIcon = ({
  size = 36,
  color = "#DBDBDB",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    style={{ width: `${size}px`, height: `${size}px`, color }}
  >
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const BackToTop = forwardRef<HTMLDivElement, BackToTopProps>(
  (props, ref) => {
    const {
      right = 10,
      bottom = 100,
      bgColor = "#FFFFFF",
      iconColor = "#DBDBDB",
      iconSize = 36,
      borderRadius = 4,
      showOnScroll = 300,
      zIndex = 10,
      ...rest
    } = props as BackToTopData & typeof props;
    const [isVisible, setIsVisible] = useState(false);
    const animation = useAnimation();

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setIsVisible(scrollTop > showOnScroll);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [showOnScroll]);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        {...rest}
        className="goToTop fixed cursor-pointer shadow-md transition-opacity duration-300"
        style={{
          right: `${right}px`,
          bottom: `${bottom}px`,
          backgroundColor: bgColor,
          borderRadius: `${borderRadius}px`,
          zIndex,
          opacity: isVisible ? 1 : 0,
        }}
        onClick={scrollToTop}
        data-motion="fade-up"
        {...animation}
      >
        <ChevronUpIcon size={iconSize} color={iconColor} />
      </div>
    );
  }
);

BackToTop.displayName = "BackToTop";

export default BackToTop;

export const schema = createSchema({
  type: "back-to-top",
  title: "Back to Top",
  limit: 1,
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "right",
          label: "Right Position",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 100,
            step: 5,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "bottom",
          label: "Bottom Position",
          defaultValue: 100,
          configs: {
            min: 0,
            max: 200,
            step: 10,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border Radius",
          defaultValue: 4,
          configs: {
            min: 0,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "zIndex",
          label: "Z-Index",
          defaultValue: 10,
          configs: {
            min: 1,
            max: 100,
            step: 1,
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
          defaultValue: "#FFFFFF",
        },
        {
          type: "color",
          name: "iconColor",
          label: "Icon Color",
          defaultValue: "#DBDBDB",
        },
      ],
    },
    {
      group: "Icon",
      inputs: [
        {
          type: "range",
          name: "iconSize",
          label: "Icon Size",
          defaultValue: 36,
          configs: {
            min: 20,
            max: 60,
            step: 2,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Behavior",
      inputs: [
        {
          type: "range",
          name: "showOnScroll",
          label: "Show After Scroll (px)",
          defaultValue: 300,
          configs: {
            min: 0,
            max: 1000,
            step: 50,
            unit: "px",
          },
          helpText: "Button will appear after scrolling this many pixels",
        },
      ],
    },
  ],
  presets: {
    right: 10,
    bottom: 100,
    bgColor: "#FFFFFF",
    iconColor: "#DBDBDB",
    iconSize: 36,
    borderRadius: 4,
    showOnScroll: 300,
    zIndex: 10,
  },
});

