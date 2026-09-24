// Minimal flat config so editor/hook tooling doesn't error on missing config.
// The CI lint gate is Biome (core-platform/templates/biome.json, CCOE-RULES §15.2),
// not ESLint — this file only prevents IDE/hook noise.
export default []
