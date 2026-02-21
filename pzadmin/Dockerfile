# 使用nginx镜像直接部署静态文件（最快方式）
FROM nginx:alpine

# 删除nginx默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 创建新的nginx配置
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 复制打包后的文件
COPY dist /usr/share/nginx/html

EXPOSE 80