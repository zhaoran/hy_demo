// 大转盘
// 

function getJsDom(dom){
    return dom.length ? return dom[0] : dom;
}

function addDom(dom, sideSize, className){
    let canvas = document.createElement("canvas");
    canvas.className = className;
    canvas.width = sideSize;
    canvas.height = sideSize;
    getJsDom(dom).appendChild(canvas);
    return canvas;
}

export default {
    
}