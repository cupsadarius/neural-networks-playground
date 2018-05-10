let training_data = [
  {
    inputs: [0, 0],
    outputs: [0]
  },
  {
    inputs: [0, 1],
    outputs: [1]
  },
  {
    inputs: [1, 0],
    outputs: [1]
  },
  {
    inputs: [1, 1],
    outputs: [0]
  }
];


class XoR extends NeuralAgent {
  constructor(dna) {
    super(dna || new NeuralNetwork([2,3,1]));
  }

  evaluate(context) {
    let run = true;
    let shouldBeFalse = 0;
    let shouldBeTrue = 0;
    let error = 0;
    do {
      const thought = random(context.data);
      const result = this.think(thought.inputs);
      const inputSum = thought.inputs[0] + thought.inputs[1];

      if (Math.round(result[0]) === thought.outputs[0]) {
        if (inputSum === 0 || inputSum === 2) {
          shouldBeFalse += 1;
        } else {
          shouldBeTrue += 1;
        }

        error += Math.pow(result[0] - thought.outputs[0], 2);
      } else {
        run = false;
      }
    } while (run);
    const weight = shouldBeFalse && shouldBeTrue ? ((shouldBeFalse / shouldBeTrue) / (shouldBeFalse + shouldBeTrue)) : 0;
    // console.log(this.generation, this.index, [shouldBeFalse, shouldBeTrue], weight, error);
    
    this.score = weight * error;
    this.die();
    return;
  }
};

const context = {
  data: training_data
};

const p = new Population(XoR, context, 500, 0.4, 0.1);

p.bestOverall = {score: 0};
while (p.bestOverall.score < 20) {
  p.nextGeneration();
  console.log(p.bestOverall.score, p.bestOverall.generation);
}
console.log('done');