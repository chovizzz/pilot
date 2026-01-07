import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef, useEffect, useState, useRef } from "react";
import { Section } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import { useDrawer } from "~/hooks/use-drawer";
import { StickyNavigationDrawer } from "./drawer";

interface StickyNavigationData {
  logoImage?: WeaverseImage | string;
  logoLink?: string;
  logoBgColor?: string;
  maxWidth?: number;
  padding?: number;
  stickyThreshold?: number;
  shrinkWidth?: number;
  fullWidth?: number;
  // Drawer settings
  enableDrawer?: boolean;
  drawerDirection?: "left" | "right" | "top" | "bottom";
  contentMaxWidth?: number;
  enableBorderRadius?: boolean;
  menuItemsJson?: string;
  menuBackgroundImage?: WeaverseImage | string;
  closeIcon?: WeaverseImage | string;
  menuImage1?: WeaverseImage | string;
  menuImage2?: WeaverseImage | string;
  menuItemColor?: string;
  menuItemSize?: number;
}

type StickyNavigationProps = HydrogenComponentProps<StickyNavigationData>;


export const StickyNavigation = forwardRef<
  HTMLElement,
  StickyNavigationProps
>((props, ref) => {
  const {
    logoImage,
    logoLink = "#",
    logoBgColor = "#ef7b2e",
    maxWidth = 480,
    padding = 10,
    stickyThreshold = 50,
    shrinkWidth = 78,
    fullWidth = 200,
    enableDrawer = false,
    drawerDirection = "top",
    contentMaxWidth = 500,
    enableBorderRadius = true,
    menuItemsJson,
    menuBackgroundImage,
    closeIcon,
    menuImage1,
    menuImage2,
    menuItemColor = "rgb(0, 0, 0)",
    menuItemSize = 26,
    ...rest
  } = props as StickyNavigationData & typeof props;

  const animation = useAnimation();
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const lastScrollYRef = useRef(0);

  // Drawer state management
  const { isOpen: isDrawerOpen, open: openDrawer, close: closeDrawer } = useDrawer({
    defaultOpen: false,
    preventBodyScroll: true,
  });

  // Parse menu items from JSON
  const defaultMenuItems: Array<{ label: string; link?: string }> = [
    { label: "Overview", link: "#overview" },
    { label: "Feature", link: "#feature" },
    { label: "Use", link: "#use" },
    { label: "Reviews", link: "#reviews" },
  ];
  
  let menuItems: Array<{ label: string; link?: string }> = defaultMenuItems;
  try {
    if (menuItemsJson) {
      const parsed = JSON.parse(menuItemsJson);
      if (Array.isArray(parsed) && parsed.every((item: any) => item && typeof item.label === "string")) {
        menuItems = parsed as Array<{ label: string; link?: string }>;
      }
    }
  } catch (e) {
    // Use default menu items if JSON parsing fails
    console.warn("Failed to parse menuItemsJson, using defaults", e);
  }

  // Prepare image data
  const logoImageData: Partial<WeaverseImage> | undefined = logoImage
    ? typeof logoImage === "string"
      ? { url: logoImage, altText: "Logo" }
      : logoImage
    : undefined;

  // Handle scroll direction and width change
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      
      // Check if scrolled past threshold
      if (currentScrollY > stickyThreshold) {
        // Determine scroll direction
        if (currentScrollY > lastScrollY) {
          // Scrolling down - shrink width
          setIsScrolledDown(true);
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up - restore width
          setIsScrolledDown(false);
        }
      } else {
        // Above threshold - always show full width
        setIsScrolledDown(false);
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [stickyThreshold]);

  // Create responsive maxWidth style
  const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
    .sticky-nav-responsive {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .sticky-nav-responsive {
        max-width: ${maxWidth}px;
      }
    }
  ` : `
    .sticky-nav-responsive {
      width: 100%;
    }
  `;

  // Logo width transition styles
  const logoStyles = `
    .sticky-nav-logo {
      transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;

  return (
    <>
      <style>{responsiveMaxWidthStyle}</style>
      <style>{logoStyles}</style>
      <Section
        ref={ref}
        {...rest}
        className="sticky-nav-responsive mx-auto sticky-nav-container"
        data-motion="fade-up"
        {...animation}
      >
        <div className="main-content max-w-7xl mx-auto sticky-nav-container relative">
          {/* Sticky Logo Button */}
          <div
            className="fixed top-0 left-1/2 -translate-x-1/2 z-10"
            style={{
              paddingTop: `${padding}px`,
              maxWidth: maxWidth && maxWidth > 0 ? `${maxWidth}px` : "100%",
            }}
          >
            <div style={{ height: "39px" }}>
              {enableDrawer ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openDrawer();
                  }}
                  className="sticky-nav-logo rounded-full py-2 px-6 mx-auto overflow-hidden cursor-pointer max-w-max block border-none bg-transparent p-0"
                  style={{
                    backgroundColor: logoBgColor,
                    width: isScrolledDown ? `${shrinkWidth}px` : `${fullWidth}px`,
                  }}
                >
                  <div className="flex items-center overflow-hidden">
                    {logoImageData && (
                      <div className="shrink-0 overflow-hidden">
                        <div
                          className="imgage-section-container"
                          style={{
                            aspectRatio: "246 / 70",
                            width: "80px",
                          }}
                        >
                          <Image
                            data={logoImageData}
                            alt="Logo"
                            width={246}
                            height={70}
                            loading="lazy"
                            sizes="auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ) : (
                <Link
                  to={logoLink}
                  className="sticky-nav-logo rounded-full py-2 px-6 mx-auto overflow-hidden cursor-pointer max-w-max block"
                  style={{
                    backgroundColor: logoBgColor,
                    width: isScrolledDown ? `${shrinkWidth}px` : `${fullWidth}px`,
                  }}
                >
                  <div className="flex items-center overflow-hidden">
                    {logoImageData && (
                      <div className="shrink-0 overflow-hidden">
                        <div
                          className="imgage-section-container"
                          style={{
                            aspectRatio: "246 / 70",
                            width: "80px",
                          }}
                        >
                          <Image
                            data={logoImageData}
                            alt="Logo"
                            width={246}
                            height={70}
                            loading="lazy"
                            sizes="auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Drawer */}
        {enableDrawer && (
          <StickyNavigationDrawer
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            menuItems={menuItems}
            menuBackgroundImage={menuBackgroundImage}
            closeIcon={closeIcon}
            menuImage1={menuImage1}
            menuImage2={menuImage2}
            maxWidth={maxWidth}
            contentMaxWidth={contentMaxWidth}
            padding={padding}
            menuItemColor={menuItemColor}
            menuItemSize={menuItemSize}
            direction={drawerDirection}
            enableBorderRadius={enableBorderRadius}
          />
        )}
      </Section>
    </>
  );
});

StickyNavigation.displayName = "StickyNavigation";

export default StickyNavigation;

export const schema = createSchema({
  type: "sticky-navigation",
  title: "Sticky Navigation",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "image",
          name: "logoImage",
          label: "Logo Image",
        },
        {
          type: "text",
          name: "logoLink",
          label: "Logo Link",
          defaultValue: "#",
          condition: (data: StickyNavigationData) => !data.enableDrawer,
        },
        {
          type: "switch",
          name: "enableDrawer",
          label: "Enable Drawer Menu",
          defaultValue: false,
          helpText: "When enabled, clicking the logo will open a drawer menu instead of navigating to the link",
        },
        {
          type: "select",
          name: "drawerDirection",
          label: "Drawer Direction",
          defaultValue: "top",
          configs: {
            options: [
              { value: "top", label: "Top" },
              { value: "bottom", label: "Bottom" },
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
            ],
          },
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
          helpText: "Direction from which the drawer appears",
        },
        {
          type: "range",
          name: "contentMaxWidth",
          label: "Content Max Width",
          defaultValue: 500,
          configs: {
            min: 0,
            max: 1200,
            step: 20,
            unit: "px",
          },
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
          helpText: "Maximum width for drawer content area on large screens (1024px and above). Set to 0 for unlimited width.",
        },
        {
          type: "switch",
          name: "enableBorderRadius",
          label: "Enable Border Radius",
          defaultValue: true,
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
          helpText: "Enable rounded corners on the drawer",
        },
      ],
    },
    {
      group: "Drawer Menu",
      inputs: [
        {
          type: "image",
          name: "menuBackgroundImage",
          label: "Menu Background Image",
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
        },
        {
          type: "image",
          name: "closeIcon",
          label: "Close Icon",
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
        },
        {
          type: "image",
          name: "menuImage1",
          label: "Menu Image 1 (Bottom Right)",
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
        },
        {
          type: "image",
          name: "menuImage2",
          label: "Menu Image 2 (Bottom Left)",
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
        },
        {
          type: "textarea",
          name: "menuItemsJson",
          label: "Menu Items (JSON)",
          defaultValue: JSON.stringify([
            { label: "Overview", link: "#overview" },
            { label: "Feature", link: "#feature" },
            { label: "Use", link: "#use" },
            { label: "Reviews", link: "#reviews" },
          ]),
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
          helpText: 'Enter menu items as JSON array: [{"label": "Overview", "link": "#overview"}, ...]',
        },
        {
          type: "color",
          name: "menuItemColor",
          label: "Menu Item Color",
          defaultValue: "rgb(0, 0, 0)",
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
        },
        {
          type: "range",
          name: "menuItemSize",
          label: "Menu Item Font Size",
          defaultValue: 26,
          configs: {
            min: 16,
            max: 48,
            step: 1,
            unit: "px",
          },
          condition: (data: StickyNavigationData) => data.enableDrawer === true,
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
            max: 1200,
            step: 20,
            unit: "px",
          },
          helpText: "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
        },
        {
          type: "range",
          name: "padding",
          label: "Top Padding",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 100,
            step: 2,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "stickyThreshold",
          label: "Sticky Threshold",
          defaultValue: 50,
          configs: {
            min: 0,
            max: 200,
            step: 10,
            unit: "px",
          },
          helpText: "Scroll distance before logo starts shrinking",
        },
        {
          type: "range",
          name: "fullWidth",
          label: "Full Width",
          defaultValue: 200,
          configs: {
            min: 100,
            max: 400,
            step: 10,
            unit: "px",
          },
          helpText: "Width when scrolling up (full logo width)",
        },
        {
          type: "range",
          name: "shrinkWidth",
          label: "Shrink Width",
          defaultValue: 78,
          configs: {
            min: 50,
            max: 200,
            step: 2,
            unit: "px",
          },
          helpText: "Width when scrolling down",
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "logoBgColor",
          label: "Logo Background Color",
          defaultValue: "#ef7b2e",
        },
      ],
    },
  ],
  presets: {
    logoBgColor: "#ef7b2e",
    maxWidth: 480,
    padding: 10,
    stickyThreshold: 50,
    fullWidth: 200,
    shrinkWidth: 78,
  },
});

