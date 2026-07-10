export interface ScanOptions {
    root?: string;
    ignore?: string[];
    extensions?: string[];
}
export declare function scan(opts?: ScanOptions): Promise<any>;
