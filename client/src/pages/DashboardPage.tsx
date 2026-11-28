import React from "react";
import { App1 } from "@/components/ui/app-1";

export const DashboardPage: React.FC = () => {
  return (
    <div className="w-full flex-1 bg-background text-foreground">
      <App1 />
    </div>
  );
};

export default DashboardPage;
