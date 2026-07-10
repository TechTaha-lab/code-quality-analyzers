export interface AnalyzeOptions {
    root?: string;
    output?: string;
    open?: boolean;
    ignore?: string[];
}
export declare function analyzeProject(opts?: AnalyzeOptions): Promise<{
    success: boolean;
    reportDir: any;
    findings: any;
    filesScanned: number;
}>;
