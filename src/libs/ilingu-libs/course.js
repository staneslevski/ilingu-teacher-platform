import { API } from "aws-amplify";

function CourseException(message) {
  this.message = message;
  this.name = "Course Exception";
}

export async function listCourses(filterParams) {
  try {
    return API.get("ilingu", `/courses`, {filterParams})
  } catch (e) {
    console.log(e);
  }
}

export async function listCoursesByStudentId(studentId) {
  try {
    let resp =  await API.get("ilingu", `/students/${studentId}/courses`, {});
    if (resp.Items) {
      return resp.Items
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getCourse(courseId) {
  try {
    return API.get("ilingu", `/courses/${courseId}`, {})
  } catch (e) {
    console.log(e);
  }
}

export async function createCourse(course) {
  if (!course.defaultTeacherId) {
    throw new CourseException("Create course failed. No teacher ID")
  } else if (!course.productId) {
    throw new CourseException("Create course failed. No product ID")
  } else if (!course.studentId) {
    throw new CourseException("Create course failed. No Student ID")
  } else {
    try {
      // set required attributes
      let body = {
        defaultTeacherId: course.defaultTeacherId,
        studentId: course.studentId,
        productId: course.productId
      };
      // set optional attributes
      if (course.courseName) {
        body.courseName = course.courseName
      }
      if (course.teacherPool) {
        body.teacherPool = course.teacherPool
      }
      if (course.level) {
        body.level = course.level
      }
      return await API.post("ilingu", "/courses", {
        body: body,
      })
    } catch (e) {
      console.log(e);
    }
  }
}