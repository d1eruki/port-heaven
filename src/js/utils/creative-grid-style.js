export const getCreativeGridStyle = ({ row, rowSpan, col, colSpan }) => ({
  ...(row && { gridRow: `${row} / span ${rowSpan}` }),
  ...(col && { gridColumn: `${col} / span ${colSpan}` }),
});
