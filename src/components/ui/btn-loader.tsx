import React from "react";
import { ClipLoader } from "react-spinners";

const BtnLoader = ({
  size = 16,
  color = "#000000",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <ClipLoader
      color={color}
      loading={true}
      size={size}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default BtnLoader;
