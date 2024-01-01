import type { QTableProps } from 'quasar'

export interface TableRef {
  title: QTableProps['title']
  columns: QTableProps['columns']
  rows: QTableProps['rows']
}
