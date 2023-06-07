import type React from 'react'
import { useEffect, useRef, useState, type SetStateAction, type Dispatch } from 'react'
import { TbArrowsSort, TbSelector } from 'react-icons/tb'

interface Option {
  value: string
  label: string | JSX.Element
}

interface FilterProps<T> {
  items: T[]
  setFilteredItems: Dispatch<SetStateAction<Array<T | Record<string, unknown>> | undefined>>
  filterFields: Record<string, 'string' | 'number'>
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const handleToggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionSelect = (optionValue: string) => {
    setIsOpen(false)
    onChange(optionValue)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={selectRef}>
      <div>
        <button
          type="button"
          className="color-component-secondary relative w-48 py-2 px-3 text-left rounded-md cursor-pointer focus:outline-none sm:text-sm"
          onClick={handleToggleOpen}>
          <div className="flex items-center justify-between">
            <span>{options.find((option) => option.value === value)?.label ?? ''}</span>
            <TbSelector />
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="color-secondary origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 focus:outline-none">
          <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {options.map((option) => (
              <button
                key={option.value}
                className={`color-heading color-hover block w-full text-left px-4 py-2 text-sm leading-5 focus:outline-none dark-component hover:rounded-md${
                  option.value === value ? 'color-background' : ''
                }`}
                onClick={() => {
                  handleOptionSelect(option.value)
                }}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Filter = <T extends Record<string, unknown>>({
  items,
  setFilteredItems,
  filterFields
}: FilterProps<T>) => {
  const [selectedFilter, setSelectedFilter] = useState('')

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)

    if (value) {
      const field = value.split('|')[0]
      const direction = value.split('|')[1]

      const filteredItems = [...items].sort((a, b) => {
        if (filterFields[field] === 'string') {
          return direction === 'asc'
            ? String(a[field]).localeCompare(String(b[field]))
            : String(b[field]).localeCompare(String(a[field]))
        } else if (filterFields[field] === 'number') {
          return direction === 'asc'
            ? Number(a[field]) - Number(b[field])
            : Number(b[field]) - Number(a[field])
        }
        return 0
      })

      setFilteredItems(filteredItems)
    } else {
      setFilteredItems(items)
    }
  }

  const generateOptions = (): Option[] => {
    const options: Option[] = []
    options.push({
      value: '',
      label: (
        <div className="flex items-center justify-between">
          <span>Sort By (Default)</span>
        </div>
      )
    }) // Add the default option

    for (const field in filterFields) {
      if (Object.prototype.hasOwnProperty.call(filterFields, field)) {
        const type = filterFields[field]
        const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1)

        if (type === 'string') {
          options.push({
            value: `${field}|asc`,
            label: `${capitalizedField} (A to Z)`
          })
          options.push({
            value: `${field}|desc`,
            label: `${capitalizedField} (Z to A)`
          })
        } else if (type === 'number') {
          options.push({
            value: `${field}|asc`,
            label: `${capitalizedField} (ASC)`
          })
          options.push({
            value: `${field}|desc`,
            label: `${capitalizedField} (DESC)`
          })
        }
      }
    }
    return options
  }

  return (
    <div>
      <div className="flex justify-center items-center space-x-2">
        <TbArrowsSort size={20} />
        <CustomSelect
          options={generateOptions()}
          value={selectedFilter}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  )
}

export default Filter
