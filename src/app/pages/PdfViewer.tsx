import { ChevronLeft, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { courses } from "../lib/mock-data";

export default function PdfViewer() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const course = courses.find((item) => item.id === id) || courses[0];
  const lesson = course.lessons.find((item) => item.id === lessonId) || course.lessons[0];
  const pdfUrl = lesson.presentationPdfUrl;

  return (
    <div className="flex min-h-full flex-col bg-[#F8F9FA]">
      <div className="z-10 flex items-center gap-4 border-b border-gray-100 bg-white px-6 pb-4 pt-12 shadow-sm">
        <button
          onClick={() => navigate(`/course/${id}/lesson/${lessonId}`)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:text-gray-900"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-400">PDF</p>
          <h1 className="truncate text-base font-extrabold text-gray-900">{lesson.title}</h1>
        </div>
      </div>

      {pdfUrl ? (
        <iframe
          title={`PDF ${lesson.title}`}
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          className="min-h-[70vh] flex-1 bg-white"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <div className="max-w-xs rounded-[28px] border border-gray-100 bg-white p-8 shadow-sm">
            <FileText className="mx-auto mb-4 text-[#A7738B]" size={28} />
            <p className="text-sm font-bold text-gray-900">PDF не найден</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Для этого урока пока не подключена PDF-презентация.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
