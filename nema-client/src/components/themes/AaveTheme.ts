// styles/GlobalStyle.ts
import { createGlobalStyle } from 'styled-components';

const AaveStyle = createGlobalStyle`
  :root {
    --primary-color: rgb(46, 186, 198);
    --bg-color: rgb(27, 32, 48);
    --text-color: #f1f1f3;
    --link-color: #f1f1f3;
    --heading-color: #f1f1f3;
    --border-color: #d1d5da;
    --header-bg: rgb(56, 61, 81);
    --block-bg: rgb(56, 61, 81);
  }
`;

export default AaveStyle;
