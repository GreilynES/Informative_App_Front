import { ArrowRight, FileText, Heart } from "lucide-react"
import { useRouter } from "@tanstack/react-router"

export default function FormsPage() {
  const router = useRouter()

  const bgUrl =
    "https://res.cloudinary.com/dyigmavwq/image/upload/v1768196080/unnamed_p0ymqu.jpg"

  return (
    <section
      className="relative min-h-screen py-20 px-6 sm:px-10 lg:px-16 overflow-hidden"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_38%,rgba(0,0,0,0.15),rgba(0,0,0,0.55))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-14">
        <div className="inline-flex flex-col items-center rounded-2xl px-6 py-5">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.60)]">
            Forma parte de la Cámara de Ganaderos <br className="hidden sm:block" />
            de Hojancha
          </h2>
        </div>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12">
        {/* ASOCIADOS CARD */}
        <div
          className="
            group relative overflow-hidden rounded-2xl
            isolate transform-gpu
            shadow-[0_22px_70px_-40px_rgba(0,0,0,0.80)]
            transition-all duration-500
            hover:-translate-y-2 hover:shadow-[0_30px_90px_-46px_rgba(0,0,0,0.85)]
          "
        >
          {/* 1) Blur (mantiene el glass) */}
          <div
            className="
              absolute inset-0 rounded-2xl
              bg-white/10
              [backdrop-filter:blur(18px)]
              [-webkit-backdrop-filter:blur(18px)]
            "
          />

          {/* 2) Homogenizer (OCULTA la costura del blur) */}
          <div className="absolute inset-0 rounded-2xl bg-white/[0.06]" />

          {/* 3) Borde suave */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/15" />

          {/* Hover wash */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7A944B]/16 via-transparent to-transparent" />
          </div>

          <div className="p-8 relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/80 border border-white/25 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <FileText className="w-7 h-7 text-[#475C1D]" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]">
                  ASOCIADOS
                </h3>
                <p className="mt-1 text-white/80 leading-relaxed">
                  Membresía oficial con derechos y beneficios exclusivos
                </p>
              </div>
            </div>

            <div className="rounded-xl p-6 mb-6 bg-white/75 ring-1 ring-white/18">
              <p className="text-[#2E321B]/90 font-medium leading-relaxed">
                Como asociado tendrás acceso completo a todos nuestros servicios, derecho a voto en asambleas,
                participación en la toma de decisiones y acceso a beneficios exclusivos para miembros.
              </p>
            </div>

            <button
              onClick={() => router.navigate({ to: "/associates" })}
              className="w-full rounded-xl bg-[#475C1D] hover:bg-[#3A4D17] text-white font-bold py-3 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BFD76F]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
            >
              Formulario
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* VOLUNTARIOS CARD */}
        <div
          className="
            group relative overflow-hidden rounded-2xl
            isolate transform-gpu
            shadow-[0_22px_70px_-40px_rgba(0,0,0,0.80)]
            transition-all duration-500
            hover:-translate-y-2 hover:shadow-[0_30px_90px_-46px_rgba(0,0,0,0.85)]
          "
        >
          {/* 1) Blur */}
          <div
            className="
              absolute inset-0 rounded-2xl
              bg-white/12
              [backdrop-filter:blur(14px)]
              [-webkit-backdrop-filter:blur(14px)]
            "
          />

          {/* 2) Homogenizer */}
          <div className="absolute inset-0 rounded-2xl bg-white/[0.06]" />

          {/* 3) Borde */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/15" />

          {/* Hover wash */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E7C56D]/16 via-transparent to-transparent" />
          </div>

          <div className="p-8 relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/80 border border-white/25 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Heart className="w-7 h-7 text-[#A9882A]" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]">
                  VOLUNTARIOS
                </h3>
                <p className="mt-1 text-white/80 leading-relaxed">
                  Colaboración flexible en proyectos específicos y adaptables
                </p>
              </div>
            </div>

            <div className="rounded-xl p-6 mb-6 bg-white/75 ring-1 ring-white/18">
              <p className="text-[#2E321B]/90 font-medium leading-relaxed">
                Como voluntario podrás colaborar en nuestros proyectos sociales, participar en actividades
                comunitarias y contribuir con tu tiempo y habilidades según tu disponibilidad.
              </p>
            </div>

            <button
              onClick={() => router.navigate({ to: "/volunteers" })}
              className="w-full rounded-xl bg-[#C1A548] hover:bg-[#A9882A] text-white font-bold py-3 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E7C56D]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
            >
              Formulario
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
