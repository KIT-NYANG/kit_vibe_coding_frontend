import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { HomePage } from '../pages/HomePage'
import { StudentLectureClipWatchPage } from '../pages/StudentLectureClipWatchPage'
import { StudentLectureDetailPage } from '../pages/StudentLectureDetailPage'
import { StudentMyPage } from '../pages/StudentMyPage'
import { TeacherLectureClipWatchPage } from '../pages/TeacherLectureClipWatchPage'
import { TeacherLectureDetailPage } from '../pages/TeacherLectureDetailPage'

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<StudentMyPage />} path="mypage" />
          <Route
            element={<StudentLectureClipWatchPage />}
            path="lecture/:lectureClassId/clip/:clipId/watch"
          />
          <Route element={<StudentLectureDetailPage />} path="lecture/:lectureClassId" />
          <Route
            element={<TeacherLectureClipWatchPage />}
            path="teacher/lecture/:lectureClassId/clip/:clipId"
          />
          <Route element={<TeacherLectureDetailPage />} path="teacher/lecture/:lectureId" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
