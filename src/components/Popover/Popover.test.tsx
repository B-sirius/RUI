import React from "react";
import { render } from "@testing-library/react";

import Popover from "./Popover";

describe("Popover", () => {
  test("renders the Popover component", () => {
    render(
      <Popover content="hello world">
        <button>Hover Me</button>
      </Popover>
    );
  });
});
