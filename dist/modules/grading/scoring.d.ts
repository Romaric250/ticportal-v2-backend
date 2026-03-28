/** Rubric JSON shape: { sections: Array<{ name, weight, criteria: Array<{ name, maxScore, description? }> }> } */
export type RubricSection = {
    name: string;
    weight: number;
    criteria: Array<{
        name: string;
        maxScore: number;
        description?: string;
    }>;
};
export type RubricJson = {
    sections: RubricSection[];
};
export type CriterionScore = {
    score: number;
    maxScore: number;
    feedback?: string;
};
export type SectionScoreInput = {
    score?: number;
    maxScore?: number;
    feedback?: string;
    criteria?: Record<string, CriterionScore>;
};
export declare function parseRubricSections(sectionsJson: unknown): RubricSection[];
export declare function sectionMaxFromRubric(section: RubricSection): number;
/**
 * Weighted total 0–100: sum over sections of (sectionRaw / sectionMax) * weight.
 */
export declare function computeTotalScore(rubric: RubricJson, sectionScores: Record<string, SectionScoreInput>): {
    total: number;
    errors: string[];
};
export declare function buildEmptySectionScores(rubric: RubricJson): Record<string, SectionScoreInput>;
//# sourceMappingURL=scoring.d.ts.map