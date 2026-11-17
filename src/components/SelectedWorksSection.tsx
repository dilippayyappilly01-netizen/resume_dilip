import React from 'react';
import { ArrowUpRight, Image as ImageIcon, Pencil, Trash2 } from 'lucide-react';
import { PRESET_IMAGES, ProjectCategory, ProjectItem } from '../data/portfolioData';
import { EditableText } from './EditableText';

interface SelectedWorksSectionProps {
  projects: ProjectItem[];
  isEditMode: boolean;
  onOpenProject: (project: ProjectItem) => void;
  onUpdateProject: (updated: ProjectItem) => void;
  onAddProject?: () => void;
  onDeleteProject: (projectId: string) => void;
  onOpenCustomizerForProjects: () => void;
}

export const SelectedWorksSection: React.FC<SelectedWorksSectionProps> = ({
  projects,
  isEditMode,
  onOpenProject,
  onUpdateProject,
  onDeleteProject,
  onOpenCustomizerForProjects,
}) => {
  const cycleProjectImage = (project: ProjectItem) => {
    const idx = PRESET_IMAGES.findIndex((p) => p.url === project.image);
    const nextPreset = PRESET_IMAGES[(idx + 1) % PRESET_IMAGES.length];
    onUpdateProject({ ...project, image: nextPreset.url });
  };

  return (
    <section id="works" aria-labelledby="selected-works-heading" className="bg-[#0b0d10] py-24 px-6 md:px-12">
      <div className="mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="pb-8">
          <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-[#7aa2d4]">
            • EDUCATION
          </p>
          <h2
            id="selected-works-heading"
            className="mt-3 font-serif-display text-[40px] sm:text-[48px] leading-[1.05] font-normal text-white"
          >
            Education & Selected Works
          </h2>
        </div>

        <div className="mb-12 h-px w-full bg-white/15" />

        {/* Education Academic Milestones Banner */}
        <div className="mb-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#11151c] p-6">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#7aa2d4]">
              2026 – Present
            </div>
            <h3 className="font-serif-display mt-2 text-[24px] leading-snug text-white">
              Indian Institute of Management Bangalore (IIMB)
            </h3>
            <p className="mt-1.5 text-[13px] font-medium text-[#9ec2f0]">
              Bachelor of Business Administration (BBA) in Digital Business & Entrepreneurship | 2026 – Present
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#a9b4c4]">
              Focusing on digital business models, financial reporting, entrepreneurial strategy, and building scalable online ventures.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11151c] p-6">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#7aa2d4]">
              Class 12
            </div>
            <h3 className="font-serif-display mt-2 text-[24px] leading-snug text-white">
              Senior Secondary Education (Class 12)
            </h3>
            <p className="mt-1.5 text-[13px] font-medium text-[#9ec2f0]">
              Score: 77% Overall | 91% in Computer Science
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#a9b4c4]">
              Built a strong foundation in programming, logic, and computational thinking alongside core academics.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11151c] p-6">
            <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#7aa2d4]">
              Class 10
            </div>
            <h3 className="font-serif-display mt-2 text-[24px] leading-snug text-white">
              Secondary Education (Class 10)
            </h3>
            <p className="mt-1.5 text-[13px] font-medium text-[#9ec2f0]">
              Score: 90.2%
            </p>
          </div>
        </div>

        {/* 2-Column Grid of Project Cards */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((project) => (
            <article key={project.id} className="group flex flex-col">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => onOpenProject(project)}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#11151c] text-left transition-all duration-300 group-hover:border-[#5c85b8]/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7aa2d4]"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                  <span className="absolute right-5 bottom-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#11151c]/85 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#7aa2d4]">
                    <ArrowUpRight className="h-4 w-4 text-[#7aa2d4]" aria-hidden="true" />
                  </span>
                </button>

                {isEditMode && (
                  <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => cycleProjectImage(project)}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-[#11151c]/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md hover:border-[#7aa2d4]"
                    >
                      <ImageIcon className="h-3 w-3 text-[#7aa2d4]" aria-hidden="true" />
                      <span>Switch Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenCustomizerForProjects}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-[#11151c]/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md hover:border-[#7aa2d4]"
                    >
                      <Pencil className="h-3 w-3 text-[#7aa2d4]" aria-hidden="true" />
                      <span>Full Case Study Editor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(project.id)}
                      aria-label={`Delete ${project.title}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-950/80 px-2.5 py-1 text-[11px] font-medium text-rose-200 backdrop-blur-md hover:border-rose-400"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Unboxed Typographic Metadata: Client · Category · Year · Impact Metric */}
              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#9aa6b8]">
                <span className="font-medium text-[#d0d9e6]">
                  <EditableText
                    value={project.client}
                    onChange={(val) => onUpdateProject({ ...project, client: val })}
                    isEditMode={isEditMode}
                    ariaLabel={`${project.title} client`}
                  />
                </span>
                <span aria-hidden="true">·</span>
                {isEditMode ? (
                  <select
                    aria-label={`${project.title} category`}
                    value={project.category}
                    onChange={(e) =>
                      onUpdateProject({
                        ...project,
                        category: e.target.value as Exclude<ProjectCategory, 'All'>,
                      })
                    }
                    className="rounded border border-[#7aa2d4]/50 bg-[#11151c] px-1.5 py-0.5 text-[12px] text-white"
                  >
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web Platform">Web Platform</option>
                    <option value="Design System">Design System</option>
                    <option value="Brand & UI">Brand & UI</option>
                  </select>
                ) : (
                  <span>{project.category}</span>
                )}
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  <EditableText
                    value={project.year}
                    onChange={(val) => onUpdateProject({ ...project, year: val })}
                    isEditMode={isEditMode}
                    ariaLabel={`${project.title} year`}
                  />
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#7aa2d4]">
                  <EditableText
                    value={project.impactMetric}
                    onChange={(val) => onUpdateProject({ ...project, impactMetric: val })}
                    isEditMode={isEditMode}
                    ariaLabel={`${project.title} impact metric`}
                  />
                </span>
              </div>

              <h3 className="font-serif-display mt-2.5 text-[28px] sm:text-[32px] leading-[1.15] font-normal text-white">
                {isEditMode ? (
                  <EditableText
                    value={project.title}
                    onChange={(val) => onUpdateProject({ ...project, title: val })}
                    isEditMode={isEditMode}
                    ariaLabel="Project Title"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    className="text-left transition-colors hover:text-[#7aa2d4]"
                  >
                    {project.title}
                  </button>
                )}
              </h3>

              <div className="mt-2.5 text-[14px] leading-[1.65] text-[#9aa6b8]">
                <EditableText
                  value={project.summary}
                  onChange={(val) => onUpdateProject({ ...project, summary: val })}
                  isEditMode={isEditMode}
                  multiline
                  ariaLabel={`${project.title} summary`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
