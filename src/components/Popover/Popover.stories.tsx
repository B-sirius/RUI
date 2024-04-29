import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Popover from "./Popover";

const meta: Meta<typeof Popover> = {
  title: "RUI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
};

export const Default: StoryFn<typeof Popover> = (args) => (
  <Popover {...args}>
    <button>Hover Me</button>
  </Popover>
);
Default.args = {
  content: "popover content",
};

export default meta;
