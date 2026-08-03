interface CommonProps {
  className?: string;
  id?: string;
  onClick?: (e: MouseEvent) => void;
  [key: string]: any; 
}

declare namespace JSX {
  interface IntrinsicElements {
    div: CommonProps;
    h1: CommonProps;
    p: CommonProps;
    li: CommonProps;
    ul: CommonProps;
    [elemName: string]: any; 
  }
}