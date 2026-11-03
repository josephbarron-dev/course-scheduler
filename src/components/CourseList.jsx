// Feature: Course list display
import CourseCard from './CourseCard'

const CourseList = ({ courses, getStatus, getPrereqNumbers, onToggle }) => {
  if (courses.length === 0) {
    return <div className="alert alert-info">No courses match this filter.</div>
  }
  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {courses.map((course) => (
        <div className="col" key={course.id}>
          <CourseCard
            course={course}
            status={getStatus(course)}
            prereqNumbers={getPrereqNumbers(course)}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  )
}

export default CourseList
