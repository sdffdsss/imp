echo 切换到OSS源
nrm add oss http://1.95.13.67:4873/
nrm current
nrm use oss
nrm current

echo 安装新版本流水窗，版本在下面输入
echo 历史版本-yarn add oss-alarm-window@1.4.287-unicom
echo yarn add oss-alarm-window@1.4.288-unicom
echo yarn add oss-alarm-window@1.4.289-unicom
echo yarn add oss-alarm-window@1.4.298-unicom
yarn add oss-alarm-window@1.4.318-unicom

cp -rf node_modules/oss-alarm-window/es/* src/components/oss-alarm-window/es

echo 切换到NPM源
nrm use npm
yarn remove oss-alarm-window
yarn install

