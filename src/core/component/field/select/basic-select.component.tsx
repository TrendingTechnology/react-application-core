import * as React from 'react';
import * as R from 'ramda';
import { LoggerFactory } from 'ts-smart-logger';

import { toClassName } from '../../../util';
import { BasicTextField, IBasicTextFieldAction } from '../../field/textfield';
import { Menu, IMenu } from '../../menu';
import {
  AnyT,
  BasicEventT,
  EntityIdT,
  KeyboardEventT,
} from '../../../definition.interface';
import {
  IBasicSelectInternalProps,
  IBasicSelectInternalState,
  ISelectOption,
  SelectOptionT,
} from './basic-select.interface';

export class BasicSelect<TComponent extends BasicSelect<TComponent, TInternalProps, TInternalState>,
                         TInternalProps extends IBasicSelectInternalProps,
                         TInternalState extends IBasicSelectInternalState>
    extends BasicTextField<TComponent,
                           TInternalProps,
                           TInternalState> {

  private static logger = LoggerFactory.makeLogger(BasicSelect);

  constructor(props: TInternalProps) {
    super(props);
    this.onSelect = this.onSelect.bind(this);

    this.defaultActions = R.insert<IBasicTextFieldAction>(0,
        {
          type: 'arrow_drop_down',
          actionHandler: (event: BasicEventT) => {
            this.setFocus();
            this.openMenu(event);
          },
        },
        this.defaultActions
    );
  }

  public componentWillReceiveProps(nextProps: Readonly<TInternalProps>, nextContext: AnyT): void {
    super.componentWillReceiveProps(nextProps, nextContext);

    if (!R.isNil(nextProps.options)
        && !R.equals(this.props.options, nextProps.options)) {
      this.setState({ emptyOptions: false });

      if (this.hasInputFocus) {
        this.showMenu(nextProps.options);

        if (this.props.onOptionsLoad) {
          this.props.onOptionsLoad(nextProps.options);
        }
      }
    }
  }

  public onKeyDown(event: KeyboardEventT): void {
    super.onKeyDown(event);
    this.stopEvent(event);
  }

  public onKeyBackspace(event: KeyboardEventT): void {
    super.onKeyBackspace(event);
    this.clearValue();
  }

  public onKeyEnter(event: KeyboardEventT): void {
    super.onKeyEnter(event);
    this.openMenu(event);
  }

  public onKeyEscape(event: KeyboardEventT): void {
    super.onKeyEscape(event);

    if (this.menu.opened) {
      this.hideMenu();
    }
  }

  public get progress(): boolean {
    return this.state.emptyOptions;
  }

  protected onClick(event: BasicEventT): void {
    super.onClick(event);
    this.openMenu(event);
  }

  protected getComponentAttachment(): JSX.Element {
    const props = this.props;
    return (
        <Menu ref='menu'
              renderer={props.renderer}
              options={this.toFilteredOptions(this.options)}
              onSelect={this.onSelect}
              {...props.menuOptions}/>
    );
  }

  protected getFieldComponentWrapperClassName(): string {
    return toClassName(
        super.getFieldComponentWrapperClassName(),
        'rac-flex-column'  // inner popup menu - width 100%
    );
  }

  protected toFilteredOptions(options: SelectOptionT[]): SelectOptionT[] {
    return options;
  }

  protected getEmptyValue(): AnyT {
    return this.applicationSettings.entityEmptyId;
  }

  protected get options(): SelectOptionT[] {
    return this.props.options || [];
  }

  protected onSelect(option: SelectOptionT): void {
    this.onChangeManually(option.value);

    if (this.props.onSelect) {
      this.props.onSelect(option);
    }
  }

  protected toDisplayValue(value: AnyT): EntityIdT {
    const selectedItem = this.getSelectedOption(value);
    return selectedItem
        ? (selectedItem.label ? this.t(selectedItem.label) : selectedItem.value)
        : super.toDisplayValue(value);
  }

  private getSelectedOption(value: AnyT): SelectOptionT {
    return R.find<SelectOptionT>((option) => option.value === value, this.options);
  }

  private get menu(): IMenu {
    return this.refs.menu as IMenu;
  }

  private openMenu(event: BasicEventT): void {
    if (this.menu.opened) {
      return;
    }
    this.stopEvent(event);

    const props = this.props;
    const noOptionsAvailable = R.isNil(props.options);

    if (props.forceAll || noOptionsAvailable) {
      if (props.onEmptyDictionary) {
        this.setState({ emptyOptions: true });

        if (props.onEmptyDictionary) {
          props.onEmptyDictionary();
        }
      } else if (!noOptionsAvailable) {
        this.showMenu();
      }
    } else {
      this.showMenu();
    }
  }

  private showMenu(options?: SelectOptionT[]): void {
    const filteredOptions = this.toFilteredOptions(options);
    if (filteredOptions.length) {
      this.input.blur();  // https://github.com/material-components/material-components-web/issues/1977
      this.menu.show();
    } else {
      BasicSelect.logger.debug('[$BasicSelect][showMenu] The options are empty. The menu does not show.');
    }
  }

  private hideMenu(): void {
    this.menu.hide();
  }
}
