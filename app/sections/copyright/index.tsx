import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section } from "~/components/section";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface CopyrightData {
  logo?: WeaverseImage | string;
  email?: string;
  copyrightText?: string;
  bgColor?: string;
  textColor?: string;
  textSize?: number;
  logoWidth?: number;
  padding?: number;
  maxWidth?: number;
}

type CopyrightProps = HydrogenComponentProps<CopyrightData>;

export const Copyright = forwardRef<HTMLElement, CopyrightProps>(
  (props, ref) => {
    const {
      logo,
      email = "cs@sakerplus.com",
      copyrightText = "© 2025 Copyright All Rights Reserved.",
      bgColor = "#FAE2D2",
      textColor = "#000000",
      textSize = 14,
      logoWidth = 100,
      padding = 32,
      maxWidth = 500,
      ...rest
    } = props as CopyrightData & typeof props;

    const animation = useAnimation();

    // Prepare image data for Image component
    const logoData: Partial<WeaverseImage> | undefined = logo
      ? typeof logo === "string"
        ? { url: logo, altText: "Logo" }
        : logo
      : undefined;

    // Create responsive maxWidth style that only applies on lg (1024px) and above
    // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
    const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
      .copyright-responsive {
        width: 100%;
      }
      @media (min-width: 1024px) {
        .copyright-responsive {
          max-width: ${maxWidth}px;
        }
      }
    ` : `
      .copyright-responsive {
        width: 100%;
      }
    `;

    return (
      <Section
        ref={ref}
        {...rest}
        className="footer-page w-full mx-auto copyright-responsive"
        style={{
          backgroundColor: bgColor,
          paddingTop: `${padding}px`,
          paddingBottom: `${padding}px`,
        }}
        data-motion="fade-up"
        {...animation}
      >
        <style>{responsiveMaxWidthStyle}</style>
        <div className="footer-content flex flex-col justify-center items-center max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          {logoData && (
            <Image
              data={logoData}
              alt=""
              className="mb-3 h-auto flex justify-center"
              style={{
                width: `${logoWidth}px`,
              }}
              loading="lazy"
              sizes="auto"
            />
          )}
          <div
            className="leading-tight footer_text footer-text text-center"
            style={{
              color: textColor,
              fontSize: `${textSize}px`,
            }}
          >
            {email && (
              <p style={{ textAlign: "center", marginBottom: "0.5rem" }}>
                <a
                  href={`mailto:${email}`}
                  style={{ color: textColor, textDecoration: "none" }}
                >
                  {email}
                </a>
              </p>
            )}
            {copyrightText && (
              <p style={{ textAlign: "center", margin: 0 }}>
                {copyrightText}
              </p>
            )}
          </div>
        </div>
      </Section>
    );
  }
);

Copyright.displayName = "Copyright";

export default Copyright;

export const schema = createSchema({
  type: "copyright",
  title: "Copyright",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "image",
          name: "logo",
          label: "Logo",
        },
        {
          type: "text",
          name: "email",
          label: "Email Address",
          defaultValue: "cs@sakerplus.com",
        },
        {
          type: "text",
          name: "copyrightText",
          label: "Copyright Text",
          defaultValue: "© 2025 Copyright All Rights Reserved.",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "logoWidth",
          label: "Logo Width",
          defaultValue: 100,
          configs: {
            min: 50,
            max: 300,
            step: 10,
            unit: "px",
          },
          condition: (data: CopyrightData) => !!data.logo,
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 32,
          configs: {
            min: 16,
            max: 80,
            step: 4,
            unit: "px",
          },
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
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#FAE2D2",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#000000",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "textSize",
          label: "Text Size",
          defaultValue: 14,
          configs: {
            min: 12,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    email: "cs@sakerplus.com",
    copyrightText: "© 2025 Copyright All Rights Reserved.",
    bgColor: "#FAE2D2",
    textColor: "#000000",
    textSize: 14,
    logoWidth: 100,
    padding: 32,
    maxWidth: 500,
  },
});

