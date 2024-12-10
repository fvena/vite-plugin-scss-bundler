import eslintNode from "personal-style-guide/eslint/node";

export default [
  ...eslintNode,
  {
    rules: {
      "import-x/no-unresolved": [2, { ignore: ["virtual:"] }],
      "unicorn/prevent-abbreviations": [
        "error",
        {
          replacements: {
            dir: {
              directory: false,
            },
            env: {
              environment: false,
            },
          },
        },
      ],
    },
  },
];
