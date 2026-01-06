import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import type { WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { FeatureComparisonTableItem } from "./table-item";

interface FeatureComparisonTableData {
  showHeader?: boolean;
  headerBgColor?: string;
  headerTextColor?: string;
  leftColumnText?: string;
  middleColumnText?: string;
  rightColumnText?: string;
  leftColumnFontSize?: number;
  leftColumnFontWeight?: string;
  middleColumnFontSize?: number;
  middleColumnFontWeight?: string;
  rightColumnFontSize?: number;
  rightColumnFontWeight?: string;
  showBorder?: boolean;
  borderColor?: string;
  rowBgColor?: string;
  rowHeight?: number;
}

export const FeatureComparisonTable = forwardRef<
  HTMLDivElement,
  HydrogenComponentProps<FeatureComparisonTableData>
>((props, ref) => {
  const {
    showHeader = true,
    headerBgColor = "#f3f4f6",
    headerTextColor = "#000000",
    leftColumnText = "Features",
    middleColumnText = "Others",
    rightColumnText = "Saker",
    leftColumnFontSize = 16,
    leftColumnFontWeight = "600",
    middleColumnFontSize = 16,
    middleColumnFontWeight = "600",
    rightColumnFontSize = 16,
    rightColumnFontWeight = "600",
    showBorder = true,
    borderColor = "#d1d5db",
    rowBgColor = "#ffffff",
    rowHeight = 48,
    ...rest
  } = props as FeatureComparisonTableData & typeof props;
  const childInstances = useChildInstances();
  const animation = useAnimation();

  if (childInstances.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      {...rest}
      className="overflow-x-auto"
      data-motion="fade-up"
      {...animation}
    >
      <table className="w-full border-collapse">
        {showHeader && (
          <thead>
            <tr style={{ backgroundColor: headerBgColor }}>
              <th
                className="px-4 text-left"
                style={{
                  color: headerTextColor,
                  fontSize: `${leftColumnFontSize}px`,
                  fontWeight: leftColumnFontWeight,
                  height: `${rowHeight}px`,
                  ...(showBorder
                    ? { border: `1px solid ${borderColor}` }
                    : {}),
                }}
              >
                {leftColumnText}
              </th>
              <th
                className="px-4 text-center"
                style={{
                  color: headerTextColor,
                  fontSize: `${middleColumnFontSize}px`,
                  fontWeight: middleColumnFontWeight,
                  height: `${rowHeight}px`,
                  ...(showBorder
                    ? { border: `1px solid ${borderColor}` }
                    : {}),
                }}
              >
                {middleColumnText}
              </th>
              <th
                className="px-4 text-center"
                style={{
                  color: headerTextColor,
                  fontSize: `${rightColumnFontSize}px`,
                  fontWeight: rightColumnFontWeight,
                  height: `${rowHeight}px`,
                  ...(showBorder
                    ? { border: `1px solid ${borderColor}` }
                    : {}),
                }}
              >
                {rightColumnText}
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {childInstances.map((child, index) => (
            <FeatureComparisonTableItem
              key={`table-item-${index}`}
              showBorder={showBorder}
              borderColor={borderColor}
              rowBgColor={rowBgColor}
              rowHeight={rowHeight}
              {...(child.data as any)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

FeatureComparisonTable.displayName = "FeatureComparisonTable";

export default FeatureComparisonTable;

export const schema = createSchema({
  type: "feature-comparison--table",
  title: "Comparison Table",
  childTypes: ["feature-comparison--table-item"],
  settings: [
    {
      group: "Table",
      inputs: [
        {
          type: "switch",
          name: "showHeader",
          label: "Show Header",
          defaultValue: true,
        },
        {
          type: "text",
          name: "leftColumnText",
          label: "Left Column Text",
          defaultValue: "Features",
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
        {
          type: "text",
          name: "middleColumnText",
          label: "Middle Column Text",
          defaultValue: "Others",
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
        {
          type: "text",
          name: "rightColumnText",
          label: "Right Column Text",
          defaultValue: "Saker",
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
      ],
    },
    {
      group: "Header Style",
      inputs: [
        {
          type: "color",
          name: "headerBgColor",
          label: "Header Background Color",
          defaultValue: "#f3f4f6",
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
        {
          type: "color",
          name: "headerTextColor",
          label: "Header Text Color",
          defaultValue: "#000000",
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
      ],
    },
    {
      group: "Left Column Style",
      inputs: [
        {
          type: "range",
          name: "leftColumnFontSize",
          label: "Font Size",
          defaultValue: 16,
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
        {
          type: "select",
          name: "leftColumnFontWeight",
          label: "Font Weight",
          defaultValue: "600",
          configs: {
            options: [
              { value: "400", label: "Normal" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semibold" },
              { value: "700", label: "Bold" },
            ],
          },
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
      ],
    },
    {
      group: "Middle Column Style",
      inputs: [
        {
          type: "range",
          name: "middleColumnFontSize",
          label: "Font Size",
          defaultValue: 16,
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
        {
          type: "select",
          name: "middleColumnFontWeight",
          label: "Font Weight",
          defaultValue: "600",
          configs: {
            options: [
              { value: "400", label: "Normal" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semibold" },
              { value: "700", label: "Bold" },
            ],
          },
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
      ],
    },
    {
      group: "Right Column Style",
      inputs: [
        {
          type: "range",
          name: "rightColumnFontSize",
          label: "Font Size",
          defaultValue: 16,
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
        {
          type: "select",
          name: "rightColumnFontWeight",
          label: "Font Weight",
          defaultValue: "600",
          configs: {
            options: [
              { value: "400", label: "Normal" },
              { value: "500", label: "Medium" },
              { value: "600", label: "Semibold" },
              { value: "700", label: "Bold" },
            ],
          },
          condition: (data: FeatureComparisonTableData) =>
            data.showHeader === true,
        },
      ],
    },
    {
      group: "Table Style",
      inputs: [
        {
          type: "switch",
          name: "showBorder",
          label: "Show Border",
          defaultValue: true,
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border Color",
          defaultValue: "#d1d5db",
          condition: (data: FeatureComparisonTableData) =>
            data.showBorder === true,
        },
        {
          type: "color",
          name: "rowBgColor",
          label: "Row Background Color",
          defaultValue: "#ffffff",
        },
        {
          type: "range",
          name: "rowHeight",
          label: "Row Height",
          defaultValue: 48,
          configs: {
            min: 32,
            max: 120,
            step: 4,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    showHeader: true,
    leftColumnText: "Features",
    middleColumnText: "Others",
    rightColumnText: "Saker",
    headerBgColor: "#f3f4f6",
    headerTextColor: "#000000",
    leftColumnFontSize: 16,
    leftColumnFontWeight: "600",
    middleColumnFontSize: 16,
    middleColumnFontWeight: "600",
    rightColumnFontSize: 16,
    rightColumnFontWeight: "600",
    showBorder: true,
    borderColor: "#d1d5db",
    rowBgColor: "#ffffff",
    rowHeight: 48,
    children: [
      {
        type: "feature-comparison--table-item",
        feature: "Feature 1",
        ourProduct: "✓",
        competitor: "✗",
      },
    ],
  },
});

