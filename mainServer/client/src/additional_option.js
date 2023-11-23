import React from 'react'

export function BlurOption({submit, i, m, setm, reset}){

    // 데이터를 정제해서 넘겨
    const handleSubmit = (event) => {
        event.preventDefault()
        var data = {'maskXSize': m.w, 'maskYSize': m.h}
        submit(0, data)
        reset(-1)
    }

    const wChange = (event) => { setm((prev) => ({...prev, w: parseInt(event.target.value, 10)})) }
    const hChange = (event) => { setm((prev) => ({...prev, h: parseInt(event.target.value, 10)})) } 

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="blurWidth">Blur Width:</label>
                    <input
                        type="range" id="blurWidth" name="blurWidth"
                        value={m.w}
                        min="11" max={Math.floor((i.w - 10) / 2) * 2 - 1} step="2"
                        //disabled={uploadOrDownload !== "n"} 
                        onChange={wChange}
                    />{m.w}<br />

                    <label htmlFor="blurHeight">Blur Height:</label>
                    <input
                        type="range" id="blurHeight" name="blurHeight"
                        value={m.h}
                        min="11" max={Math.floor((i.h - 10) / 2) * 2 - 1} step="2"
                        //disabled={uploadOrDownload !== "n"} 
                        onChange={hChange}
                    />{m.h}

                </div>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}


export function InverseOption({submit, reset}) {
        
    const handleSubmit = (event) => { 
        event.preventDefault()
        submit(1, {}) 
        reset(-1)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="submit" value="Submit"/>
            </form>      
        </div>

    )
}