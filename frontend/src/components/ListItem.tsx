import { type SetStateAction, useState, useEffect, type ReactNode, type Dispatch } from 'react'
import Filter from './Filter'
import useSidebarStore from '../store/useSidebarStore'

interface ListComponentProps<T extends Record<string, unknown>> {
  items: T[]
  renderListItem: (item: T, index: number) => ReactNode
  filterFields: Record<string, 'string' | 'number'>
}

function ListComponent<T extends Record<string, unknown>>({
  items,
  renderListItem,
  filterFields
}: ListComponentProps<T>): JSX.Element {
  const [filteredItems, setFilteredItems] = useState<
    Array<T | Record<string, unknown>> | undefined
  >(items)
  const { isExpanded } = useSidebarStore()

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  const handleFilterChange: Dispatch<
    SetStateAction<Array<T | Record<string, unknown>> | undefined>
  > = (filteredItems) => {
    setFilteredItems(filteredItems)
  }

  return (
    <div>
      <Filter items={items} setFilteredItems={handleFilterChange} filterFields={filterFields} />
      <div
        className={
          isExpanded
            ? `grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
            : `grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
        }>
        {filteredItems?.map((item: T | Record<string, unknown>, index: number) => (
          <div key={index}>{renderListItem(item as T, index)}</div>
        ))}
      </div>
    </div>
  )
}

export default ListComponent
