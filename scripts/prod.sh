#!/bin/bash

# 服务器连接信息
SERVER_IP="120.48.27.201"  # 请替换为实际服务器IP
USERNAME="root"
PASSWORD="qwerDF123^"
REMOTE_DIR="/root/workspace/kids-code-api"

# 检查sshpass是否安装
check_dependencies() {
    if ! command -v sshpass &> /dev/null; then
        echo "错误：sshpass未安装，请先安装："
        echo "Ubuntu/Debian: sudo apt-get install sshpass"
        echo "CentOS/RHEL: sudo yum install sshpass"
        echo "MacOS: brew install hudochenkov/sshpass/sshpass"
        exit 1
    fi
}

# 自动部署函数
auto_deploy() {
    echo "正在连接到服务器 $SERVER_IP..."
    
    # 使用sshpass处理密码登录
    sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 $USERNAME@$SERVERIP << 'ENDSSH'
        cd "$REMOTE_DIR" || { echo "无法进入目录 $REMOTE_DIR"; exit 1; }
        
        echo "正在执行git pull..."
        git pull || { echo "git pull失败"; exit 1; }
        
        echo "正在安装依赖..."
        npm install || { echo "npm install失败"; exit 1; }
        
        echo "停止应用..."
        npm stop || echo "停止应用时出现警告(可能应用未运行)"
        
        echo "启动应用..."
        npm start || { echo "启动应用失败"; exit 1; }
        
        echo "所有命令执行完成!"
ENDSSH
}

# 主执行流程
check_dependencies
echo "开始自动部署流程..."
auto_deploy
echo "自动部署完成!"
