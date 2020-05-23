import { Chromosome, Individual, Simulation } from "@adrianperea/genie.js";
import { CHARSET } from "./globals";

class PhraseGuesser extends Simulation {
  calculateFitness(individual, phrase) {
    return individual
      .getDna(0)
      .reduce(
        (fitness, gene, i) =>
          gene === phrase.charAt(i) ? fitness + 1 : fitness,
        0
      );
  }

  shouldFinish(top) {
    return top.fitness === this.data.length;
  }
}

export default function createSimulation(
  phrase,
  popSize,
  maxGenerations,
  mutationRate,
  onCalculateFitness,
  onFinish
) {
  const alphanumeric = new Chromosome(phrase.length, () => {
    return CHARSET[Math.floor(Math.random() * CHARSET.length)];
  });

  const prototype = new Individual(alphanumeric);

  const config = {
    prototype,
    popSize,
    maxGenerations,
    mutationRate,
    data: phrase,
    onCalculateFitness,
    onFinish,
  };

  return new PhraseGuesser(config);
}
