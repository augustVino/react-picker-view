interface Item {
    label: string;
    value: any;
}
export declare function findItem(val: any, arr: Item[]): Item;
export declare function hasVal(val: any, arr: any): any;
export declare function bound(position: number, min: number | undefined, max: number | undefined): number;
export declare function rubberband(distance: number, dimension: number, constant: number): number;
export declare function rubberbandIfOutOfBounds(position: number, min: number, max: number, dimension: number, constant?: number): number;
export declare const PREFIX_CLS = "hipin-picker-view";
export {};
