
import React from 'react'

import Card from './Card'
import Spinner from './Spinner'

import {
  TABLE_HEADER_BG,
  TABLE_HEADER_CELL,
  TABLE_BODY_CELL,
  TABLE_DIVIDER,
  TABLE_ROW_HOVER,
  TABLE_CURSOR_POINTER,
  TABLE_FOOTER_BG,
  TABLE_FOOTER_BORDER,
  TABLE_FOOTER_TEXT
} from '../../utils/constants.js'

const Table = ({ columns, 
  data, title, 
  onRowClick,
   emptyMessage = 'No data available',
   loading = false }) => {
  
    const displayData = data

  return (
    <Card className="overflow-hidden p-0">
      {title && (
        <div className="px-6 py-4 border-b border-[#eef2f6]">
          <h3 className="text-lg font-semibold text-[#0b1e3c]">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className={`min-w-full ${TABLE_DIVIDER}`}>
          <thead className={TABLE_HEADER_BG}>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={TABLE_HEADER_CELL}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className={`bg-white ${TABLE_DIVIDER}`}>

            {!loading && data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`${TABLE_ROW_HOVER} ${onRowClick ? TABLE_CURSOR_POINTER : ''}`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={TABLE_BODY_CELL}>
                    {column.cell ? column.cell(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && data.length > 0 && (
        <div className={`${TABLE_FOOTER_BG} ${TABLE_FOOTER_BORDER}`}>
          <div className={TABLE_FOOTER_TEXT}>
            Showing {data.length} of {data.length} entries
          </div>
        </div>
      )}
    </Card>
  )
}

export default Table