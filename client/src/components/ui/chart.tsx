import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  }
>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactElement;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  const style = React.useMemo(() => {
    const colorStyles: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value.color) {
        colorStyles[`--color-${key}`] = value.color;
      }
    }
    return colorStyles as React.CSSProperties;
  }, [config]);

  return (
    <div className={cn("w-full", className)} style={style} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ChartTooltip({ content, ...props }: any) {
  const Comp = content || ChartTooltipContent;
  return <Comp {...props} />;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: any) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-background/95 p-2.5 text-xs shadow-md backdrop-blur",
        className
      )}
    >
      {label && <p className="mb-1.5 font-medium text-foreground">{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color || entry.stroke || entry.fill }}
            />
            <span className="capitalize text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartLegend({ content, ...props }: any) {
  const Comp = content || ChartLegendContent;
  return <Comp {...props} />;
}

export function ChartLegendContent({ payload, className }: any) {
  if (!payload?.length) return null;

  return (
    <div className={cn("flex items-center justify-center gap-4 pt-3 text-xs", className)}>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
