# 陪诊医疗系统 - 全栈项目(前端部分)

## 📋 项目简介
一个完整的陪诊服务医疗系统，包含后台管理端和H5用户端，实现陪护员管理、订单流转、用户下单等核心功能。

## 🏗️ 技术栈
- **前端框架**：Vue 3
- **构建工具**：Vite
- **状态管理**：Vuex
- **容器化部署**：Docker + Nginx
```
## 📁 项目结构
CompanionMedicalSystem/
├── pzadmin/                 # 后台管理端
│   ├── src/
│   │   ├── views/           # 页面
│   │   ├── components/      # 组件
│   │   ├── store/           # Vuex状态
│   │   └── router/          # 路由配置
│   ├── public/              # 图片资源
│   ├── Dockerfile           # 后台Docker配置
│   └── package.json
│
├── pzh5/                    # H5用户端
│   ├── src/
│   │   ├── pages/           # 页面（首页、下单、订单列表、个人中心等）
│   │   ├── components/      # 组件
│   │   ├── router/          # 路由配置
│   │   └── store/           # Vuex状态
│   ├── public/              # 图片资源
│   ├── Dockerfile           # H5 Docker配置
│   └── package.json
│
└──docker-compose.yml       # Docker编排配置


## ✨ 功能特性

### 后台管理端 (`/pzadmin`)
- **权限管理**：多角色权限控制（管理员、陪护员）
- **陪护员管理**：增删改查、资质审核
- **订单管理**：订单状态流转（待接单-进行中-已完成-已取消）
- **数据统计**：订单量、收入统计

### H5用户端 (`/pzh5`)
- **首页**：服务介绍、医院推荐
- **预约下单**：
  - 选择服务时间
  - 选择服务地点（医院/社区）
  - 选择陪护员
  - 在线支付
- **订单跟踪**：实时查看订单状态
- **个人中心**：历史订单、个人信息

## 🚀 快速开始

### 本地开发
```bash
# 后台管理
cd pzadmin
npm install
npm run dev

# H5端
cd pzh5
npm install
npm run dev
```

### Docker部署
```bash

# 访问地址
# 后台管理: http://localhost:8080
# H5用户端: http://localhost:8081
```

## 📦 部署命令
```bash
# 手动部署
docker-compose down
docker-compose up -d --build

# 查看运行状态
docker-compose ps
docker-compose logs -f
```

## 🛠️ 环境要求
- Node.js 16+
- Docker & Docker Compose
- npm 或 yarn

## 📝 订单状态流转
待接单 → 已接单 → 服务中 → 已完成
   ↓         
  取消 

## 📧 联系方式
黄佳馨
Telephone: 15169066946
Email: Huangjiaxin669499@163.com
哈尔滨工业大学（威海）