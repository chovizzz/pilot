import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section } from "~/components/section";
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
      ...rest
    } = props as CopyrightData & typeof props;

    const animation = useAnimation();

    // Extract logo URL from WeaverseImage object or string
    const logoUrl = logo
      ? typeof logo === "string"
        ? logo
        : logo.url
      : null;

    return (
      <Section
        ref={ref}
        {...rest}
        className="footer-page w-full lg:mx-auto mx-auto"
        style={{
          backgroundColor: bgColor,
          paddingTop: `${padding}px`,
          paddingBottom: `${padding}px`,
        }}
        data-motion="fade-up"
        {...animation}
      >
        <div className="footer-content flex flex-col justify-center items-center max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          {logoUrl && (
            <img
              src={logoUrl}
              alt=""
              className="mb-3 h-auto"
              style={{
                width: `${logoWidth}px`,
              }}
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
  },
});

