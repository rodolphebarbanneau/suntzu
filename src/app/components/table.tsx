import type { ReactNode } from 'react';

import styles from './map.module.scss';

export const TableCell = ({ content, size, weight, format, colorScale }: {
  content: string | number,
  size?: string,
  weight?: string,
  format?: (value: string) => string,
  colorScale?: (value: number) => string,
}) => {
  const color = colorScale ? colorScale(content as number) : undefined;
  return (
    <div
      className={styles['table-cell']}
      style={{
        fontSize: size || undefined,
        fontWeight: weight || undefined,
        color: color,
      }}
    >
      {format ? format(content as string) : content}
    </div>
)};

export const TableRow = ({ cells }: { cells: ReactNode | ReactNode[] }) => (
  <div className={styles['table-row']}>
    {cells}
  </div>
);


export const TableHeader = ({ columns }: { columns: string[] }) => (
  <div className={styles['table-header']}>
    {columns.map((column, index) => <TableCell key={index} content={column} />)}
  </div>
);

const TableBody: React.FC<BodyProps> = ({ data }) => (
  <div className="TableBody">
    {data.map((row, index) =>
      <div key={index} className="TableRow">
        {row.map((cell, cellIndex) => <TableCell key={cellIndex} content={cell} />)}
      </div>
    )}
  </div>
);

const Table: React.FC<TableProps> = ({ headers, data, width, height }) => (
  <div className="Table" style={{ width: width }}>
    <TableHeader headers={headers} />
    <TableBody data={data} />
  </div>
);

export default Table;
