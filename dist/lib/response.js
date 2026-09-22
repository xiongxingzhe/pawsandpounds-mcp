const SITE = "https://pawsandpounds.com";
export const DISCLAIMER = "Estimate only — educational use. Not a substitute for veterinary advice. Consult a licensed veterinarian before changing your pet's diet.";
export const TOOL_URLS = {
    cupToGrams: `${SITE}/tools/cup-to-grams-converter`,
    catCalories: `${SITE}/tools/cat-calorie-calculator`,
    dogCalories: `${SITE}/tools/dog-calorie-calculator`,
    catWeight: `${SITE}/cats/weight-calculator`,
    dogWeight: `${SITE}/dogs/weight-calculator`,
    catBcs: `${SITE}/tools/cat-body-condition-score`,
    dogBcs: `${SITE}/tools/dog-body-condition-score`,
    mcp: `${SITE}/mcp`,
    home: SITE,
};
export function envelope(payload, sourceUrl) {
    return {
        ...payload,
        sourceUrl,
        site: SITE,
        disclaimer: DISCLAIMER,
        reviewedAgainst: "WSAVA/AAHA public guidelines (editorial research team — not a licensed veterinarian claim)",
    };
}
export function asToolText(data) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}
