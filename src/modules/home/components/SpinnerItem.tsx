import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"


export function SpinnerItem() {
  return (
    <div className="flex w-full flex-col gap-4 [--radius:1rem]">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <Spinner />
        </ItemMedia>

        <ItemContent>
          <ItemTitle>Bienvenido</ItemTitle>
          <ItemDescription>Estamos cargando la información...</ItemDescription>
        </ItemContent>

        <ItemActions className="hidden sm:flex" />

        <ItemFooter>
          {/* Si quieres animar el progress, se puede, pero así funciona bien */}
          <Progress value={75} />
        </ItemFooter>
      </Item>
    </div>
  )
}
