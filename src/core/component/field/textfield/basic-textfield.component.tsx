import * as React from 'react';
import MaskedTextInput from 'react-text-mask';
import { MDCTextfield } from '@material/textfield';

import { noop, toClassName, uuid } from '../../../util';
import { AnyT, IKeyValue, ChangeEventT, BasicEventT } from '../../../definition.interface';

import { Field, IField } from '../field';
import {
  IBasicTextFieldInternalState,
  IBasicTextFieldInternalProps,
  IBasicTextField,
  INativeMaterialBasicTextFieldComponent,
  IBasicTextFieldAction,
  ActionPositionEnum,
} from './basic-textfield.interface';

export class BasicTextField<TComponent extends IField<TInternalProps, TInternalState, ChangeEventT>,
                            TInternalProps extends IBasicTextFieldInternalProps,
                            TInternalState extends IBasicTextFieldInternalState,
                            TNativeMaterialComponent extends INativeMaterialBasicTextFieldComponent>
    extends Field<TComponent,
                  TInternalProps,
                  TInternalState,
                  TNativeMaterialComponent,
                  ChangeEventT>
    implements IBasicTextField<TInternalProps, TInternalState> {

  private static CHAR_WIDTH_AT_PX = 10;

  protected defaultAction: IBasicTextFieldAction;

  constructor(props: TInternalProps) {
    super(props, MDCTextfield);
  }

  public render(): JSX.Element {
    const props = this.props;
    const error = this.error;
    const isFocused = props.autoFocus || this.isValuePresent;

    const prepareStyles = this.context.muiTheme
        ? this.context.muiTheme.prepareStyles
        : (styles) => styles;

    const actionsTpl = this.actions
        ? (
            this.actions.map((action) => (
                <button key={uuid()}
                        disabled={action.disabled === false
                            ? false : (action.disabled || this.isDeactivated)}
                        title={action.title && this.t(action.title)}
                        className={
                          toClassName('material-icons', 'mdc-toolbar__icon', 'app-action', action.className)
                        }
                        onClick={(event: BasicEventT) => {
                          if (action.actionHandler) {
                            this.stopEvent(event);
                            action.actionHandler(event);
                          }
                        }}>
                  {action.type}
                </button>
            ))
        )
        : null;

    return (
        <div className='app-text-field-wrapper'
             style={prepareStyles({...props.wrapperStyle as {}})}>
          <div ref='self'
               style={props.style}
               className={toClassName(
                   'mdc-text-field',
                   'mdc-text-field--upgraded',
                   'app-text-field',
                   props.className,
                   this.isDeactivated && 'app-text-field-deactivated',
                   isFocused && 'mdc-text-field--focused',
                   props.prefixLabel && 'app-text-field-prefixed'
                   )}>
            {
              props.prefixLabel
                  ? (
                      <span className='app-text-field-prefix'>{props.prefixLabel}</span>
                  )
                  : null
            }
            {this.getComponent()}
            <label style={{paddingLeft: props.prefixLabel
                  ? (props.prefixLabel.length * BasicTextField.CHAR_WIDTH_AT_PX) + 'px'
                  : undefined}}
                   className={
                     toClassName('mdc-text-field__label', isFocused && 'mdc-text-field__label--float-above')
                   }>
              {props.label ? this.t(props.label) : props.children}
            </label>
            {actionsTpl}
            {this.isLoaderShowed ? <div className='material-icons app-text-field-loader'>timelapse</div> : null}
          </div>
          {this.getMessage(props.message, false)}
          {this.getMessage(error, !props.notErrorMessageRequired)}
          {this.getAttachment()}
        </div>
    );
  }

  public resetError(): void {
    super.resetError();
    this.nativeMdcInstance.getDefaultFoundation().setValid(true);
  }

  protected getComponentProps(): IKeyValue {
    const props = this.props;
    const autoFocus = props.autoFocus;
    const name = props.name;
    const type = props.type || 'text';
    const autoComplete = props.autoComplete || 'new-password';
    const readOnly = props.readOnly;
    const mask = props.mask;
    const pattern = props.pattern;
    const required = props.required;
    const minLength = props.minLength;
    const maxLength = props.maxLength;
    const onFocus = this.onFocus;
    const onBlur = this.onBlur;
    const onClick = this.isDeactivated ? noop : this.onClick;
    const onChange = this.onChange;
    const onKeyDown = this.onKeyDown;
    const onKeyUp = this.onKeyUp;
    return {
      name, type, autoFocus, readOnly, mask, pattern, required, minLength, maxLength,
      onFocus, onBlur, onClick, onChange, onKeyDown, onKeyUp, autoComplete,
      ref: 'input',
      value: this.value,
      className: 'mdc-text-field__input',
      placeholder: props.placeholder ? this.t(props.placeholder) : null,
    };
  }

  protected getComponent(): JSX.Element {
    const componentProps = this.getComponentProps();
    return componentProps.mask
        ? <MaskedTextInput guide={false}
                           {...componentProps}/>
        : <input {...componentProps}/>;
  }

  protected getAttachment(): JSX.Element {
    return null;
  }

  protected getEmptyValue(): string {
    return '';
  }

  protected getRawValueFromEvent(event: ChangeEventT): AnyT {
    return event.target.value;
  }

  protected get actions(): IBasicTextFieldAction[] {
    const props = this.props;
    if (props.actionsPosition === ActionPositionEnum.LEFT) {
      return (this.defaultAction ? [this.defaultAction] : []).concat(props.actions || []);
    } else {
      return (this.props.actions || []).concat(this.defaultAction || []);
    }
  }

  protected cleanNativeInputForSupportHTML5Validation(): void {
    this.input.value = '';  // We should reset the field manually before HTML5 validation will be called
  }

  protected get isLoaderShowed(): boolean {
    return false;
  }

  private getMessage(m: string, required: boolean): JSX.Element {
    return m || required ? (
        <p title={m}
           className={toClassName(
               'mdc-text-field-helptext',
               'mdc-text-field-helptext--persistent',
               required && 'mdc-text-field-helptext--validation-msg'
           )}>
          {m ? this.t(m) : '\u00a0'}
        </p>
    ) : null;
  }
}
