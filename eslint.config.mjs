// eslint.config.mjs
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier'; // <-- 1. Importe a configuração do Prettier
import prettierPlugin from 'eslint-plugin-prettier';

// (Opcional, mas recomendado para flat config com TS)
// Use tseslint.config para uma configuração mais integrada
export default tseslint.config(
    // Configurações Globais ou Padrões
    {
        // Aplica a todos os arquivos por padrão, a menos que sobrescrito
        languageOptions: {
            globals: {
                ...globals.node, // Adiciona globais do Node.js
            },
            parserOptions: {
                project: true, // Necessário para regras com type checking
                tsconfigRootDir: import.meta.dirname, // Ajuda a localizar tsconfig.json
            },
        },
        // Adicione padrões de ignore globais aqui se desejar
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            // Adicione outros arquivos/pastas a serem ignorados globalmente
        ],
    },

    // Configuração base recomendada para JavaScript
    js.configs.recommended,

    // Configuração base recomendada para TypeScript
    // Isso já inclui o parser e o plugin do typescript-eslint
    ...tseslint.configs.recommended,
    // Se precisar de regras que exigem informações de tipo (mais rigoroso):
    // ...tseslint.configs.recommendedRequiringTypeChecking,
    // (Se usar type-checking, configure parserOptions.project abaixo)

    // Configurações específicas para seus arquivos JS/TS (se necessário)
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        plugins: {
            prettier: prettierPlugin,
        },
        // Se usar regras com type checking, descomente e ajuste parserOptions:
        // Adicione regras específicas ou sobrescreva regras aqui, se necessário
        rules: {
            'no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            // Exemplo: '@typescript-eslint/no-explicit-any': 'warn',
        },
    },

    // Configuração do Prettier (DEVE SER A ÚLTIMA!!) <-- 2. Adicione como último item
    prettierConfig
);

// ---------------
// Alternativa (mais próxima da sua estrutura original, mas menos idiomática com tseslint.config):
// import { defineConfig } from "eslint/config"; // Não é mais estritamente necessário com a abordagem acima
/*
export default [ // Removido defineConfig para simplificar
  { files: ["** / *.{js,mjs,cjs,ts}"] }, // Pode ser redundante se coberto abaixo
  {
    files: ["** / *.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node }
  },
  // js.configs.recommended é um objeto, precisa ser espalhado ou usado como está
  js.configs.recommended,
  // tseslint.configs.recommended é um array, precisa ser espalhado
  ...tseslint.configs.recommended,
  // Adicione suas configurações específicas aqui, se houver
  // ...

  // Configuração do Prettier (DEVE SER A ÚLTIMA!!)
  prettierConfig,
];
*/
