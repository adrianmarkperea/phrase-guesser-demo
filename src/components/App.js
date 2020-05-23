import React from "react";
import createSimulation from "../utils/ga";
import { CHARSET } from "../utils/globals";
import Stats from "./Stats";

const MAX_CHARS = 30;
const MAX_DISPLAY_LENGTH = 74;

function App() {
  const [population, setPopulation] = React.useState([]);
  const [phrase, setPhrase] = React.useState("Powered by genie.js");
  const [popSize, setPopSize] = React.useState(1000);
  const [maxGenerations, setMaxGenerations] = React.useState(1000);
  const [mutation, setMutation] = React.useState(0.01);
  const [simulation, setSimulation] = React.useState(null);
  const [firstRun, setFirstRun] = React.useState(true);
  const [running, setRunning] = React.useState(false);

  const [currentGeneration, setCurrentGeneration] = React.useState(0);
  const [averageFitnesses, setAverageFitnesses] = React.useState([]);
  const [topFitnesses, setTopFitnesses] = React.useState([]);

  const submitButton = React.useRef();
  const target = React.useRef(phrase);

  const onCalculateFitness = React.useCallback(
    ({ averageFitness, currentGeneration, population, top }) => {
      setAverageFitnesses((averageFitnesses) => [
        ...averageFitnesses,
        averageFitness,
      ]);
      setCurrentGeneration(currentGeneration);
      setPopulation(population);
      setTopFitnesses((topFitnesses) => [...topFitnesses, top.fitness]);
    },
    []
  );

  const onFinish = React.useCallback(() => {
    setRunning(false);
  }, []);

  React.useEffect(() => {
    if (running) return;

    const simulation = createSimulation(
      phrase,
      popSize,
      maxGenerations,
      mutation,
      onCalculateFitness,
      onFinish
    );
    setSimulation(simulation);
  }, [
    running,
    phrase,
    popSize,
    maxGenerations,
    mutation,
    onCalculateFitness,
    onFinish,
  ]);

  React.useEffect(() => {
    if (!simulation) return;
    if (!firstRun) return;

    setFirstRun(false);
    submitButton.current.click();
  }, [firstRun, simulation]);

  const top50 = population.slice(0, 50);
  const averagesToDisplay =
    averageFitnesses.length < MAX_DISPLAY_LENGTH
      ? averageFitnesses
      : averageFitnesses.slice(
          averageFitnesses.length - MAX_DISPLAY_LENGTH,
          averageFitnesses.length
        );
  const topToDisplay =
    topFitnesses.length < MAX_DISPLAY_LENGTH
      ? topFitnesses
      : topFitnesses.slice(
          topFitnesses.length - MAX_DISPLAY_LENGTH,
          topFitnesses.length
        );

  return (
    <>
      <header>
        <h1>Genetic Algorithm Phrase Guesser</h1>
        <h2>
          A simple demo using{" "}
          <a href="https://github.com/adrianmarkperea/genie">Genie.js</a>
        </h2>
        <p>
          Adjust the <code>phrase</code>, <code>popSize</code>,{" "}
          <code>maxGenerations</code>and <code>mutation</code> values and press
          start. The genetic algorithm will try to guess your phrase.
        </p>
        <p>
          The left column shows its guesses, and the right column shows how many
          characters it got right.
        </p>
      </header>

      <main className="grid-container">
        <div className="options">
          <h2>Options</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              setAverageFitnesses([]);
              setTopFitnesses([]);
              setRunning(true);
              target.current = phrase;
              simulation.start();
            }}
          >
            <div className="input-group">
              <label htmlFor="phrase">phrase</label>
              <span>
                {phrase.length}/{MAX_CHARS}
              </span>
              <input
                type="text"
                value={phrase}
                id="phrase"
                maxLength={MAX_CHARS}
                onChange={(e) => {
                  const everyCharIsInCharset = Array.from(
                    e.target.value
                  ).every((char) => CHARSET.includes(char));

                  if (everyCharIsInCharset) setPhrase(e.target.value);
                }}
                disabled={running}
              />
            </div>

            <div className="input-group">
              <label htmlFor="popSize">popSize</label>
              <span>{popSize}</span>
              <input
                type="range"
                min="100"
                max="5000"
                value={popSize}
                id="popSize"
                step="50"
                onChange={(e) => setPopSize(parseInt(e.target.value))}
                disabled={running}
              />
            </div>

            <div className="input-group">
              <label htmlFor="maxGenerations">maxGenerations</label>
              <span>{maxGenerations}</span>
              <input
                type="range"
                min="100"
                max="10000"
                value={maxGenerations}
                id="maxGenerations"
                step={1}
                onChange={(e) => setMaxGenerations(parseInt(e.target.value))}
                disabled={running}
              />
            </div>

            <div className="input-group">
              <label htmlFor="mutations">mutation</label>
              <span>{mutation}</span>
              <input
                type="range"
                min="0"
                max="1"
                value={mutation}
                id="mutation"
                step={0.01}
                onChange={(e) => setMutation(parseFloat(e.target.value))}
                disabled={running}
              />
            </div>

            <button
              ref={submitButton}
              type="submit"
              disabled={running || phrase.length === 0}
            >
              Start
            </button>
          </form>
        </div>

        <div className="container">
          {top50.map((individual, i) => (
            <div className="grid mono fit-children" key={i}>
              <div>
                {individual.getDna(0).map((char, j) => (
                  <span
                    className={`${
                      char !== target.current.charAt(j)
                        ? "white-text red-bg"
                        : ""
                    }`}
                    key={j}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <span className="gold-text">{individual.fitness}</span>
            </div>
          ))}
        </div>

        <Stats
          averages={averagesToDisplay}
          tops={topToDisplay}
          target={target.current}
          currentGeneration={currentGeneration}
          maxGenerations={maxGenerations}
        />
      </main>

      <footer>
        &copy; <a href="https://twitter.com/adrianmarkperea">Adrian Perea</a>
      </footer>
    </>
  );
}

export default App;
