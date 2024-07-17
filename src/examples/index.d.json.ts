type ExampleFile = {
  filename: string;
  content: string;
};

type Example = {
  title: string;
  files: Array<ExampleFile>;
};

declare const examples: Array<Example>;
export default examples;
