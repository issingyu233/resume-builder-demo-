'use client';

import { useState } from 'react';
import ResumePreview from '@/components/ResumePreview';

interface BulletItem {
  original: string;
  rewritten: string;
  accepted: boolean;
}

interface Experience {
  company: string;
  title: string;
  bullets: BulletItem[];
}

interface ResumeData {
  summary: { original: string; rewritten: string };
  experiences: Experience[];
  skills: { original: string[]; rewritten: string[] };
}

export default function Home() {
  const [originalCV, setOriginalCV] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleRewrite = async () => {
    if (!originalCV || !jobDesc) return alert('请填写简历和职位描述');
    setLoading(true);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalCV, jobDesc }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const experiences = data.experiences.map((exp: any) => ({
        ...exp,
        bullets: exp.bullets.map((b: any) => ({ ...b, accepted: true })),
      }));
      setResumeData({ ...data, experiences });
      const emailMatch = originalCV.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = originalCV.match(/1[3-9]\d{9}/);
      const nameMatch = originalCV.match(/姓名[：:]\s*(\S+)/);
      setName(nameMatch?.[1] || '');
      setEmail(emailMatch?.[0] || '');
      setPhone(phoneMatch?.[0] || '');
    } catch (err: any) {
      alert('生成失败：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccept = (expIdx: number, bulletIdx: number) => {
    if (!resumeData) return;
    const newData = { ...resumeData };
    newData.experiences[expIdx].bullets[bulletIdx].accepted =
      !newData.experiences[expIdx].bullets[bulletIdx].accepted;
    setResumeData(newData);
  };

  const handlePrint = () => {
    window.print();
  };

  const previewData = resumeData
    ? {
        name,
        email,
        phone,
        summary: resumeData.summary.rewritten,
        experiences: resumeData.experiences.map(exp => ({
          ...exp,
          bullets: exp.bullets.map(b => ({ ...b })),
        })),
        skills: resumeData.skills.rewritten,
      }
    : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/2 p-6 border-r overflow-y-auto bg-gray-50">
        <h2 className="text-xl font-bold mb-4">原始简历 & 职位要求</h2>
        <textarea
          className="w-full h-48 p-3 border rounded mb-4 text-sm"
          placeholder="在这里粘贴你的原始简历全文..."
          value={originalCV}
          onChange={(e) => setOriginalCV(e.target.value)}
        />
        <textarea
          className="w-full h-48 p-3 border rounded mb-4 text-sm"
          placeholder="在这里粘贴目标职位描述(JD)..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
        <button
          onClick={handleRewrite}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'AI 正在改写...' : '生成定制简历'}
        </button>
      </div>

      <div className="w-1/2 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 border-b">
          {resumeData ? (
            <>
              <div className="mb-4">
                <h3 className="font-bold text-sm mb-1">姓名 / 联系方式（可修改）</h3>
                <input className="border p-1 mr-2 text-sm" placeholder="姓名" value={name} onChange={e => setName(e.target.value)} />
                <input className="border p-1 mr-2 text-sm" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="border p-1 text-sm" placeholder="电话" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-sm">个人总结</h3>
                <p className="text-xs text-gray-500 line-through text-red-600">{resumeData.summary.original}</p>
                <p className="text-sm text-green-700">{resumeData.summary.rewritten}</p>
              </div>
              <h3 className="font-bold text-sm mb-2">工作经历</h3>
              {resumeData.experiences.map((exp, i) => (
                <div key={i} className="mb-4">
                  <p className="text-sm font-semibold">{exp.title} @ {exp.company}</p>
                  {exp.bullets.map((b, j) => (
                    <div key={j} className="ml-4 mt-2 flex items-start gap-2">
                      <div className="flex-1">
                        <p className={`text-xs ${b.accepted ? 'hidden' : 'text-red-600 line-through'}`}>
                          原文: {b.original}
                        </p>
                        <p className={`text-sm ${b.accepted ? 'text-green-700' : 'text-gray-400'}`}>
                          {b.accepted ? '✓ 已采用: ' : '已拒绝: '}{b.rewritten}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleAccept(i, j)}
                        className="text-xs px-2 py-1 border rounded whitespace-nowrap"
                      >
                        {b.accepted ? '拒绝' : '接受'}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
              <div className="mb-4">
                <h3 className="font-bold text-sm">技能</h3>
                <p className="text-xs text-red-600 line-through">原始：{resumeData.skills.original.join('、')}</p>
                <p className="text-sm text-green-700">改写后：{resumeData.skills.rewritten.join('、')}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center mt-20">生成后，AI修改对照会显示在这里</p>
          )}
        </div>
        <div className="h-[40%] overflow-y-auto bg-gray-100 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">简历预览</h3>
            <button onClick={handlePrint} className="bg-green-600 text-white px-4 py-1 rounded text-sm">
              导出 PDF
            </button>
          </div>
          {previewData ? (
            <ResumePreview
              name={previewData.name}
              email={previewData.email}
              phone={previewData.phone}
              summary={previewData.summary}
              experiences={previewData.experiences}
              skills={previewData.skills}
            />
          ) : (
            <p className="text-gray-400">暂无预览</p>
          )}
        </div>
      </div>
    </div>
  );
}
