import React from "react"
import ReactDOM from "react-dom"
import domready from "domready"
import assign from "object-assign"
import keys from "./keys"
import AABB from "./aabb"

import AdaptiveLinearization from "adaptive-linearization"
import CurveForm from "./CurveForm";

const PRESETS = [
    {
        name: "(Choose preset curve)"
    },
    {
        name: "Wave",
        curve: {
            x1: 0,
            y1: 50,
            x2: 33,
            y2: 0,
            x3: 66,
            y3: 100,
            x4: 100,
            y4: 50
        }
    },
    {
        name: "Straight Line",
        curve: {
            x1: 0,
            y1: 50,
            x2: 33,
            y2: 50,
            x3: 66,
            y3: 50,
            x4: 100,
            y4: 50
        }
    },
    {
        name: "X-Shape",
        curve: {
            x1: 100,
            y1: 100,
            x2: 300,
            y2: 200,
            x3: 200,
            y3: 200,
            x4: 200,
            y4: 100
        }
    },
    {
        name: "S-Shape",
        curve: {
            x1: 100,
            y1: 100,
            x2: 200,
            y2: 100,
            x3: 100,
            y3: 200,
            x4: 200,
            y4: 200
        }
    }
];

function newState(component, slice, name, value, validKeys)
{
    if (!validKeys.hasOwnProperty(name))
    {
        throw new Error(
            "'" + name + "' is no valid option name: " +
            JSON.stringify(
                keys(validKeys)
            )
        );
    }

    const newState = {
        [slice]: assign({}, component.state[slice])
    };

    newState[slice][name] = value;

    component.setState(newState);
}

function convert(opts)
{
    const defaults = AdaptiveLinearization.DEFAULT_OPTS;

    const converted = {};

    for (let name in defaults)
    {
        if (defaults.hasOwnProperty(name))
        {
            const n = +opts[name];

            if (isNaN(n))
            {
                return false;
            }

            converted[name] = n;
        }
    }

    return converted;
}

function linearize(state)
{
    const aabb = new AABB();
    const {x1, y1, x2, y2, x3, y3, x4, y4} = state.curve;
    const array = [x1,y1];
    aabb.extend(x1,y1);
    aabb.extend(x2,y2);
    aabb.extend(x3,y3);

    const  opts = convert(state.opts);
    if (opts)
    {
        const al = new AdaptiveLinearization((x1, y1, x2, y2) => {

            array.push(x2, y2);
            aabb.extend(x2,y2);

        }, opts);

        al.linearize(x1, y1, x2, y2, x3, y3, x4, y4);
    }

    return {
        vertices: array,
        aabb: aabb
    };
}


function currentSize()
{
    const size = {
        width: (window.innerWidth - 16) & ~7,
        height: (window.innerHeight - 350)
    };
    console.log({size});
    return size;

}

function renderLinePath(vertices)
{
    let s = "M" + vertices[0] + "," + vertices[1] + "L";

    for (let i = 2; i < vertices.length; i+= 2)
    {
        s += vertices[i] + ","  + vertices[i+1] + " ";
    }

    return s;
}


class Main extends React.Component {

    state = {
        curve: PRESETS[1].curve,

        opts: assign({
            drawOptimal: false,
        },AdaptiveLinearization.DEFAULT_OPTS),

        size: currentSize()
    };

    setOption = (name, value) => newState(this, "opts", name, value, this.state.opts);

    setCurvePoint = (name, value) => newState(this, "curve", name, value, this.state.curve);

    onResize = ev => {
        this.setState({ size: currentSize() });
    };

    componentDidMount()
    {
        window.addEventListener("resize", this.onResize, true);
    }

    componentWillUnmount()
    {
        window.removeEventListener("resize", this.onResize, true);
    }

    shouldComponentUpdate(nextProps,nextState)
    {
        const { state } = this;

        return (
            state.curve !== nextState.curve ||
            state.opts !== nextState.opts ||
            state.size !== nextState.size
        );
    }
    
    selectPreset = index => {
        if (index > 0)
        {
            let presetCurve = PRESETS[index].curve;
            console.log({presetCurve});

            this.setState({
                curve: presetCurve
            })
        }
    };


    render()
    {
        const {opts, curve, size } = this.state;

        //console.log({opts, curve, size });

        const {width, height} = size;

        const { vertices, aabb } = linearize(this.state);

        console.log({vertices});

        const markers = [];
        for (let i = 0; i < vertices.length; i+=2)
        {
            markers.push(
                <rect
                    key={ i }
                    className="marker"
                    x={ vertices[    i] - 1 }
                    y={ vertices[i + 1] - 1 }
                    width={ 2 }
                    height={ 2 }
                />
            )

        }

        return (
            <div className="playground container-fluid">
                <CurveForm
                    curve={ curve }
                    opts={ opts }
                    presets={ PRESETS }
                    setCurvePoint={ this.setCurvePoint }
                    setOption={ this.setOption }
                    selectPreset={ this.selectPreset }
                    count={ vertices.length/2 }
                />
                <div className="row">
                    <div className="col-md-12">
                        <svg
                            width="100%"
                            height={ height }
                            viewBox={ aabb.renderViewBox() }
                            preserveAspectRatio="xMidYMid meet"
                            style={{background: "#f0f0f0"}}
                        >
                            <path
                                className="ctrl-line"
                                d={
                                    "M" + curve.x1 + "," + curve.y1 + "L" + curve.x2 + "," + curve.y2
                                }
                            />
                            <path
                                className="ctrl-line"
                                d={
                                    "M" + curve.x3 + "," + curve.y3 + "L" + curve.x4 + "," + curve.y4
                                }
                            />
                            <path className="linear" d={ renderLinePath(vertices) } />
                            {
                                opts.drawOptimal &&
                                <path
                                    className="curve"
                                    d={
                                        "M" + curve.x1 + "," + curve.y1 + "C" + curve.x2 + "," + curve.y2 + " " + curve.x3 + "," + curve.y3 + " " + curve.x4 + "," + curve.y4
                                    }/>
                            }
                            { markers }
                            <rect className="curve-end" x={ curve.x1 - 1.5 } y={ curve.y1 - 1 } width={ 3 } height={ 3 } />
                            <rect className="curve-end" x={ curve.x4 - 1.5 } y={ curve.y4 - 1 } width={ 3 } height={ 3 } />
                            <rect className="ctrl-point" x={ curve.x2 - 1.5 } y={ curve.y2 - 1 } width={ 3 } height={ 3 } />
                            <rect className="ctrl-point" x={ curve.x3 - 1.5 } y={ curve.y3 - 1 } width={ 3 } height={ 3 } />
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}

domready(function () {

    ReactDOM.render(
        <Main/>,
        document.getElementById("root"),
        () => console.log("ready")
    )

});
