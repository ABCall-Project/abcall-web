class BaseBuilder<T> {
  element: T;
  constructor() {
    this.element = {} as T;
  }

  build(): T {
      return this.element;
  }

  withParam(property: string, value: any) {
    const key = property as keyof T;
    this.element[key] = value;
    return this;
  }
}

export default BaseBuilder;
