# <p align="center"> 🌐 AI 翻译大师 🚀✨</p>

<p align="center">AI翻译大师通过大语言模型在全世界各种语言之间进行高质量的翻译，还可以自定义各种不同的翻译风格，例如专业、活泼、简洁、艺术等风格，还支持总结、润色、修改等功能</p>

<p align="center"><a href="https://302.ai/product/detail/ai-translate-master" target="blank"><img src="https://file.302.ai/gpt/imgs/github/20250102/72a57c4263944b73bf521830878ae39a.png" /></a></p >

<p align="center"><a href="README_zh.md">中文</a> | <a href="README.md">English</a> | <a href="README_ja.md">日本語</a></p>

![](docs/302_AI_Master_Translator.png)

来自[302.AI](https://302.ai)的[AI 翻译大师](https://302.ai/product/detail/ai-translate-master)的开源版本。你可以直接登录302.AI，零代码零配置使用在线版本。或者对本项目根据自己的需求进行修改，传入302.AI的API KEY，自行部署。

## 界面预览
通过大语言模型在全世界各种语言之间进行高质量的翻译，提供总结、润色、修正等辅助功能，还可以自定义各种不同的翻译风格
![](docs/302_AI_Master_Translator_screenshot.png)          
 
## 项目特性
### 🌐 覆盖全球多语言
支持世界主流语言的高质量互译，满足各种跨语言场景。
### ✨ 翻译风格多样化
可自由选择专业、活泼、简洁、艺术等多种翻译风格，并持续丰富。
### 📝 智能文本辅助
内置智能总结、润色、修正等多项辅助功能，提升文本质量。
### ⚡ 极速体验
界面极简，操作便捷，即刻享受AI高效翻译。
### 📜 历史记录与管理
自动记录翻译历史，便于查询、管理及后续复用。
### 🌍 多语言界面支持
  - 中文界面
  - English Interface
  - 日本語インターフェース

## 🚩 未来更新计划
- [ ] 新增更多翻译风格和应用场景（如学术、法律、商务等）
- [ ] 增强文本辅助功能（如语气调整、摘要生成等）

## 🛠️ 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI组件**: Radix UI
- **状态管理**: Jotai
- **表单处理**: React Hook Form
- **HTTP客户端**: ky
- **国际化**: next-intl
- **主题**: next-themes
- **代码规范**: ESLint, Prettier
- **提交规范**: Husky, Commitlint

## 开发&部署
1. 克隆项目
```bash
git clone https://github.com/302ai/302_ai_translater
cd 302_ai_translater
```

2. 安装依赖
```bash
pnpm install
```

3. 环境配置
```bash
cp .env.example .env.local
```
根据需要修改 `.env.local` 中的环境变量。

4. 启动开发服务器
```bash
pnpm dev
```

5. 构建生产版本
```bash
pnpm build
pnpm start
```

## ✨ 302.AI介绍 ✨
[302.AI](https://302.ai)是一个按需付费的AI应用平台，为用户解决AI用于实践的最后一公里问题。
1. 🧠 集合了最新最全的AI能力和品牌，包括但不限于语言模型、图像模型、声音模型、视频模型。
2. 🚀 在基础模型上进行深度应用开发，我们开发真正的AI产品，而不是简单的对话机器人
3. 💰 零月费，所有功能按需付费，全面开放，做到真正的门槛低，上限高。
4. 🛠 功能强大的管理后台，面向团队和中小企业，一人管理，多人使用。
5. 🔗 所有AI能力均提供API接入，所有工具开源可自行定制（进行中）。
6. 💡 强大的开发团队，每周推出2-3个新应用，产品每日更新。有兴趣加入的开发者也欢迎联系我们