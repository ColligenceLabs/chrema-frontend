module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: {
      pragma: 'React',
      version: '17.0.2',
    },
  },
  rules: {
    'no-unused-vars': 'off',
    'react/prop-types': 'off',
    'no-undef': 'off',
    'react/jsx-no-duplicate-props': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'no-redeclare': 'off',
    'no-empty': 'off',
    'no-extra-boolean-cast': 'off',
    '@typescript-eslint/no-unused-vars': ['off'],
  },
};
