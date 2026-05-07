# 2FA-Auth-Lite - 浏览器扩展

[English](./README.md)

适用于 Chrome、Edge 及其他基于 Chromium 的浏览器。

## 安装

### 从商店安装

- [**Edge 扩展商店**](https://microsoftedge.microsoft.com/addons/detail/mlgkegmodaokoabknaehdahemdiebejg)

- [**FireFox 扩展商店**](https://addons.mozilla.org/zh-CN/firefox/addon/2fa-auth-lite/)
  
### 从 GitHub Releases 安装

1. 访问 [Releases 页面](https://github.com/suolk/2FA-Auth-Lite/releases/tag/v1.0.0)
2. 下载 `2FA-Auth-Lite.zip`
3. 打开浏览器扩展页面：
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
4. 启用**开发者模式**
5. 将解压后的 zip 文件夹拖入页面，或点击**加载已解压的扩展程序**并选择解压后的文件夹

## 使用方法

### 添加账户

1. 点击浏览器工具栏中的扩展图标
2. 点击右上角的 **+** 按钮
3. 选择以下任一方式：

#### 方式 A：上传二维码图片
- 点击**上传二维码**按钮
- 选择包含二维码的截图或图片
- 密钥将自动提取

#### 方式 B：手动输入
- 粘贴**密钥**（服务提供的 Base32 字符串）

### 生成验证码

- 验证码每 30 秒自动刷新
- 点击任意验证码即可**复制到剪贴板**
- 进度条显示刷新倒计时

### 语言切换

点击右上角的语言切换按钮在中文和 English 之间切换。

## 权限说明

- `storage` - 本地保存账户数据
- `clipboardWrite` - 复制验证码到剪贴板
- `activeTab` - （可选）在网站上截屏

## 数据存储

所有数据通过 `chrome.storage.local` **本地存储**在浏览器中，不会发送到任何外部服务器。

## 常见问题

### 验证码无法使用
- 检查系统时钟是否准确
- 确认密钥输入正确
- 部分服务使用非标准 TOTP 参数（暂不支持）
