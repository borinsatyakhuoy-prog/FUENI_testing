import { defineConfig } from 'allure';

export default defineConfig({
  name: 'FUENI (Patient) QA Report',
  output: './allure-report',
  historyPath: './allure-history/history.jsonl',
  plugins: {
    awesome: {
      options: {
        reportName: 'FUENI (Patient) QA Report',
        singleFile: false,
        reportLanguage: 'en',
      },
    },
  },
});
