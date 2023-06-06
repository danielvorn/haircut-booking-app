type Tab = 'upcoming' | 'past'

interface TabProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const Tabs: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
  const handleTabChange = (tab: Tab) => {
    if (activeTab !== tab) {
      onTabChange(tab)
    }
  }

  const getTabButtonClass = (tab: Tab) => {
    const baseClass = 'font-medium py-2 px-4 rounded-t-lg'
    const activeClass =
      'border-b-4 border-neutral-500 text-neutral-900 dark:text-neutral-200 dark:border-b-4 dark:border-neutral-200'
    const inactiveClass =
      'text-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-200'

    return `${baseClass} ${activeTab === tab ? activeClass : inactiveClass}`
  }

  return (
    <div>
      <button
        className={getTabButtonClass('upcoming')}
        onClick={() => {
          handleTabChange('upcoming')
        }}>
        Upcoming
      </button>
      <button
        className={getTabButtonClass('past')}
        onClick={() => {
          handleTabChange('past')
        }}>
        History
      </button>
    </div>
  )
}

export default Tabs
