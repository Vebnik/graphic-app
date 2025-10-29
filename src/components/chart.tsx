import { useEffect } from "react";
import * as d3 from "d3";

import { Data } from "@/store";
import { SvgElement } from "@/types";

interface GraphicChartProps {
  data: Data;
  visibleYaxis: string[];
  yAxis: string[];
}

export function GraphicChart({ data, visibleYaxis, yAxis }: GraphicChartProps) {
  const removePrevLayres = (svg: SvgElement) => {
    // eslint-disable-next-line no-console
    console.log("Removed prev layers", { svg });

    // remvoe x axis & x grid axis
    const xAxis = document.querySelector("#x-axis-chart");
    const xAxisGrid = document.querySelector("#x-axis-chart-grid");

    if (xAxis) xAxis.remove();
    if (xAxisGrid) xAxisGrid.remove();

    // remove y axis
    for (const axisKey of yAxis) {
      const axis = document.querySelector(`#y-axis-${axisKey}`);

      axis?.remove();
    }

    // remove common y axis
    const commonYaxis = document.querySelector(`#y-axis-common`);
    const commonPath = document.querySelector(`#path-common`);

    commonYaxis?.remove();
    commonPath?.remove();

    // remove paths
    for (const key of yAxis) {
      const path = document.querySelector(`#path-${key}`);

      if (path) path.remove();
    }
  };

  const renderYaxis = (
    svg: SvgElement,
    transform: string,
    color: string,
    id: string,
    title: string,
    domain: d3.Axis<d3.AxisDomain>
  ) => {
    svg
      .append("g")
      .attr("transform", transform)
      .attr("color", color)
      .attr("id", id)
      .call(domain)
      .call((g) =>
        g
          .append("text")
          .attr("x", -15)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .text(title)
      );
  };

  const renderPath = (
    svg: SvgElement,
    color: string,
    id: string,
    data: any,
    line: d3.Line<[number, number]>
  ) => {
    svg
      .append("g")
      .attr("fill", "none")
      .attr("id", id)
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(data)
      .join("path")
      .style("mix-blend-mode", "multiply")
      // @ts-expect-error
      .attr("d", line);
  };

  const renderXaxis = (
    svg: SvgElement,
    transform: string,
    color: string,
    id: string,
    tick: any
  ) => {
    svg
      .append("g")
      .attr("transform", transform)
      .attr("id", id)
      .attr("color", color)
      .call(tick);
  };

  useEffect(() => {
    const svg: SvgElement = d3.select("#graphic-chart");

    if (!svg) {
      // eslint-disable-next-line no-console
      return console.error("Not found graphic-chart element");
    }

    removePrevLayres(svg);

    const width = 1300;
    const height = 600;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 20;
    const marginLeft = 85 + visibleYaxis.length * 80;

    // Declare the x ----------------------------------------------------- //
    const x = d3
      .scaleUtc()
      // @ts-expect-error
      .domain(d3.extent(data.mounth, (d) => d.date))
      .range([marginLeft, width - marginRight]);

    renderXaxis(
      svg,
      `translate(0, ${height - marginBottom})`,
      "gray",
      "x-axis-chart-grid",
      d3
        .axisBottom(x)
        .ticks(width / 10)
        .tickSize(-(height - marginTop - marginBottom))
        // @ts-expect-error
        .tickFormat("")
    );

    renderXaxis(
      svg,
      `translate(0,${height - marginBottom})`,
      "white",
      "x-axis-chart",
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );
    // -------------------------------------------------------------------- //

    // Declare the shared y  ---------------------------------------------- //
    const commonItems = Object.values(data).flat();

    const commonY = d3
      .scaleLinear()
      // @ts-expect-error
      .domain([0, d3.max(commonItems, (d) => d.value)])
      .nice()
      .range([height - marginBottom, marginTop]);

    renderYaxis(
      svg,
      `translate(${marginLeft - 90 * visibleYaxis.length + 1},0)`,
      "#a0e6ff",
      "y-axis-common",
      "Common",
      // @ts-expect-error: Mismatch type
      d3.axisLeft(commonY).ticks(20)
    );

    const points = commonItems.map((d) => [
      x(d.date),
      commonY(d.value),
      d.title,
    ]);

    const groups = d3.rollup(
      points,
      (v) => Object.assign(v, { z: v[0][2] }),
      (d) => d[2]
    );

    renderPath(svg, "#a0e6ff", "path-common", groups.values(), d3.line());

    // -------------------------------------------------------------------- //

    // Declare the y  ----------------------------------------------------- //
    let i = 0;

    Object.entries(data).forEach((value) => {
      const [key, items] = value;

      if (!visibleYaxis.includes(key)) return;

      const y = d3
        .scaleLinear()
        // @ts-expect-error
        .domain([0, d3.max(items, (d) => d.value)])
        .nice()
        .range([height - marginBottom, marginTop]);

      renderYaxis(
        svg,
        `translate(${marginLeft - 90 * i},0)`,
        items[0].color,
        `y-axis-${key}`,
        items[0].title,
        // @ts-expect-error: Mismatch type
        d3.axisLeft(y).ticks(20)
      );

      const points = items.map((d) => [x(d.date), y(d.value), d.title]);

      const groups = d3.rollup(
        points,
        (v) => Object.assign(v, { z: v[0][2] }),
        (d) => d[2]
      );

      renderPath(
        svg,
        items[0].color,
        `path-${key}`,
        groups.values(),
        d3.line()
      );

      i += 1;
    });
    // -------------------------------------------------------------------- //

    // eslint-disable-next-line no-console
    console.log("Render GraphicChart");
  }, [visibleYaxis]);

  return (
    <div className="border-slate-700 border-1 rounded p-1 overflow-auto">
      <svg height="600" id="graphic-chart" width="1300" />
    </div>
  );
}
