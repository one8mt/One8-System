"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { getTooltipStyle, getTooltipTextStyle } from "../ChartColors";
import { cn } from "../ui/utils";

type DonutDatum = {
  name: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DonutDatum[];
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  showLegend?: boolean;
  legendProps?: React.ComponentProps<typeof Legend>;
  showTooltip?: boolean;
};

export function DonutChart({
  data,
  className,
  innerRadius = 60,
  outerRadius = 100,
  paddingAngle = 2,
  showLegend = false,
  legendProps,
  showTooltip = true,
}: DonutChartProps) {
  return (
    <div className={cn("h-64", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
            stroke="transparent"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={getTooltipStyle()}
              itemStyle={getTooltipTextStyle()}
              labelStyle={getTooltipTextStyle()}
            />
          )}
          {showLegend && (() => {
            const { ref: _ref, ...safeLegendProps } = legendProps ?? {};
            return <Legend {...safeLegendProps} />;
          })()}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
