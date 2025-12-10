"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AD_SCRIPT_PROMPT = void 0;
const prompts_1 = require("@langchain/core/prompts");
exports.AD_SCRIPT_PROMPT = new prompts_1.PromptTemplate({
    template: `You are an expert video ad script writer.
Create a {duration} script for {platform} targeting {target_audience}.
Product: {product_name}
Description: {product_description}
Language: {language}

Format the output as valid JSON with the following structure:
{{
  "hook": "Catchy opening line",
  "problem": "Problem statement",
  "solution": "How the product solves it",
  "cta": "Call to action",
  "scenes": [
    {{ "scene": 1, "text": "Visual/Audio description", "duration": "3s" }}
  ]
}}

Generate the JSON only, no markdown.`,
    inputVariables: ['duration', 'platform', 'target_audience', 'product_name', 'product_description', 'language'],
});
//# sourceMappingURL=ad-script.prompt.js.map