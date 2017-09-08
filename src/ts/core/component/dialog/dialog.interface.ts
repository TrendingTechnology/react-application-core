import { FunctionT } from 'core/util';
import { INativeMaterialComponent } from 'core/component/material';
import { IBaseComponent, IBaseComponentInternalProps } from 'core/component/base';

export interface INativeMaterialDialogComponent extends INativeMaterialComponent {
  show(): void;
  listen(type: string, callback: FunctionT);
}

export interface IDialog<TInternalProps extends IDialogInternalProps, TInternalState>
    extends IBaseComponent<TInternalProps, TInternalState> {
  activate(): void;
}

export interface IDialogInternalProps extends  IBaseComponentInternalProps {
  title?: string;
  message?: string;
  closeMessage?: string;
  acceptMessage?: string;
  canClose?: boolean;
  canAccept?: boolean;
  onAccept?(): void;
  onClose?(): void;
}
