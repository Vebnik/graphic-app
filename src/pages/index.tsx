import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { GithubIcon, GraphicIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <div className="text-2xl">Beautiful Graphic app</div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={"/graphic"}
          >
            <GraphicIcon size={20} />
            Graphic
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
}
