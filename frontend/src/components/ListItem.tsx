import { type SetStateAction, useState, useEffect } from 'react'
import Filter from './Filter'
import useSidebarStore from '../store/useSidebarStore'

interface ListComponentProps<T> {
  items: T[] | undefined
  renderListItem: (item: T, index: number) => React.ReactNode
  filterFields: Record<string, 'string' | 'number'>
}

function ListComponent<T>({
  items,
  renderListItem,
  filterFields
}: ListComponentProps<T>): JSX.Element {
  const [filteredItems, setFilteredItems] = useState(items)
  const { isExpanded } = useSidebarStore()

  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  const handleFilterChange = (filteredItems: SetStateAction<T[] | undefined>): void => {
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
        {filteredItems?.map((item, index) => (
          <div key={index}>{renderListItem(item, index)}</div>
        ))}
      </div>
    </div>
  )
}

export default ListComponent
