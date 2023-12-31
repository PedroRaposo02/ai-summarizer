import Hero from './components/Hero'
import Demo from './components/Demo'

import './index.css'

const App = () => {
  return (
    <main>
      <div className="main">
        <div className='gradient' />
        
        <div className="app overflow-auto">
          <Hero />
          <Demo />
        </div>
      </div>
    </main>
  )
}

export default App