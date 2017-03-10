import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface ITextBoxComponentProps extends React.Props<void> {
    /**
     * id for the control.
     */
    id: string;
    /**
     * Label for the input box.
     */
    label: string;
    /**
     * Value in the input box.
     */
    value: string;
    /**
     * Change handler of the input box.
     */
    onChange?: (value: string) => void;
    /**
     * class name for the control.
     */
    className?: string;
    /**
     * Flag indicate if the control is valid. If not set, default to true.
     */
    isValid?: boolean;
    /**
     * Error message to display.
     */
    errorMessage?: JSX.Element;
    /**
     * dynamic style for the control.
     */
    style?: Object;
    /**
     * Placeholder text shown on input.
     */
    placeholderText?: string;
    /**
     * disabled the control or not.
     */
    disabled?: boolean;
}

export interface ITextBoxState {
}

export class TextBox extends React.Component<ITextBoxComponentProps, ITextBoxState> {
    public static INVALID_CLASS = "invalid";
    public static INPUT_ERROR_TIP_CLASS = "input-error-tip";

    public render(): JSX.Element {
        let errorMessage: JSX.Element = (this.props.isValid == null) || this.props.isValid ? null : <div className={TextBox.INPUT_ERROR_TIP_CLASS} hidden={ this.props.isValid }>{ this.props.errorMessage }</div>;

        return <div className={this.props.className}>
            <fieldset style={this.props.style}>
                <label htmlFor={this.props.id}>{this.props.label}</label>
                {this._renderInput()}
            </fieldset>
            {errorMessage}
        </div>;
    }

    private _renderInput(): JSX.Element {
        
        if (this.props.disabled) {
            return <input type="text" id={this.props.id} value={this.props.value} placeholder={this.props.placeholderText} disabled/>
        }
        else {
            var onChange = (event: any) => {
                this.props.onChange(event.target.value);
            };
            var invalidClassName = this.props.isValid ? "" : TextBox.INVALID_CLASS;
            return <input type="text" id={this.props.id} value={this.props.value} onChange={onChange} className={invalidClassName} placeholder={this.props.placeholderText} />
        }
    }
}

ReactDOM.render(<TextBox id="name" label="Name" value=""/>, document.getElementById("main-container"));

