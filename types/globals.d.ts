interface imgInfo {
    name: string,
    url: string,
    crossOrigin: boolean
}

interface spriteInfo {
    el: any,
    pathPrefix: string,
    postfix: string
}

interface keyimgsInfo {
    el: any,
    pathPrefix: string,
    postfix: string
}

interface imgList {
    imgs?: imgInfo[];
    sprites?: spriteInfo[],
    keyimgs?: keyimgsInfo[]
}

declare class Preload {
    constructor (pm: imgList)
    onloading(p:string):void;
    onload?():void;
    onfail(msg:string):void;
    load():void;
}

interface Config {
    imgPath: string;
    defShare: object;
    Preload: typeof Preload;
    preImgs: imgList;
    mainImgs: imgList;
}

interface EventManager {
    eventList: string[],
    callbacks: {[key: string]: any[]},
    callbacksOneTime: {[key: string]: any[]},
    on: (name: string, callback?: (params?: any) => void) => void,
    one: (name: string, callback?: (params?: any) => void) => void,
    off: (name: string, callback?: () => void) => void,
    trigger: (name: string, params?: any) => void,
}

interface StateManager {
    state: string;
    stateList: string[],
    changeState: (state: string) => void,
}

interface DataManager {
    data: anyValue;
    dataList: string[],
    getData: (name: string) => any,
    setData: (name: string, value: any) => void,
    getModel?: (name: string) => any,
    addModel?: (name: string, value: any) => void,
    getTexture?: (name: string) => any,
    addTexture?: (name: string, value: any) => void,
}

interface Node {
    getAttribute(attr: string): string;
}
// interface GLTFLoader {
//     [propName: string]: any;
// }
// interface DRACOLoader {
//     [propName: string]: any;
//     setDecoderPath: any;
//     setDecoderConfig: any;
// }
interface directionalLightOption {
    intensity: number,
    position: THREE.Vector3,
}

interface pointLightOption {
    intensity: number,
    position: THREE.Vector3,
}

interface spotLightOption {
    intensity: number,
    position: THREE.Vector3,
    target: THREE.Vector3
}

interface rectLightOption {
    intensity: number,
    width: number,
    height: number,
    position: THREE.Vector3,
    target: THREE.Vector3
}
interface positionConfig {
    inX?: any;
    inY?: any;
    inZ?: any;
    cardboard?: any;
    x: number,
    y: number,
    z: number,
    rotX: number,
    rotY: number,
    rotZ: number,
    doorPos?: any;
    shadowPos?: any;
}
interface modelOption {
    // url: string,
    name: string,
    size: number,
    position?: positionConfig,
    scene: THREE.Scene
}
interface showCaseOption {
    // url: string,
    name: string,
    size: {width: number, height: number},
    position?: positionConfig,
    scene: THREE.Object3D,
    envMap: THREE.Texture,
    scale: number;
}
interface carOption extends modelOption {
    envMap?: THREE.Texture,
}

interface subSceneOption {
    camera: THREE.PerspectiveCamera;
}

// declare class GUI {
//     addFolder: (name: string) => GUI;
//     open: () => void;
//     add: any;
// }
declare const glsl: any;