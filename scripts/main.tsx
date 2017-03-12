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
        return <div className={this.props.className}>
            <fieldset style={this.props.style}>
                <label htmlFor={this.props.id}>{this.props.label}</label>
                {this._renderTextArea()}
            </fieldset>
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
            return <textarea value={this.props.value} onChange={onChange} className={invalidClassName} placeholder={this.props.placeholderText} rows={40} cols={80}/>
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
    featureflag: string;
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
        this.state = { name:"", scaleUnit: "SU0", service: "tfs", milestone:"115", operation: OperationType[OperationType.TurnFeatureFlagOn], featureflag: "", content: ""};
    }
    public render(): JSX.Element {
        return <div className="bowtie">
            <TextBox id="name" label="ConfigurationName" value={this.state.name} onChange={this._onNameChange} isValid={!!this.state.name}/>
            <fieldset>
                <label>ScaleUnit</label>
                <select id="scaleUnit" label="ScaleUnit" value={this.state.scaleUnit} onChange={this._onScaleUnitChange}>
                        <option value="SU0">SU0</option>
                        <option value="SU1">SU1</option>
                        <option value="SU2">SU2</option>
                        <option value="SU3">SU3</option>
                        <option value="SU4">SU4</option>
                        <option value="SU5">SU5</option>
                </select>
            </fieldset>
            <fieldset>
                <label>ScaleUnit</label>
                <select id="service" label="Service" value={this.state.scaleUnit} onChange={this._onServiceChange}>
                        <option value="tfs">tfs</option>
                        <option value="sps">sps</option>
                        <option value="spsext">spsext</option>
                        <option value="ems">ems</option>
                        <option value="sh">sh</option>
                        <option value="aex">cl</option>
                        <option value="mps">mps</option>
                        <option value="mms">mms</option>
                        <option value="pe">pe</option>
                </select>
            </fieldset>
            <fieldset>
                <label>Milestone</label>
                <select id="milestone" label="milestone" value={this.state.milestone} onChange={this._onMilestoneChange}>
                        <option value="114">114</option>
                        <option value="115">115</option>
                        <option value="116">116</option>
                </select>
            </fieldset>
            <fieldset>
                <label>Operation</label>
                <select id="operation" value={this.state.operation} onChange={this._onOperationChange}>
                        <option value={OperationType[OperationType.TurnFeatureFlagOn]}>TurnFeatureFlagOn</option>
                        <option value={OperationType[OperationType.TurnFeatureFlagOff]}>TurnFeatureFlagOff</option>
                        <option value={OperationType[OperationType.RunSQLScript]}>RunSQLScript</option>
                </select>
            </fieldset>
            {this._dynamicRender()}
            <MultilineTextBox id="content" label="Preview" value={this.state.content} onChange={this._onContentChange} isValid={!!this.state.content}/>
            <ButtonComponent cssClass="btn-cta" onClick={this._onCreateButtonClick} text="Create"/>
        </div>
        
    }
    private _onNameChange = (value: string) => {
        this.setState({name: value} as AutoConfigToolState);
    };
    private _onScaleUnitChange = (event) => {
        var stateClone = $.extend({}, this.state, {scaleUnit: event.target.value});
        stateClone.content = this._populateContent(stateClone);
        this.setState(stateClone);
    };
    private _onServiceChange = (event) => {
        this.setState({service: event.target.value} as AutoConfigToolState);
    };
    private _onMilestoneChange = (event) => {
        this.setState({milestone: event.target.value} as AutoConfigToolState);
    };
    private _onOperationChange = (event) => {
        var stateClone = $.extend({}, this.state, {operation: event.target.value});
        stateClone.content = this._populateContent(stateClone);
        this.setState(stateClone);
    };
    private _onFeatureFlagChange = (value: string) => {
        var stateClone = $.extend({}, this.state, {featureflag: value});
        stateClone.content = this._populateContent(stateClone);
        this.setState(stateClone);
    };
    private _onContentChange = (value: string) => {
        this.setState({content: value, contentCustomized: true } as any);
    };
    private _onCreateButtonClick = () => {
        this._dataService.createPR(this.state).then(pullRequest => {
            window.top.location.href = `${pullRequest.repository.remoteUrl}/pullrequest/${pullRequest.pullRequestId}?_a=files`
        });
    };
    private _dynamicRender(): JSX.Element {
        if (this.state.operation === OperationType[OperationType.TurnFeatureFlagOn] || this.state.operation === OperationType[OperationType.TurnFeatureFlagOff]) {
            return <TextBox id="featureflag" label="FeatureFlagName" value={this.state.featureflag} onChange={this._onFeatureFlagChange} isValid={!!this.state.featureflag}/>;
        }
        return null;
    }
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
   Set-FeatureFlag -FeatureName '${state.featureflag}' -State on
}       

`;
case OperationType[OperationType.TurnFeatureFlagOff]:
                return `
$ErrorActionPreference = "Stop"
if ($pwd -like '*${state.scaleUnit}' -or $pwd -like '*\devfabric')
{
   Set-FeatureFlag -FeatureName '${state.featureflag}' -State off
}       

`;
           case OperationType[OperationType.RunSQLScript]:
                return "TODO ;)";
            default:
                break;
        }
    }
}

ReactDOM.render(<AutoConfigTool />, document.getElementById("main-container"));

