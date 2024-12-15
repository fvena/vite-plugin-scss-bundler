import eslintNode from "personal-style-guide/eslint/node";

export default [
  ...eslintNode,
  {
    rules: {
      "import/no-unresolved": [2, { ignore: ["virtual:"] }],
      "security/detect-non-literal-fs-filename": "off",
    },
  },
];
