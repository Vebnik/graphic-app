import { useEffect } from "react";
import * as d3 from "d3";

import { Data } from "@/store";

interface GraphicChartProps {
  data: Data;
  visibleYaxis: string[];
  yAxis: string[];
}

export function GraphicChart({ data, visibleYaxis, yAxis }: GraphicChartProps) {
  useEffect(() => {
    const svg = d3.select("#graphic-chart");

    if (!svg) {
      // eslint-disable-next-line no-console
      return console.error("Not found graphic-chart element");
    }

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

    const xAxis = document.querySelector("#x-axis-chart");

    if (xAxis) xAxis.remove();

    const xAxisGrid = document.querySelector("#x-axis-chart-grid");

    if (xAxisGrid) xAxisGrid.remove();

    svg
      .append("g")
      .attr("class", "grid x-grid")
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .attr("id", "x-axis-chart-grid")
      .attr("color", "gray")
      // @ts-expect-error
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 10)
          .tickSize(-(height - marginTop - marginBottom))
          // @ts-expect-error
          .tickFormat("") // Remove tick labels
      );

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .attr("id", "x-axis-chart")
      .attr("color", "white")
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );
    // -------------------------------------------------------------------- //

    // remove prev exist y axis
    for (const axisKey of yAxis) {
      const axis = document.querySelector(`#y-axis-${axisKey}`);

      axis?.remove();
    }

    const commonYaxis = document.querySelector(`#y-axis-common`);
    const commonPath = document.querySelector(`#path-common`);

    commonYaxis?.remove();
    commonPath?.remove();

    // -------------------------------------------------------------------- //

    // Declare the shared y  ---------------------------------------------- //
    const commonItems = Object.values(data).flat();

    const commonY = d3
      .scaleLinear()
      // @ts-expect-error
      .domain([0, d3.max(commonItems, (d) => d.value)])
      .nice()
      .range([height - marginBottom, marginTop]);

    svg
      .append("g")
      .attr(
        "transform",
        `translate(${marginLeft - 90 * visibleYaxis.length + 1},0)`
      )
      .attr("color", "#a0e6ff")
      .attr("id", `y-axis-common`)
      .call(d3.axisLeft(commonY).ticks(20))
      .call((g) =>
        g
          .append("text")
          .attr("x", -15)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .text("Common")
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

    const line = d3.line();

    svg
      .append("g")
      .attr("fill", "none")
      .attr("id", "path-common")
      .attr("stroke", "#a0e6ff")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .selectAll("path")
      .data(groups.values())
      .join("path")
      .style("mix-blend-mode", "multiply")
      // @ts-expect-error
      .attr("d", line);
    // -------------------------------------------------------------------- //

    // Declare the y  ----------------------------------------------------- //
    let i = 0;

    Object.entries(data).forEach((value) => {
      const [key, items] = value;

      const path = document.querySelector(`#path-${key}`);

      if (path) path.remove();

      if (!visibleYaxis.includes(key)) return;

      const y = d3
        .scaleLinear()
        // @ts-expect-error
        .domain([0, d3.max(items, (d) => d.value)])
        .nice()
        .range([height - marginBottom, marginTop]);

      svg
        .append("g")
        .attr("transform", `translate(${marginLeft - 90 * i},0)`)
        .attr("color", items[0].color)
        .attr("id", `y-axis-${key}`)
        .call(d3.axisLeft(y).ticks(20))
        .call((g) =>
          g
            .append("text")
            .attr("x", -15)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .attr("font-size", "14")
            .text(items[0].title)
        );

      const points = items.map((d) => [x(d.date), y(d.value), d.title]);

      const groups = d3.rollup(
        points,
        (v) => Object.assign(v, { z: v[0][2] }),
        (d) => d[2]
      );

      const line = d3.line();

      svg
        .append("g")
        .attr("fill", "none")
        .attr("id", `path-${key}`)
        .attr("stroke", items[0].color)
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data(groups.values())
        .join("path")
        .style("mix-blend-mode", "multiply")
        // @ts-expect-error
        .attr("d", line);

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
