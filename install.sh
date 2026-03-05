node -v
npm -v
yarn -v
npm config list
yarn config list

# npm cache clean --force
# yarn cache clean --force
yarn config set ignore-engines true

sed -i 's#https://registry.npmjs.org/#http://172.24.128.160:18087/repository/npm_public_group/#' yarn.lock

yarn install