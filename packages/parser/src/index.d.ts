export type Language = 'typescript' | 'javascript';
export interface ParseResult {
    filePath: string;
    code: string;
    language: Language;
    ast: any;
}
export declare function parseFile(filePath: string): Promise<ParseResult | null>;
