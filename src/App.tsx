import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { ThemeProvider } from './theme/ThemeContext';
import TabLayout from './components/TabLayout';
import CalcScreen from './screens/CalcScreen';
import ScientificScreen from './screens/ScientificScreen';
import ConvertScreen from './screens/ConvertScreen';
import GraphScreen from './screens/GraphScreen';
import ProgrammerScreen from './screens/ProgrammerScreen';
import HistoryScreen from './screens/HistoryScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<TabLayout />}>
                <Route index element={<CalcScreen />} />
                <Route path='scientific' element={<ScientificScreen />} />
                <Route path='convert' element={<ConvertScreen />} />
                <Route path='graph' element={<GraphScreen />} />
                <Route path='programmer' element={<ProgrammerScreen />} />
              <Route path='history' element={<HistoryScreen />} />
              <Route path='privacy-policy' element={<PrivacyPolicyScreen />} />
              <Route path='terms' element={<TermsOfServiceScreen />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
