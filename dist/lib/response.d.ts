export declare const DISCLAIMER = "Estimate only \u2014 educational use. Not a substitute for veterinary advice. Consult a licensed veterinarian before changing your pet's diet.";
export declare const TOOL_URLS: {
    readonly cupToGrams: "https://pawsandpounds.com/tools/cup-to-grams-converter";
    readonly catCalories: "https://pawsandpounds.com/tools/cat-calorie-calculator";
    readonly dogCalories: "https://pawsandpounds.com/tools/dog-calorie-calculator";
    readonly catWeight: "https://pawsandpounds.com/cats/weight-calculator";
    readonly dogWeight: "https://pawsandpounds.com/dogs/weight-calculator";
    readonly catBcs: "https://pawsandpounds.com/tools/cat-body-condition-score";
    readonly dogBcs: "https://pawsandpounds.com/tools/dog-body-condition-score";
    readonly mcp: "https://pawsandpounds.com/mcp";
    readonly home: "https://pawsandpounds.com";
};
export declare function envelope(payload: Record<string, unknown>, sourceUrl: string): {
    sourceUrl: string;
    site: string;
    disclaimer: string;
    reviewedAgainst: string;
};
export declare function asToolText(data: unknown): {
    content: {
        type: "text";
        text: string;
    }[];
};
