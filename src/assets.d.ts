// FIXME: why does it require an asterisk in module path
// to make this declaration work?
declare module "*/examples/index.json" {
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
}
