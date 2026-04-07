import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { TeacherLectureDetailPage } from '../pages/TeacherLectureDetailPage'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<TeacherLectureDetailPage />} path="teacher/lecture/:lectureId" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
