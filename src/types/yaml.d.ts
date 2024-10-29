declare module '*.yml' {
  const content: any
  export default content
}

declare module '*.yaml' {
  const content: any
  export default content
}
declare module '*.yml?raw' {
  const content: string;
  export default content;
}
