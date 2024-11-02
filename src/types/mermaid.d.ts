declare module 'mermaid' {
  const mermaid: {
    initialize: (config: any) => void;
    contentLoaded: () => void;
  };
  export default mermaid;
}
