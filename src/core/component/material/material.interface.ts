import { ReactInstance } from 'react';

import { FunctionT } from '../../util';
import { IKeyValue } from '../../definition.interface';

export interface IMaterialComponentFactory<TNativeMaterialComponent extends INativeMaterialComponent> {
  attachTo(el: ReactInstance): TNativeMaterialComponent;
}

export interface INativeMaterialComponent {
  listen(type: string, callback: FunctionT);
  unlisten(type: string, callback: FunctionT);
  destroy(): void;
  getDefaultFoundation(): INativeMaterialDefaultFoundation;
}

export interface INativeMaterialDefaultFoundation extends IKeyValue {
  adapter_: IKeyValue;
}
