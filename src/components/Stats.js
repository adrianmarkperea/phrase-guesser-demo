import React from "react";

const MAX_STATS_HEIGHT = 30;

function map(input, input_start, input_end, output_start, output_end) {
  return (
    output_start +
    ((output_end - output_start) / (input_end - input_start)) *
      (input - input_start)
  );
}

function Stats({
  averages,
  tops,
  target,
  currentGeneration,
  maxGenerations,
  max_width = 74,
}) {
  const [show, setShow] = React.useState("averages");

  const statToShow = show === "average" ? averages : tops;

  return (
    <div
      className="stats-wrapper"
      onClick={() =>
        setShow((stat) => (stat === "average" ? "top" : "average"))
      }
    >
      <div className="stats">
        <p className="stats--title">
          {show === "average" ? "Ave" : "Top"} Fitness
        </p>
        <div className="stats--graph">
          {max_width - statToShow.length > 0 &&
            Array(max_width - statToShow.length)
              .fill(null)
              .map((_) => <span className="stats--buffer"></span>)}

          {statToShow.map((stat, i) => (
            <span
              key={i}
              className="stats--buffer"
              style={{
                height:
                  MAX_STATS_HEIGHT -
                  map(stat, 0, target.length, 0, MAX_STATS_HEIGHT),
              }}
            ></span>
          ))}
        </div>
        <p className="stats--top-fitness">
          {show === "average" ? "Ave" : "Top"}{" "}
          {statToShow[statToShow.length - 1]
            ? statToShow[statToShow.length - 1].toFixed()
            : 0}
        </p>
        <p className="stats--max-generations">
          gen. {currentGeneration}/{maxGenerations}
        </p>
      </div>
    </div>
  );
}

export default Stats;
