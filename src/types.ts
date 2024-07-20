export type File = {
  filename: string;
  content: string;
};

export type Example = {
  title: string;
  files: Array<File>;
};
