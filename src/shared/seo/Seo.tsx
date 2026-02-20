type SeoProps = {
  title: string
  description: string
  canonical?: string
  image?: string
  noIndex?: boolean
}

export function Seo({ title, description, canonical, image, noIndex }: SeoProps) {
  return (
    <>
      <title>{title}</title>

      <meta name="description" content={description} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image ? <meta property="og:image" content={image} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
    </>
  )
}