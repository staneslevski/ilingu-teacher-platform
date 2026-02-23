import { API } from "aws-amplify";

function LocalLessonException(message) {
  this.message = message;
  this.name = "Lesson Exception";
}

export async function createLesson(lesson) {
  if (!lesson.enrolmentId) {
    throw new LocalLessonException("No enrollment ID")
  } else if (!lesson.courseId) {
    throw new LocalLessonException("No course ID")
  } else if (!lesson.teacherId) {
    throw new LocalLessonException("No teacher ID")
  } else if (!lesson.studentId) {
    throw new LocalLessonException("No student ID")
  } else if (!lesson.parts || lesson.parts.length === 0) {
    throw new LocalLessonException("No lesson.parts")
  } else {
    try {
      return await API.post("lessons", `/lessons/`, {
        body: lesson
      })
    } catch (e) {
      console.log(e);
      return e
    }
  }
}

export async function listLessonsByStudentId(studentId, startDate, endDate) {
  try {
    return await API.get("students", `/students/${studentId}/lessons`, {
      queryStringParameters: {
        startDate: startDate,
        endDate: endDate
      }
    });
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function listLessonsByTeacherId(teacherId, startDate, endDate) {
  try {
    return await API.get("teachers", `/teachers/${teacherId}/lessons`, {
      queryStringParameters: {
        startDate: startDate,
        endDate: endDate
      }
    });
  } catch (e) {
    console.log(e);
    return e;
  }
}
