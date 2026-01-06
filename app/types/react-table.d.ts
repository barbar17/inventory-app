import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    print?: (value: any) => string;
    printHeader?: string;
  }
}
