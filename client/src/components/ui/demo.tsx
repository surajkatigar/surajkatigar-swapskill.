import GeometricBackground from "@/components/ui/geometric";

export default function GeometricBackgroundExample() {
  return (
    <GeometricBackground className="flex w-full h-screen justify-center items-center">
      <div className="text-center space-y-4 lg:space-y-6 z-10">
        <div className="text-2xl lg:text-4xl text-white/80">
          Geometric background
        </div>
      </div>
    </GeometricBackground>
  );
}
