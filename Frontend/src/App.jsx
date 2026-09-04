import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import MinimalLayout from './layouts/MinimalLayout';
import { useAuth } from './context/AuthContext';
import AuthGateModal from './components/AuthGateModal';

import Home from './pages/public/Home';
import ExamDiscovery from './pages/public/ExamDiscovery';
import ExamDetail from './pages/public/ExamDetail';
import EligibilityChecker from './pages/public/EligibilityChecker';
import StudyMaterials from './pages/public/StudyMaterials';
import CurrentAffairs from './pages/public/CurrentAffairs';
import CurrentAffairsArticle from './pages/public/CurrentAffairsArticle';
import Pricing from './pages/public/Pricing';
import About from './pages/public/About';

import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';

import MyExams from './pages/dashboard/MyExams';
import AICoach from './pages/dashboard/AICoach';
import MockTestLanding from './pages/dashboard/MockTestLanding';
import MockTestTaking from './pages/dashboard/MockTestTaking';
import Performance from './pages/dashboard/Performance';
import AdmitCard from './pages/dashboard/AdmitCard';
import AnswerKey from './pages/dashboard/AnswerKey';
import Results from './pages/dashboard/Results';
import InterviewCoach from './pages/dashboard/InterviewCoach';

function App() {
  const { showAuthModal } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/exams" element={<ExamDiscovery />} />
          <Route path="/exams/:examSlug" element={<ExamDetail />} />
          <Route path="/eligibility" element={<EligibilityChecker />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/current-affairs" element={<CurrentAffairs />} />
          <Route path="/current-affairs/:articleSlug" element={<CurrentAffairsArticle />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/my-exams" element={<MyExams />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/mock-tests" element={<MockTestLanding />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/admit-card" element={<AdmitCard />} />
          <Route path="/answer-key" element={<AnswerKey />} />
          <Route path="/results" element={<Results />} />
          <Route path="/interview-coach" element={<InterviewCoach />} />
        </Route>

        <Route element={<MinimalLayout />}>
  <Route path="/mock-tests/:testId" element={<MockTestTaking />} />
</Route>
      </Routes>
      {showAuthModal && <AuthGateModal />}
    </BrowserRouter>
  );
}

export default App;