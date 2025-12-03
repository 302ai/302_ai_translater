module.exports = {
  apps: [
    {
      name: 'AI-Translator',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3005', //3005是我们希望nextjs程序运行的端口号，你也可以修改为其他端口号
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};