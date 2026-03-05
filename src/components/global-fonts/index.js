import { createGlobalStyle } from 'styled-components';
import constants from '@Src/common/constants';

// @ts-ignore
const GlobalFonts = createGlobalStyle`
    @font-face {
        font-family: 'Noto Sans SC';
        src: url(${constants.STATIC_PATH}/fonts/SourceHanSansCN-Normal.ttf);
    }
    @font-face {
        font-family: 'DIN-Regular';
        src: url(${constants.STATIC_PATH}/fonts/DIN-Regular.otf);
    }
    @font-face {
        font-family: 'HYQiHei';
        src: url(${constants.STATIC_PATH}/fonts/HYQiHei.ttf);
    }
`;

export default GlobalFonts;
