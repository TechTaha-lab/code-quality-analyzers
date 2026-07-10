export type Severity = 'info' | 'warning' | 'error' | 'critical';
export interface Finding {
    id: string;
    message: string;
    file: string;
    line?: number;
    column?: number;
    severity?: Severity;
    category?: string;
}
export interface RuleModule {
    id: string;
    category?: string;
    severity?: Severity;
    run: (context: {
        filePath: string;
        code: string;
        ast: any;
    }) => Promise<Finding[] | Finding[]> | Finding[];
}
export declare function loadRulesFromPackages(rootDir: string): Promise<RuleModule[]>;
export declare function runRules(rootDir: string, parsedFiles: Array<{
    filePath: string;
    code: string;
    ast: any;
}>): Promise<Finding[]>;
