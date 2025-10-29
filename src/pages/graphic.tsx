import { useEffect } from "react";

import DefaultLayout from "@/layouts/default";
import { GraphicChart } from "@/components/chart";
import { useGraphicStore } from "@/store";
import { Loader } from "@/components/loader";
import { GraphicSettings } from "@/components/graphic-settings";

export default function GraphicPage() {
  const graphicStore = useGraphicStore();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Render GraphicPage");

    graphicStore.fetchData();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center h-[100%] w-[100%]">
        <div className="inline-block text-center justify-center">
          <div className="dark:bg-slate-300/30 bg-slate-400 rounded p-2 flex gap-[10px] max-w-max w-[90vw]">
            {!graphicStore.data && <Loader />}
            {graphicStore.data && (
              <>
                <GraphicSettings />
                <GraphicChart data={graphicStore.data} visibleYaxis={graphicStore.axis} yAxis={["mounth", "day", "water", "depth"]}/>
              </>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
