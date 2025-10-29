import { create } from 'zustand'
import * as d3 from "d3";
import * as d3Time from "d3-time";


const dateRange = d3Time.timeDays(new Date(2025, 10, 1), new Date(2025, 11, 31));

export interface Data {
  [key: string]: {
    title: string;
    value: number;
    color: string;
    date: Date;
  }[];
}


type Store = {
  data: Data | null
  visible: string[]
  axis: string[]

  fetchData: () => Promise<void>
  onChangeVisible: (values: string[]) => void
  onChangeAxis: (values: string[]) => void
}

export const useGraphicStore = create<Store>()((set, get) => ({
  data: null,
  visible: ["mounth", "day", "water", "depth"],
  axis: ["mounth", "day", "water", "depth"],

  fetchData: async () => {
    const data: Data = {
      "mounth": dateRange.map((date, i) => ({
        title: "Mounth, m3",
        value: i > 25 ? d3.randomUniform(1 + i, 3 + i)() : d3.randomUniform(10 + i, 13 + i)(),
        color: "#fade91",
        date,
      })),
      "day": dateRange.map((date, i) => ({
        title: "m3 / day",
        value: i > 25 ? d3.randomUniform(30 + i, 40 + i)() : d3.randomUniform(8 + i, 10 + i)(),
        color: "#e8fa91",
        date,
      })),
      "water": dateRange.map((date, i) => ({
        title: "water, %(0-100)",
        value: d3.randomUniform(40 + i, 46 + i)(),
        color: "#a1f0c2",
        date,
      })),
      "depth": dateRange.map((date, i) => ({
        title: "Depth",
        value: d3.randomUniform(1 + i, 5 + i)(),
        color: "#a1cbf0",
        date,
      })),
    };

    // just for simualte load
    await new Promise((res) => setTimeout(() => res(undefined), 2000))

    return set({ data })
  },
  onChangeVisible: (values: string[]) => {
    const { visible } = get()

    if (values.length > visible.length) {
      const forOn = values.filter((el) => !visible.includes(el));

      for (const key of forOn) {
        const path = document.querySelector(`#path-${key}`);

        if (!path) return;

        // @ts-expect-error: mismatch type
        path.style.display = "block";
      }
    }

    if (values.length < visible.length) {
      const forOff = visible.filter((el) => !values.includes(el));

      for (const key of forOff) {
        const path = document.querySelector(`#path-${key}`);

        if (!path) return;

        // @ts-expect-error: mismatch type
        path.style.display = "none";
      }
    }

    return set({ visible: values })
  },
  onChangeAxis: (values: string[]) => {
    // const { axis } = get()

    const svg = d3.select("#graphic-chart");

    if (!svg) {
      // eslint-disable-next-line no-console
      return console.error("Not found graphic-chart element")
    };

    // if (values.length > axis.length) {
    //   const forOn = values.filter((el) => !axis.includes(el));

    //   for (const key of forOn) {
    //     const path = document.querySelector(`#path-${key}`);
    //     const yAxis = document.querySelector(`#y-axis-${key}`)

    //     if (!path || !yAxis) return;

    //     // @ts-expect-error: mismatch type
    //     path.style.display = "block";
    //     // @ts-expect-error: mismatch type
    //     yAxis.style.display = "block";
    //   }
    // }

    // if (values.length < axis.length) {
    //   const forOff = axis.filter((el) => !values.includes(el));

    //   for (const key of forOff) {
    //     const path = document.querySelector(`#path-${key}`);
    //     const yAxis = document.querySelector(`#y-axis-${key}`)

    //     if (!path || !yAxis) return;

    //     // @ts-expect-error: mismatch type
    //     path.style.display = "none";
    //     // @ts-expect-error: mismatch type
    //     yAxis.style.display = "none";
    //   }
    // }

    return set({ axis: values })
  }
}))
