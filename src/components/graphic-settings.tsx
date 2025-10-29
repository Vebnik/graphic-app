import { Checkbox, CheckboxGroup, Chip, Divider } from "@heroui/react";

import { useGraphicStore } from "@/store";

export function GraphicSettings() {
  const graphicStore = useGraphicStore();

  return (
    <div className="border-slate-700 border-1 rounded p-1">
      <CheckboxGroup
        defaultValue={["mounth", "day", "water", "depth"]}
        label="Visible"
        value={graphicStore.visible}
        onChange={graphicStore.onChangeVisible}
      >
        <Checkbox value="mounth">
          <Chip>Mounth, m3</Chip>
        </Checkbox>
        <Checkbox value="day">
          <Chip>m3 / day</Chip>
        </Checkbox>
        <Checkbox value="water">
          <Chip>water, %(0-100)</Chip>
        </Checkbox>
        <Checkbox value="depth">
          <Chip>Depth</Chip>
        </Checkbox>
      </CheckboxGroup>
      <Divider className="my-4 bg-slate-700 h-1 rounded" />
      <CheckboxGroup
        defaultValue={["mounth", "day", "water", "depth"]}
        label="Axis"
        onChange={graphicStore.onChangeAxis}
      >
        <Checkbox value="mounth">
          <Chip>Mounth, m3</Chip>
        </Checkbox>
        <Checkbox value="day">
          <Chip>m3 / day</Chip>
        </Checkbox>
        <Checkbox value="water">
          <Chip>water, %(0-100)</Chip>
        </Checkbox>
        <Checkbox value="depth">
          <Chip>Depth</Chip>
        </Checkbox>
      </CheckboxGroup>
      <Divider className="my-4 bg-slate-700 h-1 rounded" />
    </div>
  );
}
