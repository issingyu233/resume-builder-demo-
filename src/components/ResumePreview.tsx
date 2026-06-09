import React from 'react';

interface Experience {
  company: string;
  title: string;
  bullets: { original: string; rewritten: string; accepted?: boolean }[];
}

interface Props {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experiences: Experience[];
  skills: string[];
}

const ResumePreview: React.FC<Props> = ({ name, email, phone, summary, experiences, skills }) => {
  return (
    <div className="max-w-[800px] mx-auto bg-white text-gray-800 p-8 shadow-md print:shadow-none print:p-0 print-area">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{name || '你的姓名'}</h1>
          <p className="text-sm mt-1">{email} | {phone}</p>
        </div>
        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center text-gray-400 text-sm rounded">
          照片
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-bold border-b pb-1 mb-2">个人总结</h2>
        <p className="text-sm leading-relaxed">{summary}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-bold border-b pb-1 mb-2">工作经历</h2>
        {experiences.map((exp, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between">
              <span className="font-semibold">{exp.title}</span>
              <span className="text-sm text-gray-500">{exp.company}</span>
            </div>
            <ul className="list-disc list-inside text-sm mt-1 space-y-1">
              {exp.bullets.map((b, j) => (
                <li key={j}>{b.accepted !== false ? b.rewritten : b.original}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-bold border-b pb-1 mb-2">技能</h2>
        <p className="text-sm">{skills.join(' · ')}</p>
      </div>
    </div>
  );
};

export default ResumePreview;
