import * as React from "react"
import { Inbox, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

type PageStateProps = {
  isLoading?: boolean
  isEmpty?: boolean
  title?: string
  description?: string
  emptyTitle?: string
  emptyDescription?: string
  actionLabel?: string
  onAction?: () => void
  /** Para páginas con fondo propio: setéalo en false */
  withContainer?: boolean
  /** Skeleton custom (si querés variar por página) */
  skeleton?: React.ReactNode
  children: React.ReactNode
  className?: string
}

function DefaultSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-24 py-10">
      <div className="space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-9 w-48 rounded-full" />
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-12 w-[320px] sm:w-[420px] rounded-xl" />
        </div>

        <div className="mx-auto mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>

          <Card className="p-4 hidden sm:block">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>

          <Card className="p-4 hidden lg:block">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 sm:px-8 lg:px-24 py-14">
      <Card className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold leading-tight">
              {title}
            </h3>
            {description ? (
              <p className="mt-1 text-sm sm:text-base text-muted-foreground">
                {description}
              </p>
            ) : null}

            {actionLabel && onAction ? (
              <div className="mt-4">
                <Button onClick={onAction} className="rounded-full">
                  {actionLabel}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  )
}

export function PageState({
  isLoading = false,
  isEmpty = false,
  title = "Cargando…",
  description = "Estamos preparando la información.",
  emptyTitle = "No hay información para mostrar",
  emptyDescription = "Intenta más tarde o revisa los filtros.",
  actionLabel,
  onAction,
  withContainer = true,
  skeleton,
  children,
  className,
}: PageStateProps) {
  // Loading
  if (isLoading) {
    return (
      <div className={cn(withContainer && "min-h-[60vh] w-full", className)}>
        {/* Header pequeño opcional */}
        <div className="sr-only">
          <Loader2 className="animate-spin" />
          {title} {description}
        </div>

        {skeleton ?? <DefaultSkeleton />}
      </div>
    )
  }

  // Empty
  if (isEmpty) {
    return (
      <div className={cn(withContainer && "min-h-[60vh] w-full", className)}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      </div>
    )
  }

  return <>{children}</>
}
