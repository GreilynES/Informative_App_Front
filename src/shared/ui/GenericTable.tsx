import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

type GenericTableProps<T> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  isLoading: boolean;
};

export function GenericTable<T>({
  data,
  columns,
  isLoading,
}: GenericTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-[#F8F9F3] p-8 text-center text-[#556B2F] font-medium">
        Cargando...
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#F8F9F3] overflow-hidden shadow-sm">
      {/* ✅ sin overflow-x-auto para que no haya scroll lateral */}
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead className="bg-[#F8F9F3]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-xs font-bold text-[#5B732E] uppercase tracking-wider text-center truncate"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-400 font-medium"
                >
                  Sin resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[#EAEFE0]">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-center text-sm truncate"
                      title={
                        typeof cell.getValue() === "string"
                          ? (cell.getValue() as string)
                          : undefined
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
