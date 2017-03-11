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
            return <textarea value={this.props.value} onChange={onChange} className={invalidClassName} placeholder={this.props.placeholderText} />
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
    milestone: string;
    operation: string;
    content: string;
    contentCustomized?: boolean;
}

export enum OperationType {
    TurnFeatureFlagOn,
    TurnFeatureFlagOff,
    RunSQLScript
}

export class AutoConfigTool extends React.Component<void, AutoConfigToolState> {
    private _dataService: DataService;

    constructor() {
        super();
        this._dataService = new DataService();
        this.state = { name:"", scaleUnit: "", service: "", milestone:"", operation: OperationType[OperationType.TurnFeatureFlagOn], content: ""};
    }
    public render(): JSX.Element {
        return <div>
            <TextBox id="name" label="Name" value={this.state.name} onChange={this._onNameChange}/>
            <TextBox id="scaleUnit" label="ScaleUnit" value={this.state.scaleUnit} onChange={this._onScaleUnitChange}/>
            <TextBox id="service" label="Service" value={this.state.service} onChange={this._onServiceChange}/>
            <TextBox id="milestore" label="Milestore" value={this.state.milestone} onChange={this._onMilestoneChange}/>
            <select id="operation" label="Operation" value={this.state.operation} onChange={this._onOperationChange}>
                    <option value={OperationType[OperationType.TurnFeatureFlagOn]}>TurnFeatureFlagOn</option>
                    <option value={OperationType[OperationType.TurnFeatureFlagOff]}>TurnFeatureFlagOff</option>
                    <option value={OperationType[OperationType.RunSQLScript]}>RunSQLScript</option>
            </select>
            <MultilineTextBox id="content" label="Content" value={this.state.content} onChange={this._onContentChange}/>
            <ButtonComponent cssClass="createButton" onClick={this._onCreateButtonClick} text="Create"/>
        </div>
        
    }
    private _onNameChange = (value: string) => {
        this.setState({name: value} as AutoConfigToolState);
    };
    private _onScaleUnitChange = (value: string) => {
        var stateClone = $.extend({}, this.state, {scaleUnit: value});
        stateClone.content = this._populateContent(stateClone);
        this.setState(stateClone);
    };
    private _onServiceChange = (value: string) => {
        this.setState({service: value} as AutoConfigToolState);
    };
    private _onMilestoneChange = (value: string) => {
        this.setState({milestone: value} as AutoConfigToolState);
    };
    private _onOperationChange = (event) => {
        var stateClone = $.extend({}, this.state, {operation: event.target.value});
        stateClone.content = this._populateContent(stateClone);
        this.setState(stateClone);
    };
    private _onContentChange = (value: string) => {
        this.setState({content: value, contentCustomized: true } as any);
    };
    private _onCreateButtonClick = () => {
        this._dataService.createPR(this.state).then(pullRequest => {
            window.top.location.href = `${pullRequest.repository.remoteUrl}/pullrequest/${pullRequest.pullRequestId}`
        });
    };

    private _populateContent(state: AutoConfigToolState): string {
        if (state.contentCustomized) {
            return undefined;
        }
        switch (state.operation) {
            case OperationType[OperationType.TurnFeatureFlagOn]:
                return `
$ErrorActionPreference = "Stop"
if ($pwd -like '*${state.scaleUnit}' -or $pwd -like '*\devfabric')
{
   Set-FeatureFlag -FeatureName <Your FeatureFlag Name> -State on
}       

`
case OperationType[OperationType.TurnFeatureFlagOff]:
                return `
$ErrorActionPreference = "Stop"
if ($pwd -like '*${state.scaleUnit}' -or $pwd -like '*\devfabric')
{
   Set-FeatureFlag -FeatureName <Your FeatureFlag Name> -State off
}       

`
           case OperationType[OperationType.RunSQLScript]:
                // TODO
                break;
        
            default:
                break;
        }
    }
}

ReactDOM.render(<AutoConfigTool />, document.getElementById("main-container"));

