const Course = ({course}) => {

    return (
      <div>
        <h2>{course.name}</h2>
        {course.parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
        <p>Total of {course.parts.reduce((sum, currentValue) => sum + currentValue.exercises,0)} exercises</p>
      </div>
    
    )
  }

  export default Course