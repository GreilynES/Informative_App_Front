import { Users, Target, Eye } from "lucide-react"
import { AboutUsCard } from "./components/AboutUsCard"
import AboutUsBackground from "./components/AboutUsBackground"
import { useAboutUs } from "./hooks/useAboutUs"

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}

// match flexible por palabras clave
function matchesAnyTitle(title: string, needles: string[]) {
  const t = normalize(title)
  return needles.some((n) => t.includes(normalize(n)))
}

export default function AboutUsPage() {
  const { data: aboutUs = [], isLoading } = useAboutUs()

  if (isLoading && aboutUs.length === 0) {
    return <p className="text-center text-muted-foreground py-20">Cargando...</p>
  }

  const findSection = (needles: string[]) =>
    aboutUs.find((item) => matchesAnyTitle(item.title, needles))

  const somos = findSection([
    "quienes somos",
    "quiénes somos",
    "somos",
    "historia",
    "sobre nosotros",
  ])

  const mision = findSection(["mision", "misión", "nuestra mision", "nuestro proposito"])
  const vision = findSection(["vision", "visión", "nuestra vision"])

  return (
    <section className="relative">
      <AboutUsBackground />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-24 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Cámara de Ganaderos</p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Sobre nosotros
          </h1>
        </div>

        {/* Si por alguna razón no llegó data útil, mostramos aviso (no deja la página “vacía”) */}
        {!somos && !mision && !vision && (
          <p className="text-center text-muted-foreground">
            Aún no hay información publicada para esta sección.
          </p>
        )}

        {/* Layout: izquierda Misión/Visión – derecha Quiénes Somos */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Izquierda */}
          <div className="flex flex-col gap-6">
            {mision && (
              <AboutUsCard
                icon={<Target className="h-5 w-5" />}
                title={mision.title}
                description={mision.description}
              />
            )}

            {vision && (
              <AboutUsCard
                icon={<Eye className="h-5 w-5" />}
                title={vision.title}
                description={vision.description}
              />
            )}
          </div>

          {/* Derecha */}
          {somos && (
            <AboutUsCard
              icon={<Users className="h-5 w-5" />}
              title={somos.title}
              description={somos.description}
            />
          )}
        </div>
      </div>
    </section>
  )
}
