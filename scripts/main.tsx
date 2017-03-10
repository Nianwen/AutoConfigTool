import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DataService} from "scripts/DataService"

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
            return <input type="text" value={this.props.value} placeholder={this.props.placeholderText} disabled/>
        }
        else {
            var onChange = (event: any) => {
                this.props.onChange(event.target.value);
            };
            var invalidClassName = this.props.isValid ? "" : TextBox.INVALID_CLASS;
            return <input type="text" value={this.props.value} onChange={onChange} className={invalidClassName} placeholder={this.props.placeholderText} />
        }
    }
}

export class MultilineTextBox extends React.Component<ITextBoxComponentProps, ITextBoxState> {
    public static INVALID_CLASS = "invalid";
    public static INPUT_ERROR_TIP_CLASS = "input-error-tip";

    public render(): JSX.Element {
        let errorMessage: JSX.Element = (this.props.isValid == null) || this.props.isValid ? null : <div className={TextBox.INPUT_ERROR_TIP_CLASS} hidden={ this.props.isValid }>{ this.props.errorMessage }</div>;

        return <div className={this.props.className}>
            <fieldset style={this.props.style}>
                <label htmlFor={this.props.id}>{this.props.label}</label>
                {this._renderTextArea()}
            </fieldset>
            {errorMessage}
        </div>;
    }

    private _renderTextArea(): JSX.Element {
        
        if (this.props.disabled) {
            return <textarea style={{ resize: "none" }} value={this.props.value} placeholder={this.props.placeholderText} disabled/>
        }
        else {
            var onChange = (event: any) => {
                this.props.onChange(event.target.value);
            };
            var invalidClassName = this.props.isValid ? "" : TextBox.INVALID_CLASS;
            return <textarea style={{ resize: "none" }} value={this.props.value} onChange={onChange} className={invalidClassName} placeholder={this.props.placeholderText} />
        }
    }
} 

export interface ButtonProps extends React.Props<any> {
    text?: string;
    cssClass?: string;
    onClick?: React.EventHandler<React.MouseEvent>;
}

export interface State {
}

export class ButtonComponent extends React.Component<ButtonProps, State> {
    public render(): JSX.Element {
        let className: string = this.props.cssClass || "";
        let icon: JSX.Element = null;
        return <button type="button" className={ this.props.cssClass } onClick={ this.props.onClick }>{ this.props.text }</button>;
    }
}

export interface AutoConfigToolProps {
}

export interface AutoConfigToolState {
    name: string;
    scaleUnit: string;
    service: string;
    milestore: string;
    operation: string;
    content: string;
}

export class AutoConfigTool extends React.Component<void, AutoConfigToolState> {
    constructor() {
        super();
        this.state = { name:"", scaleUnit: "", service: "", milestore:"", operation:"", content: ""};
    }
    public render(): JSX.Element {
        return <div>
            <TextBox id="name" label="Name" value={this.state.name} onChange={this._onNameChange}/>
            <TextBox id="scaleUnit" label="ScaleUnit" value={this.state.scaleUnit} onChange={this._onScaleUnitChange}/>
            <TextBox id="service" label="Service" value={this.state.service} onChange={this._onServiceChange}/>
            <TextBox id="milestore" label="Milestore" value={this.state.milestore} onChange={this._onMilestoneChange}/>
            <TextBox id="operation" label="Operation" value={this.state.operation} onChange={this._onOperationChange}/>
            <MultilineTextBox id="content" label="Content" value={this.state.content} onChange={this._onContentChange}/>
            <ButtonComponent cssClass="createButton" onClick={this._onCreateButtonClick} text="Create"/>
        </div>
        
    }
    private _onNameChange = (value: string) => {
        this.setState({name: value} as AutoConfigToolState);
    };
    private _onScaleUnitChange = (value: string) => {
        this.setState({scaleUnit: value} as AutoConfigToolState);
    };
    private _onServiceChange = (value: string) => {
        this.setState({service: value} as AutoConfigToolState);
    };
    private _onMilestoneChange = (value: string) => {
        this.setState({milestore: value} as AutoConfigToolState);
    };
    private _onOperationChange = (value: string) => {
        this.setState({operation: value} as AutoConfigToolState);
    };
    private _onContentChange = (value: string) => {
        this.setState({content: value} as AutoConfigToolState);
    };
    private _onCreateButtonClick = () => {
        console.log(JSON.stringify(this.state));
        var dataService = new DataService();
        dataService.createPR(this.state.service, this.state.milestore, this.state.name);
    };
}

ReactDOM.render(<AutoConfigTool />, document.getElementById("main-container"));

