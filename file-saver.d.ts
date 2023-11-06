declare module "file-saver" {
  const saveAs: {
    (data: Blob, filename: string, options?: object): void;
  };
  export default saveAs;
}
