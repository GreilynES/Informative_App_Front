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

export function GenericTable<T>({ data, columns, isLoading }: GenericTableProps<T>) {
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

  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-lg bg-[#F8F9F3] shadow-sm">
      <div className="block md:hidden">
        {rows.length === 0 ? (
          <div className="py-8 text-center text-gray-400 font-medium bg-white">
            Sin resultados
          </div>
        ) : (
          <div className="space-y-3 p-3 bg-[#F8F9F3]">
            {rows.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-[#EAEFE0] bg-white p-3"
              >
                <div className="space-y-2">
                  {row.getVisibleCells().map((cell) => {
                    const header = cell.column.columnDef.header;

                    return (
                      <div key={cell.id} className="grid grid-cols-12 gap-2 items-start">
                        {/* Label */}
                        <div className="col-span-5 text-[11px] font-bold text-[#5B732E] uppercase tracking-wider">
                          {header
                            ? String(
                                typeof header === "function"
                                  ? "Campo"
                                  : header
                              )
                            : "Campo"}
                        </div>

                        {/* Value */}
                        <div className="col-span-7 text-sm text-[#2E321B] whitespace-normal break-words">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <table className="w-full table-fixed">
          <thead className="bg-[#F8F9F3]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-xs font-bold text-[#5B732E] uppercase tracking-wider text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-gray-400 font-medium"
                >
                  Sin resultados
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[#EAEFE0]">
                  {row.getVisibleCells().map((cell) => {
                    const raw = cell.getValue();
                    const isString = typeof raw === "string";

                    return (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-center text-sm align-top"
                        title={isString ? raw : undefined}
                      >
                        <div className="whitespace-normal break-words">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
