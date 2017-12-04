var bubbleChart = () => {
  const width = 600;
  const height = 400;

  function chart(selection){
      // you gonna get here
  }

  chart.width = (value) => {
    if (!arguments.length) { return width; }
    width = value;
    return chart;
  };

  chart.height = (value) => {
    if (!arguments.length) { return height; }
    height = value;

    return chart;
};

  return chart;
};
