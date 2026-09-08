declare module "jsoneditor" {
  export interface JSONEditorOptions {
    mode?: string;
    modes?: string[];
    onChange?: () => void;
  }

  export default class JSONEditor {
    constructor(container: HTMLElement, options?: JSONEditorOptions);
    get(): unknown;
    set(value: unknown): void;
    update(value: unknown): void;
    destroy(): void;
  }
}
