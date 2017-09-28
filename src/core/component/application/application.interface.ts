import { PureComponent } from 'react';

import { IBaseContainerInternalProps, IContainerInternalProps } from '../../component/base';

export interface IApplicationContainerProps extends IBaseContainerInternalProps {
  basename: string;
}

export interface IContainerWrapperCtor {
  new(...args): PureComponent<IContainerInternalProps, {}>;
}
