// import React from 'react'
// import { useState } from 'react'

import Card from './Card'
import Spinner from './Spinner'

const Table = ({
  columns,
  data,
  title,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
}) => {

  const displayData = data

  return (
    <Card className="overflow-hidden p-0">
      
      {/* {title && (
        <div className="px-6 py-4 border-b border-[#eef2f6]">
         <p>{title}</p>
        </div>
      )} */}
      {title && (
        <div className="px-6 py-4 border-b border-[#eef2f6]">
          <h3 className="text-lg font-semibold text-[#0b1e3c]">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#eef2f6]">

          <thead className="bg-[#f8fafd]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-xs font-semibold text-[#5b6f87] uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-[#eef2f6]">

            {loading && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <Spinner size="md" text="Loading data..." />
                </td>
              </tr>
            )}

            {/* {!loading && ( */}
            {!loading && displayData.length > 0 && (
              displayData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    }
                  }}
                  className={`
                    hover:bg-[#f5f9ff] transition-colors duration-150
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-[#1e293b]"
                    >
                      {/* {column ? column(row) : row[column.accessor]} */}
                      {column.cell ? column.cell(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}

            {!loading && displayData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-sm text-[#5b6f87]">{emptyMessage}</p>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {!loading && displayData.length > 0 && (
        <div className="px-6 py-3 bg-[#f8fafd] border-t border-[#eef2f6]">
          <p className="text-xs text-[#5b6f87]">
            Showing {displayData.length} of {data.length} entries
          </p>
        </div>
      )}

    </Card>
  )
}

export default Table