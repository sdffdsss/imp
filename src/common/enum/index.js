import { Enums } from 'oss-web-common';
// import { rebuild as rebuildEnums } from './enums';
import common from './common.js';
import Filter from './filter.js';
import AlarmWindow from './alarm-window.js';

const { rebuild: rebuildEnums } = Enums;

const enumsContainer = { ...common, ...Filter, ...AlarmWindow};
rebuildEnums.call(enumsContainer);

export default enumsContainer;
