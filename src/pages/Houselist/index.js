import React from 'react'

import Filter from './components/Filter'

class Houselist extends React.Component {
  render () {
    return <div>
      {/* Filter: 筛选条件组件 */}
      <Filter></Filter>
    </div>
  }
}

export default Houselist
