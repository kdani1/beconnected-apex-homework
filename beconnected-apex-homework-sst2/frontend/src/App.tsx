import './app.css'
import { MomentContextProvider } from './context/moment'
import CreateMoment from './views/CreateMoment'

function App() {
  return (
    <MomentContextProvider>
      <CreateMoment />
    </MomentContextProvider>
  )
}

export default App
