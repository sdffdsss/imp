import { Enums } from 'oss-web-common';
// import { rebuild as rebuildEnums } from './enums';
import common from './common.js';
var rebuildEnums = Enums.rebuild;
var enumsContainer = Object.assign({}, common);
rebuildEnums.call(enumsContainer);
export default enumsContainer;