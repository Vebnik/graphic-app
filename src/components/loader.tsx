import { Spinner } from "@heroui/react";

export function Loader() {
  return (
    <div className="flex flex-wrap w-[100vw] h-[600px]">
      <Spinner
        className="w-[100%] h-[100%]"
        classNames={{ label: "text-foreground mt-4" }}
        size="lg"
        variant="simple"
      />
    </div>
  );
}
