import { MDCRipple } from '@material/ripple';

import { MaterialComponent } from 'core/component/material';

import {
  INativeMaterialRippleComponent,
  IRippleInternalProps,
} from './ripple.interface';

export class Ripple<TInternalProps extends IRippleInternalProps>
    extends MaterialComponent<Ripple<TInternalProps>,
                              TInternalProps,
                              {},
                              INativeMaterialRippleComponent> {

  constructor(props: TInternalProps) {
    super(props, MDCRipple);
  }

  public componentDidMount(): void {
    super.componentDidMount();

    if (this.props.activated) {
      this.nativeMdcInstance.activate();
    }
  }
}