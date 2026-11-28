import * as React from "react";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

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
    <div
      className={cn("w-full h-64 min-h-[256px] relative", className)}
      style={style}
      {...props}
    >
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
          Loading metrics visualization...
        </div>
      )}
    </div>
  );
}

// Recharts native Tooltip and Legend exports
export const ChartTooltip = RechartsTooltip;
export const ChartLegend = RechartsLegend;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  {
    active?: boolean;
    payload?: Array<any>;
    label?: string;
    className?: string;
  }
>(({ active, payload, label, className }, ref) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      ref={ref}
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
});
ChartTooltipContent.displayName = "ChartTooltipContent";

export const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  {
    payload?: Array<any>;
    className?: string;
  }
>(({ payload, className }, ref) => {
  if (!payload || !payload.length) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-4 pt-3 text-xs",
        className
      )}
    >
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
});
ChartLegendContent.displayName = "ChartLegendContent";
