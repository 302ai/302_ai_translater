#定义使用node 20.9.0版本的基础镜像
FROM node:20.9.0

#在容器中创建工作目录
WORKDIR /usr/src/app

#复制 package.json 以及 package-lock.json 文件到工作目录
COPY package*.json ./

#安装项目依赖
RUN npm install

#编译打包应用
RUN npm run build

#打开服务器访问端口
EXPOSE 3000

#复制所有文件到工作⚙️目录（除了 .dockerignore 排除的路径）
COPY . .

# 启动服务命令 
CMD [ "npm", "start" ]