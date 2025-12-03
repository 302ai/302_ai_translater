module.exports = {
  apps: [
    {
      name: 'AI-Translator-Test',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};