import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function rewriteResume(originalCV: string, jobDesc: string) {
  const prompt = `
你是一位顶级简历顾问。现在需要你根据以下【原始简历】和【职位描述】，生成一份量身定制的简历。
要求：
1. 必须严格输出如下JSON格式，不要包含任何额外文字。
2. JSON结构为：
{
  "summary": { "original": "原始个人总结", "rewritten": "改写后个人总结" },
  "experiences": [
    {
      "company": "公司名",
      "title": "职位",
      "bullets": [
        { "original": "原始工作描述句子", "rewritten": "改写后句子" },
        ...
      ]
    }
  ],
  "skills": { "original": ["技能1","技能2"], "rewritten": ["技能1","技能2"] }
}
3. 改写必须基于原始经历的事实，不得编造，但可以重组语言以匹配JD关键词，使用STAR法则，强调量化成果。
4. 技能部分，请筛选并排序，将JD要求且你具备的技能放在前面，但不要凭空添加你原始简历中没有的技能。
5. 保持原文语种（如果中文就全中文，英文就全英文）。

【原始简历】
${originalCV}

【职位描述】
${jobDesc}
`;

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = response.choices[0].message.content?.trim() || '';
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) throw new Error('AI返回格式错误');
  return JSON.parse(jsonMatch[1]);
}
