import React from 'react';
import { GeneratorConfig } from '../types/curriculum';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { BarChart3, PieChart, Clock, Award, CheckCircle } from 'lucide-react';

interface BlueprintViewProps {
  config: GeneratorConfig;
  subjectName: string;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({ config, subjectName }) => {
  const currentSubject = CURRICULUM_DATA[config.grade]?.find(s => s.id === config.subjectId);
  const selectedChapters = (currentSubject?.chapters || []).filter(c =>
    config.selectedChapterIds.includes(c.id)
  );

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Official CBSE Assessment Blueprint</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Cognitive Domain & Typology Matrix ({config.grade} - {subjectName})
          </h2>
          <p className="text-xs text-slate-700 mt-1">
            Aligned with National Curriculum Framework (NCF) and CBSE Examination Guidelines.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase">Maximum Marks</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{config.totalMarks} M</div>
            <span className="text-[10px] text-slate-700">Strictly balanced</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase">Total Duration</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{config.durationMinutes} Min</div>
            <span className="text-[10px] text-slate-700">~{(config.durationMinutes / config.totalMarks).toFixed(1)} min / mark</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase">Target Units</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">{config.selectedChapterIds.length}</div>
            <span className="text-[10px] text-slate-700">NCERT chapters</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase">Standard</span>
            <div className="text-lg font-black text-emerald-600 mt-1 uppercase truncate">
              {config.difficulty}
            </div>
            <span className="text-[10px] text-slate-700">CBSE board calibrated</span>
          </div>
        </div>

        {/* Cognitive Domain Weightage Breakdown */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-indigo-600" />
            <span>CBSE Bloom's Taxonomy Cognitive Weightage</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>1. Remembering & Understanding (Definitions, Concepts, Core Principles)</span>
                <span className="font-bold text-slate-900">~45% - 50%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>2. Application & Numericals (Problem-Solving, Formula Execution, Equations)</span>
                <span className="font-bold text-slate-900">~30% - 35%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>3. Analyzing, Evaluating & Creating (HOTS, Case Studies, Unseen Scenarios)</span>
                <span className="font-bold text-slate-900">~20%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Chapters Table */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 mb-3">
            Mapped NCERT Chapters in this Question Paper:
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {selectedChapters.map((chap, idx) => (
              <div key={chap.id} className="p-3 bg-slate-50/50 flex items-start justify-between text-xs">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">{chap.name}</span>
                    {chap.typicalSubtopics && (
                      <p className="text-[11px] text-slate-700 mt-0.5">
                        High yield areas: {chap.typicalSubtopics.join(' &bull; ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1" /> Active in Test
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
