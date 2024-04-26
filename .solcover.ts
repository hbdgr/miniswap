module.exports = {
  skipFiles: ["test", "uniswapV2Router"],
  mocha: {
    grep: "@skip-on-coverage", // Find everything with this tag
    invert: true               // Run the grep's inverse set.
  }
};
