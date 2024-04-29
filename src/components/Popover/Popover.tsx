import React, { RefObject } from "react";
import { Position, PopoverProps } from "./Popover.types";
import type * as CSS from "csstype";
import {
  cloneElement,
  useState,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import "./Popover.css";

const computeTop = (targetBox: DOMRect, margin: number) => {
  const x = targetBox.left + targetBox.width / 2;
  const y = targetBox.top - margin;
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: "translate(-50%, -100%)",
  };
};

const computeBottom = (targetBox: DOMRect, margin: number) => {
  const x = targetBox.left + targetBox.width / 2;
  const y = targetBox.bottom + margin;
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: "translateX(-50%)",
  };
};

const computeLeft = (targetBox: DOMRect, margin: number) => {
  const x = targetBox.left - margin;
  const y = targetBox.top + targetBox.height / 2;
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: "translate(-100%, -50%)",
  };
};

const computeRight = (targetBox: DOMRect, margin: number) => {
  const x = targetBox.right + margin;
  const y = targetBox.top + targetBox.height / 2;
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: "translateY(-50%)",
  };
};

const computeStyle = (
  position: Position,
  margin: number,
  targetBox: DOMRect,
  popoverBox: DOMRect
) => {
  switch (position) {
    case "top": {
      if (targetBox.top - popoverBox.height - margin > 0) {
        return computeTop(targetBox, margin);
      }
      return computeBottom(targetBox, margin);
    }
    case "bottom": {
      if (targetBox.bottom + popoverBox.height + margin < window.innerHeight) {
        return computeBottom(targetBox, margin);
      }
      return computeTop(targetBox, margin);
    }
    case "left": {
      if (targetBox.left - popoverBox.width - margin > 0) {
        return computeLeft(targetBox, margin);
      }
      return computeRight(targetBox, margin);
    }
    case "right": {
      if (targetBox.right + targetBox.width + margin < window.innerWidth) {
        return computeRight(targetBox, margin);
      }
      return computeLeft(targetBox, margin);
    }

    default:
      return {};
  }
};

const PopoverContent = ({
  content,
  position,
  targetRef,
  margin = 5,
}: {
  content: string;
  position: Position;
  targetRef: RefObject<Element>;
  margin?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSS.Properties>({});

  const getPosition = () => {
    if (!targetRef.current || !ref.current) {
      return;
    }
    const targetBox = targetRef.current.getBoundingClientRect();
    const popoverBox = ref.current.getBoundingClientRect();

    const positionStyle = computeStyle(position, margin, targetBox, popoverBox);
    setStyle(positionStyle);
  };

  useEffect(() => {
    // when page scrolls or resize
    // position should be recalculated
    window.addEventListener("resize", getPosition);
    window.addEventListener("scroll", getPosition);
    return () => {
      // remove these listeners during clean up
      window.removeEventListener("resize", getPosition);
      window.removeEventListener("scroll", getPosition);
    };
  }, []);

  // useEffect is async
  // while useLayoutEffect is synced before DOM mutation are painted
  // so, in this case, the first paint user saw is after this hook being excuted
  // which is super useful!
  useLayoutEffect(() => {
    getPosition();
  }, []);

  // createPortal can put PopoverContent under body
  // That's why it's portal!
  return createPortal(
    <div className="popover-content" style={style} ref={ref}>
      {content}
    </div>,
    document.body
  );
};
export default function Popover({
  children,
  content,
  position = "top",
}: PopoverProps) {
  const [show, setShow] = useState(false);
  const childrenRef = useRef<Element>(null);

  // cloneElement is a common way to "proxy" the children
  const clonedChildren = cloneElement(children, {
    ref: childrenRef,
    onPointerEnter: () => {
      if (children.props.onPointerEnter) {
        children.props.onPointerEnter();
      }
      setShow(true);
    },
    onPointerLeave: () => {
      if (children.props.onPointerLeave) {
        children.props.onPointerLeave();
      }
      setShow(false);
    },
  });

  return (
    <>
      {clonedChildren}
      {show && (
        <PopoverContent
          position={position}
          content={content}
          targetRef={childrenRef}
          margin={10}
        />
      )}
    </>
  );
}
