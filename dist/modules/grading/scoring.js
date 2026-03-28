/** Rubric JSON shape: { sections: Array<{ name, weight, criteria: Array<{ name, maxScore, description? }> }> } */
export function parseRubricSections(sectionsJson) {
    if (!sectionsJson || typeof sectionsJson !== "object")
        return [];
    const raw = sectionsJson;
    if (!Array.isArray(raw.sections))
        return [];
    return raw.sections.filter((s) => {
        return (s &&
            typeof s === "object" &&
            typeof s.name === "string" &&
            typeof s.weight === "number" &&
            Array.isArray(s.criteria));
    });
}
export function sectionMaxFromRubric(section) {
    return section.criteria.reduce((sum, c) => sum + (Number(c.maxScore) || 0), 0);
}
/**
 * Weighted total 0–100: sum over sections of (sectionRaw / sectionMax) * weight.
 */
export function computeTotalScore(rubric, sectionScores) {
    const errors = [];
    let total = 0;
    for (const section of rubric.sections) {
        const key = section.name;
        const input = sectionScores[key];
        const smax = sectionMaxFromRubric(section);
        if (smax <= 0)
            continue;
        let sectionRaw = 0;
        if (input?.criteria && typeof input.criteria === "object") {
            for (const crit of section.criteria) {
                const ckey = crit.name;
                const cs = input.criteria[ckey];
                if (!cs) {
                    errors.push(`Missing score for criterion "${ckey}" in section "${key}"`);
                    continue;
                }
                const max = Number(crit.maxScore) || 0;
                const sc = Number(cs.score);
                if (Number.isNaN(sc) || sc < 0 || sc > max) {
                    errors.push(`Invalid score for "${ckey}" in "${key}" (max ${max})`);
                }
                else {
                    sectionRaw += sc;
                }
            }
        }
        else if (input && typeof input.score === "number") {
            sectionRaw = input.score;
            if (sectionRaw < 0 || sectionRaw > smax) {
                errors.push(`Section "${key}" score must be between 0 and ${smax}`);
            }
        }
        else {
            errors.push(`Missing scores for section "${key}"`);
            continue;
        }
        const weighted = (sectionRaw / smax) * section.weight;
        total += weighted;
    }
    return { total: Math.round(total * 1000) / 1000, errors };
}
export function buildEmptySectionScores(rubric) {
    const out = {};
    for (const section of rubric.sections) {
        const criteria = {};
        for (const c of section.criteria) {
            criteria[c.name] = { score: 0, maxScore: c.maxScore, feedback: "" };
        }
        out[section.name] = {
            score: 0,
            maxScore: sectionMaxFromRubric(section),
            feedback: "",
            criteria,
        };
    }
    return out;
}
//# sourceMappingURL=scoring.js.map