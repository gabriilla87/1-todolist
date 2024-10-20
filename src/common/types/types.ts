export type TestAction<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">;

export type CommonResponse<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};
