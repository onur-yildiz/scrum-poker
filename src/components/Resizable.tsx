import React, { PropsWithChildren, useCallback, useState } from "react";

import Box from "@mui/system/Box";
import { Stack } from "@mui/material";

const Resizable = (props: PropsWithChildren<any>) => {
  const [leftWidth, setLeftWidth] = useState("30%");
  const [rightWidth, setRightWidth] = useState("70%");

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    document.addEventListener("mouseup", handleMouseUp, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    const newWidth = Math.min(
      Math.max(e.clientX - document.body.offsetLeft, 0),
      window.innerWidth
    );
    setLeftWidth(`${(newWidth / window.innerWidth) * 100}%`);
    setRightWidth(`${100 - (newWidth / window.innerWidth) * 100}%`);
  }, []);

  return (
    <Stack direction="row" sx={{ width: "100%", height: "100vh" }}>
      <Box sx={{ width: leftWidth }}>{props.children[0]}</Box>
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: "2px",
          cursor: "col-resize",
        }}
      />
      <Box sx={{ width: rightWidth, zIndex: 99999 }}>{props.children[1]}</Box>
    </Stack>
  );
};

export default Resizable;
