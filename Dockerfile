FROM zhongyuan-registry.cucloud.cn/znjk/nginx:1.23.1
ENV TZ=Asia/Shanghai
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8
COPY ./build/ /usr/share/nginx/html/oss-imp-unicom-new/build