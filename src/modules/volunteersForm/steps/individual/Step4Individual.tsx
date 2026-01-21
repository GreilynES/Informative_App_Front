import { DocumentUploadVoluntarios } from "../../components/DocumentUploadVoluntarios"
import { NavigationButtons } from "../../components/NavigationButtons"

export function Step4Individual(props: {
  files: any
  setFiles: (files: any) => void
  goPrev: () => void
  goNext: () => void
  isStepValid: () => boolean
}) {
  const { files, setFiles, goPrev, goNext, isStepValid } = props

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          4
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Documentos</h3>
      </div>

      <DocumentUploadVoluntarios files={files} setFiles={setFiles} />

      <NavigationButtons onPrev={goPrev} onNext={goNext} disableNext={!isStepValid()} />
    </div>
  )
}
