import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants, type Button } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        // ✅ estilos exactos tipo tu captura
        isActive
          ? "border border-[#E5E7EB] bg-white text-[#111827] shadow-sm"
          : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-3", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span className="hidden sm:block">Anterior</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-3", className)}
      {...props}
    >
      <span className="hidden sm:block">Siguiente</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center text-[#6B7280]", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

/* =====================================================================================
   ✅ LÓGICA (para que las páginas tengan el mínimo código posible)
   ===================================================================================== */

function getPageItems(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: Array<number | "ellipsis"> = []
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)

  items.push(1)

  if (left > 2) items.push("ellipsis")
  for (let p = left; p <= right; p++) items.push(p)
  if (right < total - 1) items.push("ellipsis")

  items.push(total)

  return items
}

export function usePagination<T>(
  items: T[],
  pageSize = 10,
  resetDeps: React.DependencyList = []
) {
  const [page, setPage] = React.useState(1)

  const totalPages = React.useMemo(() => {
    return Math.max(1, Math.ceil(items.length / pageSize))
  }, [items.length, pageSize])

  React.useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps)

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages)
    if (page < 1) setPage(1)
  }, [page, totalPages])

  const pagedItems = React.useMemo(() => {
    const startIdx = (page - 1) * pageSize
    return items.slice(startIdx, startIdx + pageSize)
  }, [items, page, pageSize])

  const pageItems = React.useMemo(() => {
    return getPageItems(page, totalPages)
  }, [page, totalPages])

  return { page, setPage, totalPages, pagedItems, pageItems, pageSize }
}

type PaginationBarProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  pageItems: Array<number | "ellipsis">
  className?: string
}

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  pageItems,
  className,
}: PaginationBarProps) {
  if (totalPages <= 1) return null

  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <Pagination className={className}>
      <PaginationContent>
        {/* ✅ si es primera página, desaparece */}
        {canPrev && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(page - 1)
              }}
            />
          </PaginationItem>
        )}

        {pageItems.map((it, idx) =>
          it === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={it}>
              <PaginationLink
                href="#"
                isActive={it === page}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(it)
                }}
              >
                {it}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* ✅ si es última página, desaparece */}
        {canNext && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onPageChange(page + 1)
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
