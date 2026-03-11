const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// 1. Tìm đường dẫn đến thư mục gốc (Root) của Monorepo
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 2. Ép Metro theo dõi toàn bộ các file trong Monorepo (để thấy @agri-scan/shared)
config.watchFolders = [workspaceRoot];

// 3. Giúp Metro tìm đúng thư viện node_modules ở cả thư mục mobile và thư mục gốc
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 4. Cấu hình quan trọng cho pnpm: Giúp xử lý các liên kết ảo (symlinks)
config.resolver.disableHierarchicalLookup = true;

module.exports = config;