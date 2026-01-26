import { type WeaverseImage } from "@weaverse/hydrogen";
import { Suspense, lazy } from "react";
import { Image } from "~/components/image";
import { Link } from "~/components/link";

// Arrow icon SVG
const ArrowIcon = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className="icon"
  >
    <path d="M512 959.68L640 896 320 576h640v-128H320L640 128l-128-63.68L64.32 512z" />
  </svg>
);

export interface StickyNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: Array<{
    label: string;
    link?: string;
  }>;
  menuBackgroundImage?: WeaverseImage | string;
  closeIcon?: WeaverseImage | string;
  menuImage1?: WeaverseImage | string;
  menuImage2?: WeaverseImage | string;
  maxWidth?: number;
  contentMaxWidth?: number;
  padding?: number;
  menuItemColor?: string;
  menuItemSize?: number;
  direction?: "left" | "right" | "top" | "bottom";
  enableBorderRadius?: boolean;
}

function StickyNavigationDrawerContent(props: StickyNavigationDrawerProps) {
  const {
    isOpen,
    onClose,
    menuItems = [
      { label: "Overview", link: "#overview" },
      { label: "Feature", link: "#feature" },
      { label: "Use", link: "#use" },
      { label: "Reviews", link: "#reviews" },
    ],
    menuBackgroundImage,
    closeIcon,
    menuImage1,
    menuImage2,
    maxWidth = 480,
    contentMaxWidth = 500,
    padding = 10,
    menuItemColor = "rgb(0, 0, 0)",
    menuItemSize = 26,
    direction = "top",
    enableBorderRadius = true,
  } = props;

  // Prepare image data
  const menuBackgroundImageData: Partial<WeaverseImage> | undefined = menuBackgroundImage
    ? typeof menuBackgroundImage === "string"
      ? { url: menuBackgroundImage, altText: "Menu background" }
      : menuBackgroundImage
    : undefined;
  const closeIconData: Partial<WeaverseImage> | undefined = closeIcon
    ? typeof closeIcon === "string"
      ? { url: closeIcon, altText: "Close" }
      : closeIcon
    : undefined;
  const menuImage1Data: Partial<WeaverseImage> | undefined = menuImage1
    ? typeof menuImage1 === "string"
      ? { url: menuImage1, altText: "Menu image 1" }
      : menuImage1
    : undefined;
  const menuImage2Data: Partial<WeaverseImage> | undefined = menuImage2
    ? typeof menuImage2 === "string"
      ? { url: menuImage2, altText: "Menu image 2" }
      : menuImage2
    : undefined;

  // Calculate transform based on direction
  const getDrawerTransform = (isOpen: boolean) => {
    if (isOpen) return "translate(0, 0)";
    switch (direction) {
      case "left":
        return "translateX(-100%)";
      case "right":
        return "translateX(100%)";
      case "top":
        return "translateY(-100%)";
      case "bottom":
        return "translateY(100%)";
      default:
        return "translateY(-100%)";
    }
  };

  const getMenuItemTransform = (isOpen: boolean) => {
    if (isOpen) return "translate(0, 0)";
    switch (direction) {
      case "left":
        return "translateX(-100%)";
      case "right":
        return "translateX(100%)";
      case "top":
        return "translateY(-20px)";
      case "bottom":
        return "translateY(20px)";
      default:
        return "translateX(-100%)";
    }
  };

  const getImageTransform = (isOpen: boolean) => {
    if (isOpen) return "translate(0, 0)";
    switch (direction) {
      case "left":
      case "right":
        return "translateY(100%)";
      case "top":
        return "translateY(-100%)";
      case "bottom":
        return "translateY(100%)";
      default:
        return "translateY(100%)";
    }
  };

  // Get drawer position classes based on direction
  const getDrawerPositionClasses = () => {
    switch (direction) {
      case "left":
        return "top-0 left-0 h-full";
      case "right":
        return "top-0 right-0 h-full";
      case "top":
        return "top-0 left-0 w-full";
      case "bottom":
        return "bottom-0 left-0 w-full";
      default:
        return "top-0 left-0 w-full";
    }
  };

  // Get border radius based on direction
  const getBorderRadius = () => {
    if (!enableBorderRadius) {
      return "";
    }
    switch (direction) {
      case "left":
        return "rounded-tr-[80px] rounded-br-[80px]";
      case "right":
        return "rounded-tl-[80px] rounded-bl-[80px]";
      case "top":
        return "rounded-tl-[80px] rounded-tr-[80px]";
      case "bottom":
        return "rounded-bl-[80px] rounded-br-[80px]";
      default:
        return "rounded-tl-[80px] rounded-tr-[80px]";
    }
  };

  // Calculate drawer container max width based on direction
  // For top/bottom: use contentMaxWidth on the drawer container itself
  // For left/right: use maxWidth for drawer width
  const getDrawerMaxWidth = () => {
    if (direction === "left" || direction === "right") {
      // For left/right, use maxWidth for drawer width
      return maxWidth && maxWidth > 0 ? `${maxWidth}px` : "100%";
    } else {
      // For top/bottom, use contentMaxWidth for drawer max width
      if (contentMaxWidth && contentMaxWidth > 0) {
        return `${contentMaxWidth}px`;
      }
      return "100%";
    }
  };

  const drawerMaxWidth = getDrawerMaxWidth();
  const shouldCenterDrawer = (direction === "top" || direction === "bottom") && contentMaxWidth && contentMaxWidth > 0;

  // Calculate base transform for centering (if needed)
  const getBaseTransform = () => {
    if (shouldCenterDrawer) {
      return "translateX(-50%)";
    }
    return "none";
  };

  // Combine base transform with animation transform
  const getCombinedTransform = (isOpen: boolean) => {
    const baseTransform = getBaseTransform();
    const animationTransform = getDrawerTransform(isOpen);
    
    if (baseTransform === "none") {
      return animationTransform;
    }
    // Combine transforms: first apply centering, then animation
    return `${baseTransform} ${animationTransform}`;
  };

  // Menu animation styles
  const menuStyles = `
    .sticky-nav-drawer {
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s, visibility 0.4s;
      will-change: transform, opacity;
    }
    .sticky-nav-drawer.open {
      transform: ${getCombinedTransform(true)};
      opacity: 1;
      visibility: visible;
    }
    .sticky-nav-drawer.closed {
      transform: ${getCombinedTransform(false)};
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .sticky-nav-menu-item {
      transition: transform 0.3s, opacity 0.3s;
    }
    .sticky-nav-menu-item.open {
      transform: ${getMenuItemTransform(true)};
      opacity: 1;
    }
    .sticky-nav-menu-item.closed {
      transform: ${getMenuItemTransform(false)};
      opacity: 0;
    }
    .sticky-nav-menu-image1 {
      transition: transform 0.6s;
    }
    .sticky-nav-menu-image1.open {
      transform: ${getImageTransform(true)};
    }
    .sticky-nav-menu-image1.closed {
      transform: ${getImageTransform(false)};
    }
    .sticky-nav-menu-image2 {
      transition: transform 0.6s;
    }
    .sticky-nav-menu-image2.open {
      transform: ${getImageTransform(true)};
    }
    .sticky-nav-menu-image2.closed {
      transform: ${getImageTransform(false)};
    }
  `;

  // Responsive max width style for drawer container
  const drawerMaxWidthStyle = (direction === "top" || direction === "bottom") && contentMaxWidth && contentMaxWidth > 0 ? `
    .sticky-nav-drawer-responsive {
      width: 100%;
    }
    @media (min-width: 1024px) {
      .sticky-nav-drawer-responsive {
        max-width: ${contentMaxWidth}px;
      }
    }
  ` : "";

  return (
    <>
      {drawerMaxWidthStyle && <style>{drawerMaxWidthStyle}</style>}
      <style>{menuStyles}</style>
      <div
        className={`fixed ${getDrawerPositionClasses()} font-semibold z-100 sticky-nav-drawer ${shouldCenterDrawer ? "sticky-nav-drawer-responsive" : ""} bg-no-repeat bg-cover ${getBorderRadius()} ${
          isOpen ? "open" : "closed"
        }`}
        style={{
          backgroundColor: "#fff",
          paddingTop: direction === "top" ? `${padding}px` : direction === "bottom" ? `${padding}px` : "0",
          paddingLeft: direction === "left" ? `${padding}px` : direction === "right" ? `${padding}px` : "0",
          paddingRight: direction === "right" ? `${padding}px` : "0",
          paddingBottom: direction === "bottom" ? `${padding}px` : "0",
          backgroundImage: menuBackgroundImageData
            ? `url(${menuBackgroundImageData.url})`
            : undefined,
          maxWidth: direction === "left" || direction === "right" 
            ? drawerMaxWidth
            : shouldCenterDrawer 
              ? undefined // Use CSS class for responsive max-width
              : "100%",
          width: direction === "left" || direction === "right" 
            ? drawerMaxWidth
            : "100%",
          height: direction === "top" || direction === "bottom" ? "100%" : "100%",
          left: direction === "left" 
            ? "0" 
            : shouldCenterDrawer
              ? "50%"
              : direction === "top" || direction === "bottom" 
                ? "0" 
                : "auto",
          right: direction === "right" ? "0" : "auto",
        }}
      >
        {/* Close Button */}
        {closeIconData && isOpen && (
          <div
            className="sticky-nav-close cursor-pointer mb-8 max-w-max mx-auto"
            onClick={onClose}
          >
            <div
              className="imgage-section-container w-10"
              style={{
                aspectRatio: "88 / 88",
              }}
            >
              <Image
                data={closeIconData}
                alt="Close"
                width={88}
                height={88}
                loading="lazy"
                sizes="auto"
              />
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-8 overflow-hidden px-8 relative z-3">
          {menuItems.map((item, index) => {
            const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              const link = item.link || "#";
              // Check if it's an anchor link (starts with #)
              if (link.startsWith("#") && link.length > 1) {
                e.preventDefault();
                const targetId = link.substring(1); // Remove the # symbol
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                  // Calculate offset for sticky navigation (header + padding)
                  const stickyNavHeight = 100; // Approximate height of sticky nav
                  
                  // Get the element's position relative to viewport
                  const elementTop = targetElement.getBoundingClientRect().top;
                  // Calculate scroll position with offset
                  const offsetPosition = elementTop + window.pageYOffset - stickyNavHeight;
                  
                  // Scroll to position with offset
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }
              
              // Close drawer after navigation
              onClose();
            };
            
            return (
              <Link
                key={index}
                to={item.link || "#"}
                className={`flex items-center gap-3 font-bold sticky-nav-menu-item cursor-pointer ${
                  isOpen ? "open" : "closed"
                }`}
                style={{
                  color: menuItemColor,
                  fontSize: `${menuItemSize}px`,
                  transitionDelay: `${index * 0.1}s`,
                }}
                onClick={handleClick}
              >
                <div>{item.label}</div>
                <ArrowIcon />
              </Link>
            );
          })}
        </div>

        {/* Menu Images - Only render when drawer is open to avoid loading on first screen */}
        {menuImage1Data && isOpen && (
          <div
            className={`absolute right-0 bottom-0 w-full sticky-nav-menu-image1 open`}
          >
            <div
              className="imgage-section-container"
              style={{
                aspectRatio: "750 / 1043",
              }}
            >
              <Image
                data={menuImage1Data}
                alt="Menu image 1"
                width={750}
                height={1043}
                loading="lazy"
                sizes="auto"
              />
            </div>
          </div>
        )}

        {menuImage2Data && isOpen && (
          <div
            className={`absolute bottom-0 w-full sticky-nav-menu-image2 max-w-[200px] open`}
          >
            <div
              className="imgage-section-container max-w-[200px]"
              style={{
                aspectRatio: "296 / 289",
              }}
            >
              <Image
                data={menuImage2Data}
                alt="Menu image 2"
                width={296}
                height={289}
                loading="lazy"
                sizes="auto"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Lazy load the drawer component for code splitting
const LazyStickyNavigationDrawer = lazy(
  () =>
    Promise.resolve({
      default: StickyNavigationDrawerContent,
    }),
);

export function StickyNavigationDrawer(props: StickyNavigationDrawerProps) {
  // Always render to allow smooth transitions
  return (
    <Suspense fallback={null}>
      <LazyStickyNavigationDrawer {...props} />
    </Suspense>
  );
}

