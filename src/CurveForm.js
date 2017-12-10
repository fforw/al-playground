import React from "react"
import keys from "./keys";

import AdaptiveLinearization from "adaptive-linearization"

const OPTION_NAMES = keys(AdaptiveLinearization.DEFAULT_OPTS);

function CoordinatePairInput(props)
{
    const { curve, xName, yName, setCurvePoint} = props;

    const xId = "input-" + xName;
    const yId = "input-" + yName;

    return (
        <div className="form-inline">
            <div className="form-group form-group-sm">
                <label htmlFor={ xId }>{ xName }</label>
                <input type="text" className="form-control" id={ xId } value={ String(curve[xName]) }
                       placeholder={ xName + "-coordinate" } onChange={ ev => setCurvePoint(xName, ev.target.value) } />
            </div>
            <div className="form-group form-group-sm">
                <label htmlFor={ yId }>{ yName }</label>
                <input type="text" className="form-control" id={ yId } value={ String(curve[yName]) }
                       placeholder={ yName + "-coordinate" } onChange={ ev => setCurvePoint(yName, ev.target.value) } />
            </div>
        </div>
    );
}


function Options(props)
{
    const { opts, setOption } = props;

    return (
        <div className="options form-horizontal">
            {
                OPTION_NAMES
                    .map(name =>
                        <div key={ name } className="form-group form-group-sm">
                            <label htmlFor={ "opt-" + name } className="control-label col-md-3" >{ name }</label>
                            <div className="col-md-3">
                                <input
                                    id={ "opt-" + name }
                                    type="text"
                                    className="form-control"
                                    value={ String(opts[name]) }
                                    placeholder={ "Value for option '" + name + "'" }
                                    onChange={ ev => setOption(name, ev.target.value) }
                                />
                            </div>
                        </div>
                    )
            }
            <a className="btn btn-link pull-right" href="https://github.com/fforw/al-playground">Github project</a>
        </div>
    );
}



/*
  <div class="form-group">
    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
    <div class="col-sm-10">
      <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
    </div>
  </div>
 */


class CurveForm extends React.Component {

    selectPreset = ev => this.props.selectPreset(ev.target.value);

    render()
    {
        const { curve, opts, count, setCurvePoint, presets, setOption } = this.props;

        return (
            <div className="row">
                <div className="col-md-6">
                    <h1>Adaptive Linearization Playground</h1>

                    <div className="form-group form-group-sm">
                        <label htmlFor="presetSelect">Preset</label>
                        <select
                            id="presetSelect"
                            className="form-control"
                            defaultValue={ 0 }
                            onChange={ this.selectPreset }
                        >
                            {
                                presets.map((preset,index) => <option key={ index } value={ index }>{ preset.name }</option> )
                            }
                        </select>
                    </div>

                    <CoordinatePairInput
                        xName="x1"
                        yName="y1"
                        curve={ curve }
                        setCurvePoint={ setCurvePoint }
                    />
                    <CoordinatePairInput
                        xName="x2"
                        yName="y2"
                        curve={ curve }
                        setCurvePoint={ setCurvePoint }
                    />
                    <CoordinatePairInput
                        xName="x3"
                        yName="y3"
                        curve={ curve }
                        setCurvePoint={ setCurvePoint }
                    />
                    <CoordinatePairInput
                        xName="x4"
                        yName="y4"
                        curve={ curve }
                        setCurvePoint={ setCurvePoint }
                    />
                    <div className="checkbox form-group-sm">
                        <label>
                            <input type="checkbox" checked={ opts.drawOptimal } onChange={ ev => setOption("drawOptimal", !opts.drawOptimal) } /> Draw Optimal
                        </label>
                    </div>
                    <div>
                        Number of coordinates in result line: { count }
                    </div>
                </div>
                <div className="col-md-6">
                    <Options opts={ opts } setOption={ setOption }/>
                </div>
            </div>
        )
    }
}

export default CurveForm
