import getPathParameter from './getPathParameter';

let { version = '' } = getPathParameter(window.location.href);
version = version === '' ? '' : `_${version}`;
export default version;
