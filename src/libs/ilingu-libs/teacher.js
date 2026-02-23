import { API } from "aws-amplify";
import { getUserId } from "./user";
import defaultAvatar from "../../assets/img/default_avatar.png";

// create
export async function createTeacher(teacher) {
  return await API.post("ilingu", "/teachers", {
    body: teacher
  });
}

// retrieve
export async function getTeacherByTeacherId(teacherId) {
  let teacher = await API.get("ilingu", `/teachers/${teacherId}`, {
  });
  if ((
      !teacher.hasOwnProperty('avatar')
      && !teacher.hasOwnProperty('avatarURL')
  ) || (
      teacher.avatar === "-" )
  ) {
    teacher.avatarURL = defaultAvatar;
  }
  return teacher
}

// update
export async function updateTeacher(userId, data) {
  return await API.put("ilingu", `/teachers/${userId}`, {
    body: data
  });
}

// delete
//TODO: make a delete


export async function getTeacherFromUser() {
  try {
    let userId = await getUserId();
    return await getTeacherByTeacherId(userId);
  } catch (e) {
    console.log(e);
  }
}

export async function listTeachers(pageSize, startToken) {
  try {
    return await API.get("teachers", "/teachers", {
      queryStringParameters: {
        pageSize: pageSize,
        startToken: startToken,
        approved: true
      }
    })
  } catch (e) {
    console.log(e)
  }
}


// list all courses for a teacher
export async function listCoursesByTeacherId(teacherId) {
  try {
    return await API.get("ilingu", `/teachers/${teacherId}/courses`, {});
  } catch (e) {
    console.log(e);
  }
}

export async function listLessonsByTeacherId(teacherId, startDate, endDate) {
  try {
    let params = null;
    if (startDate && endDate) {
      params = {
        queryStringParameters: {
          startDate: startDate,
          endDate: endDate
        }
      };
      return await API.get("ilingu", `/teachers/${teacherId}/lessons`, {params});

    } else if (startDate && !endDate) {
      console.log("startDate supplied but no endDate");
    } else if (!startDate && endDate) {
      console.log("endDate supplied but no startDate " +
        "(this shouldn't be able to happen - check logic)")
    } else if (!startDate && !endDate) {
      return await API.get("ilingu", `/teachers/${teacherId}/lessons`, {});
    } else {
      console.log("All logic exhausted check function")
    }
  } catch (e) {
    console.log(e);
  }
}

// composite function to retrieve necessary teacher data on app load
export async function loadTeacherData(teacherId) {
  try {
    // list teacher courses
    let courses = await listCoursesByTeacherId(teacherId);
    // list teacher lessons
    let lessons = await listLessonsByTeacherId(teacherId);
    // return composite object
    return {
      courses: courses,
      lessons: lessons,
    }
  } catch (e) {
    console.log(e)
  }
}