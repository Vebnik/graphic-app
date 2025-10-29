import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SvgElement = d3.Selection<d3.BaseType, unknown, HTMLElement, any>;